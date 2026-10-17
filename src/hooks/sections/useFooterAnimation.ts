"use client";
import type { RefObject } from "react";
import { gsap } from "gsap";
import {
  useSectionAnimation,
  elements,
  matchesAny,
  bindReveal,
  bindHover,
  bindScrollTimeline,
  type AnimationSetup,
} from "@/hooks/useSectionAnimation";
const setup: AnimationSetup = (section, reduced, cleanup) => {
  // Button Hover In
  for (const element of elements(section, '[data-motion="footer-button"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set(elements(element, ".rt-button-font.rt-one"), { yPercent: 0 });
    gsap.set(elements(element, ".rt-button-star-image"), { scaleX: 0.8, scaleY: 0.8 });
    gsap.set(elements(element, ".rt-button-font.rt-two"), { yPercent: 0 });
    timeline.to(
      elements(element, ".rt-button-font.rt-one"),
      { ...{ yPercent: -100 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-button-font.rt-two"),
      { ...{ yPercent: -100 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-button-star-image"),
      { ...{ scaleX: 1.2, scaleY: 1.2 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    cleanup.push(bindHover(element, timeline, true));
  }

  // Button Hover out
  for (const element of elements(section, '[data-motion="footer-button"]')) {
    const timeline = gsap.timeline({ paused: true });
    timeline.to(
      elements(element, ".rt-button-font.rt-one"),
      { ...{ yPercent: 0 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-button-star-image"),
      { ...{ scaleX: 0.8, scaleY: 0.8 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-button-font.rt-two"),
      { ...{ yPercent: 0 }, duration: reduced ? 0 : 0.5, ease: "power1.inOut" },
      0,
    );
    cleanup.push(bindHover(element, timeline, false));
  }

  // Footer border animation
  for (const element of [section]) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set(elements(element, ".rt-footer-left-border.rt-one"), { height: "0%" });
    gsap.set(elements(element, ".rt-footer-top-border"), { width: "0%" });
    gsap.set(elements(element, ".rt-footer-left-border.rt-two"), { height: "0%" });
    gsap.set(elements(element, ".rt-footer-left-border.rt-three"), { height: "0%" });
    timeline.to(
      elements(element, ".rt-footer-top-border"),
      { ...{ width: "100%" }, duration: reduced ? 0 : 1.5, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-footer-left-border.rt-one"),
      { ...{ height: "100%" }, duration: reduced ? 0 : 0.5, ease: "none" },
      0.7,
    );
    timeline.to(
      elements(element, ".rt-footer-left-border.rt-two"),
      { ...{ height: "100%" }, duration: reduced ? 0 : 0.5, ease: "none" },
      0.9,
    );
    timeline.to(
      elements(element, ".rt-footer-left-border.rt-three"),
      { ...{ height: "100%" }, duration: reduced ? 0 : 0.5, ease: "none" },
      1.2,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: false });
  }
};
export function useFooterAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
