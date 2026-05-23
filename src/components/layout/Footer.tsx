'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Github, Linkedin, Twitter } from 'lucide-react';
import { companyInfo, navLinks } from '@/lib/data';

const social = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

const quickLinks = [
  ...navLinks,
  { label: 'Login', href: '/login' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Dashboard', href: '/dashboard' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-300 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/careernest-logo.svg" alt="CarrierNest" width={40} height={40} className="rounded-md" />
              <span className="text-xl font-extrabold text-white">{companyInfo.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{companyInfo.tagline}. {companyInfo.about.slice(0, 120)}...</p>
            <div className="mt-6 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-sky-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/services" className="hover:text-sky-300">Talent Placement</Link></li>
              <li><Link href="/services" className="hover:text-sky-300">Recruitment Dashboard</Link></li>
              <li><Link href="/services" className="hover:text-sky-300">Internship Programs</Link></li>
              <li><Link href="/services" className="hover:text-sky-300">Analytics & Insights</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>{companyInfo.email}</li>
              <li>{companyInfo.phone}</li>
              <li className="leading-relaxed">{companyInfo.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.</p>
          <p>Internship Project — Full Stack Web Development</p>
        </div>
      </div>
    </footer>
  );
}
