"use client";
import ActionButton from "@/components/ui/ActionButton";

import Image from "next/image";
import { useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useAIPartnerAnimation } from "@/hooks/sections/useAIPartnerAnimation";
export default function AIPartner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useAIPartnerAnimation(sectionRef);
  const content = siteConfig.sections.aIPartner;
  return (
    <section className="rt-partner-v1 rt-overflow-hidden" ref={sectionRef}>
      <div className="w-layout-blockcontainer rt-container w-container">
        <div className="w-layout-hflex rt-pariner-v1-main">
<div className="rt-partner-v1-image-wrap-main"><div className="w-layout-vflex rt-partner-v1-image-wrap rt-border-radius-small-20 rt-overflow-hidden" data-motion="aIPartner-partnerV1ImageWrap"><div className="w-layout-vflex rt-partner-v1-image-block"><div className="rt-partner-v1-client-image rt-border-radius-little rt-overflow-hidden" data-motion="aIPartner-partnerV1ClientImage"><Image src={content.aveletyHomeOnePartnerClientQuoteImage} alt={content.aveletyHomeOnePartnerClientQuoteAlt} width={390} height={92}/></div><div className="rt-partner-v1-main-image rt-position-relative" data-motion="aIPartner-partnerV1MainImage"><Image src={content.aveletyHomeOnePartnerMainImageImage} alt={content.aveletyHomeOnePartnerMainImageAlt} width={348} height={364}/><div className="rt-partner-v1-bar-image rt-border-radius-small-20 rt-overflow-hidden" data-motion="aIPartner-partnerV1BarImage"><Image src={content.aveletyHomeOnePartnerBarGraphImageImage} alt={content.aveletyHomeOnePartnerBarGraphImageAlt} width={241} height={255}/></div></div></div></div></div>          <div className="w-layout-vflex rt-partner-v1-text-wrap">
            <div className="rt-partner-v1-heading rt-overflow-hidden">
              <h2 className="rt-gap-off" data-motion="aIPartner-gapOff">
                {content.heading}
                <span className="rt-heading-special-font">{content.highlight}</span>
              </h2>
            </div>
            <div className="rt-partner-v1-paragraph rt-overflow-hidden">
              <p className="rt-gap-off" data-motion="aIPartner-gapOff-2">
                {content.description}
              </p>
            </div>
            <div className="rt-button-wrap" data-motion="aIPartner-buttonWrap">
              <ActionButton href={content.startFreeTrialstartFreeTrialHref} className="rt-button w-inline-block" data-motion="aIPartner-button">{content.buttonLabel}</ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
