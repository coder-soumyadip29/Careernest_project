import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="scroll-smooth light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen selection:bg-brand-secondary selection:text-white">
        {children}
      </body>
    </html>
  );
}
