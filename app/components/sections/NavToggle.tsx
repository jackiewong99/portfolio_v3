'use client';

import { motion } from 'motion/react';

type NavToggleProps = {
  isOpen: boolean;
  onClick: () => void;
};

// Keep all three strokes on the same timing curve for a single icon morph.
const lineTransition = { duration: 0.26, ease: [0.4, 0, 0.2, 1] as const };

export default function NavToggle({ isOpen, onClick }: NavToggleProps) {
  return (
    <motion.button
      aria-controls='mobile-navigation'
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      animate={{ rotate: isOpen ? 90 : 0 }}
      className='relative grid size-10 place-items-center rounded-full text-deep-water transition-colors hover:bg-deep-water/5 focus-visible:outline-none'
      onClick={onClick}
      type='button'
      whileTap={{ scale: 0.9 }}
    >
      {/* Variant paths morph the persistent button between hamburger and X. */}
      <motion.svg
        animate={isOpen ? 'open' : 'closed'}
        aria-hidden='true'
        className='size-5'
        fill='none'
        initial='closed'
        viewBox='0 0 24 24'
      >
        <motion.path
          stroke='currentColor'
          strokeLinecap='round'
          strokeWidth='1.8'
          transition={lineTransition}
          variants={{
            closed: { d: 'M 4 7 L 20 7' },
            open: { d: 'M 5 5 L 19 19' },
          }}
        />
        <motion.path
          d='M 4 12 L 20 12'
          stroke='currentColor'
          strokeLinecap='round'
          strokeWidth='1.8'
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          variants={{
            closed: { opacity: 1, scaleX: 1 },
            open: { opacity: 0, scaleX: 0 },
          }}
        />
        <motion.path
          stroke='currentColor'
          strokeLinecap='round'
          strokeWidth='1.8'
          transition={lineTransition}
          variants={{
            closed: { d: 'M 4 17 L 20 17' },
            open: { d: 'M 19 5 L 5 19' },
          }}
        />
      </motion.svg>
    </motion.button>
  );
}
