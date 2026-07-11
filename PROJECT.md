# Dalaal - Complete System Documentation

> Somalia's premier real estate & vehicle marketplace platform.

---

## What is Dalaal?

Dalaal is a full-stack marketplace platform designed for the Somali market (Mogadishu, Hargeisa, Garowe, Kismayo, and Djibouti). It enables buying, selling, and renting of properties and vehicles through a secure, escrow-backed system with real-time communication between buyers, sellers, and brokers.

The platform supports **7 user roles**, each with its own dashboard, permissions, and workflow. It includes real-time chat, voice/video calls, mobile money payments, escrow protection, identity verification, and a social-media-style "Clips" feature for property/vehicle walkthrough videos.

---

## Tech Stack

| Layer | Technology | Port |
|-------|-----------|------|
| **Backend API** | NestJS + Prisma ORM + PostgreSQL | `3005` |
| **Mobile App** | React Native (Expo) + Expo Router + Zustand | `8081` |
| **Web App** | Next.js 16 + Tailwind CSS v4 + shadcn/ui | `3000` |

---

## User Roles

Dalaal defines **7 distinct roles**, each with tailored dashboards and permissions:

| Role | Description | Can Create Listings | Can Moderate | Can Admin |
|------|-------------|-------------------|--------------|-----------|
| **SUPER_ADMIN** | Full system control, analytics, user management | Yes | Yes | Yes |
| **MODERATOR** | Review moderation, listing approval/rejection | No | Yes | Partial |
| **VERIFIED_DALAAL** | Verified broker with extra privileges | Yes | No | No |
| **REGULAR_DALAAL** | Basic broker | Yes | No | No |
| **PROPERTY_OWNER** | Lists own properties | Yes | No | No |
| **VEHICLE_OWNER** | Lists own vehicles | Yes | No | No |
| **CUSTOMER** | Browses, favorites, messages, bookings | No | No | No |

### Role-Based Routing

Both web and mobile apps enforce role-based access:

- **Web**: Next.js middleware decodes JWT from cookies and redirects users to their role-specific dashboard (`/pages/super-admin`, `/pages/broker`, etc.)
- **Mobile**: Expo Router layouts conditionally render navigation based on the authenticated user's role

---

## Role Capabilities — What Each Role Can Do

### 1. SUPER_ADMIN (Super Administrator)

The super admin has **full system control**. They can do everything on the platform.

