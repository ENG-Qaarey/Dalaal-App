# Dalaal Web Master Guide

## Overview

This file combines the key information from the web project markdown files into one place.

The project is a Next.js web app for Dalaal with a clean route structure focused on two separate areas:
- Users portal
- Admin panel

## Table of Contents

1. Project Structure
2. Quick Start
3. Architecture
4. Route Map
5. Components
6. Hooks
7. State Management
8. Types
9. Configuration
10. Styling
11. Development Guide
12. Testing Guide
13. Deployment
14. Completion Summary
15. File Inventory
16. Quick Reference

---

## 1. Project Structure

### Root Web Folder

```text
web/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── pages/
│   │       ├── users/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx
│   │       │   ├── profile/page.tsx
│   │       │   └── settings/page.tsx
│   │       └── admin/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           ├── users/page.tsx
│   │           └── listings/page.tsx
	│   ├── components/
	│   │   ├── layout/
	│   │   ├── ui/
	│   │   └── property/
	│   ├── hooks/
	│   ├── lib/
	│   ├── store/
	│   └── types/
└── public/
```

### Clean Separation Rule

- User-facing pages go in `src/app/pages/users/*`
- Admin/back-office pages go in `src/app/pages/admin/*`
- Shared layout stays in `src/app/layout.tsx`
- Shared global styles stay in `src/app/globals.css`

---

## 2. Quick Start

```bash
cd web
npm install
npm run dev
```

Open:
- http://localhost:3000

Production build:

```bash
npm run build
npm start
```

---

## 3. Architecture

### Stack
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Zustand for state management
- Frontend-only structure with backend connection handled separately

### Core Patterns
- Feature-based component organization
- Shared reusable hooks
- Strong typing across the app
- Mobile-first Tailwind styling

---

## 4. Route Map

### Public Landing
- `/` -> landing page

### Users Section
- `/pages/users` -> users dashboard
- `/pages/users/profile` -> user profile
- `/pages/users/settings` -> user settings

### Admin Section
- `/pages/admin` -> admin dashboard
- `/pages/admin/users` -> manage users
- `/pages/admin/listings` -> manage listings

---

## 5. Components

### Layout Components
- `Navbar.tsx`
- `Footer.tsx`

### UI Components
- `Button.tsx`
- `Input.tsx`
- `Card.tsx`

### Property Components
- `PropertyCard.tsx`
- `PropertyCardSkeleton.tsx`

### Component Index Files
- `src/components/ui/index.ts`
- `src/components/layout/index.ts`
- `src/components/property/index.ts`

---

## 6. Hooks

- `useMediaQuery.ts`
- `useDebounce.ts`

### Hook Purpose
- `useMediaQuery` handles responsive logic
- `useDebounce` reduces repeated search calls

---

## 7. State Management

### Stores
- `uiStore.ts`
- `chatStore.ts`

### Why Zustand
- Lightweight
- Simple API
- Good for simple global UI and chat state
- Easy persistence with localStorage

---

## 8. Types

### Type Files
- `user.types.ts`
- `property.types.ts`
- `api.types.ts`

### Why Types Matter
- Stronger API contracts
- Safer component props
- Cleaner service layer

---

## 9. Configuration

### Main Config Files
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `.env.local`
- `.env.example`

### Important Env Vars
```bash
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002/chat
```

---

## 10. Styling

### Global Styles
- `src/app/globals.css`

### Current Design Direction
- Blue and gray palette
- Clean cards and sections
- Responsive layouts
- Simple modern landing page

---

## 11. Development Guide

### Add a New Page
1. Create a folder in the correct route section
2. Add `page.tsx`
3. Add `layout.tsx` if the section needs its own navigation
4. Use existing components and services where possible

### Add a New Component
1. Create component file in the right folder
2. Keep it small and reusable
3. Export from index file if it should be shared

### Add a New Service
1. Connect it in the separate backend project
2. Keep the web app focused on UI and interactions
3. Add backend wiring only when you are ready to integrate

### Add a New Type
1. Put it under `src/types/`
2. Reuse across services and components
3. Keep naming consistent

---

## 12. Testing Guide

### Manual Checks
- Landing page loads
- Navbar works
- Footer links work
- Users pages load
- Admin pages load
- Responsive behavior works on mobile and desktop
- No console errors

### Build Validation
```bash
npm run build
```

### Lint Validation
```bash
npm run lint
```

---

## 13. Deployment

### Recommended
- Vercel for frontend hosting

### Basic Deployment Flow
1. Ensure env vars are set
2. Run production build
3. Test locally
4. Deploy

---

## 14. Completion Summary

### What Was Built
- Clean route separation
- Users section
- Admin section
- Landing page
- Shared navigation and footer
- Documentation merged into this guide

### Current Status
- Web structure is ready for feature work
- Routes are cleanly separated
- Landing page is active

---

## 15. File Inventory

### Key Files
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/pages/users/layout.tsx`
- `src/app/pages/users/page.tsx`
- `src/app/pages/users/profile/page.tsx`
- `src/app/pages/users/settings/page.tsx`
- `src/app/pages/admin/layout.tsx`
- `src/app/pages/admin/page.tsx`
- `src/app/pages/admin/users/page.tsx`
- `src/app/pages/admin/listings/page.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/hooks/useMediaQuery.ts`
- `src/hooks/useDebounce.ts`
- `src/store/uiStore.ts`
- `src/store/chatStore.ts`
- `src/types/user.types.ts`
- `src/types/property.types.ts`
- `src/types/api.types.ts`

---

## 16. Quick Reference

### Important Commands
```bash
npm install
npm run dev
npm run build
npm run lint
```

### Important Routes
- `/`
- `/pages/users`
- `/pages/users/profile`
- `/pages/users/settings`
- `/pages/admin`
- `/pages/admin/users`
- `/pages/admin/listings`

### Important Folders
- `src/app/pages/users`
- `src/app/pages/admin`
- `src/components`
- `src/store`
- `src/types`

---

## Final Note

If you want a true single-file documentation setup, this file can replace the smaller markdown files as the main reference.
