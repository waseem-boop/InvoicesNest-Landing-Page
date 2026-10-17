"use client";
import { useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { useTestimonialsAnimation } from "@/hooks/sections/useTestimonialsAnimation";
export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useTestimonialsAnimation(sectionRef);
  const content = siteConfig.sections.testimonials;
  return (
    <section className="rt-testimonial-v1 rt-overflow-hidden" ref={sectionRef}>
      <div className="w-layout-blockcontainer rt-container w-container">
        <div className="w-layout-vflex rt-testimonial-v1-main">
          <div className="w-layout-vflex rt-testimonial-v1-heading-wrap">
            <div className="w-layout-hflex rt-sub-text-main" data-motion="testimonials-subTextMain">
              <div className="w-layout-hflex rt-sub-text-wrapper">
                <div className="rt-sub-text-dot"></div>
                <div className="rt-sub-text">{content.eyebrow}</div>
              </div>
              <div className="w-layout-vflex rt-gradient-box">
                <div className="rt-button-linear rt-color-change"></div>
                <div className="rt-button-linear rt-color-change rt-2"></div>
              </div>
            </div>
            <div className="rt-testimonial-v1-heading">
              <h2 className="rt-gap-off rt-text-center" data-motion="testimonials-gapOff">
                {content.heading}
                <span className="rt-heading-special-font">{content.highlight}</span>
              </h2>
            </div>
          </div>
          <div className="w-layout-hflex rt-trstimonial-v1-marquee-wrap rt-full-width">
            <div className="w-layout-hflex rt-testimonial-v1-marquee-main rt-full-width rt-position-relative">
              <div
                className="w-layout-vflex rt-testimonial-marquee rt-overflow-hidden"
                data-motion="testimonials-testimonialMarquee"
              >
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  {content.testimonials.map((item, index) => (
                    <div
                      className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20"
                      key={index}
                    >
                      <div className="w-layout-hflex rt-testimonial-v1-star">
                        <Image
                          alt={content.aveletyTestimonialStarAlt}
                          src={content.aveletyTestimonialStarImage}
                          width={91}
                          height={15}
                          sizes="91px"
                        />
                      </div>
                      <div className="rt-text-style-h5">{item.title}</div>
                      <div className="rt-testimonial-v1-card-paragraph">
                        <p className="rt-gap-off">{item.description}</p>
                      </div>
                      <div className="w-layout-vflex rt-testimonial-v1-author-details">
                        <div className="rt-text-style-h5">{item.title2}</div>
                        <div className="rt-text-color-sky-blue">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  {content.testimonials2.map((item, index) => (
                    <div
                      className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20"
                      key={index}
                    >
                      <div className="w-layout-hflex rt-testimonial-v1-star">
                        <Image
                          alt={content.aveletyTestimonialStarAlt}
                          src={content.aveletyTestimonialStarImage}
                          width={91}
                          height={15}
                          sizes="91px"
                        />
                      </div>
                      <div className="rt-text-style-h5">{item.title}</div>
                      <div className="rt-testimonial-v1-card-paragraph">
                        <p className="rt-gap-off">{item.description}</p>
                      </div>
                      <div className="w-layout-vflex rt-testimonial-v1-author-details">
                        <div className="rt-text-style-h5">{item.title2}</div>
                        <div className="rt-text-color-sky-blue">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  {content.testimonials3.map((item, index) => (
                    <div
                      className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20"
                      key={index}
                    >
                      <div className="w-layout-hflex rt-testimonial-v1-star">
                        <Image
                          alt={content.aveletyTestimonialStarAlt}
                          src={content.aveletyTestimonialStarImage}
                          width={91}
                          height={15}
                          sizes="91px"
                        />
                      </div>
                      <div className="rt-text-style-h5">{item.title}</div>
                      <div className="rt-testimonial-v1-card-paragraph">
                        <p className="rt-gap-off">{item.description}</p>
                      </div>
                      <div className="w-layout-vflex rt-testimonial-v1-author-details">
                        <div className="rt-text-style-h5">{item.title2}</div>
                        <div className="rt-text-color-sky-blue">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="w-layout-vflex rt-testimonial-marquee rt-overflow-hidden rt-mobile-display-none"
                data-motion="testimonials-testimonialMarquee-2"
              >
                <div className="w-layout-vflex rt-marquee-train rt-down">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.brilliantSolution}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description4}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.coreyLubin}</div>
                      <div className="rt-text-color-sky-blue">{content.coreylubin}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        className="rt-no-stretch"
                        width={275}
                        height={15}
                        sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.simplifyYourWorkload}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description5}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.martinBergson}</div>
                      <div className="rt-text-color-sky-blue">{content.martinbergson}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.weLoveIt}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description6}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.wilsonDonin}</div>
                      <div className="rt-text-color-sky-blue">{content.wilson}</div>
                    </div>
                  </div>
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-down">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.brilliantSolution}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description4}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.coreyLubin}</div>
                      <div className="rt-text-color-sky-blue">{content.coreylubin}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        className="rt-no-stretch"
                        width={275}
                        height={15}
                        sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.simplifyYourWorkload}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description5}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.martinBergson}</div>
                      <div className="rt-text-color-sky-blue">{content.martinbergson}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.weLoveIt}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description6}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.wilsonDonin}</div>
                      <div className="rt-text-color-sky-blue">{content.wilson}</div>
                    </div>
                  </div>
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-down">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.brilliantSolution}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description4}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.coreyLubin}</div>
                      <div className="rt-text-color-sky-blue">{content.coreylubin}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        className="rt-no-stretch"
                        width={275}
                        height={15}
                        sizes="(max-width: 767px) 100vw, (max-width: 1200px) 70vw, 1440px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.simplifyYourWorkload}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description5}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.martinBergson}</div>
                      <div className="rt-text-color-sky-blue">{content.martinbergson}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.weLoveIt}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description6}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.wilsonDonin}</div>
                      <div className="rt-text-color-sky-blue">{content.wilson}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-layout-vflex rt-testimonial-marquee rt-overflow-hidden rt-landscape-display-none"
                data-motion="testimonials-testimonialMarquee-3"
              >
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.saveHourOfWork}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description7}
                        <br />
                        {content.description8}
                        <br />
                        {content.description9}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.emeryPhilips}</div>
                      <div className="rt-text-color-sky-blue">{content.philips}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.justWow}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description10}
                        <br />
                        {content.description11}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.skylarStanton}</div>
                      <div className="rt-text-color-sky-blue">{content.skylarstanton}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.good}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description12}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.charlieKorsgaard}</div>
                      <div className="rt-text-color-sky-blue">{content.korsgaard}</div>
                    </div>
                  </div>
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.saveHourOfWork}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description7}
                        <br />
                        {content.description8}
                        <br />
                        {content.description9}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.emeryPhilips}</div>
                      <div className="rt-text-color-sky-blue">{content.philips}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.justWow}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description10}
                        <br />
                        {content.description11}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.skylarStanton}</div>
                      <div className="rt-text-color-sky-blue">{content.skylarstanton}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.good}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description12}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.charlieKorsgaard}</div>
                      <div className="rt-text-color-sky-blue">{content.korsgaard}</div>
                    </div>
                  </div>
                </div>
                <div className="w-layout-vflex rt-marquee-train rt-up">
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.saveHourOfWork}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description7}
                        <br />
                        {content.description8}
                        <br />
                        {content.description9}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.emeryPhilips}</div>
                      <div className="rt-text-color-sky-blue">{content.philips}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.justWow}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">
                        {content.description10}
                        <br />
                        {content.description11}
                      </p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.skylarStanton}</div>
                      <div className="rt-text-color-sky-blue">{content.skylarstanton}</div>
                    </div>
                  </div>
                  <div className="w-layout-vflex rt-testimonial-v1-card rt-border-radius-small-20">
                    <div className="w-layout-hflex rt-testimonial-v1-star">
                      <Image
                        alt={content.aveletyTestimonialStarAlt}
                        src={content.aveletyTestimonialStarImage}
                        width={91}
                        height={15}
                        sizes="91px"
                      />
                    </div>
                    <div className="rt-text-style-h5">{content.good}</div>
                    <div className="rt-testimonial-v1-card-paragraph">
                      <p className="rt-gap-off">{content.description12}</p>
                    </div>
                    <div className="w-layout-vflex rt-testimonial-v1-author-details">
                      <div className="rt-text-style-h5">{content.charlieKorsgaard}</div>
                      <div className="rt-text-color-sky-blue">{content.korsgaard}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rt-testimonial-v1-overlay rt-down"></div>
              <div className="rt-testimonial-v1-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
