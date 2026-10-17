"use client";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  for (const element of elements(section, '[data-motion="aISupport-button"]')) {
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
  for (const element of elements(section, '[data-motion="aISupport-button"]')) {
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
  for (const element of elements(section, '[data-motion="aISupport-subTextMain"]')) {
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
  for (const element of elements(section, '[data-motion="aISupport-subTextMain"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 0, unit: "%", delay: 0.1, loop: false });
  }

  // Common border line animation
  for (const element of elements(section, '[data-motion="aISupport-borderLine"]')) {
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

  // Animate the existing chat rows only while this panel is in view.
  for (const panel of elements(section, '[data-motion="aISupport-featureHeroMainChat"]')) {
    const rows = elements(panel, '[data-support-message]');
    if (reduced) { gsap.set(rows, {opacity:1,y:0}); continue; }
    const conversation = gsap.timeline({paused:true});
    const typing=elements(panel, '[data-support-closed]');
    gsap.set(typing,{opacity:0});
    gsap.set(rows, {opacity:0,y:12});
    rows.forEach((row,index) => conversation.to(row,{opacity:1,y:0,duration:.45,ease:"power2.out"},.25+index*1.5));
    conversation.to(typing,{opacity:1,duration:.3},rows.length*1.5);
    const trigger = ScrollTrigger.create({trigger:panel,start:"top 85%",end:"bottom 15%",
      onEnter:()=>conversation.play(),onEnterBack:()=>conversation.play(),
      onLeave:()=>conversation.pause(),onLeaveBack:()=>conversation.pause(0)});
    cleanup.push(()=>{trigger.kill();conversation.kill();});
  }

  // slideInLeft
  for (const element of elements(section, '[data-motion="aISupport-aiSupportClientImage-3"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: -100, y: 0 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.5, loop: false });
  }

  // slideInLeft
  for (const element of elements(section, '[data-motion="aISupport-aiSupportClientImage-2"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: -100, y: 0 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.6, loop: false });
  }

  // slideInLeft
  for (const element of elements(section, '[data-motion="aISupport-aiSupportClientImage"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: -100, y: 0 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.7, loop: false });
  }

  // growIn
  for (const element of elements(section, '[data-motion="aISupport-aiSupportIconWrap"]')) {
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
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.8, loop: false });
  }

  // slideInLeft
  for (const element of elements(section, '[data-motion="aISupport-textColorWhite"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: -100, y: 0 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.9, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="aISupport-gapOff"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.2, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="aISupport-gapOff-2"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.3, loop: false });
  }

  // slideInBottom
  for (const element of elements(section, '[data-motion="aISupport-buttonWrap"]')) {
    const timeline = gsap.timeline({ paused: true });
    gsap.set([element], { opacity: 0 });
    timeline.to([element], { ...{ x: 0, y: 100 }, duration: reduced ? 0 : 0, ease: "none" }, 0);
    timeline.to([element], { ...{ x: 0, y: 0 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    timeline.to([element], { ...{ opacity: 1 }, duration: reduced ? 0 : 1, ease: "power3.out" }, 0);
    if (reduced) timeline.progress(1);
    else bindReveal(element, timeline, { offset: 20, unit: "%", delay: 0.4, loop: false });
  }
};
export function useAISupportAnimation(ref: RefObject<HTMLElement | null>) {
  useSectionAnimation(ref, setup);
}
