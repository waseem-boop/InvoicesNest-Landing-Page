"use client";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useSectionAnimation,
  elements,
  bindReveal,
  bindHover,
  type AnimationSetup,
} from "@/hooks/useSectionAnimation";
const setup: AnimationSetup = (section, reduced, cleanup) => {
  // Button Hover In
  for (const element of elements(section, '[data-motion="hero-button"]')) {
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
  for (const element of elements(section, '[data-motion="hero-button"]')) {
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

  // Sub text linear glow animation
  for (const element of elements(section, '[data-motion="hero-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    timeline.to(
      elements(element, ".rt-gradient-box"),
      { ...{ rotation: 0 }, duration: reduced ? 0 : 0, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-gradient-box"),
      { ...{ rotation: 359 }, duration: reduced ? 0 : 4.5, ease: "none" },
      0,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="hero-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0.1, loop: false });
  }

  // Retain the reference hero's perspective and scroll scrub on the live builder.
  const workspace = section.querySelector<HTMLElement>('[data-invoice-workspace]');
  const perspective = section.querySelector<HTMLElement>('.rt-hero-v1-dashboard-prespective');
  if (workspace && perspective) {
    if (reduced) gsap.set(workspace, { rotationX: 0, y: 0 });
    else {
      const tilt = gsap.fromTo(workspace,
        { rotationX: 60, y: '-8.125rem', transformOrigin: '50% 0%', force3D: true },
        {
          rotationX: 0, y: 0, ease: 'none', scrollTrigger: {
            trigger: perspective, start: 'top 95%', end: 'top 18%', scrub: 0.5,
            invalidateOnRefresh: true,
          }
        },
      );
      cleanup.push(() => { tilt.scrollTrigger?.kill(); tilt.kill(); });
    }
    let previousHeight = 0;
    let refreshFrame = 0;
    const observer = new ResizeObserver(([entry]) => {
      const height = Math.round(entry.contentRect.height);
      if (height === previousHeight) return;
      previousHeight = height;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(workspace);
    cleanup.push(() => { observer.disconnect(); cancelAnimationFrame(refreshFrame); });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="hero-gapOff"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="hero-gapOff-2"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.3, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="hero-buttonWrap"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.4, loop: false });
  }

  // Blink star animation
  for (const element of elements(
    section,
    '[data-motion="hero-blinkStar"], [data-motion="hero-blinkStar"]',
  )) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    gsap.set(elements(element, ".rt-blink-star"), { scaleX: 0, scaleY: 0 });
    timeline.to(
      elements(element, ".rt-blink-star"),
      { ...{ scaleX: 1, scaleY: 1 }, duration: reduced ? 0 : 1, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-blink-star"),
      { ...{ scaleX: 0.2, scaleY: 0.2 }, duration: reduced ? 0 : 1, ease: "none" },
      1,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }

  // Blink star animation v2
  for (const element of elements(
    section,
    '[data-motion="hero-blinkStar-3"], [data-motion="hero-blinkStar-3"]',
  )) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    gsap.set(elements(element, ".rt-blink-star"), { scaleX: 1, scaleY: 1 });
    timeline.to(
      elements(element, ".rt-blink-star"),
      { ...{ scaleX: 0, scaleY: 0 }, duration: reduced ? 0 : 1, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-blink-star"),
      { ...{ scaleX: 1, scaleY: 1 }, duration: reduced ? 0 : 1, ease: "none" },
      1,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }
};
export function useHeroAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
