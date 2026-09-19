'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import NavToggle from './NavToggle';
import { navigationItems, resumeHref } from './navigation-data';

// Matches the fixed toggle's centre, making the menu appear to grow from it.
const revealOrigin = 'calc(100% - 2.5rem) 2.5rem';
// useSyncExternalStore avoids rendering a document portal during SSR hydration.
const subscribeToClient = () => () => undefined;

type MobileNavProps = {
  isNavigationVisible: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function MobileNav({
  isNavigationVisible,
  onOpenChange,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(previouslyOpen => !previouslyOpen);

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

    // Treat the overlay like a modal: lock scrolling, focus its first link, and
    // provide an Escape exit while it is present.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    contentRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const revealTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: [0.65, 0, 0.35, 1] as const };

  return (
    <>
      {/* Preserves the right-side space in the header; the interactive toggle is portaled below. */}
      <div aria-hidden='true' className='size-10 lg:hidden' />
      {isClient &&
        createPortal(
          <>
            <motion.div
              animate={{ opacity: isNavigationVisible || isOpen ? 1 : 0 }}
              className='fixed right-5 top-5 z-[70] lg:hidden'
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {/* A persistent control stays above the reveal, so its icon can morph both ways. */}
              <NavToggle isOpen={isOpen} onClick={toggleMenu} />
            </motion.div>
            <AnimatePresence initial={false}>
              {isOpen && (
                /* The portal escapes the transformed header; clipPath can cover the viewport. */
                <motion.aside
                  animate={{ clipPath: `circle(150vmax at ${revealOrigin})` }}
                  aria-labelledby='mobile-navigation-title'
                  aria-modal='true'
                  className='fixed inset-0 z-[60] overflow-hidden bg-fog-line text-deep-water'
                  exit={{ clipPath: `circle(0px at ${revealOrigin})` }}
                  id='mobile-navigation'
                  initial={{ clipPath: `circle(0px at ${revealOrigin})` }}
                  onClick={closeMenu}
                  role='dialog'
                  transition={revealTransition}
                >
                  <div
                    className='flex h-full flex-col px-5 pb-10 pt-28 sm:px-8'
                    onClick={event => event.stopPropagation()}
                  >
                    {/* Stops background-click closing while visitors use menu content. */}
                    <p
                      className='font-mono text-[0.65rem] font-medium uppercase tracking-[0.18em] text-reef-teal'
                      id='mobile-navigation-title'
                    >
                      Navigate
                    </p>
                    <div className='mt-auto pb-6' ref={contentRef}>
                      <nav aria-label='Mobile navigation'>
                        <ul className='space-y-1'>
                          {navigationItems.map((item, index) => (
                            <motion.li
                              animate={{ opacity: 1, y: 0 }}
                              initial={{ opacity: 0, y: 18 }}
                              key={item.href}
                              transition={{
                                delay: prefersReducedMotion
                                  ? 0
                                  : 0.16 + index * 0.055,
                                duration: prefersReducedMotion ? 0 : 0.28,
                                ease: 'easeOut',
                              }}
                            >
                              <a
                                className='group inline-flex items-center gap-3 font-display text-5xl font-semibold tracking-[-0.045em] transition-colors hover:text-reef-teal sm:text-6xl'
                                href={item.href}
                                onClick={closeMenu}
                              >
                                <span className='font-mono text-[0.65rem] font-medium tracking-normal text-slate-tide transition-colors group-hover:text-reef-teal'>
                                  0{index + 1}
                                </span>
                                {item.label}
                              </a>
                            </motion.li>
                          ))}
                        </ul>
                      </nav>
                      <motion.a
                        animate={{ opacity: 1, y: 0 }}
                        className='mt-10 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-deep-water transition-colors hover:text-reef-teal'
                        href={resumeHref}
                        initial={{ opacity: 0, y: 12 }}
                        onClick={closeMenu}
                        rel='noreferrer'
                        target='_blank'
                        transition={{
                          delay: prefersReducedMotion ? 0 : 0.42,
                          duration: 0.24,
                        }}
                      >
                        Resume
                        <ExternalArrow />
                      </motion.a>
                    </div>
                    <p className='font-mono text-[0.625rem] uppercase tracking-[0.14em] text-slate-tide'>
                      Jackie Wong · 2026
                    </p>
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
    <svg
      aria-hidden='true'
      className='size-3.5'
      fill='none'
      viewBox='0 0 16 16'
    >
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
