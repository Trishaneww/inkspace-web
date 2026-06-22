"use client";

// React
import { useEffect, type ReactNode } from "react";

// Libs
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const HEADER_OFFSET = -80;

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis();

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: HEADER_OFFSET });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
