# DalaalPrime --- PLAN.md

> Complete product, UI/UX, role, page, component, modal, toast,
> validation, and development plan for the DalaalPrime marketplace.

## 1. Project Overview

**Project Name:** DalaalPrime\
**System Type:** Web-Based Property and Vehicle Marketplace\
**Database:** PostgreSQL\
**ORM:** Prisma ORM

DalaalPrime is a role-based marketplace where customers can discover
property and vehicle listings, while brokers, property owners, and
vehicle owners can publish and manage listings. The platform also
supports messaging, favorites, saved searches, reviews, notifications,
payments, escrow transactions, identity verification, reports, and
administrative management.

The system must be responsive, secure, simple to navigate, and
consistent across all pages.

------------------------------------------------------------------------

# 2. User Roles

The system has five main roles.

## 2.1 SUPER_ADMIN

The Super Admin has full platform access.

Main responsibilities: - View administrative dashboard. - Manage users
and user statuses. - View and manage brokers, property owners, vehicle
owners, and customers. - Review and moderate listings. - Approve,
reject, feature, archive, or remove listings. - Review identity
verification requests. - Manage payments and escrow transactions. -
Review customer reports and disputes. - View conversations when
permitted for moderation/support. - Manage platform permissions. -
Manage announcements. - Manage FAQs. - Respond to contact messages. -
View audit logs and admin actions. - View platform reports and
analytics. - Manage personal profile. - View notifications. - Manage
system-level settings where implemented.

## 2.2 BROKER

A Broker can manage marketplace listings and communicate with customers.

Main responsibilities: - Register and log in. - Complete and edit
personal profile. - Complete identity verification. - Add property
listings. - Add vehicle listings if broker permissions allow it. - Edit
and delete own listings. - Upload listing photos and video clips. -
Submit listings for review. - Monitor listing approval status. - View
listing performance. - Receive and respond to customer messages. -
Manage conversations. - View favorites/reviews related to listings where
applicable. - View payments and escrow transactions involving the
broker. - Receive notifications. - Submit reports. - View own
dashboard. - Log out securely.

## 2.3 PROPERTY_OWNER

A Property Owner manages their own real-estate listings.

Main responsibilities: - Register and log in. - Manage personal
profile. - Complete identity verification. - Add property listings. -
Edit and delete own property listings. - Upload property photos and
video clips. - Set property price, location, property type, facilities,
and availability. - Submit properties for review. - View active,
pending, featured, rejected, and archived listings. - Receive and
respond to customer messages. - View listing views, favorites, and
inquiries. - Manage payments and escrow transactions related to own
listings. - View and respond to reviews where supported. - Receive
notifications. - Submit reports. - Log out securely.

## 2.4 VEHICLE_OWNER

A Vehicle Owner manages vehicle listings.

Main responsibilities: - Register and log in. - Manage personal
profile. - Complete identity verification. - Add vehicle listings. -
Edit and delete own vehicle listings. - Upload vehicle images and
videos. - Provide make, model, year, mileage, condition, fuel type,
transmission, color, seats, sale/rental status, and deposit
information. - Submit vehicle listings for review. - Receive and respond
to customer messages. - Monitor listing views, favorites, and
inquiries. - View payments and escrow transactions involving own
listings. - Receive notifications. - Submit reports. - Log out securely.

## 2.5 CUSTOMER

Customers discover listings and communicate with sellers.

Main responsibilities: - Register and log in. - Manage personal
profile. - Browse properties and vehicles. - Search and filter
listings. - View listing details. - Save and remove favorites. - Save
searches. - Contact brokers/owners. - Participate in conversations. -
Make supported payments. - Track relevant escrow transactions. - Submit
reviews. - Receive notifications. - Report suspicious listings or
users. - View own activity. - Log out securely.

------------------------------------------------------------------------

# 3. Access Control

Every protected route must validate both authentication and
authorization.

Example access matrix:

  --------------------------------------------------------------------------
  Feature        Super Admin Broker      Property    Vehicle     Customer
                                         Owner       Owner       
  -------------- ----------- ----------- ----------- ----------- -----------
  Browse         Yes         Yes         Yes         Yes         Yes
  listings                                                       

  Manage own     Yes         Yes         Yes         Yes         Yes
  profile                                                        

  Add property   Yes         Yes         Yes         No          No

  Add vehicle    Yes         If          No          Yes         No
                             permitted                           

  Manage own     Yes         Yes         Yes         Yes         No
  listings                                                       

  Manage all     Yes         No          No          No          No
  listings                                                       

  Manage users   Yes         No          No          No          No

  Approve        Yes         No          No          No          No
  listings                                                       

  Chat           Yes         Yes         Yes         Yes         Yes

  Favorites      Optional    Yes         Yes         Yes         Yes

  Payments       All         Own         Own         Own         Own

  Escrow         All         Relevant    Relevant    Relevant    Relevant

  Verification   Yes         No          No          No          No
  review                                                         

  Submit         Optional    Yes         Yes         Yes         Yes
  verification                                                   

  Audit logs     Yes         No          No          No          No
  --------------------------------------------------------------------------

