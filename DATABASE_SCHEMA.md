# Dalaal Database Schema

> PostgreSQL database managed by Prisma ORM  
> Generated from `backend/prisma/schema.prisma`

---

## Table of Contents

1. [Enums](#enums)
2. [Tables](#tables)
3. [Relationships](#relationships)
4. [Constraints & Indexes](#constraints--indexes)
5. [Complete SQL Script](#complete-sql-script)

---

## Enums

| Enum | Values |
|------|--------|
| `UserRole` | `SUPER_ADMIN`, `BROKER`, `PROPERTY_OWNER`, `VEHICLE_OWNER`, `CUSTOMER` |
| `UserStatus` | `ACTIVE`, `SUSPENDED`, `BANNED`, `PENDING_VERIFICATION`, `INACTIVE` |
| `ListingType` | `PROPERTY`, `VEHICLE` |
| `ListingStatus` | `DRAFT`, `PENDING_REVIEW`, `ACTIVE`, `FEATURED`, `EXPIRED`, `REJECTED`, `ARCHIVED` |
| `PropertyType` | `HOUSE`, `APARTMENT`, `LAND`, `COMMERCIAL`, `VILLA`, `TOWNHOUSE`, `OFFICE` |
| `VehicleType` | `CAR`, `TRUCK`, `MOTORCYCLE`, `BUS`, `VAN`, `SUV`, `PICKUP` |
| `FuelType` | `PETROL`, `DIESEL`, `ELECTRIC`, `HYBRID` |
| `Transmission` | `MANUAL`, `AUTOMATIC` |
| `PaymentProvider` | `EVC_PLUS`, `ZAAD`, `SAHAL`, `CASH` |
| `PaymentStatus` | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |
| `PaymentType` | `LISTING_FEE`, `PREMIUM_FEATURE`, `ESCROW_DEPOSIT`, `ESCROW_RELEASE`, `COMMISSION` |
| `EscrowStatus` | `PENDING_DEPOSIT`, `HOLDING`, `RELEASED`, `DISPUTED`, `REFUNDED` |
| `MessageType` | `TEXT`, `IMAGE`, `DOCUMENT`, `LISTING_SHARE`, `SYSTEM` |
| `NotificationType` | `NEW_LISTING`, `PRICE_DROP`, `NEW_MESSAGE`, `LISTING_VERIFIED`, `PAYMENT_RECEIVED`, `ESCROW_RELEASED`, `REVIEW_RECEIVED`, `ACCOUNT_VERIFIED`, `WELCOME`, `SYSTEM_ANNOUNCEMENT` |
| `DocumentType` | `NATIONAL_ID`, `PASSPORT`, `BUSINESS_LICENSE`, `TITLE_DEED`, `DRIVERS_LICENSE` |
| `VerificationStatus` | `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED` |

---

## Tables

### 1. `users`

Core user account table.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `email` | `VARCHAR` | `UNIQUE, NOT NULL` | — |
| `phone` | `VARCHAR` | `UNIQUE` | `NULL` |
| `password` | `VARCHAR` | | `NULL` |
| `google_id` | `VARCHAR` | `UNIQUE` | `NULL` |
| `username` | `VARCHAR` | `UNIQUE` | `NULL` |
| `role` | `UserRole` | `NOT NULL` | `CUSTOMER` |
| `status` | `UserStatus` | `NOT NULL` | `PENDING_VERIFICATION` |
| `email_verified` | `BOOLEAN` | `NOT NULL` | `false` |
| `phone_verified` | `BOOLEAN` | `NOT NULL` | `false` |
| `two_factor_enabled` | `BOOLEAN` | `NOT NULL` | `false` |
| `session_token` | `VARCHAR` | | `NULL` |
| `last_seen_at` | `TIMESTAMPTZ` | | `NULL` |
| `is_online` | `BOOLEAN` | `NOT NULL` | `false` |
| `last_login_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 2. `profiles`

Extended user profile information (1:1 with `users`).

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `UNIQUE, NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `first_name` | `VARCHAR` | | `NULL` |
| `last_name` | `VARCHAR` | | `NULL` |
| `avatar` | `VARCHAR` | | `NULL` |
| `bio` | `TEXT` | | `NULL` |
| `city` | `VARCHAR` | | `'Mogadishu'` |
| `country` | `VARCHAR` | | `'SO'` |
| `is_diaspora` | `BOOLEAN` | `NOT NULL` | `false` |
| `currency` | `VARCHAR` | | `'USD'` |
| `language` | `VARCHAR` | | `'so'` |
| `whatsapp_number` | `VARCHAR` | | `NULL` |
| `telegram_handle` | `VARCHAR` | | `NULL` |
| `total_listings` | `INT` | `NOT NULL` | `0` |
| `rating` | `DOUBLE PRECISION` | | `0` |
| `review_count` | `INT` | `NOT NULL` | `0` |
| `response_rate` | `DOUBLE PRECISION` | | `0` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 3. `listings`

Central listing table for both properties and vehicles.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `type` | `ListingType` | `NOT NULL` | — |
| `title` | `VARCHAR` | `NOT NULL` | — |
| `slug` | `VARCHAR` | `UNIQUE, NOT NULL` | — |
| `description` | `TEXT` | | `NULL` |
| `price` | `DECIMAL(12,2)` | `NOT NULL` | — |
| `price_negotiable` | `BOOLEAN` | `NOT NULL` | `false` |
| `currency` | `VARCHAR` | `NOT NULL` | `'USD'` |
| `city` | `VARCHAR` | `NOT NULL` | — |
| `district` | `VARCHAR` | | `NULL` |
| `address` | `TEXT` | | `NULL` |
| `latitude` | `DOUBLE PRECISION` | | `NULL` |
| `longitude` | `DOUBLE PRECISION` | | `NULL` |
| `status` | `ListingStatus` | `NOT NULL` | `DRAFT` |
| `is_verified` | `BOOLEAN` | `NOT NULL` | `false` |
| `is_featured` | `BOOLEAN` | `NOT NULL` | `false` |
| `view_count` | `INT` | `NOT NULL` | `0` |
| `favorite_count` | `INT` | `NOT NULL` | `0` |
| `inquiry_count` | `INT` | `NOT NULL` | `0` |
| `featured_image` | `VARCHAR` | | `NULL` |
| `video_url` | `VARCHAR` | | `NULL` |
| `available_from` | `TIMESTAMPTZ` | | `NULL` |
| `expires_at` | `TIMESTAMPTZ` | | `NULL` |
| `published_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 4. `properties`

Property-specific details (1:1 with `listings` where `type = 'PROPERTY'`).

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `listing_id` | `UUID` | `UNIQUE, NOT NULL, FK → listings.id ON DELETE CASCADE` | — |
| `property_type` | `PropertyType` | `NOT NULL` | — |
| `bedrooms` | `INT` | | `NULL` |
| `bathrooms` | `INT` | | `NULL` |
| `square_meters` | `DOUBLE PRECISION` | | `NULL` |
| `year_built` | `INT` | | `NULL` |
| `furnished` | `BOOLEAN` | `NOT NULL` | `false` |
| `parking` | `BOOLEAN` | `NOT NULL` | `false` |
| `garden` | `BOOLEAN` | `NOT NULL` | `false` |
| `security` | `BOOLEAN` | `NOT NULL` | `false` |
| `water` | `BOOLEAN` | `NOT NULL` | `true` |
| `electricity` | `BOOLEAN` | `NOT NULL` | `true` |
| `property_status` | `VARCHAR` | | `'FOR_SALE'` |
| `deposit_months` | `INT` | | `NULL` |
| `min_lease_months` | `INT` | | `NULL` |

---

### 5. `vehicles`

Vehicle-specific details (1:1 with `listings` where `type = 'VEHICLE'`).

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `listing_id` | `UUID` | `UNIQUE, NOT NULL, FK → listings.id ON DELETE CASCADE` | — |
| `vehicle_type` | `VehicleType` | `NOT NULL` | — |
| `make` | `VARCHAR` | `NOT NULL` | — |
| `model` | `VARCHAR` | `NOT NULL` | — |
| `year` | `INT` | `NOT NULL` | — |
| `mileage` | `INT` | | `NULL` |
| `condition` | `VARCHAR` | | `'GOOD'` |
| `fuel_type` | `FuelType` | | `NULL` |
| `transmission` | `Transmission` | | `NULL` |
| `color` | `VARCHAR` | | `NULL` |
| `seats` | `INT` | | `NULL` |
| `vehicle_status` | `VARCHAR` | | `'FOR_SALE'` |
| `min_rental_days` | `INT` | | `NULL` |
| `deposit_required` | `BOOLEAN` | `NOT NULL` | `false` |

---

### 6. `listing_images`

Images attached to listings.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `listing_id` | `UUID` | `NOT NULL, FK → listings.id ON DELETE CASCADE` | — |
| `url` | `VARCHAR` | `NOT NULL` | — |
| `thumbnail` | `VARCHAR` | | `NULL` |
| `order` | `INT` | `NOT NULL` | `0` |
| `is_primary` | `BOOLEAN` | `NOT NULL` | `false` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 7. `payments`

Payment transactions.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `NOT NULL, FK → users.id` | — |
| `recipient_id` | `UUID` | `FK → users.id` | `NULL` |
| `listing_id` | `UUID` | `FK → listings.id` | `NULL` |
| `escrow_id` | `UUID` | `UNIQUE, FK → escrows.id` | `NULL` |
| `amount` | `DECIMAL(12,2)` | `NOT NULL` | — |
| `currency` | `VARCHAR` | `NOT NULL` | `'USD'` |
| `provider` | `PaymentProvider` | `NOT NULL` | — |
| `provider_ref` | `VARCHAR` | | `NULL` |
| `type` | `PaymentType` | `NOT NULL` | — |
| `status` | `PaymentStatus` | `NOT NULL` | `PENDING` |
| `description` | `TEXT` | | `NULL` |
| `failure_reason` | `TEXT` | | `NULL` |
| `completed_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 8. `escrows`

Escrow service for secure transactions.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `payment_id` | `UUID` | `UNIQUE, FK → payments.id` | `NULL` |
| `buyer_id` | `UUID` | `NOT NULL, FK → users.id` | — |
| `seller_id` | `UUID` | `NOT NULL, FK → users.id` | — |
| `listing_id` | `UUID` | `NOT NULL, FK → listings.id` | — |
| `amount` | `DECIMAL(12,2)` | `NOT NULL` | — |
| `currency` | `VARCHAR` | `NOT NULL` | `'USD'` |
| `platform_fee` | `DECIMAL(12,2)` | `NOT NULL` | — |
| `net_amount` | `DECIMAL(12,2)` | `NOT NULL` | — |
| `status` | `EscrowStatus` | `NOT NULL` | `PENDING_DEPOSIT` |
| `buyer_confirmed` | `BOOLEAN` | `NOT NULL` | `false` |
| `seller_confirmed` | `BOOLEAN` | `NOT NULL` | `false` |
| `released_at` | `TIMESTAMPTZ` | | `NULL` |
| `is_disputed` | `BOOLEAN` | `NOT NULL` | `false` |
| `disputed_at` | `TIMESTAMPTZ` | | `NULL` |
| `dispute_reason` | `TEXT` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 9. `conversations`

Chat conversations.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `listing_id` | `UUID` | | `NULL` |
| `title` | `VARCHAR` | | `NULL` |
| `is_group` | `BOOLEAN` | `NOT NULL` | `false` |
| `last_message_at` | `TIMESTAMPTZ` | | `NULL` |
| `message_count` | `INT` | `NOT NULL` | `0` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 10. `conversation_participants`

Junction table for users in conversations.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `conversation_id` | `UUID` | `NOT NULL, FK → conversations.id ON DELETE CASCADE` | — |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `is_admin` | `BOOLEAN` | `NOT NULL` | `false` |
| `last_read_at` | `TIMESTAMPTZ` | | `NULL` |
| `unread_count` | `INT` | `NOT NULL` | `0` |
| `joined_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

**Unique constraint:** `(conversation_id, user_id)`

---

### 11. `messages`

Individual messages within conversations.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `conversation_id` | `UUID` | `NOT NULL, FK → conversations.id ON DELETE CASCADE` | — |
| `sender_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `type` | `MessageType` | `NOT NULL` | `TEXT` |
| `content` | `TEXT` | | `NULL` |
| `media_url` | `VARCHAR` | | `NULL` |
| `is_read` | `BOOLEAN` | `NOT NULL` | `false` |
| `read_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 12. `message_deletions`

Tracks which users have soft-deleted which messages.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `message_id` | `UUID` | `PK (composite), FK → messages.id ON DELETE CASCADE` | — |
| `user_id` | `UUID` | `PK (composite), FK → users.id ON DELETE CASCADE` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 13. `notifications`

User notifications.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `type` | `NotificationType` | `NOT NULL` | — |
| `title` | `VARCHAR` | `NOT NULL` | — |
| `body` | `TEXT` | `NOT NULL` | — |
| `data` | `JSONB` | | `NULL` |
| `is_read` | `BOOLEAN` | `NOT NULL` | `false` |
| `read_at` | `TIMESTAMPTZ` | | `NULL` |
| `action_url` | `VARCHAR` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 14. `reviews`

User reviews for listings and sellers.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `reviewer_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `reviewee_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `listing_id` | `UUID` | `FK → listings.id` | `NULL` |
| `overall_rating` | `INT` | `NOT NULL` | — |
| `communication_rating` | `INT` | | `NULL` |
| `accuracy_rating` | `INT` | | `NULL` |
| `value_rating` | `INT` | | `NULL` |
| `title` | `VARCHAR` | | `NULL` |
| `comment` | `TEXT` | | `NULL` |
| `is_verified` | `BOOLEAN` | `NOT NULL` | `false` |
| `helpful_count` | `INT` | `NOT NULL` | `0` |
| `response` | `TEXT` | | `NULL` |
| `responded_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 15. `favorites`

User favorites/bookmarks.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `listing_id` | `UUID` | `NOT NULL, FK → listings.id ON DELETE CASCADE` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

**Unique constraint:** `(user_id, listing_id)`

---

### 16. `saved_searches`

User saved search filters.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `name` | `VARCHAR` | | `NULL` |
| `type` | `VARCHAR` | | `NULL` |
| `city` | `VARCHAR` | | `NULL` |
| `min_price` | `DECIMAL(12,2)` | | `NULL` |
| `max_price` | `DECIMAL(12,2)` | | `NULL` |
| `bedrooms` | `INT` | | `NULL` |
| `property_type` | `VARCHAR` | | `NULL` |
| `vehicle_type` | `VARCHAR` | | `NULL` |
| `make` | `VARCHAR` | | `NULL` |
| `alert_enabled` | `BOOLEAN` | `NOT NULL` | `true` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 17. `identity_verifications`

KYC/identity verification records.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `UNIQUE, NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `document_type` | `DocumentType` | `NOT NULL` | — |
| `document_number` | `VARCHAR` | | `NULL` |
| `document_image` | `VARCHAR` | | `NULL` |
| `selfie_image` | `VARCHAR` | | `NULL` |
| `business_license` | `VARCHAR` | | `NULL` |
| `status` | `VerificationStatus` | `NOT NULL` | `PENDING` |
| `submitted_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `reviewed_at` | `TIMESTAMPTZ` | | `NULL` |
| `rejection_reason` | `TEXT` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 18. `verification_codes`

OTP / email / phone verification codes.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `code` | `VARCHAR` | `NOT NULL` | — |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 19. `password_reset_tokens`

Password reset tokens.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `token` | `VARCHAR` | `UNIQUE, NOT NULL` | — |
| `user_id` | `UUID` | `NOT NULL, FK → users.id ON DELETE CASCADE` | — |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 20. `reports`

User-submitted reports (abuse, fraud, etc).

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `reporter_id` | `UUID` | `NOT NULL, FK → users.id` | — |
| `reported_id` | `UUID` | `FK → users.id` | `NULL` |
| `listing_id` | `UUID` | `FK → listings.id` | `NULL` |
| `type` | `VARCHAR` | `NOT NULL` | — |
| `description` | `TEXT` | `NOT NULL` | — |
| `status` | `VARCHAR` | `NOT NULL` | `'SUBMITTED'` |
| `resolution` | `TEXT` | | `NULL` |
| `resolved_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 21. `permissions`

RBAC permission definitions.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `name` | `VARCHAR` | `UNIQUE, NOT NULL` | — |
| `description` | `TEXT` | | `NULL` |
| `group` | `VARCHAR` | `NOT NULL` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 22. `role_permissions`

Maps roles to permissions (M:N).

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `role` | `UserRole` | `NOT NULL` | — |
| `permission_id` | `UUID` | `NOT NULL, FK → permissions.id ON DELETE CASCADE` | — |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

**Unique constraint:** `(role, permission_id)`

---

### 23. `admin_actions`

Audit trail for admin operations.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `actor_id` | `UUID` | `NOT NULL, FK → users.id` | — |
| `target_user_id` | `UUID` | `FK → users.id` | `NULL` |
| `target_listing_id` | `UUID` | | `NULL` |
| `action_type` | `VARCHAR` | `NOT NULL` | — |
| `reason` | `TEXT` | | `NULL` |
| `details` | `JSONB` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 24. `announcements`

Platform-wide announcements.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `title` | `VARCHAR` | `NOT NULL` | — |
| `content` | `TEXT` | `NOT NULL` | — |
| `type` | `VARCHAR` | `NOT NULL` | `'INFO'` |
| `is_active` | `BOOLEAN` | `NOT NULL` | `true` |
| `starts_at` | `TIMESTAMPTZ` | | `NULL` |
| `expires_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 25. `audit_logs`

General-purpose audit log.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `user_id` | `UUID` | `FK → users.id` | `NULL` |
| `action` | `VARCHAR` | `NOT NULL` | — |
| `entity_type` | `VARCHAR` | `NOT NULL` | — |
| `entity_id` | `UUID` | | `NULL` |
| `old_values` | `JSONB` | | `NULL` |
| `new_values` | `JSONB` | | `NULL` |
| `ip_address` | `VARCHAR` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 26. `contact_messages`

Contact form submissions.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `name` | `VARCHAR` | `NOT NULL` | — |
| `email` | `VARCHAR` | `NOT NULL` | — |
| `phone` | `VARCHAR` | | `NULL` |
| `subject` | `VARCHAR` | `NOT NULL` | — |
| `message` | `TEXT` | `NOT NULL` | — |
| `status` | `VARCHAR` | `NOT NULL` | `'NEW'` |
| `response` | `TEXT` | | `NULL` |
| `responded_at` | `TIMESTAMPTZ` | | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

### 27. `faqs`

Frequently asked questions.

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | `UUID` | `PRIMARY KEY` | `gen_random_uuid()` |
| `category` | `VARCHAR` | `NOT NULL` | — |
| `question` | `VARCHAR` | `NOT NULL` | — |
| `answer` | `TEXT` | `NOT NULL` | — |
| `order` | `INT` | `NOT NULL` | `0` |
| `is_active` | `BOOLEAN` | `NOT NULL` | `true` |
| `language` | `VARCHAR` | `NOT NULL` | `'so'` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `now()` |

---

## Relationships

```
users (1) ──────── (1) profiles
users (1) ──────── (1) identity_verifications
users (1) ──────── (1) password_reset_tokens
users (1) ────< (N) verification_codes
users (1) ────< (N) listings
users (1) ────< (N) favorites
users (1) ────< (N) saved_searches
users (1) ────< (N) messages (as sender)
users (1) ────< (N) notifications
users (1) ────< (N) payments (as payer)
users (1) ────< (N) payments (as recipient)
users (1) ────< (N) escrows (as buyer)
users (1) ────< (N) escrows (as seller)
users (1) ────< (N) reviews (as reviewer)
users (1) ────< (N) reviews (as reviewee)
users (1) ────< (N) reports (as reporter)
users (1) ────< (N) reports (as reported)
users (1) ────< (N) admin_actions (as actor)
users (1) ────< (N) admin_actions (as target)
users (M) ────< (N) conversations  [via conversation_participants]

listings (1) ──── (1) properties
listings (1) ──── (1) vehicles
listings (1) ────< (N) listing_images
listings (1) ────< (N) favorites
listings (1) ────< (N) payments
listings (1) ────< (N) escrows
listings (1) ────< (N) reviews
listings (1) ────< (N) reports

conversations (1) ────< (N) messages
conversations (M) ────< (N) users  [via conversation_participants]

messages (1) ────< (N) message_deletions

permissions (M) ────< (N) roles  [via role_permissions]

payments (1) ──── (1) escrows
```

---

## Constraints & Indexes

### Primary Keys

All tables use `UUID` primary keys generated via `gen_random_uuid()`.

| Table | PK Column |
|-------|-----------|
| `users` | `id` |
| `profiles` | `id` |
| `listings` | `id` |
| `properties` | `id` |
| `vehicles` | `id` |
| `listing_images` | `id` |
| `payments` | `id` |
| `escrows` | `id` |
| `conversations` | `id` |
| `conversation_participants` | `id` |
| `messages` | `id` |
| `notifications` | `id` |
| `reviews` | `id` |
| `favorites` | `id` |
| `saved_searches` | `id` |
| `identity_verifications` | `id` |
| `verification_codes` | `id` |
| `password_reset_tokens` | `id` |
| `reports` | `id` |
| `permissions` | `id` |
| `role_permissions` | `id` |
| `admin_actions` | `id` |
| `announcements` | `id` |
| `audit_logs` | `id` |
| `contact_messages` | `id` |
| `faqs` | `id` |

### Composite Primary Keys

| Table | Columns |
|-------|---------|
| `message_deletions` | `(message_id, user_id)` |

### Unique Constraints

| Table | Columns |
|-------|---------|
| `users` | `email`, `phone`, `google_id`, `username` |
| `profiles` | `user_id` |
| `listings` | `slug` |
| `properties` | `listing_id` |
| `vehicles` | `listing_id` |
| `payments` | `escrow_id` |
| `escrows` | `payment_id` |
| `conversation_participants` | `(conversation_id, user_id)` |
| `favorites` | `(user_id, listing_id)` |
| `identity_verifications` | `user_id` |
| `permissions` | `name` |
| `role_permissions` | `(role, permission_id)` |
| `password_reset_tokens` | `token` |

### Foreign Key Constraints

| Table | Column | References | On Delete |
|-------|--------|------------|-----------|
| `profiles` | `user_id` | `users.id` | CASCADE |
| `listings` | `user_id` | `users.id` | CASCADE |
| `properties` | `listing_id` | `listings.id` | CASCADE |
| `vehicles` | `listing_id` | `listings.id` | CASCADE |
| `listing_images` | `listing_id` | `listings.id` | CASCADE |
| `favorites` | `user_id` | `users.id` | CASCADE |
| `favorites` | `listing_id` | `listings.id` | CASCADE |
| `payments` | `user_id` | `users.id` | — |
| `payments` | `recipient_id` | `users.id` | — |
| `payments` | `listing_id` | `listings.id` | — |
| `payments` | `escrow_id` | `escrows.id` | — |
| `escrows` | `buyer_id` | `users.id` | — |
| `escrows` | `seller_id` | `users.id` | — |
| `escrows` | `listing_id` | `listings.id` | — |
| `escrows` | `payment_id` | `payments.id` | — |
| `conversations` | `listing_id` | `listings.id` | — |
| `conversation_participants` | `conversation_id` | `conversations.id` | CASCADE |
| `conversation_participants` | `user_id` | `users.id` | CASCADE |
| `messages` | `conversation_id` | `conversations.id` | CASCADE |
| `messages` | `sender_id` | `users.id` | CASCADE |
| `message_deletions` | `message_id` | `messages.id` | CASCADE |
| `message_deletions` | `user_id` | `users.id` | CASCADE |
| `notifications` | `user_id` | `users.id` | CASCADE |
| `reviews` | `reviewer_id` | `users.id` | CASCADE |
| `reviews` | `reviewee_id` | `users.id` | CASCADE |
| `reviews` | `listing_id` | `listings.id` | — |
| `saved_searches` | `user_id` | `users.id` | CASCADE |
| `identity_verifications` | `user_id` | `users.id` | CASCADE |
| `verification_codes` | `user_id` | `users.id` | CASCADE |
| `password_reset_tokens` | `user_id` | `users.id` | CASCADE |
| `reports` | `reporter_id` | `users.id` | — |
| `reports` | `reported_id` | `users.id` | — |
| `reports` | `listing_id` | `listings.id` | — |
| `role_permissions` | `permission_id` | `permissions.id` | CASCADE |
| `admin_actions` | `actor_id` | `users.id` | — |
| `admin_actions` | `target_user_id` | `users.id` | — |

### Database Indexes

| Table | Column(s) | Type |
|-------|-----------|------|
| `users` | `email` | BTREE |
| `users` | `phone` | BTREE |
| `users` | `role` | BTREE |
| `users` | `status` | BTREE |
| `listings` | `city` | BTREE |
| `listings` | `created_at` | BTREE |
| `listings` | `is_verified` | BTREE |
| `listings` | `price` | BTREE |
| `listings` | `status` | BTREE |
| `listings` | `type` | BTREE |
| `listings` | `user_id` | BTREE |
| `properties` | `property_type` | BTREE |
| `vehicles` | `make` | BTREE |
| `vehicles` | `vehicle_type` | BTREE |
| `vehicles` | `year` | BTREE |
| `listing_images` | `listing_id` | BTREE |
| `payments` | `created_at` | BTREE |
| `payments` | `status` | BTREE |
| `payments` | `user_id` | BTREE |
| `escrows` | `buyer_id` | BTREE |
| `escrows` | `seller_id` | BTREE |
| `escrows` | `status` | BTREE |
| `conversations` | `last_message_at` | BTREE |
| `messages` | `conversation_id` | BTREE |
| `messages` | `created_at` | BTREE |
| `messages` | `sender_id` | BTREE |
| `notifications` | `created_at` | BTREE |
| `notifications` | `is_read` | BTREE |
| `notifications` | `user_id` | BTREE |
| `reviews` | `listing_id` | BTREE |
| `reviews` | `reviewee_id` | BTREE |
| `saved_searches` | `user_id` | BTREE |
| `identity_verifications` | `status` | BTREE |
| `verification_codes` | `user_id` | BTREE |
| `password_reset_tokens` | `user_id` | BTREE |
| `reports` | `status` | BTREE |
| `permissions` | `group` | BTREE |
| `role_permissions` | `role` | BTREE |
| `admin_actions` | `action_type` | BTREE |
| `admin_actions` | `created_at` | BTREE |
| `announcements` | `expires_at` | BTREE |
| `announcements` | `is_active` | BTREE |
| `audit_logs` | `created_at` | BTREE |
| `audit_logs` | `(entity_type, entity_id)` | BTREE |
| `audit_logs` | `user_id` | BTREE |
| `contact_messages` | `status` | BTREE |
| `faqs` | `category` | BTREE |
| `faqs` | `language` | BTREE |

---

## Complete SQL Script

```sql
-- ============================================================
-- DALAAL DATABASE SCHEMA
-- PostgreSQL — Generated from Prisma schema
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM (
  'SUPER_ADMIN', 'BROKER', 'PROPERTY_OWNER', 'VEHICLE_OWNER', 'CUSTOMER'
);

CREATE TYPE "UserStatus" AS ENUM (
  'ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION', 'INACTIVE'
);

CREATE TYPE "ListingType" AS ENUM ('PROPERTY', 'VEHICLE');

CREATE TYPE "ListingStatus" AS ENUM (
  'DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'FEATURED', 'EXPIRED', 'REJECTED', 'ARCHIVED'
);

CREATE TYPE "PropertyType" AS ENUM (
  'HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'VILLA', 'TOWNHOUSE', 'OFFICE'
);

CREATE TYPE "VehicleType" AS ENUM (
  'CAR', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'SUV', 'PICKUP'
);

CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

CREATE TYPE "Transmission" AS ENUM ('MANUAL', 'AUTOMATIC');

CREATE TYPE "PaymentProvider" AS ENUM ('EVC_PLUS', 'ZAAD', 'SAHAL', 'CASH');

CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

CREATE TYPE "PaymentType" AS ENUM (
  'LISTING_FEE', 'PREMIUM_FEATURE', 'ESCROW_DEPOSIT', 'ESCROW_RELEASE', 'COMMISSION'
);

CREATE TYPE "EscrowStatus" AS ENUM (
  'PENDING_DEPOSIT', 'HOLDING', 'RELEASED', 'DISPUTED', 'REFUNDED'
);

CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT', 'LISTING_SHARE', 'SYSTEM');

CREATE TYPE "NotificationType" AS ENUM (
  'NEW_LISTING', 'PRICE_DROP', 'NEW_MESSAGE', 'LISTING_VERIFIED',
  'PAYMENT_RECEIVED', 'ESCROW_RELEASED', 'REVIEW_RECEIVED',
  'ACCOUNT_VERIFIED', 'WELCOME', 'SYSTEM_ANNOUNCEMENT'
);

CREATE TYPE "DocumentType" AS ENUM (
  'NATIONAL_ID', 'PASSPORT', 'BUSINESS_LICENSE', 'TITLE_DEED', 'DRIVERS_LICENSE'
);

CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');


-- ── Tables ───────────────────────────────────────────────────

-- 1. users
CREATE TABLE "users" (
  "id"                UUID          NOT NULL DEFAULT gen_random_uuid(),
  "email"             VARCHAR       NOT NULL,
  "phone"             VARCHAR,
  "password"          VARCHAR,
  "google_id"         VARCHAR,
  "username"          VARCHAR,
  "role"              "UserRole"    NOT NULL DEFAULT 'CUSTOMER',
  "status"            "UserStatus"  NOT NULL DEFAULT 'PENDING_VERIFICATION',
  "email_verified"    BOOLEAN       NOT NULL DEFAULT false,
  "phone_verified"    BOOLEAN       NOT NULL DEFAULT false,
  "two_factor_enabled" BOOLEAN      NOT NULL DEFAULT false,
  "session_token"     VARCHAR,
  "last_seen_at"      TIMESTAMPTZ,
  "is_online"         BOOLEAN       NOT NULL DEFAULT false,
  "last_login_at"     TIMESTAMPTZ,
  "created_at"        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  "updated_at"        TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT "users_pkey"             PRIMARY KEY ("id"),
  CONSTRAINT "users_email_key"        UNIQUE ("email"),
  CONSTRAINT "users_phone_key"        UNIQUE ("phone"),
  CONSTRAINT "users_google_id_key"    UNIQUE ("google_id"),
  CONSTRAINT "users_username_key"     UNIQUE ("username")
);

CREATE INDEX "idx_users_email"    ON "users"("email");
CREATE INDEX "idx_users_phone"    ON "users"("phone");
CREATE INDEX "idx_users_role"     ON "users"("role");
CREATE INDEX "idx_users_status"   ON "users"("status");


-- 2. profiles
CREATE TABLE "profiles" (
  "id"               UUID          NOT NULL DEFAULT gen_random_uuid(),
  "user_id"          UUID          NOT NULL,
  "first_name"       VARCHAR,
  "last_name"        VARCHAR,
  "avatar"           VARCHAR,
  "bio"              TEXT,
  "city"             VARCHAR       DEFAULT 'Mogadishu',
  "country"          VARCHAR       DEFAULT 'SO',
  "is_diaspora"      BOOLEAN       NOT NULL DEFAULT false,
  "currency"         VARCHAR       DEFAULT 'USD',
  "language"         VARCHAR       DEFAULT 'so',
  "whatsapp_number"  VARCHAR,
  "telegram_handle"  VARCHAR,
  "total_listings"   INT           NOT NULL DEFAULT 0,
  "rating"           DOUBLE PRECISION DEFAULT 0,
  "review_count"     INT           NOT NULL DEFAULT 0,
  "response_rate"    DOUBLE PRECISION DEFAULT 0,
  "created_at"       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  "updated_at"       TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT "profiles_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_profiles_city" ON "profiles"("city");


-- 3. listings
CREATE TABLE "listings" (
  "id"               UUID            NOT NULL DEFAULT gen_random_uuid(),
  "user_id"          UUID            NOT NULL,
  "type"             "ListingType"   NOT NULL,
  "title"            VARCHAR         NOT NULL,
  "slug"             VARCHAR         NOT NULL,
  "description"      TEXT,
  "price"            DECIMAL(12,2)   NOT NULL,
  "price_negotiable" BOOLEAN         NOT NULL DEFAULT false,
  "currency"         VARCHAR         NOT NULL DEFAULT 'USD',
  "city"             VARCHAR         NOT NULL,
  "district"         VARCHAR,
  "address"          TEXT,
  "latitude"         DOUBLE PRECISION,
  "longitude"        DOUBLE PRECISION,
  "status"           "ListingStatus" NOT NULL DEFAULT 'DRAFT',
  "is_verified"      BOOLEAN         NOT NULL DEFAULT false,
  "is_featured"      BOOLEAN         NOT NULL DEFAULT false,
  "view_count"       INT             NOT NULL DEFAULT 0,
  "favorite_count"   INT             NOT NULL DEFAULT 0,
  "inquiry_count"    INT             NOT NULL DEFAULT 0,
  "featured_image"   VARCHAR,
  "video_url"        VARCHAR,
  "available_from"   TIMESTAMPTZ,
  "expires_at"       TIMESTAMPTZ,
  "published_at"     TIMESTAMPTZ,
  "created_at"       TIMESTAMPTZ     NOT NULL DEFAULT now(),
  "updated_at"       TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT "listings_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "listings_slug_key" UNIQUE ("slug"),
  CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_listings_city"        ON "listings"("city");
CREATE INDEX "idx_listings_created_at"  ON "listings"("created_at");
CREATE INDEX "idx_listings_is_verified" ON "listings"("is_verified");
CREATE INDEX "idx_listings_price"       ON "listings"("price");
CREATE INDEX "idx_listings_status"      ON "listings"("status");
CREATE INDEX "idx_listings_type"        ON "listings"("type");
CREATE INDEX "idx_listings_user_id"     ON "listings"("user_id");


-- 4. properties
CREATE TABLE "properties" (
  "id"              UUID          NOT NULL DEFAULT gen_random_uuid(),
  "listing_id"      UUID          NOT NULL,
  "property_type"   "PropertyType" NOT NULL,
  "bedrooms"        INT,
  "bathrooms"       INT,
  "square_meters"   DOUBLE PRECISION,
  "year_built"      INT,
  "furnished"       BOOLEAN       NOT NULL DEFAULT false,
  "parking"         BOOLEAN       NOT NULL DEFAULT false,
  "garden"          BOOLEAN       NOT NULL DEFAULT false,
  "security"        BOOLEAN       NOT NULL DEFAULT false,
  "water"           BOOLEAN       NOT NULL DEFAULT true,
  "electricity"     BOOLEAN       NOT NULL DEFAULT true,
  "property_status" VARCHAR       DEFAULT 'FOR_SALE',
  "deposit_months"  INT,
  "min_lease_months" INT,

  CONSTRAINT "properties_pkey"         PRIMARY KEY ("id"),
  CONSTRAINT "properties_listing_id_key" UNIQUE ("listing_id"),
  CONSTRAINT "properties_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_properties_property_type" ON "properties"("property_type");


-- 5. vehicles
CREATE TABLE "vehicles" (
  "id"               UUID          NOT NULL DEFAULT gen_random_uuid(),
  "listing_id"       UUID          NOT NULL,
  "vehicle_type"     "VehicleType" NOT NULL,
  "make"             VARCHAR       NOT NULL,
  "model"            VARCHAR       NOT NULL,
  "year"             INT           NOT NULL,
  "mileage"          INT,
  "condition"        VARCHAR       DEFAULT 'GOOD',
  "fuel_type"        "FuelType",
  "transmission"     "Transmission",
  "color"            VARCHAR,
  "seats"            INT,
  "vehicle_status"   VARCHAR       DEFAULT 'FOR_SALE',
  "min_rental_days"  INT,
  "deposit_required" BOOLEAN       NOT NULL DEFAULT false,

  CONSTRAINT "vehicles_pkey"         PRIMARY KEY ("id"),
  CONSTRAINT "vehicles_listing_id_key" UNIQUE ("listing_id"),
  CONSTRAINT "vehicles_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_vehicles_make"         ON "vehicles"("make");
CREATE INDEX "idx_vehicles_vehicle_type" ON "vehicles"("vehicle_type");
CREATE INDEX "idx_vehicles_year"         ON "vehicles"("year");


-- 6. listing_images
CREATE TABLE "listing_images" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "listing_id"  UUID        NOT NULL,
  "url"         VARCHAR     NOT NULL,
  "thumbnail"   VARCHAR,
  "order"       INT         NOT NULL DEFAULT 0,
  "is_primary"  BOOLEAN     NOT NULL DEFAULT false,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "listing_images_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "listing_images_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_listing_images_listing_id" ON "listing_images"("listing_id");


-- 7. payments
CREATE TABLE "payments" (
  "id"             UUID              NOT NULL DEFAULT gen_random_uuid(),
  "user_id"        UUID              NOT NULL,
  "recipient_id"   UUID,
  "listing_id"     UUID,
  "escrow_id"      UUID,
  "amount"         DECIMAL(12,2)     NOT NULL,
  "currency"       VARCHAR           NOT NULL DEFAULT 'USD',
  "provider"       "PaymentProvider" NOT NULL,
  "provider_ref"   VARCHAR,
  "type"           "PaymentType"     NOT NULL,
  "status"         "PaymentStatus"   NOT NULL DEFAULT 'PENDING',
  "description"    TEXT,
  "failure_reason" TEXT,
  "completed_at"   TIMESTAMPTZ,
  "created_at"     TIMESTAMPTZ       NOT NULL DEFAULT now(),
  "updated_at"     TIMESTAMPTZ       NOT NULL DEFAULT now(),

  CONSTRAINT "payments_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "payments_escrow_id_key" UNIQUE ("escrow_id"),
  CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "payments_recipient_id_fkey" FOREIGN KEY ("recipient_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "payments_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON UPDATE CASCADE,
  CONSTRAINT "payments_escrow_id_fkey" FOREIGN KEY ("escrow_id")
    REFERENCES "escrows"("id") ON UPDATE CASCADE
);

CREATE INDEX "idx_payments_created_at" ON "payments"("created_at");
CREATE INDEX "idx_payments_status"     ON "payments"("status");
CREATE INDEX "idx_payments_user_id"    ON "payments"("user_id");


-- 8. escrows
CREATE TABLE "escrows" (
  "id"               UUID            NOT NULL DEFAULT gen_random_uuid(),
  "payment_id"       UUID,
  "buyer_id"         UUID            NOT NULL,
  "seller_id"        UUID            NOT NULL,
  "listing_id"       UUID            NOT NULL,
  "amount"           DECIMAL(12,2)   NOT NULL,
  "currency"         VARCHAR         NOT NULL DEFAULT 'USD',
  "platform_fee"     DECIMAL(12,2)   NOT NULL,
  "net_amount"       DECIMAL(12,2)   NOT NULL,
  "status"           "EscrowStatus"  NOT NULL DEFAULT 'PENDING_DEPOSIT',
  "buyer_confirmed"  BOOLEAN         NOT NULL DEFAULT false,
  "seller_confirmed" BOOLEAN         NOT NULL DEFAULT false,
  "released_at"      TIMESTAMPTZ,
  "is_disputed"      BOOLEAN         NOT NULL DEFAULT false,
  "disputed_at"      TIMESTAMPTZ,
  "dispute_reason"   TEXT,
  "created_at"       TIMESTAMPTZ     NOT NULL DEFAULT now(),
  "updated_at"       TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT "escrows_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "escrows_payment_id_key" UNIQUE ("payment_id"),
  CONSTRAINT "escrows_buyer_id_fkey" FOREIGN KEY ("buyer_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "escrows_seller_id_fkey" FOREIGN KEY ("seller_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "escrows_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON UPDATE CASCADE,
  CONSTRAINT "escrows_payment_id_fkey" FOREIGN KEY ("payment_id")
    REFERENCES "payments"("id") ON UPDATE CASCADE
);

CREATE INDEX "idx_escrows_buyer_id"  ON "escrows"("buyer_id");
CREATE INDEX "idx_escrows_seller_id" ON "escrows"("seller_id");
CREATE INDEX "idx_escrows_status"    ON "escrows"("status");


-- 9. conversations
CREATE TABLE "conversations" (
  "id"               UUID        NOT NULL DEFAULT gen_random_uuid(),
  "listing_id"       UUID,
  "title"            VARCHAR,
  "is_group"         BOOLEAN     NOT NULL DEFAULT false,
  "last_message_at"  TIMESTAMPTZ,
  "message_count"    INT         NOT NULL DEFAULT 0,
  "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_conversations_last_message_at" ON "conversations"("last_message_at");


-- 10. conversation_participants
CREATE TABLE "conversation_participants" (
  "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
  "conversation_id" UUID        NOT NULL,
  "user_id"         UUID        NOT NULL,
  "is_admin"        BOOLEAN     NOT NULL DEFAULT false,
  "last_read_at"    TIMESTAMPTZ,
  "unread_count"    INT         NOT NULL DEFAULT 0,
  "joined_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "conversation_participants_conversation_id_user_id_key"
    UNIQUE ("conversation_id", "user_id"),
  CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id")
    REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- 11. messages
CREATE TABLE "messages" (
  "id"              UUID          NOT NULL DEFAULT gen_random_uuid(),
  "conversation_id" UUID          NOT NULL,
  "sender_id"       UUID          NOT NULL,
  "type"            "MessageType" NOT NULL DEFAULT 'TEXT',
  "content"         TEXT,
  "media_url"       VARCHAR,
  "is_read"         BOOLEAN       NOT NULL DEFAULT false,
  "read_at"         TIMESTAMPTZ,
  "created_at"      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  "updated_at"      TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT "messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id")
    REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_messages_conversation_id" ON "messages"("conversation_id");
CREATE INDEX "idx_messages_created_at"     ON "messages"("created_at");
CREATE INDEX "idx_messages_sender_id"      ON "messages"("sender_id");


-- 12. message_deletions
CREATE TABLE "message_deletions" (
  "message_id" UUID        NOT NULL,
  "user_id"    UUID        NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "message_deletions_pkey" PRIMARY KEY ("message_id", "user_id"),
  CONSTRAINT "message_deletions_message_id_fkey" FOREIGN KEY ("message_id")
    REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "message_deletions_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- 13. notifications
CREATE TABLE "notifications" (
  "id"         UUID                NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    UUID                NOT NULL,
  "type"       "NotificationType"  NOT NULL,
  "title"      VARCHAR             NOT NULL,
  "body"       TEXT                NOT NULL,
  "data"       JSONB,
  "is_read"    BOOLEAN             NOT NULL DEFAULT false,
  "read_at"    TIMESTAMPTZ,
  "action_url" VARCHAR,
  "created_at" TIMESTAMPTZ         NOT NULL DEFAULT now(),

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_notifications_created_at" ON "notifications"("created_at");
CREATE INDEX "idx_notifications_is_read"    ON "notifications"("is_read");
CREATE INDEX "idx_notifications_user_id"    ON "notifications"("user_id");


-- 14. reviews
CREATE TABLE "reviews" (
  "id"                   UUID        NOT NULL DEFAULT gen_random_uuid(),
  "reviewer_id"          UUID        NOT NULL,
  "reviewee_id"          UUID        NOT NULL,
  "listing_id"           UUID,
  "overall_rating"       INT         NOT NULL,
  "communication_rating" INT,
  "accuracy_rating"      INT,
  "value_rating"         INT,
  "title"                VARCHAR,
  "comment"              TEXT,
  "is_verified"          BOOLEAN     NOT NULL DEFAULT false,
  "helpful_count"        INT         NOT NULL DEFAULT 0,
  "response"             TEXT,
  "responded_at"         TIMESTAMPTZ,
  "created_at"           TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"           TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "reviews_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON UPDATE CASCADE
);

CREATE INDEX "idx_reviews_listing_id"  ON "reviews"("listing_id");
CREATE INDEX "idx_reviews_reviewee_id" ON "reviews"("reviewee_id");


-- 15. favorites
CREATE TABLE "favorites" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID        NOT NULL,
  "listing_id"  UUID        NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "favorites_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "favorites_user_id_listing_id_key" UNIQUE ("user_id", "listing_id"),
  CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


-- 16. saved_searches
CREATE TABLE "saved_searches" (
  "id"            UUID            NOT NULL DEFAULT gen_random_uuid(),
  "user_id"       UUID            NOT NULL,
  "name"          VARCHAR,
  "type"          VARCHAR,
  "city"          VARCHAR,
  "min_price"     DECIMAL(12,2),
  "max_price"     DECIMAL(12,2),
  "bedrooms"      INT,
  "property_type" VARCHAR,
  "vehicle_type"  VARCHAR,
  "make"          VARCHAR,
  "alert_enabled" BOOLEAN         NOT NULL DEFAULT true,
  "created_at"    TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "saved_searches_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_saved_searches_user_id" ON "saved_searches"("user_id");


-- 17. identity_verifications
CREATE TABLE "identity_verifications" (
  "id"               UUID                  NOT NULL DEFAULT gen_random_uuid(),
  "user_id"          UUID                  NOT NULL,
  "document_type"    "DocumentType"        NOT NULL,
  "document_number"  VARCHAR,
  "document_image"   VARCHAR,
  "selfie_image"     VARCHAR,
  "business_license" VARCHAR,
  "status"           "VerificationStatus"  NOT NULL DEFAULT 'PENDING',
  "submitted_at"     TIMESTAMPTZ           NOT NULL DEFAULT now(),
  "reviewed_at"      TIMESTAMPTZ,
  "rejection_reason" TEXT,
  "created_at"       TIMESTAMPTZ           NOT NULL DEFAULT now(),
  "updated_at"       TIMESTAMPTZ           NOT NULL DEFAULT now(),

  CONSTRAINT "identity_verifications_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "identity_verifications_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "identity_verifications_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_identity_verifications_status" ON "identity_verifications"("status");


-- 18. verification_codes
CREATE TABLE "verification_codes" (
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "code"       VARCHAR     NOT NULL,
  "user_id"    UUID        NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "verification_codes_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_verification_codes_user_id" ON "verification_codes"("user_id");


-- 19. password_reset_tokens
CREATE TABLE "password_reset_tokens" (
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "token"      VARCHAR     NOT NULL,
  "user_id"    UUID        NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "password_reset_tokens_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "password_reset_tokens_token_key" UNIQUE ("token"),
  CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_password_reset_tokens_user_id" ON "password_reset_tokens"("user_id");


-- 20. reports
CREATE TABLE "reports" (
  "id"           UUID        NOT NULL DEFAULT gen_random_uuid(),
  "reporter_id"  UUID        NOT NULL,
  "reported_id"  UUID,
  "listing_id"   UUID,
  "type"         VARCHAR     NOT NULL,
  "description"  TEXT        NOT NULL,
  "status"       VARCHAR     NOT NULL DEFAULT 'SUBMITTED',
  "resolution"   TEXT,
  "resolved_at"  TIMESTAMPTZ,
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "reports_reported_id_fkey" FOREIGN KEY ("reported_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "reports_listing_id_fkey" FOREIGN KEY ("listing_id")
    REFERENCES "listings"("id") ON UPDATE CASCADE
);

CREATE INDEX "idx_reports_status" ON "reports"("status");


-- 21. permissions
CREATE TABLE "permissions" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "name"        VARCHAR     NOT NULL,
  "description" TEXT,
  "group"       VARCHAR     NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "permissions_pkey"     PRIMARY KEY ("id"),
  CONSTRAINT "permissions_name_key" UNIQUE ("name")
);

CREATE INDEX "idx_permissions_group" ON "permissions"("group");


-- 22. role_permissions
CREATE TABLE "role_permissions" (
  "id"            UUID        NOT NULL DEFAULT gen_random_uuid(),
  "role"          "UserRole"  NOT NULL,
  "permission_id" UUID        NOT NULL,
  "created_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "role_permissions_role_permission_id_key" UNIQUE ("role", "permission_id"),
  CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id")
    REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_role_permissions_role" ON "role_permissions"("role");


-- 23. admin_actions
CREATE TABLE "admin_actions" (
  "id"                UUID        NOT NULL DEFAULT gen_random_uuid(),
  "actor_id"          UUID        NOT NULL,
  "target_user_id"    UUID,
  "target_listing_id" UUID,
  "action_type"       VARCHAR     NOT NULL,
  "reason"            TEXT,
  "details"           JSONB,
  "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "admin_actions_actor_id_fkey" FOREIGN KEY ("actor_id")
    REFERENCES "users"("id") ON UPDATE CASCADE,
  CONSTRAINT "admin_actions_target_user_id_fkey" FOREIGN KEY ("target_user_id")
    REFERENCES "users"("id") ON UPDATE CASCADE
);

CREATE INDEX "idx_admin_actions_action_type" ON "admin_actions"("action_type");
CREATE INDEX "idx_admin_actions_created_at"  ON "admin_actions"("created_at");


-- 24. announcements
CREATE TABLE "announcements" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "title"       VARCHAR     NOT NULL,
  "content"     TEXT        NOT NULL,
  "type"        VARCHAR     NOT NULL DEFAULT 'INFO',
  "is_active"   BOOLEAN     NOT NULL DEFAULT true,
  "starts_at"   TIMESTAMPTZ,
  "expires_at"  TIMESTAMPTZ,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_announcements_expires_at" ON "announcements"("expires_at");
CREATE INDEX "idx_announcements_is_active"  ON "announcements"("is_active");


-- 25. audit_logs
CREATE TABLE "audit_logs" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID,
  "action"      VARCHAR     NOT NULL,
  "entity_type" VARCHAR     NOT NULL,
  "entity_id"   UUID,
  "old_values"  JSONB,
  "new_values"  JSONB,
  "ip_address"  VARCHAR,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_audit_logs_created_at"  ON "audit_logs"("created_at");
CREATE INDEX "idx_audit_logs_entity"      ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "idx_audit_logs_user_id"     ON "audit_logs"("user_id");


-- 26. contact_messages
CREATE TABLE "contact_messages" (
  "id"           UUID        NOT NULL DEFAULT gen_random_uuid(),
  "name"         VARCHAR     NOT NULL,
  "email"        VARCHAR     NOT NULL,
  "phone"        VARCHAR,
  "subject"      VARCHAR     NOT NULL,
  "message"      TEXT        NOT NULL,
  "status"       VARCHAR     NOT NULL DEFAULT 'NEW',
  "response"     TEXT,
  "responded_at" TIMESTAMPTZ,
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_contact_messages_status" ON "contact_messages"("status");


-- 27. faqs
CREATE TABLE "faqs" (
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "category"   VARCHAR     NOT NULL,
  "question"   VARCHAR     NOT NULL,
  "answer"     TEXT        NOT NULL,
  "order"      INT         NOT NULL DEFAULT 0,
  "is_active"  BOOLEAN     NOT NULL DEFAULT true,
  "language"   VARCHAR     NOT NULL DEFAULT 'so',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_faqs_category" ON "faqs"("category");
CREATE INDEX "idx_faqs_language" ON "faqs"("language");
```

---

## RBAC Permission Assignment

| Role | Permission Count | Description |
|------|-----------------|-------------|
| `SUPER_ADMIN` | 70 | Full access to everything |
| `BROKER` | 42 | Listings, payments, chat, verification, reports, search, uploads, favorites, agent features |
| `PROPERTY_OWNER` | 39 | Listings, payments, chat, verification, reports, search, uploads, favorites, agent features |
| `VEHICLE_OWNER` | 39 | Same as PROPERTY_OWNER |
| `CUSTOMER` | 27 | Basic browsing, chat, payments, verification, reports, search, uploads, favorites |

See `backend/src/common/enums/permission.enum.ts` for the full list of 70 permissions.
