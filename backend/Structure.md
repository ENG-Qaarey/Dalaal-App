backend/
├── 📁 prisma/
│   ├── schema.prisma              # 22-table optimized schema
│   ├── seed.ts                    # Demo data for Somalia market
│   └── 📁 migrations/
│       └── 20250422000000_init/
│           └── migration.sql
│
├── 📁 src/
│   ├── main.ts                    # App bootstrap
│   ├── app.module.ts              # Root module
│   │
│   ├── 📁 common/                 # Shared across all modules
│   │   ├── 📁 constants/
│   │   │   ├── app.constants.ts   # App name, version
│   │   │   ├── error.constants.ts # Error codes
│   │   │   └── index.ts
│   │   │
│   │   ├── 📁 decorators/
│   │   │   ├── roles.decorator.ts # @Roles() decorator
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   │
│   │   ├── 📁 enums/
│   │   │   └── index.ts           # Re-export Prisma enums
│   │   │
│   │   ├── 📁 filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   │
│   │   ├── 📁 guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── ownership.guard.ts
│   │   │
│   │   ├── 📁 interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   │
│   │   ├── 📁 pipes/
│   │   │   └── validation.pipe.ts
│   │   │
│   │   └── 📁 utils/
│   │       ├── password.utils.ts    # bcrypt helpers
│   │       ├── sms.utils.ts       # Africa's Talking
│   │       └── slug.utils.ts      # URL slugs
│   │
│   ├── 📁 config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── cloudinary.config.ts
│   │   ├── payment.config.ts       # EVC Plus, Zaad, Sahal
│   │   └── app.config.ts
│   │
│   ├── 📁 database/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── 📁 auth/                    # TABLE: User (auth part)
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts      # POST /auth/login, /register, /refresh
│   │   ├── auth.service.ts         # JWT generation, validation
│   │   ├── auth.repository.ts
│   │   ├── 📁 dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   ├── verify-phone.dto.ts
│   │   │   ├── forgot-password.dto.ts
│   │   │   └── reset-password.dto.ts
│   │   └── 📁 strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   │
│   ├── 📁 users/                   # TABLE: User, Profile
│   │   ├── users.module.ts
│   │   ├── users.controller.ts     # GET /users/me, PATCH /users/me
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── profile.service.ts
│   │   └── 📁 dto/
│   │       ├── update-profile.dto.ts
│   │       └── update-settings.dto.ts
│   │
│   ├── 📁 verification/            # TABLE: IdentityVerification
│   │   ├── verification.module.ts
│   │   ├── verification.controller.ts
│   │   ├── verification.service.ts
│   │   ├── ai-verification.service.ts
│   │   └── 📁 dto/
│   │       ├── submit-verification.dto.ts
│   │       └── review-verification.dto.ts
│   │
│   ├── 📁 listings/                # TABLE: Listing, Property, Vehicle
│   │   ├── listings.module.ts
│   │   ├── listings.controller.ts  # CRUD + search + filter
│   │   ├── listings.service.ts
│   │   ├── listings.repository.ts
│   │   ├── search.service.ts       # Full-text + geo search
│   │   ├── property.service.ts
│   │   ├── vehicle.service.ts
│   │   └── 📁 dto/
│   │       ├── create-listing.dto.ts
│   │       ├── update-listing.dto.ts
│   │       ├── listing-filter.dto.ts
│   │       └── listing-search.dto.ts
│   │
│   ├── 📁 uploads/                 # TABLE: ListingImage
│   │   ├── uploads.module.ts
│   │   ├── uploads.controller.ts   # POST /uploads/image
│   │   └── cloudinary.service.ts
│   │
│   ├── 📁 favorites/               # TABLE: Favorite
│   │   ├── favorites.module.ts
│   │   ├── favorites.controller.ts
│   │   └── favorites.service.ts
│   │
│   ├── 📁 chat/                    # TABLE: Conversation, ConversationParticipant, Message
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts      # REST endpoints
│   │   ├── chat.gateway.ts         # WebSocket (Socket.IO)
│   │   ├── chat.service.ts
│   │   ├── conversation.service.ts
│   │   └── 📁 dto/
│   │       ├── create-message.dto.ts
│   │       └── create-conversation.dto.ts
│   │
│   ├── 📁 payments/                # TABLE: Payment
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── mobile-money.service.ts # EVC Plus, Zaad, Sahal APIs
│   │   └── 📁 dto/
│   │       ├── create-payment.dto.ts
│   │       └── verify-payment.dto.ts
│   │
│   ├── 📁 escrow/                  # TABLE: Escrow
│   │   ├── escrow.module.ts
│   │   ├── escrow.controller.ts
│   │   ├── escrow.service.ts
│   │   └── 📁 dto/
│   │       ├── create-escrow.dto.ts
│   │       └── release-escrow.dto.ts
│   │
│   ├── 📁 reviews/                 # TABLE: Review
│   │   ├── reviews.module.ts
│   │   ├── reviews.controller.ts
│   │   └── reviews.service.ts
│   │
│   ├── 📁 notifications/           # TABLE: Notification
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   ├── push.service.ts         # Firebase
│   │   ├── sms.service.ts          # Africa's Talking
│   │   └── email.service.ts        # SendGrid
│   │
│   ├── 📁 reports/                 # TABLE: Report
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   └── reports.service.ts
│   │
│   ├── 📁 admin/                   # TABLE: AdminAction + dashboards
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── analytics.service.ts
│   │   ├── moderation.service.ts
│   │   └── 📁 dto/
│   │       └── admin-action.dto.ts
│   │
│   ├── 📁 saved-searches/          # TABLE: SavedSearch
│   │   ├── saved-searches.module.ts
│   │   ├── saved-searches.controller.ts
│   │   └── saved-searches.service.ts
│   │
│   ├── 📁 faq/                     # TABLE: Faq
│   │   ├── faq.module.ts
│   │   └── faq.controller.ts
│   │
│   ├── 📁 announcements/           # TABLE: Announcement
│   │   ├── announcements.module.ts
│   │   └── announcements.controller.ts
│   │
│   ├── 📁 contact/                 # TABLE: ContactMessage
│   │   ├── contact.module.ts
│   │   └── contact.controller.ts
│   │
│   ├── 📁 audit/                   # TABLE: AuditLog
│   │   ├── audit.module.ts
│   │   ├── audit.controller.ts
│   │   └── audit.service.ts
│   │
│   └── 📁 health/
│       ├── health.module.ts
│       └── health.controller.ts
│
├── 📁 test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── jest.config.js