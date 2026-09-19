'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import MobileNav from './MobileNav';
import { navigationItems, resumeHref } from './navigation-data';
import useScrollVisibility from './useScrollVisibility';

export default function Navigation() {
  const { isPastHero, isVisible } = useScrollVisibility();
  // MobileNav owns menu interaction; this state only coordinates the brand fade.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      animate={{ y: isVisible ? 0 : '-115%' }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isPastHero
          ? 'border-fog-line/80 bg-mist/95 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav
        aria-label='Primary navigation'
        className='mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-22 lg:px-10'
      >
        <motion.div
          animate={{ opacity: isMobileMenuOpen ? 0 : 1, y: isMobileMenuOpen ? -4 : 0 }}
          className='relative z-[60]'
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {/* Keep the header brand out of the overlay's visual and keyboard flow. */}
          <Link
            aria-hidden={isMobileMenuOpen}
            className='font-display text-base font-semibold tracking-[-0.035em] text-deep-water transition-colors hover:text-reef-teal'
            href='/'
            tabIndex={isMobileMenuOpen ? -1 : undefined}
          >
            JACKIE WONG
          </Link>
        </motion.div>

        <div className='hidden items-center gap-8 lg:flex'>
          {/* Desktop links remain mounted above the 1024px breakpoint. */}
          <ul className='flex items-center gap-7' role='list'>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  className='text-sm font-medium text-deep-water transition-colors duration-200 hover:text-reef-teal'
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className='inline-flex items-center gap-1.5 border-l border-fog-line pl-8 text-sm font-medium text-deep-water transition-colors duration-200 hover:text-reef-teal'
            href={resumeHref}
            rel='noreferrer'
            target='_blank'
          >
            Resume
            <ExternalArrow />
          </a>
        </div>

        {/* MobileNav reports its open state so the brand can transition with it. */}
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
    <svg aria-hidden='true' className='size-3.5' fill='none' viewBox='0 0 16 16'>
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
