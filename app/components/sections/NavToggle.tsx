'use client';

import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

type NavToggleProps = {
  isOpen: boolean;
  onClick: () => void;
};

/*
 * HOW THE MORPH WORKS
 *
 * CHANGED: the old version morphed SVG path `d` strings and also spun the whole
 * button 90deg. Two problems:
 *   1. Path morphing interpolates each endpoint independently. The bottom bar's
 *      open path (`M 19 5 L 5 19`) lists its endpoints in the opposite order from
 *      its closed path (`M 4 17 L 20 17`), so at ~50% the two endpoints crossed
 *      over each other and the bar collapsed into a short vertical stub. That was
 *      the "abrupt" moment.
 *   2. The button `rotate` had no transition of its own, so Motion used its
 *      default spring while the paths used a 0.26s tween. Two motions with two
 *      different feels and two different end times read as mechanical.
 *
 * NEW technique: three plain bars that never change shape. Each bar only
 * translates (`y`) and rotates around its own centre. Rigid bars can't twist or
 * collapse, so the morph is continuous by construction and reverses cleanly.
 *
 *   closed:  ───   top    (y: 0,  rotate: 0)
 *            ───   middle (opacity: 1)
 *            ───   bottom (y: 0,  rotate: 0)
 *
 *   open:     ╲╱   top    (y: +6, rotate: +45)  } meet on the middle bar's
 *             ╱╲   bottom (y: -6, rotate: -45)  } centre line and cross
 *                  middle (opacity: 0, scaleX: 0)
 *
 * Bars are HTML spans, not SVG: `y`/`rotate` become a CSS transform, so no layout
 * or path repaint work happens per frame.
 */

// Bar geometry: 2px tall (`h-0.5`), centres 6px apart (`top-0`, `top-1.5`, `top-3`
// inside a 14px-tall box). 6px is exactly how far each outer bar must travel to
// land on the middle bar's centre line, so the finished X is centred in the box.
const BAR_TRAVEL = 6;

// Total morph is ~0.36s (0.3s + 0.06s stagger). That lines up with the 0.35-0.4s
// menu reveal in MobileNav, so the icon and the circle settle together.
const MORPH_DURATION = 0.3;

// The outer bars slide and rotate on the same curve, but rotation is offset by
// this much. Opening: bars start closing in, then tilt into the X. Closing: the X
// un-tilts first, then the bars spread apart. Reversing the order on close is what
// makes the animation feel like one gesture played backwards instead of two
// unrelated animations. Without the offset, both happen at once and the bars
// visibly swing while still far apart.
const MORPH_STAGGER = 0.06;

// Standard "ease in-out" bezier: gentle start and end, no long crawl at either
// end (the old icon used the same curve family, so feel stays consistent).
const MORPH_EASE = [0.4, 0, 0.2, 1] as const;

// `direction` is +1 for the top bar (moves down, tilts clockwise) and -1 for the
// bottom bar (moves up, tilts counter-clockwise). One factory keeps the two bars
// perfectly mirrored; hand-writing both is how the old endpoint mismatch crept in.
const createOuterBarVariants = (direction: 1 | -1): Variants => ({
  closed: {
    y: 0,
    rotate: 0,
    // Per-variant `transition` is used for animating *into* that variant, so this
    // is the closing timing: rotation leads, translation follows.
    transition: {
      rotate: { duration: MORPH_DURATION, ease: MORPH_EASE },
      y: { duration: MORPH_DURATION, ease: MORPH_EASE, delay: MORPH_STAGGER },
    },
  },
  open: {
    y: direction * BAR_TRAVEL,
    rotate: direction * 45,
    // Opening timing: translation leads, rotation follows.
    transition: {
      y: { duration: MORPH_DURATION, ease: MORPH_EASE },
      rotate: {
        duration: MORPH_DURATION,
        ease: MORPH_EASE,
        delay: MORPH_STAGGER,
      },
    },
  },
});

const topBarVariants = createOuterBarVariants(1);
const bottomBarVariants = createOuterBarVariants(-1);

// The middle bar has no place in the X, so it fades and shrinks toward its centre.
// Opening: it leaves fast (0.12s) so it's gone before the outer bars pile onto its
// centre line. Closing: it waits (0.14s) until the outer bars have separated, then
// draws back in, so it never appears to poke through the crossing bars.
const middleBarVariants: Variants = {
  closed: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.18, ease: 'easeOut', delay: 0.14 },
  },
  open: {
    opacity: 0,
    scaleX: 0,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

// `bg-current` lets the bars follow the button's text colour, so the hover colour
// change needs no extra code.
const barClassName = 'absolute inset-x-0 h-0.5 rounded-full bg-current';

export default function NavToggle({ isOpen, onClick }: NavToggleProps) {
  return (
    <motion.button
      aria-controls='mobile-navigation'
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      // CHANGED: removed `focus-visible:outline-none` so the global focus ring in
      // globals.css shows for keyboard users (blueprint QA: keyboard pass), and
      // swapped the tinted `hover:bg-deep-water/5` circle for the same
      // `hover:text-reef-teal` shift every other nav link uses (blueprint 7.4).
      className='relative grid size-10 place-items-center rounded-full text-deep-water transition-colors duration-150 hover:text-reef-teal'
      onClick={onClick}
      // CHANGED: removed `animate={{ rotate }}`. This transition now only drives
      // `whileTap`; the bars own their own timing via the variants above.
      transition={{ duration: 0.12, ease: 'easeOut' }}
      type='button'
      whileTap={{ scale: 0.92 }}
    >
      {/*
        One parent sets the variant label and the three bars inherit it, so all
        three start on the same frame. `initial={false}` skips a mount animation
        (the menu is closed on load). The box is 20x14px: even numbers centre on
        whole pixels inside the 40px button, which keeps 2px bars crisp.
      */}
      <motion.span
        animate={isOpen ? 'open' : 'closed'}
        aria-hidden='true'
        className='relative block h-3.5 w-5'
        initial={false}
      >
        <motion.span
          className={`${barClassName} top-0`}
          variants={topBarVariants}
        />
        <motion.span
          className={`${barClassName} top-1.5`}
          variants={middleBarVariants}
        />
        <motion.span
          className={`${barClassName} top-3`}
          variants={bottomBarVariants}
        />
      </motion.span>
    </motion.button>
  );
}