Unauthorized users must never see or execute protected actions only
because a button is hidden. Authorization must also be enforced on the
backend.

------------------------------------------------------------------------

# 4. Global UI Style

## 4.1 Visual Direction

Use a modern marketplace/dashboard style: - Professional and clean. -
Generous whitespace. - Clear information hierarchy. - Consistent
cards. - Rounded but not excessively rounded components. - Subtle
borders and shadows. - Strong readable typography. - Consistent icon
style. - Responsive desktop, tablet, and mobile layouts.

## 4.2 Layout

Public pages: - Top navigation. - Main content. - Footer.

Authenticated dashboards: - Sidebar navigation. - Top header. - Main
content area. - Breadcrumb/page title when useful. - Notification and
profile controls in header.

Desktop sidebar should remain visible where space permits. Mobile should
use a drawer/sheet.

## 4.3 Typography

Use: - Large bold page titles. - Medium section headings. - Normal
readable body text. - Smaller muted metadata. - Consistent label and
helper-text sizes.

Do not mix many font families.

## 4.4 Cards

Cards should use: - Clear heading. - Optional icon. - Main
value/content. - Optional comparison/status text. - Consistent
padding. - Subtle border/shadow.

Dashboard statistic cards should be clickable only when they have a
meaningful destination.

## 4.5 Tables

Tables should support, where relevant: - Search. - Filters. - Sorting. -
Pagination. - Status badges. - Row actions. - Empty states. - Loading
state. - Error state. - Responsive behavior.

Do not overload tables with unnecessary columns. Put secondary actions
in an action menu.

------------------------------------------------------------------------

# 5. Global Components

Reusable components should include:

-   Button
-   IconButton
-   Input
-   Textarea
-   Select
-   Combobox
-   Checkbox
-   Radio group
-   Switch
-   Date picker
-   Price input
-   Search input
-   File uploader
-   Image uploader
-   Video uploader
-   Avatar
-   Badge
-   Status badge
-   Card
-   Statistic card
-   Listing card
-   Property card
-   Vehicle card
-   Data table
-   Pagination
-   Tabs
-   Breadcrumb
-   Dropdown menu
-   Tooltip
-   Popover
-   Modal/Dialog
-   Confirmation dialog
-   Drawer/Sheet
-   Toast
-   Alert
-   Skeleton
-   Spinner
-   Empty state
-   Error state
-   Chart container
-   Message bubble
-   Notification item

------------------------------------------------------------------------

# 6. Toast Notification System

Use toasts for short feedback after an action.

## Success Toasts

Examples: - "Account created successfully." - "Profile updated
successfully." - "Listing created successfully." - "Listing updated
successfully." - "Listing submitted for review." - "Listing deleted
successfully." - "Added to favorites." - "Removed from favorites." -
"Message sent." - "Payment completed successfully." - "Verification
submitted successfully." - "Changes saved."

## Error Toasts

Examples: - "Unable to complete the request." - "Invalid email or
password." - "Failed to upload image." - "Payment failed. Please try
again." - "You do not have permission to perform this action." -
"Something went wrong. Please try again."

## Warning Toasts

Examples: - "Your listing is still under review." - "Complete identity
verification to continue." - "Your session will expire soon."

## Toast Rules

-   Do not use a toast instead of field-level validation.
-   Avoid stacking excessive toasts.
-   Success messages should be short.
-   Error messages should explain the next useful action where possible.
-   Do not expose technical stack traces to users.

------------------------------------------------------------------------

# 7. Modal and Dialog System

Use dialogs for focused actions requiring user attention.

## Confirmation Dialog

Use for destructive actions: - Delete listing. - Delete user. - Archive
listing. - Ban/suspend account. - Cancel transaction where supported.

Example:

**Delete Listing?**

"This listing will be permanently removed. This action cannot be
undone."

Buttons: - Cancel - Delete Listing

## Listing Approval Modal

Admin sees: - Listing summary. - Owner. - Listing type. - Submission
date. - Verification information. - Approve button. - Reject button. -
Rejection reason field when rejecting.

## Image Preview Modal

Allows: - Larger image preview. - Previous/next image. - Close.

## Payment Modal

Shows: - Listing. - Recipient. - Amount. - Currency. - Payment
provider. - Confirmation action.

## Report Modal

Fields: - Report type. - Description. - Optional supporting
information. - Submit report.

------------------------------------------------------------------------

# 8. Authentication Pages

