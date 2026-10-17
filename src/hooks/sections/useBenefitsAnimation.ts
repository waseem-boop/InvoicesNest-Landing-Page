"use client";
import type {RefObject} from "react";
import {gsap} from "gsap";
import {useSectionAnimation, elements, type AnimationSetup} from "@/hooks/useSectionAnimation";
const setup:AnimationSetup=(section,reduced)=>{
 for(const element of elements(section,"[data-benefit-reveal]:not(.nest-guide-item)")){
  if(reduced) continue;
  gsap.fromTo(element,{y:35,opacity:0},{y:0,opacity:1,duration:.75,ease:"power3.out",scrollTrigger:{trigger:element,start:"top 92%",once:true}});
 }
};
export function useBenefitsAnimation(ref:RefObject<HTMLElement|null>){useSectionAnimation(ref,setup);}
