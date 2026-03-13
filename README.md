# VK Creative Co

> A full-featured photography & videography portfolio website with client gallery management, built with Next.js 16 and Supabase.

---

## Overview

VK Creative Studio is a marketing and client-management platform for a creative photography/videography business. It combines a polished public-facing website with a full-featured admin dashboard and private client gallery portal.

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

