# Dalaal Project - Cleanup & SDK 56 Upgrade Plan

## Overview

| Area | Scope | Issues Found |
|------|-------|-------------|
| **Backend** | Full code review + cleanup | ~149 issues (46 empty files, 28 unused methods, 8 duplication clusters, security holes) |
| **Dalaal-app** | Full code review + cleanup | ~100+ issues (17 stub screens, 19 unused components, 6 duplication clusters, hardcoded mocks) |
| **SDK Upgrade** | SDK 54 → 56 | Major: React Navigation removal, RN 0.85, TypeScript 6, 170+ packages to update |

---

## Phase 1: Dalaal-app Cleanup (13 tasks)

### Task 1.1 - Delete dead files
**Priority:** High
**Files to delete:**
- `src/hooks/useListings.ts` - stub, never imported
- `src/hooks/useSearch.ts` - stub, never imported
- `src/hooks/useUser.ts` - stub, never imported
- `src/store/listingStore.ts` - stub, never imported
- `src/services/listings.ts` - stub, never imported
- `src/utils/helpers.ts` - empty, never imported
- `src/utils/formatters.ts` - empty, never imported
- `src/constants/config.ts` - empty, never imported
- `src/i18n/config.ts` - unused, no i18n exists
- `src/types/index.ts` - unused export

---

### Task 1.2 - Delete 17 stub screens
**Priority:** High
**Files to delete (all are `return null` with no UI/logic):**
- `src/app/listings/create.tsx`
- `src/app/listings/edit.tsx`
- `src/app/listings/vehicles/index.tsx`
- `src/app/listings/vehicles/[id].tsx`
- `src/app/listings/properties/index.tsx`
- `src/app/listings/properties/[id].tsx`
- `src/app/profile/my-listings.tsx`
- `src/app/profile/settings.tsx`
- `src/app/profile/verification.tsx`
- `src/app/chat/new-chat.tsx`
- `src/app/notifications/index.tsx`
- `src/app/payments/payment.tsx`
- `src/app/payments/history.tsx`
- `src/app/payments/escrow.tsx`
- `src/app/search/results.tsx`
- `src/app/search/map.tsx`
- `src/app/search/advanced.tsx`

---

### Task 1.3 - Delete 19 unused components
**Priority:** High
**Files to delete (never imported anywhere):**
- `src/components/ui/VerificationBadge.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/SearchBar.tsx`
- `src/components/ui/RatingStars.tsx`
- `src/components/ui/PriceTag.tsx`
- `src/components/ui/OfflineBanner.tsx`
- `src/components/ui/MapPin.tsx`
- `src/components/ui/ImageCarousel.tsx`
- `src/components/ui/FilterChip.tsx`
- `src/components/ui/Divider.tsx`
- `src/components/ui/ChatBubble.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Avatar.tsx`
- `src/components/ui/Input.tsx`
- `src/components/profile/UserDataModal.tsx`
- `src/components/common/BlurOverlay.tsx`

---

### Task 1.4 - Extract shared `unwrapResponse`
**Priority:** High
**Action:** Move the duplicated `unwrapResponse<T>` function into `src/services/api.ts` and import from there.
**Files to update:**
- `src/services/api.ts` - keep exported `unwrapResponse` here
- `src/services/auth.ts` - remove local copy, import from `./api`
- `src/services/chat.ts` - remove local copy, import from `./api`
- `src/services/users.ts` - remove local copy, import from `./api`
- `src/services/analytics.ts` - remove local copy, import from `./api`

---

### Task 1.5 - Extract shared `safeSetItem`/`safeDeleteItem`
**Priority:** High
**Action:** Remove duplicates from `src/services/auth.ts`, keep only in `src/services/api.ts`.
**Files to update:**
- `src/services/auth.ts` - remove local `safeSetItem`/`safeDeleteItem`, import from `./api`

---

### Task 1.6 - Extract `CITY_OPTIONS`/`COUNTRY_OPTIONS`
**Priority:** Medium
**Action:** Move duplicated city/country arrays to `src/constants/locations.ts`.
**Files to update:**
- Create `src/constants/locations.ts` with shared arrays
- `src/app/profile/edit.tsx` - import from constants
- `src/app/profile/privacy-security.tsx` - import from constants

---

### Task 1.7 - Fix React Navigation imports
**Priority:** High (pre-upgrade prep)
**Action:** Change `useFocusEffect` import from `@react-navigation/native` to `expo-router/react-navigation`.
**Files to update:**
- `src/app/chat/[id]/index.tsx`
- `src/app/(tabs)/profile.tsx`
- `src/app/pages/broker/dashboard.tsx`
- `src/app/pages/super-admin/dashboard.tsx`

---

### Task 1.8 - Clean console.log/debug statements
**Priority:** Medium
**Action:** Remove or convert 36 console.log/warn/debug statements across 12 files.

