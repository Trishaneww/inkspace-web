"use client";

// Next.js
import { useLayoutEffect, useRef } from "react";

type SlideTransitionOptions = {
  distance?: number;
  duration?: number;
  easing?: string;
};

const DEFAULTS = {
  distance: 24,
  duration: 240,
  easing: "cubic-bezier(0.33, 1, 0.68, 1)",
};

export function useSlideTransition<T extends HTMLElement = HTMLDivElement>(
  activeIndex: number,
  options?: SlideTransitionOptions,
) {
  const ref = useRef<T>(null);
  const prevIndexRef = useRef(activeIndex);

  const { distance, duration, easing } = { ...DEFAULTS, ...options };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || activeIndex === prevIndexRef.current) return;

    const direction = activeIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = activeIndex;

    el.getAnimations().forEach((animation) => animation.cancel());
    el.animate(
      [
        { transform: `translateX(${direction * distance}px)` },
        { transform: "translateX(0px)" },
      ],
      { duration, easing, fill: "backwards" },
    );
  }, [activeIndex, distance, duration, easing]);

  return ref;
}