## 8.1 Login

Elements: - DalaalPrime logo. - Email/username field. - Password
field. - Show/hide password. - Remember me if implemented. - Forgot
password. - Login button. - Google authentication if implemented. -
Registration link.

Behavior: 1. Validate fields. 2. Send credentials securely. 3. Show
loading state. 4. On success, redirect according to role. 5. On failure,
show a safe authentication error.

## 8.2 Registration

Fields should reflect actual account requirements: - Email. - Phone if
required. - Username if required. - Password. - Confirm password. - Role
selection when users are allowed to choose a role. - Terms acceptance.

Role choices should never include SUPER_ADMIN for public registration.

## 8.3 Forgot Password

Flow: 1. User enters email. 2. System generates reset workflow. 3. User
receives reset instructions/code. 4. User enters new password. 5. Token
expiry is validated. 6. Password is updated.

## 8.4 Verification

Support email/phone verification using verification codes where
implemented.

------------------------------------------------------------------------

# 9. Public Website Pages

## 9.1 Home Page

Sections: - Header/navigation. - Hero section. - Main search. -
Property/vehicle type selector. - Featured listings. - Latest
properties. - Latest vehicles. - Popular locations. - Marketplace
benefits. - How it works. - Call to action. - Footer.

## 9.2 Browse Listings

Display: - Search. - Property/vehicle selector. - Filter
sidebar/drawer. - Sort control. - Result count. - Grid/list toggle if
supported. - Listing cards. - Pagination.

Filters can include: - Listing type. - City. - District. - Minimum
price. - Maximum price. - Property type. - Bedrooms. - Vehicle type. -
Make. - Year. - Verified listings. - Featured listings.

## 9.3 Listing Details

Header area: - Listing title. - Price. - Location. - Status badges. -
Favorite button. - Share action.

Media: - Main image. - Gallery. - Video when available.

Information: - Description. - Listing-specific details. - Seller/owner
information. - Verification status. - Availability. - Created/published
date where useful.

Actions: - Send message. - Favorite. - Report. - Start supported
transaction/payment flow.

Property details can include: - Property type. - Bedrooms. -
Bathrooms. - Square meters. - Furnished. - Parking. - Garden. -
Security. - Water. - Electricity. - Sale/rental status.

Vehicle details can include: - Vehicle type. - Make. - Model. - Year. -
Mileage. - Condition. - Fuel. - Transmission. - Color. - Seats. -
Sale/rental status.

## 9.4 Contact

Fields: - Name. - Email. - Phone. - Subject. - Message.

Admin can later view and respond to submissions.

## 9.5 FAQ

Show active FAQs grouped by category and language.

------------------------------------------------------------------------

# 10. Super Admin Dashboard

## 10.1 Dashboard Overview

Possible KPI cards: - Total users. - Total active listings. - Pending
listings. - Pending identity verifications. - Completed payments. -
Active/holding escrows. - Open reports. - Unread contact messages.

Charts: - New users over time. - Listings over time. - Property vs
vehicle listings. - Payment activity. - Listing status distribution.

Sections: - Recent users. - Recent listings. - Pending reviews. - Recent
payments. - Recent reports. - Recent admin activity.

## 10.2 User Management

Table: - User. - Email/phone. - Role. - Status. - Verification. - Joined
date. - Last login. - Actions.

Actions: - View. - Edit allowed information. - Activate. - Suspend. -
Ban. - Review verification. - View related listings. - View relevant
audit history.

## 10.3 Listing Management

Filters: - Property/vehicle. - Status. - Owner. - City. - Verified. -
Featured. - Date.

Actions: - View. - Approve. - Reject. - Feature/unfeature. - Archive. -
Remove where policy permits.

## 10.4 Identity Verification

Display: - User. - Document type. - Submitted date. - Status. - Review
action.

Review page/modal: - Document information. - Uploaded evidence. -
Approve. - Reject. - Rejection reason.

## 10.5 Payment Management

Display: - Payment ID. - Payer. - Recipient. - Listing. - Amount. -
Provider. - Type. - Status. - Date.

## 10.6 Escrow Management

Display: - Buyer. - Seller. - Listing. - Amount. - Platform fee. - Net
amount. - Status. - Confirmation states. - Dispute state.

Admin actions must follow actual backend permissions and transaction
rules.

## 10.7 Reports

Display: - Reporter. - Reported user/listing. - Type. - Description. -
Status. - Submitted date.

Actions: - Investigate. - Resolve. - Add resolution. - Apply permitted
moderation action.

## 10.8 Permissions

Manage permission definitions and role-permission mappings.

Changes here are security-sensitive and should require confirmation.

## 10.9 Announcements

Admin can: - Create. - Edit. - Activate/deactivate. - Set start and
expiry dates.

