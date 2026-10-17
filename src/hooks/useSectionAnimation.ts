"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type AnimationSetup = (
  section: HTMLElement,
  reducedMotion: boolean,
  cleanup: (() => void)[],
) => void;

export function elements(root: HTMLElement, selector: string): HTMLElement[] {
  return [
    ...(root.matches(selector) ? [root] : []),
    ...Array.from(root.querySelectorAll<HTMLElement>(selector)),
  ];
}

export function matchesAny(queries: string[]) {
  return queries.some(query => window.matchMedia(query).matches);
}

export function useSectionAnimation(ref: RefObject<HTMLElement | null>, setup: AnimationSetup) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let cancelled = false;
    let context: gsap.Context | undefined;
    const cleanup: (() => void)[] = [];
    let width = window.innerWidth;

    const mount = () => {
      cleanup.splice(0).reverse().forEach(dispose => dispose());
      context?.revert();
      context = gsap.context(() => {
        setup(section, window.matchMedia("(prefers-reduced-motion: reduce)").matches, cleanup);
      }, section);
      ScrollTrigger.refresh();
    };
    const refresh = () => ScrollTrigger.refresh();
    const resize = () => {
      if (window.innerWidth === width) return;
      const previous = width;
      width = window.innerWidth;
      const breakpoint = (value: number) => value >= 992 ? 3 : value >= 768 ? 2 : value >= 480 ? 1 : 0;
      if (breakpoint(previous) !== breakpoint(width)) mount();
    };
    document.fonts.ready.then(() => {
      if (!cancelled) mount();
    });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", mount);
    section.addEventListener("load", refresh, true);
    window.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      preference.removeEventListener("change", mount);
      section.removeEventListener("load", refresh, true);
      window.removeEventListener("resize", resize);
      cleanup.reverse().forEach(dispose => dispose());
      context?.revert();
    };
  }, [ref, setup]);
}

export function bindReveal(
  element: HTMLElement,
  timeline: gsap.core.Timeline,
  options: { offset: number; unit: string; delay: number; loop: boolean },
) {
  const inset = options.unit.toLowerCase() === "px" ? `${options.offset}px` : `${options.offset}%`;
  const play = () => { timeline.delay(options.delay).restart(true); };
  ScrollTrigger.create({
    trigger: element,
    start: `top bottom-=${inset}`,
    end: `bottom top+=${inset}`,
    once: !options.loop,
    onEnter: play,
    onEnterBack: options.loop ? play : undefined,
    onLeave: options.loop ? () => { timeline.pause(); } : undefined,
    onLeaveBack: options.loop ? () => { timeline.pause(); } : undefined,
  });
}

export function bindHover(element: HTMLElement, timeline: gsap.core.Timeline, entering: boolean) {
  const play = () => { timeline.invalidate().restart(); };
  const pointer = entering ? "mouseenter" : "mouseleave";
  const keyboard = entering ? "focusin" : "focusout";
  element.addEventListener(pointer, play);
  element.addEventListener(keyboard, play);
  return () => {
    element.removeEventListener(pointer, play);
    element.removeEventListener(keyboard, play);
  };
}

interface ScrollTimelineOptions {
  page: boolean;
  smoothing: number;
  startsEntering: boolean;
  startsExiting: boolean;
  startOffset: number;
  endOffset: number;
}

export function bindScrollTimeline(
  element: HTMLElement,
  timeline: gsap.core.Timeline,
  options: ScrollTimelineOptions,
) {
  const range = () => {
    if (options.page) return { start: 0, end: Math.max(1, ScrollTrigger.maxScroll(window)) };
    const bounds = element.getBoundingClientRect();
    const viewport = document.documentElement.clientHeight;
    const entry = options.startsEntering ? options.startOffset : 1 - options.startOffset;
    const exit = options.startsExiting ? options.endOffset : 1 - options.endOffset;
    const inset = Math.min(bounds.height * entry, viewport);
    const start = window.scrollY + bounds.top + inset - viewport;
    const distance = Math.min(viewport + bounds.height * exit - inset, document.documentElement.scrollHeight);
    return { start, end: start + Math.max(1, distance) };
  };
  let targetProgress = 0;
  let currentProgress = 0;
  const scroll = ScrollTrigger.create({
    trigger: element,
    start: () => range().start,
    end: () => range().end,
    invalidateOnRefresh: true,
    onUpdate: self => { targetProgress = self.progress; },
    onRefresh: self => { targetProgress = self.progress; },
  });
  currentProgress = targetProgress = scroll.progress;
  timeline.progress(currentProgress);

  // Preserve full keyframe progress without adding a second seconds-long scroll delay.
  const blend = Math.min(0.99, Math.max(0, options.smoothing));
  const tick = () => {
    const alpha = 1 - Math.pow(blend, Math.min(4, gsap.ticker.deltaRatio(60)));
    currentProgress += (targetProgress - currentProgress) * alpha;
    if (Math.abs(targetProgress - currentProgress) < 0.00001) currentProgress = targetProgress;
    timeline.progress(currentProgress);
  };
  gsap.ticker.add(tick);
  return () => { gsap.ticker.remove(tick); scroll.kill(); };
}
