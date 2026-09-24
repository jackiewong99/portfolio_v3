'use client';

import { useEffect, useRef, useState } from 'react';

type ScrollVisibilityOptions = {
  heroSelector?: string;
  hideThreshold?: number;
  throttleMs?: number;
};

type ScrollVisibility = {
  isScrolled: boolean;
  isVisible: boolean;
};

/** Shares throttled navigation scroll state with desktop and mobile views. */
export default function useScrollVisibility({
  hideThreshold = 12,
  throttleMs = 100,
}: ScrollVisibilityOptions = {}): ScrollVisibility {
  const previousScrollY = useRef(0);
  const [scrollState, setScrollState] = useState<ScrollVisibility>({
    isScrolled: false,
    isVisible: true,
  });

  useEffect(() => {
    let lastRunAt = 0;
    let trailingTimer: number | undefined;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY.current;
      const isAtTop = currentScrollY < hideThreshold;
      const isScrolled = !isAtTop;

      previousScrollY.current = currentScrollY;
      lastRunAt = Date.now();

      setScrollState((previousState: ScrollVisibility) => {
        const isVisible = isAtTop
          ? true
          : scrollDelta > hideThreshold
            ? false
            : scrollDelta < -hideThreshold
              ? true
              : previousState.isVisible;

        if (
          previousState.isVisible === isVisible &&
          previousState.isScrolled === isScrolled
        ) {
          return previousState;
        }

        return { isScrolled, isVisible };
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

    return () => {
      window.removeEventListener('scroll', onScroll);

      if (trailingTimer !== undefined) {
        window.clearTimeout(trailingTimer);
      }
    };
  }, [hideThreshold, throttleMs]);

  return scrollState;
}