---

### Task 1.9 - Run ESLint auto-fix
**Priority:** Medium
**Command:**
```sh
cd Dalaal-app && npx expo lint --fix
```

---

### Task 1.10 - Verify app still works
**Priority:** High
**Command:**
```sh
cd Dalaal-app && npx expo start --clear
```

---

### Task 1.11 - Remove unused `analytics.ts` method
**Priority:** Low
**Action:** Remove `getAgentLeads()` from `src/services/analytics.ts` (never called).

---

### Task 1.12 - Clean up redundant onboarding redirect
**Priority:** Low
**Action:** Remove `src/app/(auth)/onboarding.tsx` (just a redirect to `/splash`, redundant with auth layout).

---

### Task 1.13 - Remove placeholder modal screen
**Priority:** Low
**Action:** Remove `src/app/modal.tsx` (generic placeholder, never navigated to).

---

## Phase 2: Backend Cleanup (10 tasks)

### Task 2.1 - Delete 46 empty files
**Priority:** High
**Files to delete:**
- `src/maps/maps.controller.ts`
- `src/maps/maps.service.ts`
- `src/maps/maps.module.ts`
- `src/maps/geocoding.service.ts`
- `src/admin/admin.service.ts`
- `src/payments/mobile-money.service.ts`
- `src/listings/dto/update-listing.dto.ts`
- `src/listings/dto/listing-filter.dto.ts`
- `src/listings/dto/listing-search.dto.ts`
- `src/listings/entities/index.ts`
- `src/listings/entities/listing.entity.ts`
- `src/listings/entities/property.entity.ts`
- `src/listings/entities/vehicle.entity.ts`
- `src/vehicles/dto/update-vehicle.dto.ts`
- `src/vehicles/entities/vehicle.entity.ts`
- `src/properties/dto/update-property.dto.ts`
- `src/properties/entities/property.entity.ts`
- `src/chat/dto/create-message.dto.ts`
- `src/chat/entities/index.ts`
- `src/chat/entities/conversation.entity.ts`
- `src/chat/entities/message.entity.ts`
- `src/payments/dto/verify-payment.dto.ts`
- `src/payments/entities/payment.entity.ts`
- `src/escrow/dto/release-escrow.dto.ts`
- `src/escrow/entities/escrow.entity.ts`
- `src/reviews/entities/review.entity.ts`
- `src/notifications/entities/notification.entity.ts`
- `src/verification/dto/submit-verification.dto.ts`
- `src/verification/dto/review-verification.dto.ts`
- `src/verification/entities/verification.entity.ts`
- `src/admin/types/analytics.types.ts`
- `src/search/types/search.types.ts`
- `src/providers/email/index.ts`
- `src/providers/email/sendgrid.provider.ts`
- `src/providers/sms/index.ts`
- `src/providers/sms/africa-talking.provider.ts`
- `src/providers/push/index.ts`
- `src/providers/mobile-money/index.ts`
- `src/providers/mobile-money/evc-plus.provider.ts`
- `src/providers/mobile-money/zaad.provider.ts`
- `src/providers/mobile-money/sahal.provider.ts`

---

### Task 2.2 - Delete unused constants/utils/interfaces
**Priority:** High
**Files to delete:**
- `src/common/constants/app.constants.ts`
- `src/common/constants/cache.constants.ts`
- `src/common/constants/error.constants.ts`
- `src/common/utils/file.utils.ts`
- `src/common/utils/sms.utils.ts`
- `src/common/utils/slug.utils.ts`
- `src/common/utils/password.utils.ts`
- `src/common/interfaces/paginated-result.interface.ts`
- `src/common/interfaces/request-with-user.interface.ts`

---

### Task 2.3 - Delete unused middleware/guards/pipes
**Priority:** Medium
**Files to delete:**
- `src/common/middleware/logger.middleware.ts`
- `src/common/middleware/rate-limit.middleware.ts`
- `src/common/guards/ownership.guard.ts`
- `src/common/guards/throttle.guard.ts`
- `src/common/pipes/validation.pipe.ts`
- `src/common/pipes/parse-int.pipe.ts`

---

### Task 2.4 - Fix `listings.repository.ts`
**Priority:** High
**Action:**
1. Remove duplicate `ListingsService` class (lines 66-159)
2. Remove unused imports (`NotFoundException`, `ForbiddenException`, DTOs, `ListingType`, `generateSlug`)
3. Fix DTO barrel exports in `src/listings/dto/index.ts`

---

### Task 2.5 - Remove dead auth methods
**Priority:** Medium
**Action:** Delete unused methods from `src/auth/auth.repository.ts`:
- `updateLastLogin()` (line 74)
- `findByUsername()` (line 23)
- `createPasswordResetToken()` (line 82)
- `findPasswordResetToken()` (line 89)
- `deletePasswordResetToken()` (line 96)
- `deleteUserPasswordResetTokens()` (line 103)

