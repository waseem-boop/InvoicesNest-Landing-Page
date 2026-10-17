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
  for (const element of elements(section, '[data-motion="aIPartner-button"]')) {
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
  for (const element of elements(section, '[data-motion="aIPartner-button"]')) {
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

  // growIn
  for (const element of elements(section, '[data-motion="aIPartner-partnerV1BarImage"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to(
      [element],
      {
        ...{ scaleX: 0.7500000000000001, scaleY: 0.7500000000000001 },
        duration: reduced ? 0 : 0,
        ease: "none",
      },
      0,
    );
    timeline.to(
      [element],
      { ...{ scaleX: 1, scaleY: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" },
      0,
    );
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.4, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="aIPartner-gapOff"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.1, loop: false });
  }

  // slideInBottom
  for (const element of elements(
    section,
    '[data-motion="aIPartner-gapOff-2"], [data-motion="aIPartner-partnerV1MainImage"]',
  )) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="aIPartner-buttonWrap"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.3, loop: false });
  }

  // Home one partner bar image move
  for (const element of elements(section, '[data-motion="aIPartner-partnerV1ImageWrap"]')) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    gsap.set(
      elements(element, ".rt-partner-v1-bar-image.rt-border-radius-small-20.rt-overflow-hidden"),
      { x: "0rem", y: "0rem" },
    );
    timeline.to(
      elements(element, ".rt-partner-v1-bar-image.rt-border-radius-small-20.rt-overflow-hidden"),
      { ...{ x: "-0.375rem", y: "0.375rem" }, duration: reduced ? 0 : 0.7, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-partner-v1-bar-image.rt-border-radius-small-20.rt-overflow-hidden"),
      { ...{ x: "0rem", y: "0rem" }, duration: reduced ? 0 : 0.7, ease: "none" },
      0.7,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }
};
export function useAIPartnerAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