**Dashboard:** `/pages/super-admin` (Web) | `pages/super-admin/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **View Platform Analytics** | Total revenue, registered users, active listings, escrow transactions, conversion rates |
| **View Time-Series Charts** | Revenue trends, user growth, listing growth by day/week/month |
| **View Listings Breakdown** | By type (property/vehicle), by city, by status |
| **View Top Brokers** | Broker performance: listings count, revenue generated, leads, rating |
| **Manage All Users** | View all users, search/filter, change roles, suspend, ban, delete |
| **Manage Broker Accounts** | View all brokers (regular + verified), approve/reject broker applications |
| **Manage User Roles** | Change any user's role (e.g., promote REGULAR_DALAAL to VERIFIED_DALAAL) |
| **Approve/Reject Listings** | Review pending property and vehicle listings, approve or reject with reason |
| **Manage Property Categories** | Add/edit/remove property types (villa, apartment, land, etc.) |
| **Manage Vehicle Categories** | Add/edit/remove vehicle types (SUV, sedan, pickup, etc.) |
| **View All Payments** | Monitor all EVC+, ZAAD, SAHAL, CASH transactions |
| **View EVC+ Transactions** | Filter payments by EVC+ provider |
| **View ZAAD Transactions** | Filter payments by ZAAD provider |
| **Monitor Escrow** | View all active escrows, disputes, releases, refunds |
| **Review Identity Verifications** | Approve/reject user identity documents (ID, passport, license) |
| **Handle Reports** | View and resolve user/content reports |
| **View Admin Audit Trail** | See all admin actions logged in AdminAction table |
| **View System Audit Logs** | Full system audit trail in AuditLog table |
| **Manage Announcements** | Create/edit/delete platform-wide announcements |
| **Manage FAQs** | Add/edit/delete bilingual FAQ entries |
| **System Settings** | Configure platform settings |
| **Create Listings** | Can create property and vehicle listings like a broker |
| **Chat with Anyone** | Can message any user on the platform |
| **Make Calls** | Can voice/video call any user |
| **Make Payments** | Can make escrow deposits and payments |
| **Post Reviews** | Can review any user or listing |
| **Favorite Listings** | Can save any listing to favorites |
| **Access All Pages** | Every page on web and mobile is accessible |

**Web Pages (14+):**
- Overview, Analytics, Reports
- Users (All, Brokers, Roles)
- Properties (All, Pending, Categories)
- Vehicles (All, Pending, Categories)
- Payments (Transactions, EVC+, ZAAD)
- Escrow, Reports, Settings

**API Endpoints Accessible:**
All endpoints including `DELETE /:id` (users), `POST /listings/:id/approve`, `POST /listings/:id/reject`, `PUT /:id/status` (verification), `GET /stats`, `GET /analytics/*`, `GET /pending-listings`

---

### 2. MODERATOR

The moderator **reviews and approves content** but cannot manage users or system settings.

**Dashboard:** `/pages/moderator` (Web) | `pages/moderator/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Review Pending Listings** | View all listings with PENDING_REVIEW status |
| **Approve Listings** | Mark listings as ACTIVE (goes live on platform) |
| **Reject Listings** | Reject listings with a reason (owner gets notified) |
| **Feature Listings** | Promote listings to FEATURED status |
| **Review Identity Verifications** | Approve/reject user identity documents |
| **View Reports** | See user/content reports submitted by users |
| **Resolve Reports** | Mark reports as resolved with notes |
| **View Flagged Content** | See listings/users flagged for review |
| **View All Listings** | Browse all active, pending, rejected listings |
| **View All Users** | Can view user profiles (read-only, cannot change roles) |
| **Chat with Users** | Can message users for moderation purposes |
| **View Reviews** | Can see all reviews on the platform |
| **Flag Reviews** | Can flag inappropriate reviews |
| **Cannot Create Listings** | Moderators do not create their own listings |
| **Cannot Manage Users** | Cannot change roles, suspend, or ban users |
| **Cannot Access Analytics** | No access to platform analytics or revenue data |
| **Cannot Manage Settings** | No access to system settings |

**Web Pages:**
- Moderation dashboard with pending items
- Listing review queue
- Verification review queue
- Reports management

**API Endpoints Accessible:**
`GET /admin/pending-listings`, `POST /admin/listings/:id/approve`, `POST /admin/listings/:id/reject`, `GET /verification/pending`, `PUT /verification/:id/status`, `GET /admin/stats` (partial), chat endpoints, review endpoints

---

### 3. VERIFIED_DALAAL (Verified Broker)

A verified broker has **extra privileges** over regular brokers — a verification badge, higher trust, and access to analytics/leads.

**Dashboard:** `/pages/broker` (Web) | `pages/broker/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Create Property Listings** | List properties for sale or rent with full details |
| **Create Vehicle Listings** | List vehicles for sale or rent with full details |
| **Edit Own Listings** | Modify any listing they created |
| **Delete Own Listings** | Remove their own listings |
| **Publish Listings** | Submit listings for review (goes to PENDING_REVIEW) |
| **Upload Images** | Upload multiple images via Cloudinary |
| **View Broker Analytics** | See their own stats: total listings, views, inquiries, revenue |
| **View Leads** | See recent inquiries/messages from potential buyers |
| **View Own Listings** | Browse all their listings with status indicators |
| **Get Verified Badge** | Blue checkmark on profile and listings |
| **Higher Trust Score** | Verified brokers appear higher in search results |
| **Chat with Customers** | Real-time messaging with potential buyers/renters |
| **Make Voice/Video Calls** | WebRTC calls with customers |
| **Receive Payments** | Accept EVC+, ZAAD, SAHAL, CASH payments |
| **Create Escrow** | Initiate escrow transactions for secure deals |
| **Post Reviews** | Review customers they've transacted with |
| **Favorite Listings** | Save competitor listings to favorites |
| **Edit Profile** | Update name, avatar, bio, city, contact info |
| **Identity Verification** | Submit documents for verification (already verified) |
| **Cannot Moderate** | Cannot approve/reject other users' listings |
| **Cannot Admin** | No access to user management or system settings |
| **Cannot View Platform Analytics** | Only sees their own stats |

**Web Pages:**
- Dashboard with analytics, period filters, recent leads
- Create listing form
- My listings (with status filters)
- Messages/Chat

**API Endpoints Accessible:**
`POST /listings`, `GET /listings/mine`, `PUT /listings/:id`, `DELETE /listings/:id`, `POST /listings/:id/publish`, `POST /properties/:listingId`, `POST /vehicles/:listingId`, `GET /agents/me/stats`, `GET /agents/me/leads`, `GET /agents/me/listings`, chat, payments, escrow, reviews, favorites, notifications, uploads

---

### 4. REGULAR_DALAAL (Regular Broker)

A regular broker can **list and sell/rent** properties and vehicles but without the verified badge.

**Dashboard:** `/pages/broker` (Web) | `pages/broker/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Create Property Listings** | List properties for sale or rent |
| **Create Vehicle Listings** | List vehicles for sale or rent |
| **Edit Own Listings** | Modify their own listings |
| **Delete Own Listings** | Remove their own listings |
| **Publish Listings** | Submit for review |
| **Upload Images** | Upload listing images |
| **View Broker Analytics** | Own stats: listings, views, inquiries |
| **View Leads** | Recent buyer inquiries |
| **View Own Listings** | Browse their listings |
| **No Verified Badge** | No blue checkmark (can upgrade by verifying) |
| **Chat with Customers** | Real-time messaging |
| **Make Calls** | Voice/video calls |
| **Receive Payments** | Accept mobile money payments |
| **Create Escrow** | Initiate escrow transactions |
| **Post Reviews** | Review transaction partners |
| **Favorite Listings** | Save listings |
| **Edit Profile** | Update profile info |
| **Submit Verification** | Can apply for identity verification to become VERIFIED_DALAAL |
| **Cannot Moderate** | No moderation powers |
| **Cannot Admin** | No admin access |

**Web Pages:**
Same as VERIFIED_DALAAL — dashboard, create listing, my listings, messages

**API Endpoints Accessible:**
Same as VERIFIED_DALAAL (listing CRUD, agents stats, chat, payments, escrow, reviews, favorites, notifications, uploads)

---

### 5. PROPERTY_OWNER

A property owner lists **their own properties** for sale or rent.

**Dashboard:** `/pages/owner` (Web) | `pages/owner/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Create Property Listings** | List their properties (house, apartment, villa, land, commercial) |
| **Edit Own Listings** | Modify their property listings |
| **Delete Own Listings** | Remove their property listings |
| **Publish Listings** | Submit for review |
| **Upload Property Images** | Upload multiple images per property |
| **View Property Stats** | See views, inquiries, favorites on their properties |
| **View Earnings** | Track income from property rentals/sales |
| **Chat with Buyers** | Message potential buyers/renters |
| **Make Calls** | Voice/video calls with interested parties |
| **Receive Payments** | Accept EVC+, ZAAD, SAHAL, CASH |
| **Create Escrow** | Secure transactions for property deals |
| **Post Reviews** | Review buyers they've transacted with |
| **Favorite Listings** | Save other listings |
| **Edit Profile** | Update profile info |
| **Submit Verification** | Apply for identity verification |
| **Cannot List Vehicles** | Only properties, no vehicles |
| **Cannot View Other Owners' Listings** | Only sees their own |
| **Cannot Moderate** | No moderation powers |
| **Cannot Admin** | No admin access |

**Web Pages:**
- Owner dashboard with property stats and earnings
- Create/edit property listing
- My properties
- Messages

**API Endpoints Accessible:**
`POST /listings` (PROPERTY type), `GET /listings/mine`, `PUT /listings/:id`, `DELETE /listings/:id`, `POST /listings/:id/publish`, `POST /properties/:listingId`, chat, payments, escrow, reviews, favorites, notifications, uploads

---

### 6. VEHICLE_OWNER

A vehicle owner lists **their own vehicles** for sale or rent.

**Dashboard:** `/pages/owner` (Web) | `pages/owner/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Create Vehicle Listings** | List their vehicles (car, SUV, truck, pickup, van) |
| **Edit Own Listings** | Modify their vehicle listings |
| **Delete Own Listings** | Remove their vehicle listings |
| **Publish Listings** | Submit for review |
| **Upload Vehicle Images** | Upload multiple images per vehicle |
| **View Vehicle Stats** | See views, inquiries, favorites on their vehicles |
| **View Earnings** | Track income from vehicle rentals/sales |
| **Chat with Buyers** | Message potential buyers/renters |
| **Make Calls** | Voice/video calls |
| **Receive Payments** | Accept mobile money payments |
| **Create Escrow** | Secure transactions for vehicle deals |
| **Post Reviews** | Review buyers |
| **Favorite Listings** | Save other listings |
| **Edit Profile** | Update profile info |
| **Submit Verification** | Apply for identity verification |
| **Cannot List Properties** | Only vehicles, no properties |
| **Cannot Moderate** | No moderation powers |
| **Cannot Admin** | No admin access |

**Web Pages:**
- Owner dashboard with vehicle stats and earnings
- Create/edit vehicle listing
- My vehicles
- Messages

**API Endpoints Accessible:**
Same as PROPERTY_OWNER but for VEHICLE type listings

---

### 7. CUSTOMER

A customer **browses, inquires, and transacts** but does not create listings.

**Dashboard:** `/pages/customer` (Web) | `pages/customer/dashboard.tsx` (Mobile)

| Capability | Details |
|-----------|---------|
| **Browse All Listings** | View all active property and vehicle listings |
| **Search Listings** | Full-text search with filters (type, city, price, bedrooms, etc.) |
| **View Listing Details** | See full listing info, images, specs, broker contact |
| **View on Map** | See listing locations on interactive map |
| **Save to Favorites** | Bookmark listings for later |
| **View Favorites** | Browse all saved listings |
| **Start Conversations** | Message any broker or owner about a listing |
| **Real-Time Chat** | Instant messaging with typing indicators, read receipts |
| **Voice/Video Calls** | WebRTC calls with brokers/owners |
| **Make Payments** | Pay for bookings or escrow deposits via EVC+, ZAAD, SAHAL |
| **Create Escrow** | Initiate secure escrow transactions |
| **Release Escrow** | Confirm receipt and release funds to seller |
| **Leave Reviews** | Rate brokers and owners after transactions |
| **View Reviews** | See reviews on user profiles and listings |
| **Save Searches** | Save search criteria with alert preferences |
| **Get Notifications** | Push, email, and in-app notifications |
| **Edit Profile** | Update name, avatar, bio, contact info |
| **Submit Verification** | Apply for identity verification |
| **View Booking History** | See past and current bookings/transactions |
| **View Contracts** | View contract details for transactions |
| **Cannot Create Listings** | Customers do not list properties or vehicles |
| **Cannot Moderate** | No moderation powers |
| **Cannot Admin** | No admin access |
| **Cannot View Analytics** | No access to platform analytics |

**Web Pages:**
- Customer dashboard with saved searches, favorites, recent messages
- Browse properties/vehicles
- Listing detail pages
- Messages/Chat
- Favorites, bookings, contracts

**API Endpoints Accessible:**
`GET /listings`, `GET /listings/:id`, `GET /search`, `POST /favorites/:listingId`, `GET /favorites/my`, chat, payments, escrow, reviews, notifications, `PUT /users/profile`, `POST /verification`

---

## Role Capabilities Matrix

| Action | SUPER_ADMIN | MODERATOR | VERIFIED_DALAAL | REGULAR_DALAAL | PROPERTY_OWNER | VEHICLE_OWNER | CUSTOMER |
|--------|:-----------:|:---------:|:---------------:|:--------------:|:--------------:|:-------------:|:--------:|
| **Browse Listings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Search Listings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Listing Details** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create Property Listings** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create Vehicle Listings** | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Edit Own Listings** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Delete Own Listings** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Publish Listings (Submit for Review)** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Approve/Reject Listings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Feature Listings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Broker Analytics** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Platform Analytics** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Leads** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Earnings** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Manage All Users** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Change User Roles** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Suspend/Ban Users** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Delete Users** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Review Identity Verifications** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Submit Verification** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Handle Reports** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Reports** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manage Announcements** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manage FAQs** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Chat (Real-Time)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Voice/Video Calls** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Make Payments** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create Escrow** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Release Escrow** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Post Reviews** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Reviews** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Favorite Listings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Save Searches** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Edit Profile** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Upload Images** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Notifications** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Get Verified Badge** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Database Schema (25+ Models)

### Core Models

| Model | Purpose |
|-------|---------|
| **User** | All users with email, phone, password, role, status, online status |
| **Profile** | Name, avatar, bio, city, country, diaspora flag, language, WhatsApp, Telegram, rating |
| **Listing** | Property or vehicle listings with title, slug, price, location, geocoords, status, counters |
| **ListingImage** | Multiple images per listing with ordering and primary flag |
| **Property** | Extended property details: type, bedrooms, bathrooms, sqm, furnished, parking, deposit |
| **Vehicle** | Extended vehicle details: make, model, year, mileage, fuel, transmission, color, seats |

### Transaction Models

| Model | Purpose |
|-------|---------|
| **Payment** | Transactions via EVC+, ZAAD, SAHAL, or CASH |
| **Escrow** | Buyer-seller escrow with 2.5% platform fee, dispute tracking |
| **Review** | Multi-dimensional ratings: overall, communication, accuracy, value |
| **Favorite** | User listing favorites |

### Communication Models

| Model | Purpose |
|-------|---------|
| **Conversation** | Chat threads linked to listings |
| **ConversationParticipant** | Many-to-many users in conversations, unread counts |
| **Message** | Text, image, document, listing share, system messages |
| **MessageDeletion** | Soft-delete tracking per user per message |
| **Notification** | Push/in-app notifications with type and action URL |

### Admin & Verification Models

| Model | Purpose |
|-------|---------|
| **IdentityVerification** | Document verification: ID, passport, license, title deed |
| **Report** | Content/user reports with resolution tracking |
| **AdminAction** | Admin audit trail |
| **AuditLog** | System-wide audit log |
| **Announcement** | Platform announcements |
| **ContactMessage** | Contact form submissions |
| **Faq** | Bilingual FAQ entries (English/Somali) |
| **SavedSearch** | Saved search criteria with alerts |

### Key Enums

| Enum | Values |
|------|--------|
| `UserRole` | SUPER_ADMIN, MODERATOR, VERIFIED_DALAAL, REGULAR_DALAAL, PROPERTY_OWNER, VEHICLE_OWNER, CUSTOMER |
| `ListingStatus` | DRAFT, PENDING_REVIEW, ACTIVE, FEATURED, EXPIRED, REJECTED, ARCHIVED |
| `PropertyType` | HOUSE, APARTMENT, LAND, COMMERCIAL, VILLA, TOWNHOUSE, OFFICE |
| `VehicleType` | CAR, TRUCK, MOTORCYCLE, BUS, VAN, SUV, PICKUP |
| `PaymentProvider` | EVC_PLUS, ZAAD, SAHAL, CASH |
| `EscrowStatus` | PENDING_DEPOSIT, HOLDING, RELEASED, DISPUTED, REFUNDED |

---

## Features

### 1. Authentication & Security

- **Registration**: Email/password with confirm password and terms acceptance
- **Email Verification**: 6-digit code, auto-login after verification
- **OTP Login**: Send OTP to email/phone, verify to log in
- **JWT Tokens**: Access tokens (7 days) + refresh tokens (30 days)
- **Session Management**: Single-session enforcement (new login invalidates old sessions)
- **Rate Limiting**: 5/min register, 10/min login, 100/min global
- **Password Reset**: Forgot password -> code -> reset flow
- **Phone Verification**: Firebase token-based verification

### 2. Listings Management

- **Create Listings**: Property or vehicle with detailed attributes
- **Property Details**: Type (house, apartment, villa, land, commercial), bedrooms, bathrooms, sqm, furnished, parking, garden, security, water, electricity, deposit, lease months
- **Vehicle Details**: Type (car, SUV, truck, pickup, van), make, model, year, mileage, condition, fuel, transmission, color, seats, rental days
- **Image Upload**: Cloudinary-based with ordering and primary image selection
- **Video URL**: Optional video walkthrough link
- **Status Lifecycle**: DRAFT -> PENDING_REVIEW -> ACTIVE -> FEATURED/EXPIRED/REJECTED/ARCHIVED
- **Publishing**: Submit for moderator review before going live
- **Geolocation**: Latitude/longitude for map-based search
- **Slug URLs**: SEO-friendly listing URLs

### 3. Search & Discovery

- **Full Search**: Filter by type, status, city, price range, bedrooms, property type, vehicle type, make
- **Advanced Search**: Detailed filters with pagination
- **Map View**: Geographic search with coordinates
- **Saved Searches**: Save search criteria with email/alert toggles
- **Category Browsing**: Properties by type (villa, apartment, land, commercial), vehicles by type (SUV, sedan, pickup, truck)

### 4. Real-Time Chat & Messaging

- **Socket.IO WebSocket**: Real-time bidirectional communication
- **Conversation Types**: Direct (1:1) and listing-linked conversations
- **Message Types**: Text, image, document, listing share, system
- **Read Receipts**: Sent -> Delivered -> Read status tracking
- **Typing Indicators**: Real-time "user is typing..." display
- **Message Deletion**: Soft-delete (self) or delete for all
- **User Presence**: Online/offline status with last seen timestamp
- **Session Revocation**: Notifications when logged in on another device
- **REST Fallback**: HTTP API fallback for messages when WebSocket is unavailable

### 5. Voice & Video Calls

- **WebRTC Peer-to-Peer**: Direct audio/video calls between users
- **Call Signaling**: Via WebSocket (call:start, accept, decline, end)
- **ICE Candidate Relay**: NAT traversal support
- **Call Controls**: Camera switch, audio/video toggle, mute, speaker
- **Call History**: System message creation for call records
- **Session Storage**: Redis (optional) or in-memory for call state

### 6. Mobile Money Payments

- **EVC+**: Hormuud Telecom mobile money
- **ZAAD**: Telesom mobile money
- **SAHAL**: Somtel mobile money
- **CASH**: In-person cash payment
- **Payment Types**: Listing fees, premium features, escrow deposits, escrow releases, commissions
- **Verification**: Transaction ID verification after payment
- **Payment History**: Full transaction history per user

### 7. Escrow Protection

- **Secure Transactions**: Buyers and sellers transact safely
- **2.5% Platform Fee**: Automated fee calculation
- **Status Flow**: PENDING_DEPOSIT -> HOLDING -> RELEASED/DISPUTED/REFUNDED
- **Dispute Tracking**: Built-in dispute resolution system
- **Buyer-Initiated Release**: Buyer confirms receipt and releases funds

### 8. Reviews & Ratings

- **Multi-Dimensional Ratings**: Overall, communication, accuracy, value for money
- **User Reviews**: Rate brokers, owners, and other users
- **Listing Reviews**: Rate specific properties or vehicles
- **Helpful Votes**: Community-driven review quality
- **Verified Reviews**: Only from users who completed transactions

### 9. Identity Verification

- **Document Types**: National ID, passport, business license, title deed, driver's license
- **Selfie + Document**: Dual image capture for verification
- **Admin Review**: Pending -> Approved/Rejected workflow
- **Verified Badge**: Displayed on profile and listings

### 10. Notifications

- **Push Notifications**: Firebase Cloud Messaging
- **Email Notifications**: SMTP-based
- **In-App Notifications**: With read/unread tracking
- **10 Notification Types**: New listing, price drop, new message, listing verified, payment received, escrow released, review received, account verified, welcome, system announcement

### 11. Clips (Video Walkthroughs)

- **Reels-Style Vertical Videos**: Short-form property/vehicle walkthroughs
- **Broker-Created Content**: Filmed by verified Dalaal brokers
- **Pricing Overlays**: Real-time pricing cards on video
- **Interactive Actions**: Like, comment, save, share, inquire
- **Mobile-First**: Full-screen immersive player in the mobile app
- **Web Preview**: Clips showcase page with phone mockup

### 12. Admin Dashboard

- **Platform Analytics**: User count, listing count, revenue, escrow, conversion rates
- **Time-Series Charts**: Revenue, escrow, users, listings by day/week/month
- **Listings Breakdown**: By type, city, status
- **Broker Performance**: Top brokers by listings, revenue, leads, rating
- **Listing Moderation**: Approve/reject pending listings
- **Verification Review**: Approve/reject identity documents
- **User Management**: Role changes, suspension, banning
- **Report Management**: Handle user/content reports
- **Payment Monitoring**: EVC+, ZAAD, SAHAL transaction tracking
- **Escrow Monitoring**: Active escrows, disputes, releases
- **System Settings**: Platform configuration

### 13. Favorites & Saved Searches

- **Favorite Listings**: Toggle favorite on any listing
- **Favorites List**: View all saved listings
- **Saved Searches**: Save search criteria for quick access
- **Search Alerts**: Email notifications for matching new listings

### 14. Maps & Geolocation

- **Geocoding**: Address to coordinates conversion
- **Map-Based Search**: Browse listings on an interactive map
- **Location Display**: Coordinates on listing detail pages

### 15. Bilingual Support

- **English / Somali**: Full language toggle on web and mobile
- **FAQ Accordion**: Bilingual FAQ section
- **RTL Support**: Prepared for Somali right-to-left display

---

## API Endpoints Summary

### Auth (`/api/auth`)
`POST /register`, `/login`, `/verify-email`, `/resend-verification`, `/send-otp`, `/verify-otp`, `/refresh`, `/forgot-password`, `/reset-password`, `/verify-phone`, `/logout`

### Users (`/api/users`)
`GET /`, `/profile`, `/:id` | `PUT /profile`, `/:id` | `DELETE /:id`

### Listings (`/api/listings`)
`POST /` | `GET /`, `/mine`, `/:id` | `PUT /:id` | `DELETE /:id` | `POST /:id/publish`

### Properties (`/api/properties`)
`POST /:listingId` | `PUT /:listingId` | `GET /:listingId`

### Vehicles (`/api/vehicles`)
`POST /:listingId` | `PUT /:listingId` | `GET /:listingId`

### Chat (`/api/chat`)
`POST /conversations` | `GET /conversations`, `/conversations/:id/messages` | `POST /conversations/:id/messages` | `DELETE /messages/:id`

### Chat WebSocket (`/chat` namespace)
`join`, `sendMessage`, `markRead`, `typing`, `messageAck` | Events: `newMessage`, `messageDelivered`, `messageDeleted`, `userTyping`, `presence:update`, `session:revoked`

### Call Signaling (WebSocket)
`call:start`, `call:accept`, `call:decline`, `call:end`, `webrtc:offer`, `webrtc:answer`, `webrtc:ice-candidate`

### Payments (`/api/payments`)
`POST /` | `GET /my` | `POST /:id/verify`

### Escrow (`/api/escrow`)
`POST /` | `GET /my` | `POST /:id/release`

### Reviews (`/api/reviews`)
`POST /` | `GET /user/:id`, `/listing/:id`

### Favorites (`/api/favorites`)
`POST /:listingId` | `GET /my`

### Notifications (`/api/notifications`)
`GET /`, `/unread-count` | `PUT /:id/read`, `/read-all`

### Search (`/api/search`)
`GET /`

### Verification (`/api/verification`)
`POST /` | `GET /my`, `/pending` | `PUT /:id/status`

### Admin (`/api/admin`)
`GET /stats`, `/analytics/overview`, `/analytics/timeseries`, `/analytics/listings/breakdown`, `/analytics/brokers`, `/pending-listings` | `POST /listings/:id/approve`, `/listings/:id/reject`

### Agents (`/api/agents`)
`GET /me/stats`, `/me/leads`, `/me/listings`

### Uploads (`/api/uploads`)
`POST /image`

### Root
`GET /` (HTML), `/api/docs` (Swagger), `/api/health`

---

## Mobile App (61 Screens)

### Auth Flow (12 screens)
Splash, onboarding, welcome, features, login (email/phone toggle), register (confirm password + terms), verify-email (auto-login), phone-verification, forgot-password, reset-password, role-selection

### Tab Navigation (6 screens)
Home feed, search, quick create, messages list, explore, profile

### Role-Based Dashboards (6 screens)
- **Super Admin**: KPI stats, quick actions
- **Broker**: Analytics with period filters, leads
- **Customer**: Search, favorites, messages, bookings
- **Owner**: Properties, vehicles, earnings
- **Moderator**: Reviews, flagged items, reports

### Feature Screens (23 screens)
Listings (create, detail, edit, properties browse/detail, vehicles browse/detail), chat (conversation, new-chat, user-content), booking, contract, notifications, payments (payment, history, escrow), profile (edit, favorites, my-listings, privacy-security, settings, verification), search (results, advanced, map)

### Components (52)
Chat system (14 components), calls (5), home sections (9), profile (2), common UI (3), shared UI elements (18)

---

## Web App (35+ Pages)

### Public Pages
Landing page, properties marketplace, vehicles marketplace, clips showcase

### Auth Pages
Login, register, email verification, forgot password, reset password

### Role-Based Dashboards
Super admin (14 sub-pages), moderator, broker, owner, customer

### Super Admin Sub-Pages
Analytics, users, roles, brokers, properties (list, categories, pending), vehicles (list, categories, pending), payments (overview, EVC+, ZAAD), escrow, reports, settings

---

## Key Architecture Decisions

1. **Response Wrapping**: All backend responses wrapped in `{ success, data, timestamp }` via TransformInterceptor
2. **Dual Token Storage**: Web stores JWT in both localStorage and cookies for SSR middleware access
3. **Network Auto-Heal**: Mobile app tries multiple API base URLs (env, Android emulator, localhost)
4. **Soft-Delete Messages**: MessageDeletion table tracks per-user deletions without removing data
5. **Session Invalidation**: Single-session enforcement via sessionToken
6. **Local PostgreSQL**: Direct pg Pool connection (no Neon serverless)
7. **Cloudinary Images**: All image uploads stored and optimized via Cloudinary
8. **Swagger Docs**: Auto-generated API documentation at `/api/docs`

---

## Mobile Money Integration

Dalaal supports Somalia's primary mobile payment systems:

| Provider | Type | Use Case |
|----------|------|----------|
| **EVC+** (Hormuud) | Mobile wallet | Listing fees, escrow deposits |
| **ZAAD** (Telesom) | Mobile wallet | Listing fees, escrow deposits |
| **SAHAL** (Somtel) | Mobile wallet | Listing fees, escrow deposits |
| **CASH** | In-person | Direct broker/owner payments |

---

## Escrow Protocol

1. **Buyer** initiates purchase on a listing
2. **Escrow created** with 2.5% platform fee calculated
3. **Buyer deposits** funds via mobile money
4. **Funds held** in escrow while transaction completes
5. **Buyer confirms** receipt of property/vehicle
6. **Funds released** to seller minus platform fee
7. **Dispute option** available if issues arise

---

## Development Setup

### Backend
```bash
cd backend
npm install --legacy-peer-deps
npx prisma db push
npm run start:dev  # Port 3005
```

### Mobile App
```bash
cd Dalaal-app
npm install --legacy-peer-deps
npx expo start  # Port 8081
```

### Web App
```bash
cd web
npm install
npm run dev  # Port 3000
```

### Database
```bash
# PostgreSQL at localhost:5432
# Database: Dalaal-App
# User: postgres, Password: 1234
# No SSL required
```

---

## File Structure

```
Dalaal/
├── backend/                     # NestJS API
│   ├── .env                     # DB URL, JWT secrets, port 3005
│   ├── prisma/schema.prisma     # 25+ models, 16 enums
│   └── src/
│       ├── main.ts              # CORS, TransformInterceptor
│       ├── auth/                # Authentication module
│       ├── users/               # User management
│       ├── listings/            # Listing CRUD
│       ├── properties/          # Property details
│       ├── vehicles/            # Vehicle details
│       ├── chat/                # Chat + WebSocket gateway
│       ├── payments/            # Mobile money payments
│       ├── escrow/              # Escrow transactions
│       ├── reviews/             # Reviews & ratings
│       ├── favorites/           # Listing favorites
│       ├── notifications/       # Push/in-app notifications
│       ├── verification/        # Identity verification
│       ├── admin/               # Admin dashboard & analytics
│       ├── agents/              # Broker stats & leads
│       ├── uploads/             # Cloudinary image uploads
│       ├── search/              # Full search
│       └── maps/                # Geocoding
│
├── Dalaal-app/                  # React Native (Expo)
│   ├── src/
│   │   ├── app/                 # Expo Router screens
│   │   │   ├── (auth)/          # 12 auth screens
│   │   │   ├── (tabs)/          # 6 tab screens
│   │   │   ├── pages/           # Role dashboards
│   │   │   ├── listings/        # Listing screens
│   │   │   ├── chat/            # Chat screens
│   │   │   ├── payments/        # Payment screens
│   │   │   ├── profile/         # Profile screens
│   │   │   └── search/          # Search screens
│   │   ├── components/          # 52 UI components
│   │   ├── services/            # API, auth, chat, socket, webrtc
│   │   ├── hooks/               # useAuth
│   │   ├── store/               # Zustand auth store
│   │   └── context/             # Favorites, theme contexts
│   └── .env                     # EXPO_PUBLIC_API_URL
│
├── web/                         # Next.js 16
│   ├── app/
│   │   ├── (auth)/              # Auth pages
│   │   ├── pages/               # Role dashboards (14+ admin pages)
│   │   ├── properties/          # Properties marketplace
│   │   ├── vehicles/            # Vehicles marketplace
│   │   └── clips/               # Clips showcase
│   ├── components/              # 37 components
│   ├── lib/                     # API client, auth context, utils
│   ├── middleware.ts            # JWT role-based routing
│   └── .env.local               # NEXT_PUBLIC_API_URL
│
└── scripts/                     # Utility scripts
```

---

## Cross-Cutting Concerns

- **Validation**: Global validation pipe with whitelist and transform
- **Error Handling**: HTTP exception filter + Prisma exception filter
- **Logging**: Logging interceptor for all requests
- **Caching**: Cache interceptor for frequently accessed data
- **Compression**: Request/response compression
- **CORS**: Configured for localhost development with credentials
- **Static Files**: Upload serving configuration
- **API Docs**: Swagger at `/api/docs`
- **10 Config Modules**: app, database, JWT, Cloudinary, email, SMS, Redis, maps, payments, Firebase
