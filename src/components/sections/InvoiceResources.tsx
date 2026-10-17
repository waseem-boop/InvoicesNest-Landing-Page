"use client";
import InvoiceGuide from "@/components/sections/InvoiceGuide";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import {useRef,useState,useId} from "react";
import {ArrowUpRight, Plus, ArrowRight} from "lucide-react";
import {useBenefitsAnimation} from "@/hooks/sections/useBenefitsAnimation";
const countries=[["USA","usa","US"],["United Kingdom","uk","GB"],["Australia","australia","AU"],["Canada","canada","CA"],["Germany","germany","DE"],["New Zealand","new-zealand","NZ"],["Singapore","singapore","SG"],["India","india","IN"]];
const questions=[
 ["Can I create an invoice for free?","Yes. You can use the online invoice generator to prepare an invoice and print or save it as a PDF without creating an account."],
 ["How do I save my invoice?","Choose Print / Save PDF in the generator and select Save as PDF in your browser’s print dialog. With an InvoicesNest account, you can also keep invoices in your workspace."],
 ["Can I add my own business logo?","Yes. Select Add Logo in the invoice editor, upload your logo and add your business details."],
 ["How do I choose a currency?","Open Select Currency and search by currency name or code, such as Pakistani Rupee or PKR. Choosing a currency changes the invoice currency; it does not convert entered amounts using an exchange rate."],
 ["Can I include taxes and discounts?","Yes. Add your line items, enter the applicable tax and discount, and review the calculated total before saving your invoice."],
 ["Can I manage more than one business?","Yes. In your account workspace, you can create separate business profiles and switch between them to keep your invoicing organised."],
 ["Does InvoicesNest collect payments from my clients?","You arrange payment with your client using the instructions on your invoice. You can record payments you receive in your workspace to keep the invoice status up to date."],
 ["Where can I get help?","Sign in to your account and open Support to create a ticket. Add the details of your question and continue the conversation in that ticket."],
];
function FaqItem({question,answer}:{question:string;answer:string}){
 const [open,setOpen]=useState(false);const id=useId();
 return <div className={"nest-faq-refined "+(open?"is-open":"")}><button type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{question}<Plus size={18}/></button><div id={id} className="nest-faq-body" inert={!open}><div><p>{answer}</p></div></div></div>;
}
export default function InvoiceResources(){
 const ref=useRef<HTMLDivElement>(null);useBenefitsAnimation(ref);
 return <div ref={ref} className="nest-resources">
 <InvoiceGuide />
 <section className="nest-country-section"><div className="rt-container w-container"><div className="nest-country-heading" data-benefit-reveal><SectionEyebrow>For your next client, near or far</SectionEyebrow><h2>Invoice generator <span className="rt-heading-special-font">by country.</span></h2><p>Explore our country-specific invoicing pages and get started with your next invoice.</p></div><div className="nest-country-links">{countries.map(([name,slug,code])=><a key={slug} href={"https://invoicesnest.com/invoice-generator-"+slug}><span className="nest-country-code" aria-hidden="true">{String.fromCodePoint(...code.split('').map(letter=>127397+letter.charCodeAt(0)))}</span>{name}<ArrowUpRight size={16}/></a>)}</div></div></section>
 <section className="nest-resource-section nest-faq-section" id="faq"><div className="rt-container w-container"><div className="nest-faq-layout"><div data-benefit-reveal><SectionEyebrow>A little clarity before you start</SectionEyebrow><h2>Frequently asked <span className="rt-heading-special-font">questions.</span></h2><p>From your first invoice to keeping your workspace organised.</p><a className="nest-resource-link" href="https://invoicesnest.com/support">Need a hand? Get support <ArrowUpRight size={17}/></a></div><div className="nest-faq-list">{questions.map(([question,answer])=><FaqItem key={question} question={question} answer={answer}/>)}</div></div></div></section>
 </div>;
}
