"use client";
import { useRef } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useCompanyOverviewAnimation } from "@/hooks/sections/useCompanyOverviewAnimation";
export default function CompanyOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useCompanyOverviewAnimation(sectionRef);
  const content = siteConfig.sections.companyOverview;
  return (
    <section id="how-it-works" className="rt-about-v1 rt-overflow-hidden" ref={sectionRef}>
      <div className="w-layout-blockcontainer rt-container w-container">
        <div className="w-layout-vflex rt-about-v1-main">
          <div className="w-layout-vflex rt-about-v1-heading-wrap">
            <div
              className="w-layout-hflex rt-sub-text-main"
              data-motion="companyOverview-subTextMain"
            >
              <div className="w-layout-hflex rt-sub-text-wrapper">
                <div className="rt-sub-text-dot"></div>
                <div className="rt-sub-text">{content.eyebrow}</div>
              </div>
              <div className="w-layout-vflex rt-gradient-box">
                <div className="rt-button-linear rt-color-change"></div>
                <div className="rt-button-linear rt-color-change rt-2"></div>
              </div>
            </div>
            <div top-box="" className="rt-about-v1-heading rt-overflow-hidden">
              <h2
                fade-heading=""
                className="rt-gap-off rt-text-center"
                data-motion="companyOverview-gapOff"
              >
                {content.heading}
                <span className="rt-heading-special-font">{content.highlight}</span>
              </h2>
            </div>
          </div>
          <div className="w-layout-grid rt-productivity-v1-card-wrap rt-full-width rt-change">
            {[
              ['01', 'Add your details', 'Your business, your client and the work you have done.'],
              ['02', 'Make it your own', 'Add a logo, currency, taxes and your payment terms.'],
              ['03', 'Prepare your PDF', 'Review the totals, then print or save a PDF for your client.'],
            ].map(([number, title, description], index) => (
              <div className="w-layout-hflex rt-productivity-v1-card-wrap rt-position-relative" key={number}>
                <div className="w-layout-vflex rt-productivity-v1-card rt-max-width" data-motion={`companyOverview-productivityV1Card${index ? `-${index + 1}` : ''}`}>
                  <div className="w-layout-hflex rt-big-text-v1-counter-box" data-motion={`companyOverview-bigTextV1CounterBox${index ? `-${index + 1}` : ''}`}>
                    <span className="rt-big-text-v1" data-step-number={index + 1}>{number}</span>
                  </div>
                  <div className="w-layout-vflex rt-productivity-v1-card-text-wrap"><div className="rt-text-style-h5 rt-text-center">{title}</div><div className="rt-text-center">{description}</div></div>
                </div>
                {index < 2 && <div className="rt-productivity-v1-card-border rt-landscape-display-none" data-motion={`companyOverview-productivityV1CardBorder${index ? '-2' : ''}`} />}
              </div>
            ))}
            <div className="rt-border-line" data-motion="companyOverview-borderLine" />
          </div>
        </div>
      </div>
    </section>
  );
}
