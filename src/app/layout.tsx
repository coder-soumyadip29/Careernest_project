import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'CarrierNest | Premium HR Tech & Placement Solutions',
  description: 'Bridge the gap between ambitious students and industry leaders. Secure your dream internship and elevate your hiring process with CarrierNest.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen selection:bg-brand-secondary selection:text-slate-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