## 10.10 FAQs

Admin can: - Add. - Edit. - Delete. - Reorder. - Activate/deactivate. -
Set language/category.

## 10.11 Contact Messages

Admin can: - View messages. - Filter by status. - Respond. - Mark
resolved/processed according to implementation.

## 10.12 Audit Logs

Read-focused page: - User. - Action. - Entity. - Old values. - New
values. - IP address where available. - Date/time.

Audit records should not be casually editable.

------------------------------------------------------------------------

# 11. Broker Dashboard

Dashboard KPIs: - Total listings. - Active listings. - Pending
listings. - Featured listings. - Total views. - Favorites. -
Inquiries/messages. - Payment summary where relevant.

Main navigation: - Dashboard. - My Listings. - Add Listing. -
Messages. - Payments. - Escrow. - Reviews. - Verification. -
Notifications. - Profile. - Settings.

## My Listings

Each listing shows: - Thumbnail. - Title. - Type. - Price. - City. -
Status. - Views. - Favorites. - Created date. - Actions.

Actions: - View. - Edit. - Delete. - Submit for review. - Manage media.

------------------------------------------------------------------------

# 12. Property Owner Dashboard

Dashboard KPIs: - Total properties. - Active properties. - Pending
properties. - Featured properties. - Views. - Favorites. -
Messages/inquiries. - Relevant transaction summary.

Navigation: - Dashboard. - My Properties. - Add Property. - Messages. -
Payments. - Escrow. - Reviews. - Verification. - Notifications. -
Profile. - Settings.

## Add/Edit Property

Sections:

### Basic Information

-   Title.
-   Description.
-   Price.
-   Negotiable.
-   Currency.

### Location

-   City.
-   District.
-   Address.
-   Coordinates if map support exists.

### Property Details

-   Property type.
-   Bedrooms.
-   Bathrooms.
-   Square meters.
-   Year built.
-   Furnished.
-   Parking.
-   Garden.
-   Security.
-   Water.
-   Electricity.
-   Property status.
-   Deposit months.
-   Minimum lease months.

### Media

-   Featured image.
-   Multiple images.
-   Video URL/upload based on implementation.

### Availability

-   Available from.
-   Expiry where applicable.

Actions: - Save Draft. - Preview. - Submit for Review.

------------------------------------------------------------------------

# 13. Vehicle Owner Dashboard

Dashboard KPIs: - Total vehicles. - Active vehicles. - Pending
vehicles. - Featured vehicles. - Views. - Favorites. -
Messages/inquiries. - Relevant transaction summary.

Navigation: - Dashboard. - My Vehicles. - Add Vehicle. - Messages. -
Payments. - Escrow. - Reviews. - Verification. - Notifications. -
Profile. - Settings.

## Add/Edit Vehicle

### Basic Information

-   Title.
-   Description.
-   Price.
-   Negotiable.
-   Currency.
-   City/location.

### Vehicle Details

-   Vehicle type.
-   Make.
-   Model.
-   Year.
-   Mileage.
-   Condition.
-   Fuel type.
-   Transmission.
-   Color.
-   Seats.
-   Vehicle status.
-   Minimum rental days.
-   Deposit required.

### Media

-   Featured image.
-   Gallery.
-   Video.

Actions: - Save Draft. - Preview. - Submit for Review.

------------------------------------------------------------------------

# 14. Customer Dashboard

Dashboard cards: - Favorites. - Saved searches. - Unread messages. -
Unread notifications. - Payments. - Active/relevant escrow
transactions. - Reviews submitted.

Navigation: - Dashboard. - Browse Listings. - Favorites. - Saved
Searches. - Messages. - Payments. - Escrow. - Reviews. -
Notifications. - Verification. - Profile. - Settings.

## Favorites

Customer can: - View saved listings. - Remove favorite. - Open
listing. - Contact seller.

## Saved Searches

Customer can: - Save filters. - Name a search. - Enable/disable
alerts. - Re-run saved search. - Delete saved search.

------------------------------------------------------------------------

# 15. Messaging System

## Conversation List

Display: - Participant. - Listing reference when applicable. - Last
message. - Last message time. - Unread count.

## Chat Page

Header: - Participant name/avatar. - Online/last seen status where
appropriate. - Listing reference.

Body: - Message bubbles. - Text. - Images/documents if supported. -
Listing share. - Read state where supported.

Composer: - Message input. - Attachment action. - Send button.

Behavior: - Optimistic UI only if failures are handled correctly. -
Prevent duplicate sending. - Show upload progress. - Show failed-message
state when necessary. - Respect message deletion rules.

------------------------------------------------------------------------

# 16. Notifications

Notification center should display: - Icon/type. - Title. - Body. -
Date/time. - Read/unread state. - Optional action link.

