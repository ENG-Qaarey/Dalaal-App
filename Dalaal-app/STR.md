Dalaal-app/
├── 📁 src/
│   │
│   ├── 📁 app/                      # Expo Router (file-based routing)
│   │   ├── _layout.tsx              # Root layout (providers, auth check)
│   │   ├── +not-found.tsx
│   │   │
│   │   ├── 📁 (auth)/               # Auth stack (no tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── verify-phone.tsx
│   │   │   └── onboarding.tsx
│   │   │
│   │   ├── 📁 (tabs)/               # Main tab navigator
│   │   │   ├── _layout.tsx          # Tab bar config
│   │   │   ├── index.tsx            # 🏠 Home tab
│   │   │   ├── search.tsx           # 🔍 Search tab
│   │   │   ├── chat.tsx             # 💬 Chat tab (with badge)
│   │   │   ├── favorites.tsx        # ❤️ Favorites tab
│   │   │   └── profile.tsx          # 👤 Profile tab
│   │   │
│   │   ├── 📁 listings/
│   │   │   ├── 📁 properties/
│   │   │   │   ├── index.tsx
│   │   │   │   └── 📁 [id].tsx
│   │   │   ├── 📁 vehicles/
│   │   │   │   ├── index.tsx
│   │   │   │   └── 📁 [id].tsx
│   │   │   ├── create.tsx
│   │   │   └── edit.tsx
│   │   │
│   │   ├── 📁 search/
│   │   │   ├── advanced.tsx
│   │   │   ├── results.tsx
│   │   │   └── map.tsx
│   │   │
│   │   ├── 📁 chat/
│   │   │   ├── 📁 [id]/
│   │   │   │   └── index.tsx        # Conversation screen
│   │   │   └── new-chat.tsx
│   │   │
│   │   ├── 📁 payments/
│   │   │   ├── payment.tsx
│   │   │   ├── escrow.tsx
│   │   │   └── history.tsx
│   │   │
│   │   ├── 📁 profile/
│   │   │   ├── settings.tsx
│   │   │   ├── verification.tsx
│   │   │   ├── my-listings.tsx
│   │   │   └── edit.tsx
│   │   │
│   │   ├── 📁 diaspora/
│   │   │   └── dashboard.tsx
│   │   │
│   │   ├── 📁 notifications/
│   │   │   └── index.tsx
│   │   │
│   │   ├── 📁 map/
│   │   │   └── full-screen.tsx
│   │   │
│   │   └── 📁 help/
│   │       ├── index.tsx
│   │       └── faq.tsx
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                   # Base UI (NativeWind)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterChip.tsx
│   │   │   ├── ImageCarousel.tsx
│   │   │   ├── RatingStars.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   ├── VerificationBadge.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── MapPin.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── Divider.tsx
│   │   │
│   │   ├── 📁 listings/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingList.tsx
│   │   │   ├── ListingDetail.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── VehicleCard.tsx
│   │   │   └── FeaturedBadge.tsx
│   │   │
│   │   ├── 📁 search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── SearchResults.tsx
│   │   │
│   │   ├── 📁 chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatMessage.tsx
│   │   │
│   │   ├── 📁 map/
│   │   │   ├── MapView.tsx
│   │   │   └── MapMarker.tsx
│   │   │
│   │   ├── 📁 payment/
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── EscrowStatus.tsx
│   │   │   └── MobileMoneySelector.tsx
│   │   │
│   │   ├── 📁 home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── FeaturedListings.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   └── 📁 shared/
│   │       ├── LoadingScreen.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── Header.tsx
│   │
│   ├── 📁 hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useListings.ts
│   │   ├── useSearch.ts
│   │   ├── useChat.ts
│   │   ├── useNotifications.ts
│   │   ├── usePayments.ts
│   │   ├── useLocation.ts
│   │   ├── useNetwork.ts
│   │   ├── useStorage.ts
│   │   └── useLanguage.ts
│   │
│   ├── 📁 services/                 # API layer
│   │   ├── api.ts                   # Axios with interceptors
│   │   ├── auth.ts
│   │   ├── listings.ts
│   │   ├── users.ts
│   │   ├── chat.ts
│   │   ├── payments.ts
│   │   ├── notifications.ts
│   │   └── upload.ts
│   │
│   ├── 📁 store/                    # Zustand stores
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── listingStore.ts
│   │   ├── chatStore.ts
│   │   ├── notificationStore.ts
│   │   └── searchStore.ts
│   │
│   ├── 📁 utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── permissions.ts
│   │
│   ├── 📁 config/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── app.ts
│   │
│   ├── 📁 types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── listing.ts
│   │   ├── chat.ts
│   │   ├── payment.ts
│   │   └── index.ts
│   │
│   ├── 📁 constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── sizes.ts
│   │   └── routes.ts
│   │
│   ├── 📁 i18n/
│   │   ├── config.ts
│   │   └── 📁 locales/
│   │       ├── so.json
│   │       ├── ar.json
│   │       └── en.json
│   │
│   └── 📁 assets/
│       ├── 📁 images/
│       ├── 📁 icons/
│       └── 📁 fonts/
│
├── 📁 tests/
│   └── setup.ts
│
├── app.json                         # Expo config
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env
└── eas.json                         # EAS Build