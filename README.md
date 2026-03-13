# VK Creative Co

> A full-featured photography & videography portfolio website with client gallery management, built with Next.js 16 and Supabase.

---

## Overview

VK Creative Co is a marketing and client-management platform for a creative photography/videography business. It combines a polished public-facing website with a full-featured admin dashboard and private client gallery portal.

---

## Features

### Public Website
- **Homepage** — Configurable hero, value propositions, featured portfolio work, testimonials, and CTA — all content-managed via the admin dashboard
- **Portfolio** — Filterable shoot gallery by category with individual shoot detail pages
- **Investment** — Pricing packages page
- **About** — Studio about page
- **Contact** — Contact form with email delivery via Resend
- **Client Galleries** — Password-protected galleries with three visual themes (Minimal, Romantic, Editorial), individual image downloads, and bulk ZIP download

### Admin Dashboard
- Manage portfolio shoots, media, and categories
- Manage client galleries with file upload and analytics
- Manage testimonials, packages, FAQs, and value propositions
- Site-wide settings (hero text, footer content, colors, CTAs)
- Gallery analytics (view and download tracking)

### Client Portal
- Secure gallery access via guest link or account login
- Download individual images or entire galleries

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 with oklch color system |
| UI Components | shadcn/ui (Radix UI + Tailwind) |
| Forms | react-hook-form + zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin + client roles) |
| Email | Resend |
| File Uploads | tus-js-client with Supabase Storage |
| Charts | Recharts |
| Dark Mode | next-themes |
| Notifications | Sonner |
| Hosting | Vercel |

---

## Project Structure

    ├── app/
    │   ├── page.tsx              # Homepage (server-rendered, DB-driven)
    │   ├── portfolio/            # Public portfolio pages
    │   ├── gallery/[slug]/       # Client gallery lightbox
    │   ├── contact/              # Contact page
    │   ├── investment/           # Pricing page
    │   ├── about/                # About page
    │   ├── admin/                # Protected admin dashboard
    │   │   └── (dashboard)/      # Portfolio, galleries, settings, etc.
    │   ├── client/               # Protected client portal
    │   └── api/                  # API routes (gallery upload/download)
    ├── components/
    │   ├── home/                 # Homepage section components
    │   ├── gallery/              # Gallery viewer, grid, lightbox, themes
    │   ├── admin/                # Admin UI components
    │   └── ui/                   # shadcn/ui primitives
    ├── lib/
    │   ├── supabase/             # Supabase clients (server, client, admin)
    │   ├── queries/              # Database query functions
    │   └── actions/              # Next.js server actions
    └── public/                   # Static assets and images

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for contact form email)

### Environment Variables

Create a `.env.local` file:

    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    RESEND_API_KEY=your_resend_api_key

### Install & Run

    npm install
    npm run dev       # Development server
    npm run build     # Production build
    npm run start     # Production server
    npm run lint      # ESLint

---

## Design System

The site uses **Tailwind CSS v4** with a custom oklch-based color palette:

| Token | Color | Usage |
|---|---|---|
| `--primary` | Forest green `#74782f` | Brand color, buttons |
| `--secondary` | Golden yellow `#ccb443` | Accents, highlights |
| `--background` | Warm off-white / dark | Page backgrounds |

Typography uses **Cormorant Garamond** for headings and **Inter** for body text, giving the site an editorial, high-end feel.

Dark mode is fully supported via the `.dark` class powered by `next-themes`.

---

---

The project is deployed on **[Vercel](https://vercel.com)**. Push to `main` triggers a production deployment automatically.

    git push origin main

---

## License

Private — All rights reserved. Not open for redistribution.
