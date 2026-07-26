# DalaalPrime — Project Plan

> **Project:** DalaalPrime — Web-Based Property Marketplace  
> **Document:** Plan / Requirements Overview  
> **Date:** 2026-07-23  
> **Status:** Draft

---

## 2.1 Scope Statement

The Scope Statement explains what the DalaalPrime: Web-Based Property Marketplace project will include and what it will not include. It defines the boundaries of the project so that everyone involved clearly understands its goals, features, and limitations. A clear scope helps the project team stay focused, avoid unnecessary work, use resources effectively, and complete the project on time while meeting the required quality standards.

---

## 2.2 Requirements Analysis

Requirements analysis is the process of identifying, documenting, and validating the needs and expectations of users and stakeholders. It helps ensure that the DalaalPrime system provides the required features and performs efficiently. The requirements are divided into functional requirements, non-functional requirements, and user requirements.

---

## ✅ What IS Needed (In Scope)

### 2.2.1 Functional Requirements

Functional requirements describe the features and functions that the DalaalPrime system **must** provide.

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | **User Registration & Authentication** | The system allows users to register and log in securely. |
| 2 | **Role-Based Access Control** | The system shall provide role-based access for **Admin**, **Broker/Owner**, and **Customer**. |
| 3 | **Profile Management** | The system allows users to manage their profiles. |
| 4 | **Property Listing Management** | Brokers and property owners can **add, edit, delete, and manage** property listings. |
| 5 | **Media Upload & Viewing** | The system allows users to **upload and view** property photos and video clips. |
| 6 | **Property Search & Filtering** | The system should provide property search and filtering features. |
| 7 | **Property Detail Display** | The system shall display detailed information about each property. |
| 8 | **Favorites** | The system shall allow customers to **save properties as favorites**. |
| 9 | **Real-Time Chat** | The system should provide **real-time chat** between customers and brokers/property owners. |
| 10 | **Notifications** | The system shall send **notifications** for important activities. |
| 11 | **Role-Based Dashboards** | The system should provide **dashboards** for different user roles. |
| 12 | **Admin Management** | The system shall allow administrators to **manage users and property listings**. |
| 13 | **Reports & Statistics** | The system shall **generate basic reports and statistics**. |
| 14 | **Input Validation** | The system shall **validate user input** and display appropriate error messages. |

### 2.2.2 Non-Functional Requirements

Non-functional requirements describe the **quality and performance standards** of the system.

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | **Usability** | The system should be **easy to use** with a simple and user-friendly interface. |
| 2 | **Security** | The system should provide **secure user authentication** and protect user data. |
| 3 | **Performance** | The system should **respond quickly** to user requests. |
| 4 | **Availability** | The system should be **available whenever users need** to access it. |
| 5 | **Concurrency** | The system should **support multiple users** at the same time. |
| 6 | **Browser Compatibility** | The system should **work correctly on modern web browsers**. |
| 7 | **Responsive Design** | The system should have a **responsive design** for desktop, tablet, and mobile browsers. |
| 8 | **Data Integrity** | The system should **maintain accurate and consistent data**. |
| 9 | **Maintainability** | The system should be **easy to maintain and update**. |
| 10 | **Reliability** | The system should provide **reliable performance with minimal errors**. |

---

## ❌ What is NOT Needed (Out of Scope)

The following features are **explicitly excluded** from the DalaalPrime MVP scope. They may be considered for future phases but are **not** part of the current project deliverables.

