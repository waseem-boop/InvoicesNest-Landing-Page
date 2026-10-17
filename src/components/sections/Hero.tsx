"use client";
import ActionButton from "@/components/ui/ActionButton";


import { useRef } from "react";

import LiveInvoice from "@/components/preview/LiveInvoice";

import Link from "next/link";

import Image from "next/image";

import { siteConfig } from "@/data/siteConfig";

import { useHeroAnimation } from "@/hooks/sections/useHeroAnimation";

export default function Hero() {

  const sectionRef = useRef<HTMLDivElement>(null);

  useHeroAnimation(sectionRef);

  const content = siteConfig.sections.hero;

  return (

    <section

      className="rt-hero-v1 rt-overflow-hidden rt-position-relative"

      data-motion="hero-heroV1"

      ref={sectionRef}

    >

      <div className="w-layout-blockcontainer rt-container-medium rt-change-position w-container">

        <div className="w-layout-vflex rt-hero-v1-main rt-position-relative">

          <div className="w-layout-vflex rt-hero-v1-heading-wrap">

            <div className="w-layout-hflex rt-sub-text-main" data-motion="hero-subTextMain">

              <div className="w-layout-hflex rt-sub-text-wrapper">

                <div className="rt-sub-text-dot"></div>

                <div className="rt-sub-text">{content.eyebrow}</div>

              </div>

              <div className="w-layout-vflex rt-gradient-box">

                <div className="rt-button-linear rt-color-change"></div>

                <div className="rt-button-linear rt-color-change rt-2"></div>

              </div>

            </div>

            <div className="rt-hero-v1-heading rt-overflow-hidden">

              <h1 className="rt-gap-off rt-text-center" data-motion="hero-gapOff">

                {content.title}

                <span className="rt-heading-special-font">{content.highlight}</span>

              </h1>

            </div>

            <div className="rt-hero-v1-paragraph rt-overflow-hidden">

              <p

                className="rt-gap-off rt-text-center rt-text-color-white"

                data-motion="hero-gapOff-2"

              >

                {content.description}

              </p>

            </div>

            <div className="rt-button-wrap" data-motion="hero-buttonWrap">

              <ActionButton href={content.buttonHref} className="rt-button w-inline-block" data-motion="hero-button">{content.buttonLabel}</ActionButton>

            </div>

          </div>

          <div className="w-layout-vflex rt-hero-v1-dashboard-prespective" id="invoice-generator">

            <div className="rt-hero-v1-dashboard-wrap rt-position-relative" data-invoice-workspace>

              <div className="rt-hero-v1-dashboard-block rt-border-radius-small-20 rt-overflow-hidden nest-live-workspace">

                <div className="nest-builder-surface"><LiveInvoice /></div>

              </div>



            </div>

          </div>

          <div className="rt-hero-v1-glow-star">

            <div className="rt-glow-star">

              <Image

                alt={content.starAlt}

                src={content.starImage}

                className="rt-blink-star"

                data-motion="hero-blinkStar"

                width={284}

                height={284}

                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"

              />

            </div>

          </div>

          <div className="rt-hero-v1-glow-star rt-two rt-landscape-display-none">

            <div className="rt-glow-star">

              <Image

                alt={content.starAlt}

                src={content.starImage}

                className="rt-blink-star"

                data-motion="hero-blinkStar"

                width={284}

                height={284}

                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"

              />

            </div>

          </div>

          <div className="rt-hero-v1-glow-star rt-three">

            <div className="rt-glow-star">

              <Image

                alt={content.starAlt}

                src={content.starImage}

                className="rt-blink-star"

                data-motion="hero-blinkStar-3"

                width={284}

                height={284}

                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"

              />

            </div>

          </div>

          <div className="rt-hero-v1-glow-star rt-four rt-landscape-display-none">

            <div className="rt-glow-star">

              <Image

                alt={content.starAlt}

                src={content.starImage}

                className="rt-blink-star"

                data-motion="hero-blinkStar-3"

                width={284}

                height={284}

                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"

              />

            </div>

          </div>

        </div>

      </div>

      <div className="rt-hero-v1-gredient"></div>

      <div className="rt-section-background-overlay"></div>

    </section>

  );

}

