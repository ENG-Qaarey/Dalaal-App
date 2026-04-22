# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create NestJS project
nest new api --strict

# Navigate into api folder
cd api

# ============================================
# INSTALL CORE NESTJS DEPENDENCIES
# ============================================

# Install NestJS core modules
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/platform-socket.io @nestjs/websockets

# Install NestJS additional modules
npm install @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/throttler @nestjs/cache-manager

# Install Prisma & database
npm install @prisma/client prisma

# Install Redis for caching/sessions
npm install redis ioredis @nestjs/cache-manager cache-manager-redis-store

# Install Socket.IO for real-time chat
npm install socket.io

# Install email & SMS services
npm install @sendgrid/mail africastalking

# Install utilities
npm install slugify date-fns uuid

# Install dev dependencies
npm install -D @types/node @types/uuid ts-node tsconfig-paths


// Core Models
- User
- Profile
- IdentityVerification
- Listing
- Property
- Vehicle
- ListingImage
- ListingDocument
- Conversation
- Message
- Payment
- Escrow
- Notification
- Review
- SavedSearch
- Favorite
- AdminAction
- AnalyticsEvent