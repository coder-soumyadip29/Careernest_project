'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}
