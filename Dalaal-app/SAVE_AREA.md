# Safe Area, Status Bar & Tab Bar Handling

## Overview
The app uses `react-native-safe-area-context` with a `SafeAreaProvider` wrapping the entire app in `src/app/_layout.tsx`. There is no centralized screen layout component — each screen manages safe area independently using one of three patterns.

## Root Setup (`_layout.tsx`)
- `<SafeAreaProvider>` wraps the entire app (provides inset context to all screens).
- `<StatusBar style="dark" />` is set globally with no per-screen customization.

## Three Safe Area Patterns

### Pattern A: SafeAreaView + useSafeAreaInsets (most tab & detail screens)
- Used in: Home, Search, Chat, Explore tab screens; listings-detail; favorites; privacy-security; edit profile; agent dashboard.
- `SafeAreaView` with `edges={['left', 'right']}` handles horizontal safe padding automatically.
- `useSafeAreaInsets()` provides `insets.top` for manual header `paddingTop`.
- `insets.bottom` is added to scroll/FlatList `contentContainerStyle` padding.
- The status bar sits inside `insets.top`; content starts below the custom header.

### Pattern B: SafeAreaView only (auth screens + chat/[id])
- Used in: Splash, Welcome, Login, Register, Verify Email, Forgot Password, Reset Password, Role Selection, Phone Verification, chat/[id].
- `<SafeAreaView>` wraps the entire screen with no `edges` prop (defaults to all edges).
- No `useSafeAreaInsets()` called — relies entirely on SafeAreaView's built-in padding.
- Status bar space is handled automatically by SafeAreaView.

### Pattern C: useSafeAreaInsets only (no SafeAreaView)
- Used in: Profile tab, booking/[id], contract/[id], agent/create-listing, chat/user-content.
- Plain `<View>` root container.
- Header uses `Math.max(insets.top, 44) + 10` for paddingTop.
- Scroll content uses `insets.bottom` for bottom padding.
- Status bar space is managed entirely through manual `insets.top` padding.

## Tab Bar
- The tab bar is defined in `src/app/(tabs)/_layout.tsx` using `expo-router`'s `Tabs` navigator.
- The tab bar has **no explicit safe area handling** — it relies on Expo Router's default behavior.
- Content in tab screens uses `paddingBottom: 18 + insets.bottom` (Pattern A) to avoid overlap with the tab bar.

## Key Inconsistencies
| Issue | Affected Screens |
|-------|-----------------|
| Profile tab is the only tab screen missing `SafeAreaView` wrapper | profile.tsx |
| Header top padding varies: `insets.top` vs `Math.max(insets.top, 44) + 10` vs `insets.top + 6` | booking, contract, create-listing, profile, user-content |
| Inconsistent `edges` prop values across screens | Various |
| No shared ScreenLayout component | All screens |
