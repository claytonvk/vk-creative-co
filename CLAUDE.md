# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 marketing website for Lumen Studio (photography/videography). Built with v0.app and auto-synced to this repository for Vercel deployment.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack

- **Framework**: Next.js 16 with React 19 and TypeScript 5
- **Styling**: Tailwind CSS v4 with oklch color variables in `/app/globals.css`
- **UI Components**: shadcn/ui (Radix UI + Tailwind) configured via `components.json`
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react

### Project Structure

- `/app` - Next.js App Router pages (homepage composed of modular sections)
- `/components/ui` - shadcn/ui primitives (button, input, label, textarea, accordion)
- `/components/home` - Homepage section components (hero, value-props, featured-work, testimonials, cta)
- `/components` - Shared components (navbar, footer, theme-provider)
- `/lib/utils.ts` - `cn()` utility for merging Tailwind classes

### Path Alias

All imports use `@/*` alias mapping to project root (e.g., `@/components/ui/button`).

### Component Patterns

- Server Components by default; add `"use client"` for interactive components
- Homepage is composed of section components imported into `/app/page.tsx`
- shadcn/ui components follow new-york style variant

## Configuration Notes

- TypeScript build errors are ignored in `next.config.mjs` (development-friendly setup)
- Images are unoptimized for static export compatibility
- Dark mode supported via next-themes with CSS variables

## Coding Guidelines

- Prefer minimal diffs when making changes
- Preserve existing structure, naming, and patterns
- Do not refactor unrelated code
- Avoid introducing new libraries unless requested
- Keep comments minimal
- If requirements or intent are unclear, ask clarifying questions before implementing
