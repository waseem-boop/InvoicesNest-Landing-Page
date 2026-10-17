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
  // Sub text linear glow animation
  for (const element of elements(section, '[data-motion="companyOverview-subTextMain"]')) {
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
  for (const element of elements(section, '[data-motion="companyOverview-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0.1, loop: false });
  }

  // Common border line animation
  for (const element of elements(section, '[data-motion="companyOverview-borderLine"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { width: "0%" });
    timeline.to(
      [element],
      { ...{ width: "100%" }, duration: reduced ? 0 : 1.5, ease: "none" },
      0.3,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: false });
  }

  // slideInBottom
  for (const element of elements(
    section,
    '[data-motion="companyOverview-productivityV1Card"], [data-motion="companyOverview-gapOff"]',
  )) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }

  // Counter top bottom move
  for (const element of elements(section, '[data-step-number]')) {
    const target = Number(element.dataset.stepNumber);
    const counter = { value: 0 };
    const timeline = gsap.timeline({ paused: true });
    timeline.to(counter, { value: target, duration: reduced ? 0 : 1.5, ease: 'power2.out', onUpdate: () => {
      element.textContent = String(Math.round(counter.value)).padStart(2, '0');
    } });
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: '%', delay: 0, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="companyOverview-productivityV1Card-2"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.4, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="companyOverview-productivityV1Card-3"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.6, loop: false });
  }

  // Vertical border grow animation
  for (const element of elements(
    section,
    '[data-motion="companyOverview-productivityV1CardBorder"], [data-motion="companyOverview-productivityV1CardBorder-2"]',
  )) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { height: "0%" });
    timeline.to([element], { ...{ height: "100%" }, duration: reduced ? 0 : 0.5, ease: "none" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: false });
  }
};
export function useCompanyOverviewAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
