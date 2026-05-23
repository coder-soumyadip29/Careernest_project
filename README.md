# CarrierNest

A premium, animated landing page built with Next.js, Tailwind CSS, and Framer Motion.

## Overview

This project features a professional hero section with a live 3D CarrierNest launch experience.
The landing page includes:

- A clean top-page 3D launch section with a dropping CarrierNest animation
- Orbiting balls and smooth motion effects for a premium user experience
- Modern split layout for clear UI and focused content
- Professional CTA buttons and performance metrics
- Tailwind CSS theme with a faded yellow gradient palette

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS v4
- Framer Motion

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Site Map (Internship Frontend)

| Page | Route |
|------|-------|
| Landing (Hero, About, Services, Testimonials, Contact) | `/` |
| Services (detailed) | `/services` |
| Contact | `/contact` |
| Sign Up | `/signup` |
| Login | `/login` |
| User Dashboard | `/dashboard` |
| User Profile | `/dashboard/profile` |
| Admin Dashboard | `/admin` |
| Manage Users | `/admin/users` |
| Manage Inquiries | `/admin/inquiries` |
| Manage Services/Content | `/admin/content` |

### Demo accounts (localStorage mock auth)

- **Admin:** `admin@carriernest.com` / `Admin@123`
- **User:** `demo@carriernest.com` / `Demo@123`

> Frontend uses localStorage for auth, inquiries, and service CRUD until the Node.js/MongoDB backend is connected.

## Build

```bash
npm run build
```

## Files of Interest

- `src/app/page.tsx` - application entry page
- `src/components/Hero.tsx` - hero section with the 3D CarrierNest launch layout
- `src/components/LiveScene.tsx` - animated 3D live scene and orbiting motion
- `src/app/globals.css` - global theme definitions and styling

## GitHub

Pushed to: `https://github.com/coder-soumyadip29/Careernest_project`
