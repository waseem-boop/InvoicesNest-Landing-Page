"use client";
import ActionButton from "@/components/ui/ActionButton";

import BrandLogo from "@/components/ui/BrandLogo";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { useFooterAnimation } from "@/hooks/sections/useFooterAnimation";
export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useFooterAnimation(sectionRef);
  const content = siteConfig.sections.footer;
  return (
    <section className="rt-footer rt-overflow-hidden" data-motion="footer-footer" ref={sectionRef}>
      <div className="w-layout-blockcontainer rt-container-lerge w-container">
        <div className="rt-footer-wrap rt-position-relative">
          <div className="w-layout-blockcontainer rt-container rt-space-off w-container">
            <div className="rt-footer-inner">
              <div className="w-layout-hflex rt-footer-main">
                <div className="rt-footer-cell-left-wrap rt-position-relative">
                  <div className="rt-footer-cell-left">
                    <Link href={content.Href} className="rt-footer-logo w-inline-block w--current">
                      <BrandLogo />
                    </Link>
                    <p className="rt-gap-off">{content.description}</p>
                    <div className="rt-footer-button">
                      <ActionButton href={content.scheduleADemoscheduleADemoHref} className="rt-button w-inline-block" data-motion="footer-button">{content.buttonLabel}</ActionButton>
                    </div>
                  </div>
                  <div className="rt-footer-left-border rt-one"></div>
                </div>
                <div className="w-layout-vflex rt-footer-content-wrap rt-one">
                  <div className="w-layout-vflex rt-footer-contact-wrap">
                    <div className="w-layout-vflex rt-footer-contact-block">
                      <div className="rt-text-style-h5">{content.contact}</div>
                      <a
                        href={siteConfig.contact.phoneHref}
                        className="rt-footer-link rt-text-color-light-gray"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                    <div className="w-layout-vflex rt-footer-contact-block">
                      <div className="rt-text-style-h5">{content.address}</div>
                      <div>{siteConfig.contact.address}</div>
                    </div>
                  </div>
                  <div className="rt-footer-left-border rt-two"></div>
                </div>
                <div className="w-layout-vflex rt-footer-content-wrap rt-two">
                  <div className="w-layout-vflex rt-footer-contact-block">
                    <div className="rt-text-style-h5">{content.quickLinks}</div>
                    <div className="w-layout-vflex rt-footer-contact-block rt-footer-v1-two">
                      {content.links.map((item, index) => (
                        <Link href={item.href} className={item.className} key={index}>
                          {item.label}
                        </Link>
                      ))}
                      <a href={content.blogHref} className="rt-footer-link">
                        {content.blog}
                      </a>
                      <Link
                        href={siteConfig.contact.phoneHref}
                        className="rt-footer-link"
                      >
                        {content.contact}
                      </Link>
                    </div>
                  </div>
                  <div className="rt-footer-left-border rt-three"></div>
                </div>
                <div className="w-layout-vflex rt-footer-content-wrap rt-three">
                  <div className="w-layout-vflex rt-footer-contact-block">
                    <div className="rt-text-style-h5">{content.utilityPages}</div>
                    <div className="w-layout-vflex rt-footer-contact-block rt-footer-v1-two">
                      {content.links2.map((item, index) => (
                        <a href={item.href} className="rt-footer-link" key={index}>
                          {item.label}
                        </a>
                      ))}
                      <Link href={content.value404Href} className="rt-footer-link">
                        {content.value404}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rt-footer-line-v1"></div>
            <div className="rt-footer-bottom">
              <div className="rt-footer-text-max-width rt-text-color-light-gray">
                {content.designedBy}
                <a
                  href={content.radiantTemplatesHref}
                  target="_blank"
                  className="rt-footer-links rt-text-color-light-gray"
                  rel="noopener noreferrer"
                >
                  {content.radiantTemplates}
                </a>
                {content.poweredBy}
                <a
                  href={content.webflowHref}
                  target="_blank"
                  className="rt-footer-links rt-text-color-light-gray"
                  rel="noopener noreferrer"
                >
                  {content.webflow}
                </a>
              </div>
              <div className="rt-footer-social-link-wrap">
                <div className="rt-footer-social-link">
                  <a
                    href={content.facebookHref}
                    className="rt-footer-link rt-text-color-light-gray"
                  >
                    {content.facebook}
                  </a>
                </div>
                <div className="rt-footer-social-link">
                  <a
                    href={content.linkedinHref}
                    className="rt-footer-link rt-text-color-light-gray"
                  >
                    {content.linkedin}
                  </a>
                </div>
                <div className="rt-footer-social-link rt-change">
                  <a
                    href={content.instagramHref}
                    className="rt-footer-link rt-text-color-light-gray"
                  >
                    {content.instagram}
                  </a>
                </div>
              </div>
            </div>
            <div data-decoration="box" className="w-layout-hflex rt-footer-big-text-wrap">
              <Link
                href={content.Href}
                data-decoration="text"
                className="rt-footer-big-text w--current"
              >
                {siteConfig.name}
              </Link>
              <div className="rt-footer-bog-text-overlay"></div>
            </div>
          </div>
          <div className="rt-footer-top-border"></div>
        </div>
      </div>
    </section>
  );
}
