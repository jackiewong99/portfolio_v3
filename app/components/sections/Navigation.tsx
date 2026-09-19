'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import MobileNav from './MobileNav';
// import { navigationItems, resumeHref } from './navigation-data';
import { navigationItems } from './navigation-data';
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
        <motion.div
          animate={{
            opacity: isMobileMenuOpen ? 0 : 1,
            y: isMobileMenuOpen ? -4 : 0,
          }}
          className='relative z-60'
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          JACKIE WONG
        </Link>

        <div className='hidden items-center gap-8 lg:flex'>
          {/* Desktop links remain mounted above the 1024px breakpoint. */}
          <ul className='flex items-center gap-7' role='list'>
            {navigationItems.map(item => (
              <li key={item.href}>
                {item.label != 'Resume' ? (
                  <a
                    className='text-sm font-medium text-deep-water transition-colors duration-200 hover:text-reef-teal'
                    href={item.href}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    className='inline-flex items-center gap-1.5 text-sm font-medium text-deep-water transition-colors duration-200 hover:text-reef-teal'
                    href={item.href}
                    rel='noreferrer'
                    target='_blank'
                  >
                    {item.label}
                    <ExternalArrow />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

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
