"use client";
import {useRef} from "react";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ArrowRight} from "lucide-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import {useSectionAnimation,type AnimationSetup} from "@/hooks/useSectionAnimation";
const points=[
 ["Business details","Your business name, address and contact information."],
 ["Client information","The name and billing address of your customer."],
 ["Invoice number","A unique reference to identify this invoice."],
 ["Invoice & due dates","When the invoice was issued and when payment is due."],
 ["Items & services","A clear description, quantity and rate for each item."],
 ["Subtotal","The amount before tax, discounts and other adjustments."],
 ["Tax & discounts","The tax and discount amounts that apply to your invoice."],
 ["Total & balance due","The final total, recorded payments and outstanding balance."],
 ["Payment terms","How and when you expect your client to pay."],
 ["Notes","A project reference, extra details or a simple thank-you."],
];
const setup:AnimationSetup=(section,reduced,cleanup)=>{
 const viewport=section.querySelector<HTMLElement>(".nest-guide-window");
 const track=section.querySelector<HTMLElement>(".nest-guide-track");
 if(!viewport||!track||reduced)return;
 // Short screens retain native horizontal scrolling instead of trapping content.
 if(window.innerHeight<560)return;
 section.classList.add("nest-guide-pinned");
 const distance=()=>Math.max(0,track.scrollWidth-viewport.clientWidth);
 const animation=gsap.to(track,{x:()=>-distance(),ease:"none",scrollTrigger:{
  trigger:section,start:()=>`top ${window.innerWidth<768?72:88}px`,
  end:()=>`+=${Math.max(distance(),window.innerHeight)}`,pin:true,pinSpacing:true,
  scrub:.6,anticipatePin:1,invalidateOnRefresh:true,
  onUpdate:self=>{section.style.setProperty("--guide-travel",String(self.progress));},
 }});
 // Keyboard focus must also be able to reveal an off-screen card.
 const focus=(event:FocusEvent)=>{const card=(event.target as HTMLElement).closest<HTMLElement>(".nest-guide-slide");const scroll=animation.scrollTrigger;if(!card||!scroll)return;const progress=Math.min(1,Math.max(0,card.offsetLeft/distance()));window.scrollTo({top:scroll.start+(scroll.end-scroll.start)*progress,behavior:"auto"});};
 track.addEventListener("focusin",focus);
 cleanup.push(()=>{track.removeEventListener("focusin",focus);animation.scrollTrigger?.kill();animation.kill();section.classList.remove("nest-guide-pinned");section.style.removeProperty("--guide-travel");});
 ScrollTrigger.refresh();
};
function DetailPreview({index}:{index:number}) {
 const labels=["FROM","BILL TO","INVOICE NUMBER","PAYMENT SCHEDULE","SERVICES","SUBTOTAL","ADJUSTMENTS","BALANCE DUE","PAYMENT TERMS","A PERSONAL NOTE"];
 return <div className="nest-detail-preview" aria-hidden="true"><div className="nest-detail-preview-top"><span/>{labels[index]}<span/></div>
 {index===0&&<div className="nest-detail-business"><div className="nest-detail-monogram">AS</div><strong>Acme Studio</strong><span>Design & creative services</span><small>hello@example.com<br/>123 Business Street</small></div>}
 {index===1&&<div className="nest-detail-business"><div className="nest-detail-monogram nest-detail-circle">JD</div><strong>Jamie Davis</strong><span>Your next great client</span><small>jamie@example.com<br/>Company & billing address</small></div>}
 {index===2&&<div className="nest-detail-reference"><small>A unique reference</small><strong><span>#</span>INV-001</strong><div className="nest-detail-reference-lines"><i/><i/><i/><i/><i/><i/><i/></div></div>}
 {index===3&&<div className="nest-detail-calendar"><header><span>JUNE</span><span>2026</span></header><div>{Array.from({length:21},(_,i)=><span key={i} className={i===14?"is-date":""}>{i+1}</span>)}</div><footer>Due date, clearly defined</footer></div>}
 {index===4&&<div className="nest-detail-rows"><div><span>Brand identity</span><strong>$350.00</strong></div><div><span>Consultation</span><strong>$100.00</strong></div><div className="nest-detail-rows-total"><span>2 items</span><strong>$450.00</strong></div></div>}
 {index===5&&<div className="nest-detail-calculation"><div><span>Services</span><b>$350.00</b></div><div><span>Consultation</span><b>$100.00</b></div><div><span>Subtotal</span><strong>$450.00</strong></div></div>}
 {index===6&&<div className="nest-detail-calculation"><div><span>Subtotal</span><b>$450.00</b></div><div><span>Tax · 10%</span><b>+$45.00</b></div><div><span>Discount</span><b>−$20.00</b></div><div><span>Total</span><strong>$475.00</strong></div></div>}
 {index===7&&<div className="nest-detail-balance"><small>AMOUNT TO PAY</small><strong>$475<span>.00</span></strong><span>USD · Balance due</span><div><i/>Clear total. No guesswork.</div></div>}
 {index===8&&<div className="nest-detail-terms"><span>PAYMENT DUE WITHIN</span><strong>30<small>days</small></strong><p>Please include your invoice number<br/>with your payment.</p></div>}
 {index===9&&<div className="nest-detail-note"><span>“</span><p>Thank you for<br/>your business.</p><small>Looking forward to working<br/>together again.</small><div>Acme Studio</div></div>}
 </div>;
}
export default function InvoiceGuide(){
 const ref=useRef<HTMLElement>(null);useSectionAnimation(ref,setup);
 return <section ref={ref} id="invoice-guide" className="nest-resource-section nest-horizontal-guide"><div className="rt-container w-container nest-guide-layout">
 <div className="nest-guide-header"><div className="nest-guide-heading"><SectionEyebrow>A useful starting point</SectionEyebrow><h2>The details of a<br/><span className="rt-heading-special-font">professional invoice.</span></h2></div><div className="nest-guide-intro"><p>Ten small details. One clear, professional invoice. Give your client everything they need to understand the work and arrange payment.</p><a className="nest-resource-link" href="/#invoice-generator">Create your invoice <ArrowRight size={17}/></a></div></div>
 <div className="nest-guide-right"><div className="nest-guide-window" role="region" aria-label="Ten invoice essentials"><div className="nest-guide-track">{points.map(([title,description],i)=><article key={title} className={"nest-guide-slide nest-guide-tone-"+(i%3)} tabIndex={0}><div className="nest-guide-slide-visual"><span className="nest-guide-slide-number">{String(i+1).padStart(2,"0")}</span><DetailPreview index={i}/></div><div className="nest-guide-slide-caption"><h3>{title}</h3><p>{description}</p></div></article>)}</div></div></div>
 </div></section>;
}
