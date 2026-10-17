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
interface NavigationState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationState>({ open: false, setOpen: () => {} });

export function MobileNavigation({ children, className = "", ...props }: ContainerProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const media = matchMedia("(min-width: 992px)");
    const reset = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", close);
    media.addEventListener("change", reset);
    return () => {
      document.removeEventListener("keydown", close);
      media.removeEventListener("change", reset);
    };
  }, []);
  return (
    <NavigationContext value={{ open, setOpen }}>
      <div {...props} className={`${className}${open ? " avelety-menu-open" : ""}`}>
        {children}
      </div>
    </NavigationContext>
  );
}

export function MenuButton({ children, className = "", ...props }: ContainerProps) {
  const { open, setOpen } = useContext(NavigationContext);
  return (
    <button
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      className={`${className} clean-menu-button${open ? " w--open" : ""}`}
      aria-label={siteConfig.ui.navigation}
      aria-controls="mobile-navigation"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      {children}
    </button>
  );
}

export function NavigationPanel({ children, ...props }: ContainerProps) {
  const { open, setOpen } = useContext(NavigationContext);
  return (
    <nav
      {...props}
      id="mobile-navigation"
      data-mobile-open={open}
      data-lenis-prevent
      onClick={(event) => {
        if ((event.target as Element).closest("a[href]")) setOpen(false);
      }}
    >
      {children}
    </nav>
  );
}
