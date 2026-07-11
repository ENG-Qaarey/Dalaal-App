# Dalaal App - Complete Progress Report

> Full record of all changes made across Backend, Mobile App, and Web App.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Backend Changes](#backend-changes)
3. [Mobile App Changes (Dalaal-app)](#mobile-app-changes)
4. [Web App Changes](#web-app-changes)
5. [File Structure After Cleanup](#file-structure-after-cleanup)
6. [Key Architecture Decisions](#key-architecture-decisions)
7. [Known Issues / Remaining Work](#known-issues--remaining-work)

---

## Project Overview

Dalaal is a multi-role real estate & vehicle marketplace app with:

- **Backend**: NestJS + Prisma ORM + PostgreSQL
- **Mobile**: React Native (Expo) with Expo Router
- **Web**: Next.js 16 with role-based routing

### 7 User Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Full system control |
| `MODERATOR` | Review moderation, flagged content |
| `REGULAR_DALAAL` | Basic broker |
| `VERIFIED_DALAAL` | Verified broker with extra privileges |
| `PROPERTY_OWNER` | Lists properties |
| `VEHICLE_OWNER` | Lists vehicles |
| `CUSTOMER` | Browses, books, messages |

### Environment

- Backend port: `3005`
- Web port: `3000`
- Mobile dev: `8081`
- Database: PostgreSQL at `localhost:5432/Dalaal-App` (user: `postgres`, pass: `1234`, no SSL)
- Demo SUPER_ADMIN: phone `614463895`, email `muscabqaarey@gmail.com`, password `12345678`

---

## Backend Changes

### Files Modified

| File | What Changed |
|------|-------------|
| `.env` | Set `DATABASE_URL` for local PostgreSQL (no SSL), JWT secrets |
| `src/main.ts` | CORS for `http://localhost:3000` with `credentials: true`, `TransformInterceptor` wrapping all responses in `{ success, data, timestamp }`, port `3005` |
| `src/auth/auth.service.ts` | `validateUser()` works by identifier (email/phone), `login()` returns tokens + user, `verifyEmail()` returns JWT tokens for auto-login |
| `src/auth/auth.repository.ts` | `findByIdentifier()` trims whitespace, tries phone with/without `+` prefix for flexible lookup |
| `src/auth/auth.controller.ts` | DTOs for validation, `@Throttle` rate limiting on sensitive endpoints, `@Public()` decorators |
| `prisma/schema.prisma` | 7-role enum, proper user model |

### Key Fixes

- Removed Neon serverless packages (`@neondatabase/serverless`, `@prisma/adapter-neon`, `ws`)
- Switched to `@prisma/adapter-pg` with `pg` Pool (local PostgreSQL)
- Added `ThrottlerModule` for rate limiting
- Fixed `forgot-password` endpoint
- Numeric `expiresIn` values for JWT (e.g., `3600` not `'3600s'`)
- `TransformInterceptor` wraps all responses

### Backend Response Format

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-07-11T..."
}
```

### npm install Note

```bash
npm install --legacy-peer-deps
```

---

## Mobile App Changes

### Environment

- `.env`: `EXPO_PUBLIC_API_URL=http://localhost:3005/api`

### Authentication Fixes

| File | What Changed |
|------|-------------|
| `services/api.ts` | Port 3002 → 3005 fallback, POST body retry cloning (fixes `body already consumed` error) |
| `services/auth.ts` | `verifyEmail` persists tokens via `persistTokens(data)`, error `.response` handling |
| `hooks/useAuth.ts` | Auth hook with Zustand integration |
| `store/authStore.ts` | Zustand store for auth state |

### Auth Flow Fixes

- **Register**: Added confirm password field + terms checkbox
- **Login**: Resend cooldown timer, show/hide password toggle
- **Verify Email**: Redirect path fixed, auto-login after verification
- **Phone Verification**: Fixed redirect flow

### File Restructuring

#### New `pages/` Directory (Role-Based Dashboards)

```
src/app/pages/
├── _layout.tsx              # Shared pages layout
├── super-admin/
│   ├── _layout.tsx          # Super admin nav
│   └── dashboard.tsx        # KPI stats, quick actions
├── broker/
│   ├── _layout.tsx          # Broker nav
│   ├── dashboard.tsx        # Analytics, period filters, leads
│   └── create-listing.tsx   # Listing creation form
├── customer/
│   ├── _layout.tsx          # Customer nav
│   └── dashboard.tsx        # Search, favorites, messages, bookings
├── owner/
│   ├── _layout.tsx          # Owner nav
│   └── dashboard.tsx        # Properties, vehicles, earnings
└── moderator/
    ├── _layout.tsx          # Moderator nav
    └── dashboard.tsx        # Reviews, flagged items, reports
```

#### Moved Files

| From | To | Reason |
|------|----|--------|
| `app/listings-detail.tsx` | `app/listings/detail.tsx` | belongs in listings folder |
| `components/BlurOverlay.tsx` | `components/common/BlurOverlay.tsx` | shared UI component |
| `components/FadeIn.tsx` | `components/common/FadeIn.tsx` | shared UI component |
| `components/OnboardingBackground.tsx` | `components/common/OnboardingBackground.tsx` | shared UI component |
| `components/chat/ChatComponents/` | `components/chat/messages/` | cleaner naming |
| `components/chat/CallComponents/` | `components/chat/calls/` | cleaner naming |

#### Deleted Files

| File | Reason |
|------|--------|
| `app/(auth)/verify-phone.tsx` | 1-line stub; `phone-verification.tsx` is the real one |
| `app/navigation/linking.ts` | Empty export |
| `app/agent/` directory | Moved to `app/pages/broker/` |
| `app/diaspora/` directory | Removed (unused) |

#### Route Updates

| Old Route | New Route | Updated In |
|-----------|-----------|-----------|
| `/agent/create-listing` | `/pages/broker/create-listing` | `(tabs)/_layout.tsx` |
| `/agent/dashboard` | `/pages/broker/dashboard` | `(tabs)/profile.tsx` |

#### Import Path Fixes (32 files + 3 manual)

All files updated to reference new component locations:
- `components/OnboardingBackground` → `components/common/OnboardingBackground`
- `components/FadeIn` → `components/common/FadeIn`
- `/listings-detail` → `/listings/detail`
- `/ChatComponents/` → `/messages/`
- `/CallComponents/` → `/calls/`

### Updated Root Layout

```tsx
// app/_layout.tsx now registers these screen groups:
"(auth)": auth screens (splash, login, register, etc.)
"(tabs)": main tab navigation
"pages": role-based dashboards
```

---

## Web App Changes

### Files Created

| File | Purpose |
|------|---------|
| `web/lib/api.ts` | API client with token injection, 401 refresh, dual cookie+localStorage storage |
| `web/lib/auth-context.tsx` | Auth provider with `login()`, `logout()`, profile fetch |
| `web/middleware.ts` | JWT-decoded role-based access control |

### Files Modified

| File | What Changed |
|------|-------------|
| `web/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3005/api` |
| `web/app/(auth)/login/page.tsx` | Rewritten to use `useAuth().login()` (not `authService.login()` directly). Phone strips whitespace. |
| All auth pages | Connected to real API (register, forgot-password, verify-email, etc.) |
| `web/app/pages/` | Role-based dashboard pages for all 7 roles |

### Web API Client Behavior

- Stores tokens in both `localStorage` AND `document.cookie`
- 401 responses trigger automatic refresh via `/auth/refresh`
- `TransformInterceptor` unwrapping: `data?.data !== undefined ? data.data : data`

### Web Auth Flow

```tsx
// Login page uses context, not direct API call:
const { login } = useAuth();
await login(emailOrPhone, password);
// login() calls setUser() in context → redirects by role
```

### Web Middleware (Role-Based Routing)

```
/pages/super-admin/* → SUPER_ADMIN only
/pages/moderator/*   → MODERATOR, SUPER_ADMIN
/pages/broker/*      → VERIFIED_DALAAL, REGULAR_DALAAL, SUPER_ADMIN
/pages/owner/*       → PROPERTY_OWNER, VEHICLE_OWNER, SUPER_ADMIN
/pages/customer/*    → CUSTOMER, SUPER_ADMIN
```

---

## File Structure After Cleanup

### Backend

```
backend/
├── .env                          # DB URL, JWT secrets, port 3005
├── prisma/
│   └── schema.prisma             # 7-role enum, user model
├── src/
│   ├── main.ts                   # CORS, TransformInterceptor, port 3005
│   ├── auth/
│   │   ├── auth.service.ts       # validateUser, login, verifyEmail
│   │   ├── auth.repository.ts    # findByIdentifier (multi-format phone)
│   │   └── auth.controller.ts    # DTOs, @Throttle, @Public
│   └── ...
```

### Mobile App (Dalaal-app/src)

```
src/
├── .env                          # EXPO_PUBLIC_API_URL
├── app/
│   ├── _layout.tsx               # Root layout (auth, tabs, pages groups)
│   ├── index.tsx                 # Entry redirect
│   ├── modal.tsx                 # Modal screen
│   ├── +html.tsx                 # HTML wrapper
│   ├── +not-found.tsx            # 404
│   │
│   ├── (auth)/                   # Authentication flow
│   │   ├── _layout.tsx
│   │   ├── splash.tsx
│   │   ├── onboarding.tsx
│   │   ├── welcome.tsx
│   │   ├── features.tsx
│   │   ├── login.tsx             # Email/Phone toggle tabs
│   │   ├── register.tsx          # Confirm password + terms
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   ├── verify-email.tsx      # Auto-login after verify
│   │   ├── phone-verification.tsx
│   │   └── role-selection.tsx
│   │
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home feed
│   │   ├── search.tsx            # Search
│   │   ├── create.tsx            # Quick create
│   │   ├── chat.tsx              # Messages list
│   │   ├── explore.tsx           # Explore
│   │   └── profile.tsx           # Profile with role-based links
│   │
│   ├── pages/                    # Role-based dashboards
│   │   ├── _layout.tsx
│   │   ├── super-admin/
│   │   │   ├── _layout.tsx
│   │   │   └── dashboard.tsx
│   │   ├── broker/
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── create-listing.tsx
│   │   ├── customer/
│   │   │   ├── _layout.tsx
│   │   │   └── dashboard.tsx
│   │   ├── owner/
│   │   │   ├── _layout.tsx
│   │   │   └── dashboard.tsx
│   │   └── moderator/
│   │       ├── _layout.tsx
│   │       └── dashboard.tsx
│   │
│   ├── listings/                 # Listing management
│   │   ├── create.tsx
│   │   ├── detail.tsx            # Moved from root
│   │   ├── edit.tsx
│   │   ├── properties/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── vehicles/
│   │       ├── index.tsx
│   │       └── [id].tsx
│   │
│   ├── booking/[id].tsx
│   ├── contract/[id].tsx
│   ├── chat/
│   │   ├── [id]/index.tsx
│   │   ├── new-chat.tsx
│   │   └── user-content.tsx
│   ├── notifications/index.tsx
│   ├── payments/
│   │   ├── escrow.tsx
│   │   ├── history.tsx
│   │   └── payment.tsx
│   ├── profile/
│   │   ├── edit.tsx
│   │   ├── favorites.tsx
│   │   ├── my-listings.tsx
│   │   ├── privacy-security.tsx
│   │   ├── settings.tsx
│   │   └── verification.tsx
│   └── search/
│       ├── advanced.tsx
│       ├── map.tsx
│       └── results.tsx
│
├── components/
│   ├── common/                   # Shared UI (moved from root)
│   │   ├── BlurOverlay.tsx
│   │   ├── FadeIn.tsx
│   │   └── OnboardingBackground.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── CallSessionModal.tsx
│   │   ├── messages/             # Renamed from ChatComponents/
│   │   │   ├── MessageSystem.tsx
│   │   │   ├── MessageText.tsx
│   │   │   ├── MessageMedia.tsx
│   │   │   ├── MessageAudio.tsx
│   │   │   ├── MessageFile.tsx
│   │   │   └── MessageMenu.tsx
│   │   └── calls/                # Renamed from CallComponents/
│   │       ├── CallHeader.tsx
│   │       ├── CallAvatar.tsx
│   │       ├── CallIncomingActions.tsx
│   │       ├── CallControls.tsx
│   │       └── CallVideoView.tsx
│   ├── home/
│   │   └── HomeClipsPlayer.tsx
│   ├── ui/
│   │   └── ScreenSkeleton.tsx
│   └── ...
│
├── services/
│   ├── api.ts                    # Port 3002→3005 fallback, retry clone
│   ├── auth.ts                   # verifyEmail persists tokens
│   └── webrtc.ts
├── hooks/
│   └── useAuth.ts                # Zustand auth hook
├── store/
│   └── authStore.ts              # Zustand auth store
├── constants/
│   └── theme.ts
└── context/
    ├── favorites-context.tsx
    └── theme-context.tsx
```

### Web App

```
web/
├── .env.local                    # NEXT_PUBLIC_API_URL
├── middleware.ts                  # JWT role-based access control
├── lib/
│   ├── api.ts                    # API client, token refresh, dual storage
│   └── auth-context.tsx          # Auth provider
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx        # Uses useAuth().login()
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── ...
│   └── pages/
│       ├── super-admin/
│       ├── broker/
│       ├── customer/
│       ├── owner/
│       └── moderator/
```

---

## Key Architecture Decisions

1. **TransformInterceptor**: All backend responses wrapped in `{ success, data, timestamp }`. Web `api.ts` unwraps with `data?.data !== undefined ? data.data : data`.

2. **Dual Token Storage**: Web stores JWT in both `localStorage` and `document.cookie` for flexibility.

3. **Role-Based Routing**: Both web middleware and mobile navigation check user roles to determine accessible routes.

4. **Local PostgreSQL**: Switched from Neon serverless to local PostgreSQL via `pg` Pool adapter. No SSL.

5. **Pages Directory**: Role-specific dashboards organized under `app/pages/{role}/` with per-role layouts.

6. **Common Components**: Shared UI elements (`OnboardingBackground`, `FadeIn`, `BlurOverlay`) moved to `components/common/` for clean imports.

7. **Auth Flow**: Register → Verify Email → Auto-Login → Role Selection → Dashboard. Login supports both email and phone with format flexibility.

---

## Known Issues / Remaining Work

### Pre-existing TypeScript Errors (not from our changes)

| File | Error |
|------|-------|
| `app/(tabs)/explore.tsx` | Missing type annotation (`any`), `unknown[]` not assignable to `User[]` |
| `services/auth.ts` | `error.response` property access on generic `Error` type (Axios pattern) |
| `services/webrtc.ts` | Duplicate function implementations |

### Potential Next Steps

- [ ] Run full backend test suite to verify auth endpoints
- [ ] Test complete auth flow end-to-end (register → verify → login → dashboard)
- [ ] Build real role-specific dashboard content
- [ ] Add proper error boundaries
- [ ] Add proper TypeScript types to `explore.tsx`
- [ ] Fix `webrtc.ts` duplicate functions
- [ ] Mobile: add pull-to-refresh on dashboards
- [ ] Mobile: implement real-time notifications
- [ ] Web: implement token refresh interceptor
- [ ] Deploy configuration (Docker, CI/CD)
