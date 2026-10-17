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
  for (const element of elements(
    section,
    '[data-motion="navbar-button"], [data-motion="navbar-button"], [data-motion="navbar-button"]',
  )) {
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
  for (const element of elements(
    section,
    '[data-motion="navbar-button"], [data-motion="navbar-button"], [data-motion="navbar-button"]',
  )) {
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

  // Responsive navbar
  for (const element of [section]) {
    if (
      !matchesAny([
        "(min-width: 768px) and (max-width: 991px)",
        "(min-width: 480px) and (max-width: 767px)",
        "(max-width: 479px)",
      ])
    )
      continue;
    const timeline = gsap.timeline({ paused: true });
    timeline.to({ clock: 0 }, { clock: 1, duration: 1, ease: "none" }, 0);
    gsap.set(elements(section, ".rt-navbar"), { backgroundColor: "rgba(255,255,255,0.94)" });
    timeline.fromTo(
      elements(section, ".rt-navbar"),
      { backgroundColor: "rgba(255,255,255,0.94)" },
      { backgroundColor: "rgba(255,255,255,1)", duration: 0.005, ease: "none", immediateRender: false },
      0,
    );
    gsap.set(elements(section, ".rt-navbar"), { borderColor: "rgba(255,255,255,0)" });
    timeline.fromTo(
      elements(section, ".rt-navbar"),
      { borderColor: "rgba(255,255,255,0)" },
      {
        borderColor: "rgba(227,220,241,1)",
        duration: 0.005,
        ease: "none",
        immediateRender: false,
      },
      0,
    );
    if (reduced) timeline.progress(1);
    else
      cleanup.push(
        bindScrollTimeline(element, timeline, {
          page: true,
          smoothing: 0.5,
          startsEntering: true,
          startsExiting: false,
          startOffset: 0,
          endOffset: 0,
        }),
      );
  }

  // Navbar menu hover in
  for (const element of elements(section, '[data-motion="navbar-navbarFont"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set(elements(element, ".rt-navbar-font.rt-menu"), { color: "rgba(65,56,82,1)" });
    gsap.set(elements(element, ".rt-navbar-dropdown-arrow"), { rotation: 0 });
    gsap.set(elements(element, ".rt-navbar-dropdown-arrow"), { filter: "brightness(200%)" });
    gsap.set(elements(element, ".rt-dropdown-list"), { y: 20 });
    gsap.set(elements(element, ".rt-dropdown-list.rt-navbar-page-menu.rt-position-middle"), {
      opacity: 0,
    });
    timeline.to(
      elements(element, ".rt-navbar-font.rt-menu"),
      { ...{ color: "rgba(87,84,215,1)" }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-dropdown-list.rt-navbar-page-menu.rt-position-middle"),
      { ...{ opacity: 1 }, duration: reduced ? 0 : 0.5, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-navbar-dropdown-arrow"),
      { ...{ rotation: -180 }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-navbar-dropdown-arrow"),
      { ...{ filter: "brightness(100%)" }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-dropdown-list"),
      { ...{ y: 0 }, duration: reduced ? 0 : 0.2, ease: "none" },
      0,
    );
    cleanup.push(bindHover(element, timeline, true));
  }

  // Navbar menu hover out
  for (const element of elements(section, '[data-motion="navbar-navbarFont"]')) {
    const timeline = gsap.timeline({ paused: true });
    timeline.to(
      elements(element, ".rt-navbar-font.rt-menu"),
      { ...{ color: "rgba(65,56,82,1)" }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-navbar-dropdown-arrow"),
      { ...{ rotation: 0 }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-navbar-dropdown-arrow"),
      { ...{ filter: "brightness(200%)" }, duration: reduced ? 0 : 0.2, ease: "power1.inOut" },
      0,
    );
    timeline.to(
      elements(element, ".rt-dropdown-list"),
      { ...{ y: 20 }, duration: reduced ? 0 : 0.2, ease: "none" },
      0,
    );
    timeline.to(
      elements(element, ".rt-dropdown-list.rt-navbar-page-menu.rt-position-middle"),
      { ...{ opacity: 0 }, duration: reduced ? 0 : 0.2, ease: "none" },
      0,
    );
    cleanup.push(bindHover(element, timeline, false));
  }
};
export function useNavbarAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