---

### Task 2.6 - Remove hardcoded secrets + console.logs
**Priority:** High
**Files to update:**
- `src/config/jwt.config.ts` - remove hardcoded JWT secret fallbacks, require env vars
- `src/config/database.config.ts` - remove hardcoded DB URL fallback
- `src/auth/auth.service.ts` - replace all `console.error`/`console.log` with NestJS `Logger`, remove verification code logging

---

### Task 2.7 - Fix CORS + security issues
**Priority:** High
**Files to update:**
- `src/main.ts` - fix broken CORS callback (else branch should reject)
- `src/chat/chat.gateway.ts` - fix WebSocket CORS `origin: '*'`
- `package.json` - move `@types/compression`, `@types/nodemailer`, `@types/passport-google-oauth20` to devDependencies

---

### Task 2.8 - Set up ESLint configuration
**Priority:** Medium
**Action:** Write proper `backend/.eslintrc.js` with TypeScript + Prettier rules.

---

### Task 2.9 - Extract duplicated utilities
**Priority:** Medium
**Action:**
1. Create `src/common/utils/user.utils.ts` with shared `sanitizeUser()` function
2. Create `src/common/utils/date.utils.ts` with shared `getDateRange()` and `changePercent()`
3. Update `auth/auth.service.ts` and `users/users.service.ts` to import shared `sanitizeUser`
4. Update `admin/analytics.service.ts` and `agents/agents.service.ts` to import shared date utils

---

### Task 2.10 - Run lint + build
**Priority:** High
**Commands:**
```sh
cd backend && npm run lint && npm run build
```

---

## Phase 3: SDK 54 → 56 Upgrade (8 tasks)

### Task 3.1 - Run Expo codemod for React Navigation
**Priority:** High
**Command:**
```sh
cd Dalaal-app && npx expo-codemod sdk-56-expo-router-react-navigation-replace src
```

---

### Task 3.2 - Upgrade expo + fix all dependencies
**Priority:** High
**Commands:**
```sh
cd Dalaal-app
npx expo install expo@^56.0.0
npx expo install --fix
```
**Key version changes:**
| Package | From | To |
|---------|------|----|
| expo | ~54.0.34 | ~56.0.15 |
| react | 19.1.0 | 19.2.3 |
| react-native | 0.81.5 | 0.85.3 |
| typescript | ~5.9.2 | ~6.0.3 |
| expo-router | ~6.0.23 | ~56.2.14 |

---

### Task 3.3 - Remove React Navigation packages
**Priority:** High
**Command:**
```sh
cd Dalaal-app
npm uninstall @react-navigation/bottom-tabs @react-navigation/elements @react-navigation/native
```

---

### Task 3.4 - Update react-native-worklets
**Priority:** High
**Command:**
```sh
cd Dalaal-app && npx expo install react-native-worklets@0.8.3
```

---

### Task 3.5 - Clean babel.config.js
**Priority:** Medium
**Action:** Remove the custom `import.meta` plugin (now automatic in SDK 56). Replace with:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

---

### Task 3.6 - Fix TypeScript errors
**Priority:** High
**Command:**
```sh
cd Dalaal-app && npx tsc --noEmit
```
Fix any type errors from TS 5→6 upgrade.

---

### Task 3.7 - Run diagnostics
**Priority:** High
**Commands:**
```sh
cd Dalaal-app
npx expo-doctor@latest
npx expo start --clear
```

---

### Task 3.8 - Test critical flows
**Priority:** High
**Manual testing checklist:**
- [ ] Auth flow (login, register, verify email)
- [ ] Tab navigation (Home, Search, Chat, Profile)
- [ ] useFocusEffect triggers (profile refresh, chat re-focus, dashboard refresh)
- [ ] WebRTC voice/video calls
- [ ] Camera and image picker
- [ ] Socket.io real-time chat
- [ ] Push notification tap-to-navigate

---

## Execution Order

```
Phase 1 (Dalaal-app cleanup) ----\
                                  >---- Phase 3 (SDK 54→56 Upgrade)
Phase 2 (Backend cleanup) ------/
```

- Phase 1 and Phase 2 can run in parallel
- Phase 3 depends on Phase 1.7 (React Navigation import fix)
- Phase 3.1 (codemod) may overlap with Phase 1.7

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| `react-native-webrtc` incompatible with RN 0.85 | HIGH | Test WebRTC calls immediately after upgrade |
| `react-native-signature-canvas` incompatible with RN 0.85 | MEDIUM | Test signature capture flow |
| Hermes v1 memory regression with reanimated | MEDIUM | Monitor memory, enable worklets bundle mode |
| TypeScript 6 type errors | LOW-MEDIUM | Run tsc early, fix incrementally |
| `useFocusEffect` behavior change in expo-router fork | LOW | API unchanged, just import path changes |
