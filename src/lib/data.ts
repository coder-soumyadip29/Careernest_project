import type { ServiceItem } from './types';

export const companyInfo = {
  name: 'CarrierNest',
  tagline: 'Premium HR Tech & Talent Placement',
  email: 'hello@carriernest.com',
  phone: '+91 98765 43210',
  address: 'Innovation Hub, Sector 62, Noida, Uttar Pradesh 201309, India',
  mission:
    'To bridge ambitious talent with high-growth organizations through intelligent matching, secure workflows, and measurable career outcomes.',
  vision:
    'To become the most trusted placement ecosystem where students, interns, and enterprises build long-term professional success together.',
  about:
    'CarrierNest is a full-stack HR technology platform designed for modern hiring. We combine data-driven talent matching, internship pipelines, and enterprise-ready dashboards so companies scale teams faster while candidates land roles that fit their skills and goals.',
};

export const defaultServices: ServiceItem[] = [
  {
    id: 'svc-1',
    name: 'Talent Placement',
    description: 'End-to-end internship and graduate placement with verified candidate pipelines.',
    longDescription:
      'Our placement specialists curate role-ready talent pools, run structured screening, and coordinate interviews so your team hires with confidence and speed.',
    price: 'Custom',
    features: ['Role-matched shortlists', 'Interview coordination', 'Offer tracking'],
    icon: 'users',
  },
  {
    id: 'svc-2',
    name: 'Recruitment Dashboard',
    description: 'Centralized hiring workspace for requisitions, candidates, and team collaboration.',
    longDescription:
      'Manage openings, review applications, assign reviewers, and monitor funnel metrics from a single secure dashboard built for HR and hiring managers.',
    price: 'From ₹4,999/mo',
    features: ['Pipeline analytics', 'Team permissions', 'Bulk actions'],
    icon: 'layout',
  },
  {
    id: 'svc-3',
    name: 'Internship Programs',
    description: 'Structured programs connecting students with industry mentors and live projects.',
    longDescription:
      'Launch cohort-based internship tracks with onboarding kits, milestone reviews, and certification-ready outcomes aligned to your business goals.',
    price: 'From ₹2,499/cohort',
    features: ['Mentor matching', 'Progress milestones', 'Completion reports'],
    icon: 'graduation',
  },
  {
    id: 'svc-4',
    name: 'Digital Hiring Suite',
    description: 'Assessments, scheduling, and automated communications in one workflow.',
    longDescription:
      'Reduce manual coordination with branded career pages, skill assessments, calendar integrations, and status notifications candidates actually read.',
    price: 'From ₹3,499/mo',
    features: ['Auto-scheduling', 'Skill assessments', 'Email templates'],
    icon: 'zap',
  },
  {
    id: 'svc-5',
    name: 'Employer Branding',
    description: 'Career microsites and campaigns that attract top-tier applicants.',
    longDescription:
      'Showcase culture, benefits, and growth stories through responsive career hubs optimized for search, social sharing, and conversion.',
    price: 'Custom',
    features: ['Career microsites', 'Campaign landing pages', 'SEO-ready content'],
    icon: 'sparkles',
  },
  {
    id: 'svc-6',
    name: 'Analytics & Insights',
    description: 'Hiring KPIs, diversity metrics, and placement ROI in real time.',
    longDescription:
      'Track time-to-hire, source effectiveness, and program performance with exportable reports leadership teams can trust.',
    price: 'Add-on',
    features: ['Executive dashboards', 'Export to CSV/PDF', 'Custom KPIs'],
    icon: 'chart',
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Priya Sharma',
    role: 'HR Director, NovaTech Labs',
    rating: 5,
    quote:
      'CarrierNest cut our internship hiring cycle by 40%. The dashboard gave our team full visibility from application to offer.',
  },
  {
    id: 't2',
    name: 'Rahul Mehta',
    role: 'Campus Lead, Apex University',
    rating: 5,
    quote:
      'Our students received better role matches and clearer feedback loops. Placement outcomes improved within one academic term.',
  },
  {
    id: 't3',
    name: 'Ananya Desai',
    role: 'Talent Partner, BrightScale',
    rating: 5,
    quote:
      'Professional UI, secure workflows, and responsive support. It feels like a product built for enterprise hiring, not a template.',
  },
  {
    id: 't4',
    name: 'Vikram Joshi',
    role: 'Founder, SkillBridge Startups',
    rating: 4,
    quote:
      'We scaled from 5 to 50 intern hires using CarrierNest pipelines. The inquiry management alone saved hours every week.',
  },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/contact' },
];