Supported notification categories from the schema include: - New
listing. - Price drop. - New message. - Listing verified. - Payment
received. - Escrow released. - Review received. - Account verified. -
Welcome. - System announcement.

Actions: - Mark read. - Mark all read if implemented. - Open linked
destination.

------------------------------------------------------------------------

# 17. Payments

Payment page should show: - Amount. - Currency. - Provider. - Payment
type. - Status. - Listing. - Recipient. - Provider reference. -
Completion date.

Providers represented by the schema: - EVC Plus. - ZAAD. - SAHAL. -
Cash.

Never display or log sensitive payment secrets.

Statuses: - Pending. - Completed. - Failed. - Refunded.

------------------------------------------------------------------------

# 18. Escrow

Escrow page shows: - Buyer. - Seller. - Listing. - Amount. - Platform
fee. - Net amount. - Status. - Buyer confirmation. - Seller
confirmation. - Dispute state. - Release date.

Statuses: - Pending Deposit. - Holding. - Released. - Disputed. -
Refunded.

Important financial state changes require confirmation and server-side
authorization.

------------------------------------------------------------------------

# 19. Reviews

Review form can contain: - Overall rating. - Communication rating. -
Accuracy rating. - Value rating. - Title. - Comment.

Review display: - Reviewer. - Rating. - Comment. - Verification
indicator. - Helpful count. - Seller response.

Validate rating ranges on both frontend and backend.

------------------------------------------------------------------------

# 20. Profile Management

Profile page: - Avatar. - First name. - Last name. - Bio. - City. -
Country. - Currency. - Language. - WhatsApp number. - Telegram handle. -
Account statistics where appropriate.

Account/security section: - Email. - Phone. - Verification states. -
Change password. - Two-factor setting if fully implemented. -
Session/security controls where implemented.

Sensitive account changes may require re-authentication.

------------------------------------------------------------------------

# 21. Identity Verification

Submission: - Document type. - Document number. - Document image. -
Selfie image. - Business license when applicable.

Statuses: - Pending. - Approved. - Rejected. - Expired.

Rejected verification should show the rejection reason when appropriate.

Uploaded identity documents must not be publicly accessible.

------------------------------------------------------------------------

# 22. Search and Filtering

Global marketplace search should support relevant combinations of: -
Keywords. - Listing type. - City. - District. - Price range. - Property
type. - Bedrooms. - Vehicle type. - Make. - Verified status. - Listing
status when appropriate.

Search behavior: - Debounce text search where useful. - Keep filters
visible in URL/query state where practical. - Provide Reset Filters. -
Clearly show active filters. - Provide an empty state when no results
match.

------------------------------------------------------------------------

# 23. Listing Status Workflow

Recommended workflow based on the schema:

`DRAFT → PENDING_REVIEW → ACTIVE`

Possible alternate outcomes:

`PENDING_REVIEW → REJECTED`

`ACTIVE → FEATURED`

`ACTIVE/FEATURED → EXPIRED`

`ACTIVE/FEATURED → ARCHIVED`

Rules: - Owner creates draft. - Owner submits for review. - Admin
reviews. - Approved listing becomes active. - Rejected listing shows
reason if the application supports it. - Only authorized administrators
can perform moderation transitions. - Owners may archive/delete their
own listing subject to transaction rules.

------------------------------------------------------------------------

# 24. Loading States

Every asynchronous page/action should have a visible state.

Use: - Skeleton cards for dashboards/listings. - Skeleton rows for
tables. - Spinner inside action buttons. - Disabled submit while request
is processing. - Upload progress for media.

Avoid full-page spinners when a skeleton can preserve page structure.

------------------------------------------------------------------------

# 25. Empty States

Examples:

### No Listings

"You haven't created any listings yet."

Action: "Create Listing"

### No Favorites

"No favorites yet. Save listings you like to find them here."

Action: "Browse Listings"

### No Messages

"No conversations yet."

### No Notifications

"You're all caught up."

### No Search Results

"No listings match your current filters."

Action: "Reset Filters"

------------------------------------------------------------------------

# 26. Error States

Pages must handle: - 400 Bad Request. - 401 Unauthorized. - 403
Forbidden. - 404 Not Found. - 409 Conflict. - 422 Validation Error if
used. - 429 Too Many Requests. - 500 Server Error. - Network failures.

Provide: - Friendly title. - Short explanation. - Retry when
appropriate. - Navigation back to a safe page.

------------------------------------------------------------------------

# 27. Form Validation

General rules: - Required fields must be marked. - Validate email
format. - Validate phone format according to application rules. -
Enforce password rules. - Confirm password must match. - Price must be
valid and non-negative/positive as business rules require. - Numeric
listing attributes must use valid ranges. - Validate URLs. - Validate
media type and size. - Validate enum values server-side. - Never rely
only on client-side validation.

