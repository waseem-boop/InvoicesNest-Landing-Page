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
  for (const element of elements(section, '[data-motion="testimonials-subTextMain"]')) {
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
  for (const element of elements(section, '[data-motion="testimonials-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0.1, loop: false });
  }

  // Testimnial v1 Marquee up
  for (const element of elements(
    section,
    '[data-motion="testimonials-testimonialMarquee"], [data-motion="testimonials-testimonialMarquee-3"]',
  )) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    timeline.to(
      elements(element, ".rt-marquee-train.rt-up"),
      { ...{ yPercent: 0 }, duration: reduced ? 0 : 0, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-marquee-train.rt-up"),
      { ...{ yPercent: -100 }, duration: reduced ? 0 : 25, ease: "none" },
      0,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }

  // Testimonial v1 marquee down
  for (const element of elements(section, '[data-motion="testimonials-testimonialMarquee-2"]')) {
    const timeline = gsap.timeline({ paused: true, repeat: reduced ? 0 : -1 });
    timeline.to(
      elements(element, ".rt-marquee-train.rt-down"),
      { ...{ yPercent: -100 }, duration: reduced ? 0 : 0, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-marquee-train.rt-down"),
      { ...{ yPercent: 0 }, duration: reduced ? 0 : 25, ease: "none" },
      0,
    );
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0, loop: true });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="testimonials-gapOff"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }
};
export function useTestimonialsAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
