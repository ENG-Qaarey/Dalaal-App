# Dalaal — All Credentials & Secrets

## All Seed Accounts (Password: `12345678`)

| Email                  | Role             | Username        | Phone     |
|------------------------|------------------|-----------------|-----------|
| `admin@dalaal.so`      | SUPER_ADMIN      | superadmin      | 614463895 |
| `broker@dalaal.so`     | BROKER           | dalaalbroker    | 614463896 |
<!-- | `property@dalaal.so`   | PROPERTY_OWNER   | propertyowner   | 614463897 |
| `vehicle@dalaal.so`    | VEHICLE_OWNER    | vehicleowner    | 614463898 | -->
| `customer@dalaal.so`   | CUSTOMER         | customer1       | 614463899 |

> Seeded via `backend/prisma/seed.ts`. All accounts are ACTIVE with email + phone verified.

---

## PostgreSQL Database (Local)

| Field      | Value                                              |
|------------|----------------------------------------------------|
| Host       | `localhost:5432`                                   |
| User       | `postgres`                                         |
| Password   | `1234`                                             |
| Database   | `Dalaal-App`                                       |
| Full URL   | `postgresql://postgres:1234@localhost:5432/Dalaal-App` |

---

## PostgreSQL Database (Neon Cloud — commented out)

| Field      | Value                                              |
|------------|-----------------------------------------------------|
| User       | `neondb_owner`                                     |
| Password   | `npg_rISh3atln9ZL`                                 |
| Host       | `ep-lively-heart-aou2daun-pooler.c-2.ap-southeast-1.aws.neon.tech` |
| Database   | `neondb`                                           |
| Full URL   | `postgresql://neondb_owner:npg_rISh3atln9ZL@ep-lively-heart-aou2daun-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |

---

## JWT Secrets

| Field             | Value                                                            |
|-------------------|------------------------------------------------------------------|
| JWT Secret        | `dalaal_jwt_sK9x2mP7vQ4wL8nR3jT6yH5bC1eF0gA9uI4oW2qZ`          |
| JWT Refresh Secret| `dalaal_refresh_tF8kM3nP6xS2wQ9vR5yL1jT7hB4eC0aG8uI3oW6qZ`     |
| Access Token TTL  | 7 days (604800s)                                                |
| Refresh Token TTL | 30 days (2592000s)                                              |

---

## SMTP / Email

| Field      | Value                   |
|------------|-------------------------|
| Host       | `smtp.gmail.com`        |
| Email      | `muscabqaarey@gmail.com`|
| App Password| `xcga typr zzsh jpdd`  |

---

## API & Server

| Field      | Value                   |
|------------|-------------------------|
| Backend Port| `3005`                 |
| API URL    | `http://localhost:3005/api` |
| LAN IP     | `192.168.137.110`       |
| Mobile API | `http://192.168.137.110:3005/api` |
| Mobile Socket| `http://192.168.137.110:3005/chat` |
| Web API    | `http://localhost:3005/api` |

---

## User Roles

| Role              | Description                               | Permissions |
|-------------------|-------------------------------------------|-------------|
| `SUPER_ADMIN`     | Platform admin, full access               | 70          |
| `BROKER`          | Professional Dalaal, lists both            | 42          |
| `PROPERTY_OWNER`  | Lists properties for sale/rent             | 39          |
| `VEHICLE_OWNER`   | Lists vehicles for sale/rent               | 39          |
| `CUSTOMER`        | Buyer/renter, default role                 | 27          |

---

## User Statuses

`ACTIVE` · `SUSPENDED` · `BANNED` · `PENDING_VERIFICATION` · `INACTIVE`

---

## RBAC Permission System

### How It Works

1. **Permissions** are stored in the `permissions` table (70 granular permissions)
2. **Role-Permission mappings** are stored in `role_permissions` (which roles get which permissions)
3. JWT tokens include the user's permissions array
4. Controllers use `@Permissions(Permission.XXX)` decorator to require specific permissions
5. `PermissionsGuard` checks if the user's permissions include the required ones

### Permission Groups

| Group           | Permissions                                            |
|-----------------|--------------------------------------------------------|
| User Management | user:view, user:list, user:create, user:update, user:delete, user:suspend, user:ban, user:restore, user:change_role |
| Profile         | profile:view_own, profile:edit_own, profile:view_any   |
| Listings        | listing:view, listing:create, listing:edit_own, listing:delete_own, listing:feature, listing:archive_own |
| Moderation      | listing:approve, listing:reject, listing:view_all      |
| Property        | property:create, property:edit_own, property:delete_own |
| Vehicle         | vehicle:create, vehicle:edit_own, vehicle:delete_own    |
| Payments        | payment:create, payment:view_own, payment:verify, payment:view_all |
| Escrow          | escrow:create, escrow:view_own, escrow:release, escrow:dispute, escrow:view_all |
| Chat            | chat:use, message:send, message:delete_own, message:delete_any |
| Notifications   | notification:view_own, notification:manage, notification:send_broadcast |
| Reviews         | review:create, review:view, review:delete_own, review:manage |
| Verification    | verification:submit, verification:view_own, verification:view_all, verification:approve, verification:reject |
| Admin           | admin:dashboard, admin:analytics, admin:settings, admin:announcements, admin:audit_log |
| Reports         | report:submit, report:view_all, report:resolve         |
| Search          | search:use, search:saved                                |
| Uploads         | upload:image, upload:document                           |
| Favorites       | favorite:add, favorite:remove, favorite:view_own        |
| Agents          | agent:stats_own, agent:leads_own, agent:listings_own    |

### Re-seed Permissions

```bash
cd backend
npx ts-node prisma/seed-permissions.ts
```

### Controller Usage

```ts
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

// Single permission
@Permissions(Permission.LISTING_CREATE)

// Multiple permissions (user needs ANY one)
@Permissions(Permission.VERIFICATION_APPROVE, Permission.VERIFICATION_REJECT)

// Combined with Roles (both must pass)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Roles(UserRole.SUPER_ADMIN)
@Permissions(Permission.ADMIN_DASHBOARD)
```

---

## Auth API Endpoints (Public)

| Method | Endpoint                    | Rate Limit     |
|--------|-----------------------------|----------------|
| POST   | `/auth/register`            | 5 per 60s      |
| POST   | `/auth/login`               | 10 per 60s     |
| POST   | `/auth/verify-email`        | —              |
| POST   | `/auth/resend-verification` | —              |
| POST   | `/auth/send-otp`            | —              |
| POST   | `/auth/verify-otp`          | —              |
| POST   | `/auth/refresh`             | —              |
| POST   | `/auth/forgot-password`     | —              |
| POST   | `/auth/reset-password`      | —              |

## Auth API Endpoints (JWT Required)

| Method | Endpoint                    |
|--------|-----------------------------|
| POST   | `/auth/verify-phone`        |
| POST   | `/auth/logout`              |