Field errors should appear close to the affected field.

------------------------------------------------------------------------

# 28. Media Upload

Listing media should support: - Multiple images. - Primary image
selection. - Reordering. - Preview. - Removal before submission. -
Supported file validation. - Size limits. - Upload progress.

Video must follow the application's actual storage/video URL strategy.

------------------------------------------------------------------------

# 29. Responsive Design

## Desktop

-   Full sidebar.
-   Multi-column dashboard.
-   Wide tables.
-   Listing grids.

## Tablet

-   Collapsible sidebar.
-   Reduced grid columns.
-   Scrollable/adaptive tables.

## Mobile

-   Drawer navigation.
-   Single-column forms.
-   Stacked cards.
-   Filter drawer.
-   Touch-friendly controls.
-   Tables should transform or scroll safely.

All primary actions must remain usable on mobile.

------------------------------------------------------------------------

# 30. Accessibility

Minimum expectations: - Semantic HTML. - Keyboard-accessible controls. -
Visible focus states. - Form labels. - Accessible dialog focus
management. - Alt text for meaningful images. - Sufficient contrast. -
Do not communicate status using color alone. - Proper heading order. -
Accessible error messages.

------------------------------------------------------------------------

# 31. Security

Required principles: - Secure authentication. - Role-based
authorization. - Password hashing. - Server-side validation. - Input
sanitization where appropriate. - Protected routes. - Rate limiting for
sensitive endpoints. - Safe file upload validation. - Secure token
handling. - Expiring verification/reset tokens. - Audit sensitive
administrative operations. - Never expose identity documents publicly. -
Never trust role information sent by the browser. - Prevent users from
editing another user's resources by changing IDs. - Apply CSRF
protection where required by the authentication architecture. - Follow
secure cookie/session practices if cookies are used.

------------------------------------------------------------------------

# 32. Database Model Map

Core model groups from the current schema:

## Accounts

-   users
-   profiles
-   identity_verifications
-   verification_codes
-   password_reset_tokens

## Marketplace

-   listings
-   properties
-   vehicles
-   listing_images
-   favorites
-   saved_searches
-   reviews

## Communication

-   conversations
-   conversation_participants
-   messages
-   message_deletions
-   notifications

## Finance

-   payments
-   escrows

## Administration

-   reports
-   permissions
-   role_permissions
-   admin_actions
-   announcements
-   audit_logs

## Support

-   contact_messages
-   faqs

------------------------------------------------------------------------

# 33. Important Data Relationships

-   User has one Profile.
-   User can have many Listings.
-   Listing belongs to one User.
-   Listing can have one Property record or one Vehicle record according
    to listing type.
-   Listing can have many Listing Images.
-   User can favorite many Listings.
-   Listing can be favorited by many Users.
-   Users participate in Conversations through Conversation
    Participants.
-   Conversation has many Messages.
-   User can receive many Notifications.
-   Users can make/receive Payments.
-   Escrow connects buyer, seller, listing, and payment.
-   Users can review other users/listings according to business rules.
-   Users can submit Reports.
-   Roles receive Permissions through Role Permissions.

------------------------------------------------------------------------

# 34. Suggested Route Structure

Exact paths may be adapted to the framework.

## Public

-   `/`
-   `/listings`
-   `/listings/[slug]`
-   `/properties`
-   `/vehicles`
-   `/contact`
-   `/faq`
-   `/login`
-   `/register`
-   `/forgot-password`

## Shared Authenticated

-   `/dashboard`
-   `/profile`
-   `/settings`
-   `/messages`
-   `/notifications`
-   `/favorites`
-   `/saved-searches`
-   `/payments`
-   `/escrow`
-   `/verification`

## Seller/Owner

-   `/dashboard/listings`
-   `/dashboard/listings/new`
-   `/dashboard/listings/[id]`
-   `/dashboard/listings/[id]/edit`

## Admin

-   `/admin`
-   `/admin/users`
-   `/admin/listings`
-   `/admin/verifications`
-   `/admin/payments`
-   `/admin/escrows`
-   `/admin/reports`
-   `/admin/permissions`
-   `/admin/announcements`
-   `/admin/faqs`
-   `/admin/contact-messages`
-   `/admin/audit-logs`

------------------------------------------------------------------------

# 35. Page Permission Guard

Before rendering a protected page:

1.  Check authentication.
2.  Load current user securely.
3.  Check account status.
4.  Check role/permission.
5.  If unauthorized, return 403 or redirect to an appropriate safe
    route.
6.  Repeat authorization on every protected backend action.

Do not use frontend visibility as the security layer.

------------------------------------------------------------------------

# 36. Destructive Action Rules

