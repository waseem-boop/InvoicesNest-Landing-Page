import type { Metadata } from 'next';
import { Inter_Tight, Instrument_Serif } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

export const metadata: Metadata = {
  title: 'InvoicesNest — A little less admin. A lot more business.',
  description: 'Create a professional invoice, make it yours, and get back to the work you love.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${interTight.variable} ${instrumentSerif.variable}`}><head>
    <link rel="preconnect" href="https://api.fontshare.com" />
    <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
  </head><body className="nest-reference-light"><SmoothScroll><div className="avelety-site"><Navbar />{children}<Footer /></div></SmoothScroll><Toaster position="bottom-right" richColors /><Analytics /></body></html>;
}
