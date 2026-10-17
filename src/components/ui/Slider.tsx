"use client";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/siteConfig";
import { reducedMotion, type ContainerProps } from "./shared";
function mapSlides(
  children: ReactNode,
  render: (child: ReactElement<HTMLAttributes<HTMLElement>>) => ReactElement,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement<HTMLAttributes<HTMLElement>>(child)) return child;
    if (child.props.className?.split(" ").includes("w-slide")) return render(child);
    return cloneElement(child, {}, mapSlides(child.props.children, render));
  });
}

export function Slider({ children, ...props }: ContainerProps) {
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(0);
  const count = useRef(0);
  const delay = Number((props as Record<string, unknown>)["data-delay"] || 4000);
  const duration = Number((props as Record<string, unknown>)["data-duration"] || 500) / 1000;
  const autoplay = (props as Record<string, unknown>)["data-autoplay"] === "true";
  let total = 0;
  const content = mapSlides(children, (slide) => {
    const index = total++;
    return cloneElement(slide, { "aria-hidden": current !== index, inert: current !== index });
  });
  count.current = total;
  useEffect(() => {
    const slides = Array.from(root.current?.querySelectorAll<HTMLElement>(".w-slide") || []);
    const move = () => {
      if (!slides[current]) return;
      gsap.to(slides, {
        x: -(slides[current].offsetLeft - slides[0].offsetLeft),
        duration: reducedMotion() ? 0 : duration,
        ease: "power1.inOut",
        overwrite: true,
      });
    };
    move();
    window.addEventListener("resize", move);
    return () => {
      window.removeEventListener("resize", move);
      gsap.killTweensOf(slides);
    };
  }, [current, duration]);
  useEffect(() => {
    if (!autoplay || paused || reducedMotion()) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setCurrent((index) => (index + 1) % Math.max(1, count.current));
    }, delay);
    return () => clearInterval(timer);
  }, [autoplay, paused, delay]);
  const move = (direction: number) =>
    setCurrent((index) => (index + direction + count.current) % Math.max(1, count.current));
  return (
    <div
      {...props}
      ref={root}
      tabIndex={0}
      role="region"
      aria-label={siteConfig.ui.showcase}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
      onTouchStart={(event) => {
        touch.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - touch.current;
        if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
      }}
      onClick={(event) => {
        const target = event.target as Element;
        if (target.closest(".w-slider-arrow-left")) move(-1);
        if (target.closest(".w-slider-arrow-right")) move(1);
      }}
    >
      {content}
    </div>
  );
}
