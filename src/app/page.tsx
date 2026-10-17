import InvoiceResources from "@/components/sections/InvoiceResources";
import Hero from '@/components/sections/Hero';
import CompanyOverview from '@/components/sections/CompanyOverview';
import AIPartner from '@/components/sections/AIPartner';
import Features from '@/components/sections/Features';
import Benefits from '@/components/sections/Benefits';
import AISupport from '@/components/sections/AISupport';
import Testimonials from '@/components/sections/Testimonials';
export default function HomePage() {
  return <main><Hero /><CompanyOverview /><AIPartner /><Features /><Benefits /><AISupport /><Testimonials /><InvoiceResources /></main>;
}
