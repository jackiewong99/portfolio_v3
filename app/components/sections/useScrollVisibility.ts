'use client';

import { useEffect, useRef, useState } from 'react';

type ScrollVisibilityOptions = {
  heroSelector?: string;
  hideThreshold?: number;
  throttleMs?: number;
};

type ScrollVisibility = {
  isPastHero: boolean;
  isVisible: boolean;
};

/** Shares throttled navigation scroll state with desktop and mobile views. */
export default function useScrollVisibility({
  heroSelector = '[data-navigation-hero]',
  hideThreshold = 12,
  throttleMs = 100,
}: ScrollVisibilityOptions = {}): ScrollVisibility {
  const previousScrollY = useRef(0);
  const [scrollState, setScrollState] = useState<ScrollVisibility>({
    isPastHero: false,
    isVisible: true,
  });

  useEffect(() => {
    let lastRunAt = 0;
    let trailingTimer: number | undefined;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      // The hero marker lets the header remain transparent over any hero height.
      const hero = document.querySelector<HTMLElement>(heroSelector);
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 80;
      const isPastHero = currentScrollY > heroBottom - 8;
      const scrollDelta = currentScrollY - previousScrollY.current;
      const isAtTop = currentScrollY < hideThreshold;

      previousScrollY.current = currentScrollY;
      lastRunAt = Date.now();

      setScrollState((previousState) => {
        const isVisible = isAtTop
          ? true
          : scrollDelta > hideThreshold
            ? false
            : scrollDelta < -hideThreshold
              ? true
              : previousState.isVisible;

        if (
          previousState.isVisible === isVisible &&
          previousState.isPastHero === isPastHero
        ) {
          return previousState;
        }

        return { isPastHero, isVisible };
      });
    };

    const onScroll = () => {
      const elapsed = Date.now() - lastRunAt;

      if (elapsed >= throttleMs) {
        updateScrollState();
        return;
      }

      if (trailingTimer === undefined) {
        // Finish a burst with one final update without turning this into debounce.
        trailingTimer = window.setTimeout(() => {
          trailingTimer = undefined;
          updateScrollState();
        }, throttleMs - elapsed);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);

      if (trailingTimer !== undefined) {
        window.clearTimeout(trailingTimer);
      }
    };
  }, [heroSelector, hideThreshold, throttleMs]);

  return scrollState;
}
