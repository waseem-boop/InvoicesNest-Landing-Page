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
  for (const element of elements(section, '[data-motion="features-subTextMain"]')) {
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
  for (const element of elements(section, '[data-motion="features-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0.1, loop: false });
  }

  // Blink star animation
  for (const element of elements(section, '[data-motion="features-blinkStar"]')) {
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
    '[data-motion="features-blinkStar-2"], [data-motion="features-blinkStar-3"]',
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

  // slideInBottom
  for (const element of elements(section, '[data-motion="features-gapOff"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }

  // Feature v2 rotate background
  for (const element of [section]) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    gsap.set([], { rotation: 0 });
    timeline.to([], { ...{ rotation: 360 }, duration: reduced ? 0 : 40, ease: "none" }, 0);
    timeline.to([], { ...{ rotation: 0 }, duration: reduced ? 0 : 0, ease: "none" }, 40);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }

  // New Scroll Animation
  for (const element of [section]) {
    if (!matchesAny(["(min-width: 992px)"])) continue;
    const timeline = gsap.timeline({ paused: true });
    timeline.to({ clock: 0 }, { clock: 1, duration: 1, ease: "none" }, 0);
    gsap.set(elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-one"), {
      xPercent: 165,
    });
    timeline.fromTo(
      elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-one"),
      { xPercent: 165 },
      { xPercent: 0, duration: 0.27, ease: "none", immediateRender: false },
      0.25,
    );
    gsap.set(elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-two"), {
      xPercent: 54,
    });
    timeline.fromTo(
      elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-two"),
      { xPercent: 54 },
      { xPercent: 0, duration: 0.27, ease: "none", immediateRender: false },
      0.25,
    );
    gsap.set(elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-three"), {
      xPercent: -57,
    });
    timeline.fromTo(
      elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-three"),
      { xPercent: -57 },
      { xPercent: 0, duration: 0.27, ease: "none", immediateRender: false },
      0.25,
    );
    gsap.set(elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-four"), {
      xPercent: -168,
    });
    timeline.fromTo(
      elements(element, ".rt-feature-card.rt-border-radius-tiny-15.rt-four"),
      { xPercent: -168 },
      { xPercent: 0, duration: 0.27, ease: "none", immediateRender: false },
      0.25,
    );
    if (reduced) timeline.progress(1);
    else
      cleanup.push(
        bindScrollTimeline(element, timeline, {
          page: false,
          smoothing: 0.5,
          startsEntering: true,
          startsExiting: false,
          startOffset: 0,
          endOffset: 0,
        }),
      );
  }

  // growIn
  for (const element of elements(section, '[data-motion="features-featureCard"]')) {
    if (
      !matchesAny([
        "(min-width: 768px) and (max-width: 991px)",
        "(min-width: 480px) and (max-width: 767px)",
        "(max-width: 479px)",
      ])
    )
      continue;
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
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.3, loop: false });
  }

  // growIn
  for (const element of elements(section, '[data-motion="features-featureCard-2"]')) {
    if (
      !matchesAny([
        "(min-width: 768px) and (max-width: 991px)",
        "(min-width: 480px) and (max-width: 767px)",
        "(max-width: 479px)",
      ])
    )
      continue;
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

  // growIn
  for (const element of elements(section, '[data-motion="features-featureCard-3"]')) {
    if (
      !matchesAny([
        "(min-width: 768px) and (max-width: 991px)",
        "(min-width: 480px) and (max-width: 767px)",
        "(max-width: 479px)",
      ])
    )
      continue;
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
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.5, loop: false });
  }

  // growIn
  for (const element of elements(section, '[data-motion="features-featureCard-4"]')) {
    if (
      !matchesAny([
        "(min-width: 768px) and (max-width: 991px)",
        "(min-width: 480px) and (max-width: 767px)",
        "(max-width: 479px)",
      ])
    )
      continue;
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
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.6, loop: false });
  }

  // growIn
  for (const element of elements(section, '[data-motion="features-featureResponsiveSlider"]')) {
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
    else bindReveal(element, timeline, { offset: 12, unit: "%", delay: 0.2, loop: false });
  }
};
export function useFeaturesAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