Actions requiring confirmation: - Delete listing. - Delete/remove
account when supported. - Ban user. - Suspend user. - Reject
verification. - Reject listing. - Refund/release financial transaction
when supported. - Delete FAQ. - Delete announcement.

Dialog should clearly state: - What will happen. - Whether it can be
undone. - Which record is affected.

------------------------------------------------------------------------

# 37. Dashboard Data Rules

Dashboard statistics must come from real database queries/API responses.

Do not hard-code: - User counts. - Listing counts. - Revenue. - Views. -
Favorites. - Payments. - Messages. - Verification counts.

Use loading, success, empty, and error states.

------------------------------------------------------------------------

# 38. Audit Requirements

Important actions should be auditable where supported: -
Login/security-sensitive activity. - User status changes. - Listing
moderation. - Verification decisions. - Permission changes. - Important
financial actions. - Administrative updates.

The existing `admin_actions` and `audit_logs` models should be used
consistently according to backend design.

------------------------------------------------------------------------

# 39. UX Rules for Status Badges

Use human-readable labels:

-   `PENDING_REVIEW` → Pending Review
-   `PENDING_VERIFICATION` → Pending Verification
-   `SUPER_ADMIN` → Super Admin
-   `PROPERTY_OWNER` → Property Owner
-   `VEHICLE_OWNER` → Vehicle Owner
-   `EVC_PLUS` → EVC Plus

Never show raw enum names to normal users unless it is a developer/admin
diagnostic screen.

------------------------------------------------------------------------

# 40. Breadcrumb Examples

Admin: `Dashboard / Users / User Details`

Property Owner: `Dashboard / My Properties / Edit Property`

Vehicle Owner: `Dashboard / My Vehicles / Add Vehicle`

Customer: `Dashboard / Favorites`

------------------------------------------------------------------------

# 41. Page Header Pattern

Each dashboard page should generally contain:

**Title**\
Short supporting description.

Right-side primary action when appropriate.

Example:

**My Properties**\
Manage your property listings and monitor their performance.

`+ Add Property`

------------------------------------------------------------------------

# 42. Listing Card Pattern

Each listing card can contain: - Primary image. - Featured/verified
badge. - Listing type. - Title. - Price. - Location. - Key
property/vehicle attributes. - Favorite button. - Owner/seller summary
where appropriate.

Do not overcrowd cards with administrative metadata.

------------------------------------------------------------------------

# 43. Data Table Action Pattern

Prefer: - Primary action visible only when important. - Remaining
actions in `...` menu.

Example user actions: - View Details - Edit - Suspend - Ban

Example listing actions: - View - Approve - Reject - Feature - Archive

------------------------------------------------------------------------

# 44. Pagination

For large datasets: - Use server-side pagination. - Preserve
search/filter parameters. - Show current page. - Show next/previous. -
Optionally show page size.

Do not load all users/listings/messages into the browser unnecessarily.

------------------------------------------------------------------------

# 45. API/Backend Behavior

For every mutation: 1. Authenticate. 2. Authorize. 3. Validate request.
4. Verify referenced records. 5. Execute transaction if multiple related
writes must succeed together. 6. Record audit event when required. 7.
Return structured response. 8. Frontend displays appropriate feedback.

------------------------------------------------------------------------

# 46. Transaction Safety

Use database transactions for operations such as: - Payment + escrow
state changes. - Multi-table listing creation when atomicity is
required. - Complex moderation operations. - Other workflows where
partial success would corrupt state.

Financial operations must be idempotent where repeated requests could
otherwise duplicate a transaction.

------------------------------------------------------------------------

# 47. Prisma/PostgreSQL Rules

-   Use Prisma models as the application data contract.
-   Use migrations for schema changes.
-   Do not manually change production tables without corresponding
    migration strategy.
-   Use UUID IDs consistently.
-   Preserve foreign-key integrity.
-   Use indexes for frequent search/filter fields.
-   Avoid N+1 queries.
-   Select only needed fields for large endpoints.
-   Paginate large relations.

------------------------------------------------------------------------

# 48. Notifications Trigger Examples

Create notifications after meaningful events such as: -
Welcome/registration. - Verification approved. - Listing approved. -
Relevant listing update. - New message. - Payment received. - Escrow
released. - Review received. - System announcement.

Do not generate duplicate notifications for the same event.

------------------------------------------------------------------------

# 49. Admin Dashboard Navigation

Recommended sections: 1. Overview 2. Users 3. Listings 4. Verifications
5. Payments 6. Escrow 7. Reports 8. Permissions 9. Announcements 10.
Contact Messages 11. FAQs 12. Audit Logs 13. Profile/Settings

Group navigation if the sidebar becomes too long.

------------------------------------------------------------------------

# 50. Seller Dashboard Navigation

