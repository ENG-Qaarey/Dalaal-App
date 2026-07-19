# Dalaal Web Improvement Plan

## Current State
App loads on web, core UI renders, but 3 crash points, 4 broken UX areas, and 5 polish issues exist.
Backend: NestJS on port 3005. Target: Local dev, both desktop + mobile browser.

---

## Phase 1: Fix Crash Points (blocks basic usage) ✅ DONE

### Step 1.1 — Create web-safe video clips ✅
- **NEW** `src/components/home/HomeClips.web.tsx` — Thumbnail + play icon, opens HTML5 `<video>` in modal
- **NEW** `src/components/home/HomeClipsPlayer.web.tsx` — HTML5 `<video>` player in modal, one clip at a time
- Expo Router auto-resolves `.web.tsx` on web, `.tsx` on native — zero native code changes

### Step 1.2 — Guard Vibration calls ✅
- **MODIFIED** `src/components/chat/CallSessionModal.tsx`
- Wrapped `Vibration.vibrate()` and `Vibration.cancel()` in `Platform.OS !== 'web'` checks (3 call sites)

### Step 1.3 — Browser WebRTC adapter ✅
- **MODIFIED** `src/services/webrtc.ts`
- Platform detection: web → browser APIs, native → react-native-webrtc
- Same interface: `startCall`, `answerCall`, `endCall`, `toggleAudio`, `toggleVideo`, `switchCamera`
- Socket signaling events already work via socket.io on web

---

## Phase 2: Fix Broken UX on Web ✅ DONE

### Step 2.1 — Listing image gallery (web) ✅
- **MODIFIED** `src/app/listings/detail.tsx`
- On web: index-based navigation with prev/next arrows + dot indicators

### Step 2.2 — Side-by-side chat layout (web) ✅
- **NEW** `src/app/(tabs)/chat.web.tsx` — Split view: conversation list left, active chat right on ≥768px
- **NEW** `src/hooks/useWebLayout.ts` — Returns `{ isWideScreen }` via Dimensions listener
- **MODIFIED** `src/components/chat/ChatList.tsx` — Accepts `selectedId` prop

---

## Phase 3: Web Polish & Responsiveness ✅ DONE

### Step 3.1 — HTML shell improvements ✅
- **MODIFIED** `src/app/+html.tsx` — OG meta, viewport, favicon, CSS reset, scrollbar, focus-visible

### Step 3.2 — Responsive container system ✅
- **NEW** `src/components/ui/ResponsiveContainer.tsx` — Max-width 1200px wrapper
- Applied to: `(tabs)/index.tsx`, `(tabs)/search.tsx`, `(tabs)/profile.tsx`

### Step 3.3 — Font size adjustments ✅
- Caption stays 12px, minimum viable for web; CSS shell enforces system font stack

### Step 3.4 — Fix KeyboardAvoidingView on web ✅
- **MODIFIED** `src/app/(auth)/login.tsx` — FormContent extracted, conditional KeyboardAvoidingView (skips on web)
- **MODIFIED** `src/app/(auth)/register.tsx` — Same pattern

### Step 3.5 — Fix profile image upload on web ✅
- **MODIFIED** `src/services/auth.ts` — On web + blob: URI → fetch blob → create File → FormData
- Also removed redundant manual Content-Type header (let fetch auto-set boundary)

---

## Phase 4: Missing Web Features ✅ DONE

### Step 4.1 — Web push notifications ✅
- **NEW** `src/utils/web-notifications.ts`
- Requests `Notification.requestPermission()` after login
- Shows browser notification on new message when app is hidden
- Integrated into `_layout.tsx` handleNewMessage

### Step 4.2 — Keyboard shortcuts ✅
- **NEW** `src/hooks/useWebKeyboardShortcuts.ts`
- `/` or `Ctrl+K` → Focus search (when not in input)
- `Escape` → Close active modal

### Step 4.3 — Error boundaries ✅
- **NEW** `src/components/ui/WebErrorBoundary.tsx`
- Catches rendering crashes, shows friendly error page with reload button
- Wraps root layout on web in `_layout.tsx`

---

## New Files

| File | Purpose |
|------|---------|
| `src/components/home/HomeClips.web.tsx` | Web clips: thumbnail + modal video |
| `src/components/home/HomeClipsPlayer.web.tsx` | Web HTML5 video player modal |
| `src/hooks/useWebLayout.ts` | Desktop vs mobile viewport detection |
| `src/components/ui/ResponsiveContainer.tsx` | Max-width centered container |
| `src/app/(tabs)/chat.web.tsx` | Side-by-side chat layout for desktop web |
| `src/utils/web-notifications.ts` | Browser notification API |
| `src/hooks/useWebKeyboardShortcuts.ts` | Desktop keyboard shortcuts |
| `src/components/ui/WebErrorBoundary.tsx` | Web error boundary |

## Modified Files

| File | Changes |
|------|---------|
| `src/components/chat/CallSessionModal.tsx` | Guard Vibration calls |
| `src/services/webrtc.ts` | Add browser WebRTC adapter |
| `src/app/listings/detail.tsx` | Fix image gallery for web |
| `src/components/chat/ChatList.tsx` | Accept `selectedId` prop |
| `src/app/+html.tsx` | Meta tags, viewport, SEO, CSS |
| `src/app/(auth)/login.tsx` | Skip KeyboardAvoidingView on web |
| `src/app/(auth)/register.tsx` | Skip KeyboardAvoidingView on web |
| `src/services/auth.ts` | Handle blob URL uploads on web |
| `src/app/(tabs)/index.tsx` | Wrap in ResponsiveContainer |
| `src/app/(tabs)/search.tsx` | Wrap in ResponsiveContainer |
| `src/app/(tabs)/profile.tsx` | Wrap in ResponsiveContainer |
