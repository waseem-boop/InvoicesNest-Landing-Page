"use client";
import dynamic from 'next/dynamic';
const InvoiceBuilder = dynamic(() => import('@/components/invoice/InvoiceBuilder'), { ssr: false, loading: () => <div className="nest-builder-loading" role="status"><span />Getting your invoice ready…</div> });
export default function LiveInvoice() { return <InvoiceBuilder isLanding standalonePreview />; }
