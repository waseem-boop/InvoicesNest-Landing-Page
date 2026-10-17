"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: !preference.matches });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    const changePreference = () => {
      lenis.options.smoothWheel = !preference.matches;
    };
    const anchor = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -90, duration: 1.2, immediate: preference.matches, force: true });
      history.replaceState(null, "", url.hash);
    };
    // Handle local anchors before Next's Link prevents the native hash scroll.
    document.addEventListener("click", anchor, true);
    preference.addEventListener("change", changePreference);
    return () => {
      document.removeEventListener("click", anchor, true);
      preference.removeEventListener("change", changePreference);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return children;
}
