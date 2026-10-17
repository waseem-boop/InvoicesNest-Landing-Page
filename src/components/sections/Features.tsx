"use client";
import { useRef } from "react";
import Image from "next/image";
import { Palette, Coins, Users, Calculator } from "lucide-react";
import { Slider } from "@/components/ui/Interactive";
import { siteConfig } from "@/data/siteConfig";
import { useFeaturesAnimation } from "@/hooks/sections/useFeaturesAnimation";
export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useFeaturesAnimation(sectionRef);
  const content = siteConfig.sections.features;
  return (
    <section
      id="features"
      className="rt-feature-v2 rt-overflow-hidden rt-position-relative"
      data-motion="features-featureV2"
      ref={sectionRef}
    >
      <div className="w-layout-blockcontainer rt-container rt-position-relative w-container">
        <div className="w-layout-vflex rt-feature-v2-heading-wrap">
          <div className="w-layout-hflex rt-sub-text-main" data-motion="features-subTextMain">
            <div className="w-layout-hflex rt-sub-text-wrapper">
              <div className="rt-sub-text-dot"></div>
              <div className="rt-sub-text">{content.eyebrow}</div>
            </div>
            <div className="w-layout-vflex rt-gradient-box">
              <div className="rt-button-linear rt-color-change"></div>
              <div className="rt-button-linear rt-color-change rt-2"></div>
            </div>
          </div>
          <div className="rt-feature-v2-heading rt-overflow-hidden">
            <h2 className="rt-gap-off rt-text-center" data-motion="features-gapOff">
              {content.heading}
              <span className="rt-heading-special-font">{content.highlight}</span>
            </h2>
          </div>
        </div>
        <div className="rt-feature-v2-glow-star rt-landscape-display-none">
          <div className="rt-glow-star">
            <Image
              alt={content.aveletyPageBigStarAlt}
              src={content.aveletyPageBigStarImage}
              className="rt-blink-star"
              data-motion="features-blinkStar"
              width={284}
              height={284}
              sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"
            />
          </div>
        </div>
        <div className="rt-feature-v2-glow-star rt-two rt-landscape-display-none">
          <div className="rt-glow-star">
            <Image
              alt={content.aveletySkyGlowAlt}
              src={content.aveletySkyGlowImage}
              style={{
                transform:
                  "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
              }}
              className="rt-blink-star"
              data-motion="features-blinkStar-2"
              width={146}
              height={146}
              sizes="146px"
            />
          </div>
        </div>
      </div>
      <div className="w-layout-blockcontainer rt-feature-v2-container w-container">
        <div className="w-layout-grid rt-feature-main-v2 rt-responsive-grid">
          {content.cards.map((item) => (
            <FeatureCard key={item.title} item={item} animated />
          ))}
        </div>
        <div
          className="rt-feature-responsive-slider"
          data-motion="features-featureResponsiveSlider"
        >
          <Slider
            data-delay="4000"
            data-animation="slide"
            className="rt-responsive-slider-main w-slider"
            data-autoplay="true"
            data-easing="ease"
            data-hide-arrows="false"
            data-disable-swipe="false"
            data-autoplay-limit="0"
            data-nav-spacing="3"
            data-duration="500"
            data-infinite="true"
          >
            <div className="w-slider-mask">
              {content.cards.map((item) => (
                <div className="w-slide" key={item.title}>
                  <FeatureCard item={item} />
                </div>
              ))}
            </div>
            <div className="rt-display-none w-slider-arrow-left">
              <div className="w-icon-slider-left"></div>
            </div>
            <div className="rt-display-none w-slider-arrow-right">
              <div className="w-icon-slider-right"></div>
            </div>
            <div className="rt-display-none w-slider-nav w-round w-num"></div>
          </Slider>
        </div>
      </div>
      <div className="rt-feature-v2-glow-star rt-four">
        <div className="rt-glow-star">
          <Image
            alt={content.aveletyBlueGlowAlt}
            src={content.aveletyBlueGlowImage}
            style={{
              transform:
                "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            }}
            className="rt-blink-star"
            data-motion="features-blinkStar-3"
            width={191}
            height={191}
            sizes="191px"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  item,
  animated = false,
}: {
  item: (typeof siteConfig.sections.features.cards)[number];
  animated?: boolean;
}) {
  const content = siteConfig.sections.features;
  const Icon = [Palette, Coins, Users, Calculator][content.cards.indexOf(item)] || Palette;
  return (
    <div className={item.className} data-motion={animated ? item.animationKey : undefined}>
      <div className="w-layout-vflex rt-feature-card-heading-wrap rt-mobile-text-center">
        
        <div className="rt-feature-card-icon-wrap">
          <Icon size={48} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="rt-text-style-h4 rt-tab-text-center">{item.title}</div>
      </div>
      <div className="rt-feature-card-paragraph-wrap-v1 rt-full-width">
        <div className="rt-feature-card-paragraph rt-mobile-text-center">
          <p className="rt-no-margin rt-tab-text-center">{item.description}</p>
        </div>
      </div>
      
    </div>
  );
}
