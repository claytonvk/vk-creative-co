# VK Creative Co.

A modern portfolio and client gallery platform for photography and film, built with **Next.js**, **TypeScript**, and **Supabase**.

VK Creative Co. is designed to showcase visual work while also providing a seamless experience for clients to view, download, and interact with their media. The platform focuses on performance, simplicity, and elegant design while supporting real-world workflows for photographers and filmmakers.

---

## Overview

This project powers the website and client gallery system for **VK Creative Co.**, a creative studio specializing in photography and Super 8 film.

The platform serves two primary purposes:

### Public Portfolio
- Showcase photography and film work
- Highlight featured projects and services
- Provide a polished web presence for potential clients

### Client Galleries
- Deliver private galleries to clients
- Enable secure media access and downloads
- Provide a streamlined viewing experience across devices

The goal of the platform is to balance **beautiful presentation** with **fast performance and scalable architecture**.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend / Infrastructure
- Supabase (Postgres database + authentication)
- Supabase Storage for media delivery
- REST APIs
- Server-side rendering and server components

### Development
- Node.js
- Git
- Vercel deployment

---

## Key Features

### Client Galleries
- Secure, shareable gallery links
- Responsive grid layouts for images and videos
- High-resolution image viewing
- Mobile-first viewing experience

### Portfolio System
- Curated project pages
- Lightweight media loading
- SEO-friendly content structure

### Performance Optimization
- Optimized image delivery
- Server-side rendering
- Lazy loading for large media collections

### Content Management
- Structured data models for galleries and projects
- Flexible media organization

---

## Project Structure

```
/app
  /gallery
  /projects
  /api
/components
  /ui
  /gallery
  /layout
/lib
  supabase
  utils
/public
```

**app/** – Next.js routes and pages  
**components/** – reusable UI components  
**lib/** – shared utilities and services  
**public/** – static assets  

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/claytonvk/vk-creative-co.git
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file and include the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These values can be obtained from your Supabase project settings.

---

## Future Improvements

- Client download management
- Gallery analytics
- Custom client permissions
- Video streaming optimization
- Admin dashboard for gallery management

---

## Author

**Clay VanderKolk**

GitHub  
https://github.com/claytonvk  

Portfolio  
https://clayvanderkolk.site