Recommended: 1. Dashboard 2. My Listings 3. Add Listing 4. Messages 5.
Payments 6. Escrow 7. Reviews 8. Verification 9. Notifications 10.
Profile 11. Settings

Property and vehicle owners should see terminology appropriate to their
listing type.

------------------------------------------------------------------------

# 51. Customer Dashboard Navigation

Recommended: 1. Dashboard 2. Browse 3. Favorites 4. Saved Searches 5.
Messages 6. Payments 7. Escrow 8. Reviews 9. Notifications 10.
Verification 11. Profile 12. Settings

------------------------------------------------------------------------

# 52. Footer

Public footer can include: - DalaalPrime. - About. - Browse
Properties. - Browse Vehicles. - FAQ. - Contact. - Terms. - Privacy. -
Social links if available. - Copyright.

Dashboard footer should remain minimal.

------------------------------------------------------------------------

# 53. Development Quality Checklist

Before marking a page complete:

-   Correct role can access it.
-   Incorrect role cannot access it.
-   API authorization works.
-   Loading state works.
-   Empty state works.
-   Error state works.
-   Validation works.
-   Success feedback works.
-   Destructive confirmation works.
-   Mobile layout works.
-   Keyboard navigation works.
-   No hard-coded production data.
-   No console errors.
-   No exposed secrets.
-   Database relationships are respected.

------------------------------------------------------------------------

# 54. Recommended Build Order

## Phase 1 --- Foundation

-   Application shell.
-   Design system.
-   Database/Prisma setup.
-   Authentication.
-   Authorization/RBAC.
-   Shared validation/error handling.

## Phase 2 --- User Accounts

-   Registration.
-   Login/logout.
-   Profile.
-   Verification.
-   Password recovery.

## Phase 3 --- Marketplace

-   Listings.
-   Properties.
-   Vehicles.
-   Media.
-   Search/filter.
-   Favorites.
-   Saved searches.

## Phase 4 --- Communication

-   Conversations.
-   Messages.
-   Notifications.

## Phase 5 --- Trust

-   Reviews.
-   Reports.
-   Identity verification.
-   Admin moderation.

## Phase 6 --- Finance

-   Payments.
-   Escrow.
-   Transaction history.

## Phase 7 --- Administration

-   Admin dashboard.
-   Users.
-   Permissions.
-   Announcements.
-   FAQs.
-   Contact messages.
-   Audit logs.

## Phase 8 --- Quality

-   Responsive testing.
-   Accessibility.
-   Security review.
-   Performance optimization.
-   Integration testing.
-   UAT.
-   Deployment preparation.

------------------------------------------------------------------------

# 55. Definition of Done

DalaalPrime is considered functionally complete when:

-   Authentication works securely.
-   RBAC is enforced server-side.
-   Every role reaches the correct dashboard.
-   Property and vehicle listing workflows work.
-   Listing moderation works.
-   Search and filtering work.
-   Favorites and saved searches work.
-   Messaging works.
-   Notifications work.
-   Identity verification works.
-   Reviews and reports work.
-   Payment and escrow workflows implemented by the project work safely.
-   Admin management pages work.
-   Forms have validation.
-   Errors are handled.
-   Loading and empty states exist.
-   The interface is responsive.
-   Critical actions are auditable.
-   Database migrations are reproducible.
-   Core workflows pass system and user acceptance testing.

------------------------------------------------------------------------

# 56. Agent Implementation Rules

When an AI coding agent works on DalaalPrime, it should:

1.  Inspect the existing project before changing files.
2.  Treat the Prisma schema as the source of truth for existing database
    models.
3.  Reuse existing components before creating duplicates.
4.  Preserve the established visual system.
5.  Never invent an API endpoint without checking the backend structure.
6.  Never bypass RBAC for convenience.
7.  Never hard-code dashboard statistics.
8.  Never expose passwords, tokens, identity documents, or secrets.
9.  Use existing enum values exactly in backend/database logic.
10. Convert enum values into friendly labels in the UI.
11. Add loading, empty, error, and success states.
12. Use confirmation dialogs for destructive actions.
13. Use toasts for short mutation feedback.
14. Keep forms accessible and responsive.
15. Validate on both client and server.
16. Keep business logic out of purely presentational components.
17. Use database transactions for atomic multi-write operations.
18. Keep financial operations idempotent where required.
19. Record audit/admin actions where the system requires them.
20. Test permissions for every role before considering a feature
    complete.

------------------------------------------------------------------------

# 57. Final Product Principle

DalaalPrime should feel like one consistent marketplace, not five
separate applications.

The role changes: - available navigation, - dashboard statistics, -
permitted actions, - management pages, - moderation capabilities,

but the visual language, component behavior, feedback patterns,
validation style, responsiveness, and accessibility should remain
consistent across the entire platform.
