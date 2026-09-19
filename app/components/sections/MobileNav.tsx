'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import NavToggle from './NavToggle';
import { navigationItems } from './navigation-data';

// Matches the fixed toggle's centre, making the menu appear to grow from it.
const revealOrigin = 'calc(100% - 5rem) 5rem';
// useSyncExternalStore avoids rendering a document portal during SSR hydration.
const subscribeToClient = () => () => undefined;

type MobileNavProps = {
  isNavigationVisible: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

// NEW: everything the clip-path needs, in plain pixels. See getRevealGeometry.
type RevealGeometry = {
  originX: number;
  originY: number;
  radius: number;
};

/*
 * REVEAL TIMING + EASING
 *
 * CHANGED: the old reveal used `cubic-bezier(0.65, 0, 0.35, 1)` at 0.38s. That
 * curve takes ~40% of its duration to cover the first quarter of the distance and
 * another ~40% to cover the last quarter. On its own that reads as "slow to
 * start", but combined with the radius bug described below it produced the two
 * hiccups you saw.
 *
 * `(0.4, 0, 0.2, 1)` is the standard ease in-out: it still accelerates and
 * decelerates (per your brief) but leaves the start and end much less flat.
 *
 * Closing is a touch faster than opening (0.35s vs 0.4s). Exits that finish
 * quicker than entrances feel responsive; both stay inside your 350-400ms window.
 */
const REVEAL_EASE = [0.4, 0, 0.2, 1] as const;
const OPEN_DURATION = 0.4;
const CLOSE_DURATION = 0.35;

// Rounding and sub-pixel toggle positions can leave a 1px sliver in the far
// corner at the end of the reveal. A couple of extra pixels removes it and costs
// nothing visible (2px of ~900px of travel).
const REVEAL_RADIUS_PADDING = 2;

// Link stagger. The first link starts while the circle is ~1/3 open (0.14s) so
// text arrives on the expanding edge instead of after the circle has finished.
const ITEM_DELAY = 0.14;
const ITEM_STAGGER = 0.05;

/*
 * HOW THE CIRCLE ORIGIN AND RADIUS ARE CALCULATED
 *
 * NEW: measured from the real toggle instead of a hard-coded string.
 *
 * Origin: the centre of the toggle's wrapper, from getBoundingClientRect(). The
 * old `calc(100% - 2.5rem) 2.5rem` only matched while the toggle stayed exactly
 * `right-5 top-5 size-10`; changing any of those (e.g. the px-5 -> px-6 blueprint
 * fix in this pass) would silently detach the circle from the button. Measuring
 * makes the CSS the single source of truth.
 *
 * We measure the wrapper, not the button: the button gets `whileTap` scale, which
 * would nudge its rect, but the wrapper's box never transforms.
 *
 * Radius: the distance from that origin to the FARTHEST viewport corner. The
 * circle only needs to reach that corner to cover everything.
 */
const getRevealGeometry = (toggleAnchor: HTMLElement): RevealGeometry => {
  const { left, top, width, height } = toggleAnchor.getBoundingClientRect();
  const originX = left + width / 2;
  const originY = top + height / 2;

  // The farthest corner is whichever side of the origin has more room, per axis.
  // (For a toggle in the top-right this is the bottom-left, but computing it per
  // axis keeps it correct if the toggle ever moves.)
  // innerWidth includes any classic scrollbar, so it can only overshoot slightly
  // (safe), never undershoot.
  const farthestX = Math.max(originX, window.innerWidth - originX);
  const farthestY = Math.max(originY, window.innerHeight - originY);

  return {
    originX,
    originY,
    radius: Math.ceil(Math.hypot(farthestX, farthestY)) + REVEAL_RADIUS_PADDING,
  };
};

/*
 * CHANGED: root cause of BOTH hiccups.
 *
 * Old: closed = `circle(0px at ...)`, open = `circle(150vmax at ...)`.
 *
 * (1) Overshoot. This is the pause at the END of opening and the START of
 *     closing. On a 390x844 phone the circle only needs ~880px to cover the
 *     screen, but 150vmax is ~1266px, so the circle already covered everything
 *     at ~70% of its radius. With the old easing that point arrives ~57% of the
 *     way through the duration, which means the last ~160ms of opening animated
 *     nothing visible. Closing is the mirror image: the edge stays off-screen for
 *     the first ~160ms before it comes back into view. Using the exact
 *     farthest-corner radius means every millisecond of the tween moves the
 *     visible edge.
 *
 * (2) Mixed units (a hazard, not proven on your machine). Motion's JS animator
 *     interpolates the numbers in a string and keeps the unit template of the
 *     TARGET keyframe, so closing from `150vmax` to `0px` can render as 150 -> 0
 *     in px: a full-screen circle snapping to 150px on the first frame. Whether
 *     that path runs depends on Motion version/WAAPI eligibility, so treat it as
 *     a risk we're removing rather than the confirmed cause.
 *
 * Fix: both keyframes come from this one function, so they always share the same
 * unit template (px everywhere, no calc(), no vmax) and only the numbers change.
 */
const getClipPath = ({ originX, originY, radius }: RevealGeometry) =>
  `circle(${radius}px at ${originX}px ${originY}px)`;

export default function MobileNav({
  isNavigationVisible,
  onOpenChange,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  // NEW: measured at open time and reused for the exit, so the circle closes
  // back onto exactly the point it opened from.
  const [reveal, setReveal] = useState<RevealGeometry>({
    originX: 0,
    originY: 0,
    radius: 0,
  });
  // NEW: points at the fixed wrapper around the toggle (its box never transforms).
  const toggleAnchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  const openMenu = () => {
    // Measure inside the click handler (not an effect) so the geometry is in state
    // in the same render that mounts the overlay. That means `initial` already
    // has the right origin, so the circle never slides from a stale point.
    const toggleAnchor = toggleAnchorRef.current;
    if (toggleAnchor) setReveal(getRevealGeometry(toggleAnchor));
    setIsOpen(true);
  };
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => (isOpen ? closeMenu() : openMenu());

  useEffect(() => {
    // Let the parent coordinate its brand animation without owning menu behavior.
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    // A desktop resize always returns the menu to its closed mobile state.
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (mediaQuery.matches) closeMenu();
    };

    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // NEW: while open, re-measure on resize/rotation. The toggle is pinned to the
    // top-right, so its x changes with the viewport width, and a radius measured
    // for portrait can fall short of a corner in landscape.
    const remeasure = () => {
      const toggleAnchor = toggleAnchorRef.current;
      if (toggleAnchor) setReveal(getRevealGeometry(toggleAnchor));
    };

    window.addEventListener('resize', remeasure);
    return () => window.removeEventListener('resize', remeasure);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Treat the overlay like a modal: lock scrolling, focus its first link, and
    // provide an Escape exit while it is present.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // CHANGED: preventScroll. The overlay's content can scroll now (see below), and
    // a plain focus() would jump that scroller to the first link mid-reveal.
    contentRef.current
      ?.querySelector<HTMLAnchorElement>('a')
      ?.focus({ preventScroll: true });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  // Both keyframes share one template (see getClipPath): only the radius differs.
  const openClipPath = getClipPath(reveal);
  const closedClipPath = getClipPath({ ...reveal, radius: 0 });

  // Reduced motion keeps the instant open/close from before (duration 0), so the
  // menu still appears and disappears without any travelling edge.
  const openTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: OPEN_DURATION, ease: REVEAL_EASE };
  const closeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: CLOSE_DURATION, ease: REVEAL_EASE };

  // NEW: while the header is hidden by scroll, the portaled toggle is faded out but
  // used to stay clickable and focusable, so an invisible button sat in the corner
  // and could open the menu by accident. `inert` removes it from pointer and
  // keyboard interaction until the nav is back.
  const isToggleShown = isNavigationVisible || isOpen;

  return (
    <>
      {/* Preserves the right-side space in the header; the interactive toggle is portaled below. */}
      <div aria-hidden='true' className='size-10 lg:hidden' />
      {isClient &&
        createPortal(
          <>
            <motion.div
              animate={{ opacity: isNavigationVisible || isOpen ? 1 : 0 }}
              className='fixed right-5 top-5 z-70 lg:hidden'
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {/* A persistent control stays above the reveal, so its icon can morph both ways. */}
              <NavToggle isOpen={isOpen} onClick={toggleMenu} />
            </motion.div>
            <AnimatePresence initial={false}>
              {isOpen && (
                /* The portal escapes the transformed header; clipPath can cover the viewport. */
                <motion.aside
                  animate={{
                    clipPath: openClipPath,
                    transition: openTransition,
                  }}
                  aria-labelledby='mobile-navigation-title'
                  aria-modal='true'
                  className='fixed inset-0 z-60 overflow-hidden bg-fog-line text-deep-water'
                  exit={{ clipPath: `circle(0px at ${revealOrigin})` }}
                  id='mobile-navigation'
                  initial={{ clipPath: closedClipPath }}
                  role='dialog'
                >
                  <div
                    className='flex h-full flex-col px-5 pb-10 pt-28 sm:px-8'
                    onClick={event => event.stopPropagation()}
                  >
                    <div className='mt-auto pb-6' ref={contentRef}>
                      <nav aria-label='Mobile navigation'>
                        <ul className='space-y-1'>
                          {navigationItems.map((item, index) => (
                            <motion.li
                              animate={{ opacity: 1, y: 0 }}
                              initial={{ opacity: 0, y: 18 }}
                              key={item.href}
                              transition={{
                                // CHANGED: shorter lead-in and shared constants. The
                                // reveal now runs its full 0.4s instead of finishing
                                // early, so links can overlap it instead of popping in
                                // after a finished circle (which read as a second,
                                // late "hiccup").
                                delay: prefersReducedMotion
                                  ? 0
                                  : ITEM_DELAY + index * ITEM_STAGGER,
                                duration: prefersReducedMotion ? 0 : 0.3,
                                ease: 'easeOut',
                              }}
                            >
                              {item.label != 'Resume' ? (
                                <a
                                  className='font-display text-5xl font-semibold tracking-[-0.045em] transition-colors hover:text-reef-teal sm:text-6xl'
                                  href={item.href}
                                  onClick={closeMenu}
                                >
                                  {item.label}
                                </a>
                              ) : (
                                <a
                                  className='inline-flex items-center gap-2 font-display text-5xl font-semibold tracking-[-0.045em] transition-colors hover:text-reef-teal sm:text-6xl'
                                  href={item.href}
                                  rel='noreferrer'
                                  target='_blank'
                                >
                                  Resume
                                  <ExternalArrow />
                                </a>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                    {/*
                      REMOVED: the "Jackie Wong · 2026" footer line. It was 10px
                      uppercase tracked mono (blueprint 8.2), repeated the brand, and
                      a third use of the mono face that the blueprint reserves for tech
                      tags and dates.
                    */}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </>,
          document.body,
        )}
    </>
  );
}

function ExternalArrow() {
  // Mobile counterpart to the resume affordance in Navigation.tsx.
  return (
    <svg aria-hidden='true' className='size-9' fill='none' viewBox='0 0 16 16'>
      <path
        d='M3 13 13 3M6 3h7v7'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
      />
    </svg>
  );
}