| # | Feature | Reason for Exclusion |
|---|---------|---------------------|
| 1 | **Vehicle Marketplace** | The project scope is limited to **property** listings only. Vehicle buying/selling is out of scope. |
| 2 | **7-Role System** | Only **3 roles** are required: Admin, Broker/Owner, Customer. The extended roles (SUPER_ADMIN, MODERATOR, VERIFIED_DALAAL, REGULAR_DALAAL, PROPERTY_OWNER, VEHICLE_OWNER) are not needed. |
| 3 | **Voice/Video Calls** | Real-time communication is limited to **text chat** only. Voice and video call functionality is out of scope. |
| 4 | **Mobile Money Payments** | Payment integration (EVC+, ZAAD, SAHAL, CASH) is **not** part of this phase. No payment processing or escrow functionality. |
| 5 | **Escrow Protection** | Escrow-backed transactions and dispute resolution are out of scope for the MVP. |
| 6 | **Identity Verification** | Document-based identity verification (ID, passport, license) is not required. |
| 7 | **Social Media "Clips" Feature** | The walkthrough video "Clips" social-media-style feature is out of scope. |
| 8 | **Multi-Factor Authentication (MFA)** | Only standard username/password authentication is needed. 2FA/MFA is not required. |
| 9 | **Multi-Language Support** | The system will support a single language (English) in the MVP. Internationalization is out of scope. |
| 10 | **Advanced Analytics** | Only **basic reports and statistics** are needed. Advanced analytics, predictive modeling, and AI-driven insights are out of scope. |
| 11 | **Offline Mode** | The system operates online only. Progressive Web App (PWA) offline capabilities are not required. |
| 12 | **Third-Party Integrations (beyond chat)** | Integrations with external services (maps, CRM, external APIs) beyond the core chat functionality are out of scope. |

---

## 📋 Summary

| Category | Status |
|----------|--------|
| Property listings (CRUD) | ✅ In Scope |
| User auth & profiles | ✅ In Scope |
| Role-based access (3 roles) | ✅ In Scope |
| Media upload (photos/video) | ✅ In Scope |
| Search & filtering | ✅ In Scope |
| Favorites | ✅ In Scope |
| Real-time chat | ✅ In Scope |
| Notifications | ✅ In Scope |
| **Admin Dashboard** | ✅ **Implemented** |
| **Broker/Owner Dashboard** | ✅ **Implemented** |
| **Customer Dashboard** | ✅ **Implemented** |
| Basic reports | ✅ In Scope |
| Input validation | ✅ In Scope |
| Vehicle marketplace | ❌ Out of Scope |
| Payments / Escrow | ❌ Out of Scope |
| Voice/Video calls | ❌ Out of Scope |
| Identity verification | ❌ Out of Scope |
| Social Clips | ❌ Out of Scope |
| 7-role system | ❌ Out of Scope |

---

## 🔧 Dashboard Implementation Details

### 1. Admin Dashboard (`/pages/admin`)
- Platform overview with KPIs (users, listings, pending approvals)
- Quick actions: Manage Properties, Manage Users, View Reports, Messages
- Links to: Analytics, Reports, Properties (categories, pending), Users
- **Backend:** Connected to `/api/admin/stats` for live data
- **Sidebar:** Properties, Users, Reports, Settings (no vehicles/payments/escrow)

### 2. Broker / Owner Dashboard (`/pages/broker`)
- My Listings count (live from API)
- Quick create listing link
- Client inquiries & messages cards
- Property-focused content (no earnings/payments section)
- **Sidebar:** Dashboard, My Listings, Clients, Messages, Settings

### 3. Customer Dashboard (`/pages/customer`)
- Search Properties link
- My Favorites with live count
- Messages & My Bookings cards
- Property-focused (no vehicle references)
- **Sidebar:** Home, My Favorites, Messages, My Bookings, Settings

### Route Mapping
| Backend Role | Dashboard Route |
|---|---|
| SUPER_ADMIN, MODERATOR | `/pages/admin` |
| BROKER, PROPERTY_OWNER, VEHICLE_OWNER, REGULAR_DALAAL, VERIFIED_DALAAL | `/pages/broker` |
| CUSTOMER | `/pages/customer` |

### Register Page
- Only 3 role options: Customer, Broker/Dalaal, Property Owner
- Vehicle Owner removed (out of scope)
