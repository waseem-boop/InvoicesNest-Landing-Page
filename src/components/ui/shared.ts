import type { HTMLAttributes, Ref } from "react";
export type ContainerProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLDivElement> };
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
