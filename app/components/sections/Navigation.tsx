'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import MobileNav from './MobileNav';
import { navigationItems, resumeHref } from './navigation-data';
import useScrollVisibility from './useScrollVisibility';

// NEW: shared by the in-page links and the Resume link so they can't drift apart.
// CHANGED: duration-200 -> duration-150. Blueprint 7.4 sets link hover to a 150ms
// colour shift.
const desktopLinkClassName =
  'text-sm font-medium text-deep-water transition-colors duration-150 hover:text-reef-teal';

export default function Navigation() {
  const { isPastHero, isVisible } = useScrollVisibility();
  // MobileNav owns menu interaction; this state only coordinates the brand's a11y state.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      animate={{ y: isVisible ? 0 : '-115%' }}
      // CHANGED (blueprint 3.1): "solid Mist background + hairline bottom border".
      //  - bg-mist/95 -> bg-mist: fully solid, as specified.
      //  - removed backdrop-blur-md: blueprint 7.3 reserves blur for the modal, and
      //    animating backdrop-filter was the most expensive part of the old
      //    transition (it forces a re-blur of everything behind the bar).
      //  - border-fog-line/80 -> border-fog-line: 5.1 defines fog-line as the
      //    hairline token at full strength.
      //  - transparent state is bg-mist/0 (mist at 0% alpha) rather than
      //    bg-transparent so the fade travels along mist instead of through black.
      //  - transition list trimmed to `colors` now that blur is gone.
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isPastHero ? 'border-fog-line bg-mist' : 'border-transparent bg-mist/0'
      }`}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav
        aria-label='Primary navigation'
        // CHANGED (blueprint 6.2): container is max-w 1120px with px-6 on mobile and
        // px-8 on desktop. Was max-w-7xl (1280px) with px-5 / sm:px-8 / lg:px-10.
        // The extra `sm` step is gone so the mobile toggle's offset stays constant
        // across the whole mobile range (MobileNav positions it against px-6).
        className='mx-auto flex h-20 max-w-[1120px] items-center justify-between px-6 lg:h-22 lg:px-8'
      >
        {/* Keep the header brand out of the overlay's keyboard flow while the menu is open. */}
        <Link
          aria-hidden={isMobileMenuOpen}
          // CHANGED: tracking-[-0.035em] -> tracking-[0.08em]. The brand is ALL
          // CAPS, and capitals need positive tracking; negative tracking on caps
          // makes letters touch. (The previous site used ~0.1em here.)
          // REMOVED: the motion.div wrapper that faded the brand out when the menu
          // opened. The fade finished in 0.18s, long before the circle (growing from
          // the top-right) reached the top-left, so the brand vanished and left an
          // empty header for a moment. The overlay now simply covers it as the
          // circle arrives. The wrapper's `z-[60]` was also inert: the header's own
          // stacking context (fixed + z-50) traps its children below the overlay.
          className='font-display text-base font-semibold tracking-[0.08em] text-deep-water transition-colors duration-150 hover:text-reef-teal'
          href='/'
          tabIndex={isMobileMenuOpen ? -1 : undefined}
        >
          JACKIE WONG
        </Link>

        {/*
          CHANGED (blueprint 3.1): Resume is now the last <li> in the same list as the
          other links, so spacing is uniform (gap-8). REMOVED the `border-l pl-8`
          vertical divider: the wireframe has none, and the arrow already carries the
          "this leaves the page" meaning, making the rule redundant decoration
          (principle 1: structure must encode information).
        */}
        <ul className='hidden items-center gap-8 lg:flex' role='list'>
          {navigationItems.map(item => (
            <li key={item.href}>
              <a className={desktopLinkClassName} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className={`inline-flex items-center gap-1.5 ${desktopLinkClassName}`}
              href={resumeHref}
              rel='noreferrer'
              target='_blank'
            >
              Resume
              <ExternalArrow />
              {/* NEW: the arrow alone doesn't tell screen-reader users it opens a new tab. */}
              <span className='sr-only'>(opens in a new tab)</span>
            </a>
          </li>
        </ul>

        {/* MobileNav reports its open state so the brand can drop out of the tab order with it. */}
        <MobileNav
          isNavigationVisible={isVisible}
          onOpenChange={setIsMobileMenuOpen}
        />
      </nav>
    </motion.header>
  );
}

function ExternalArrow() {
  // Shared external-link affordance for the desktop resume action.
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
