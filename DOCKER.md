# Dalaal Connect - Docker Setup

## Overview

This setup provides a complete Docker-based development environment for Dalaal Connect.

```
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (Port 80)                       │
│                  (Reverse Proxy & Static)                   │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│     Web (Next.js)        │      Backend (NestJS)           │
│     Container            │      Container                  │
│     Port 3000            │      Port 3002                   │
│                          │                                  │
├──────────────────────────┴──────────────────────────────────┤
│                                                              │
│              PostgreSQL Container (Port 5432)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    Dalaal-app (External)
```

## Quick Start

### 1. Prerequisites

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Included with Docker Desktop

### 2. Start Development Environment

```bash
# Navigate to project root
cd Dalaal

# Start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 3. Access Services

| Service       | URL                        |
|---------------|----------------------------|
| Web           | http://localhost           |
| Backend API   | http://localhost/api       |
| Backend Direct| http://localhost:3002      |
| PostgreSQL    | localhost:5432             |

## Services

### PostgreSQL (Database)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Credentials**: See .env.docker
- **Data**: Persisted in `postgres_data` volume

### Backend (NestJS API)
- **Port**: 3002
- **Hot Reload**: Yes (via volume mounts)
- **Prisma**: Auto-generated on startup

### Web (Next.js Frontend)
- **Port**: 3000
- **Hot Reload**: Yes (via volume mounts)

### Nginx (Reverse Proxy)
- **Port**: 80
- **Routes**:
  - `/api/*` → Backend
  - `/*` → Web
  - `/socket.io/*` → Backend (WebSocket)

## Common Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build web

# Restart specific service
docker-compose restart backend

# Access container shell
docker exec -it dalaal-backend sh
docker exec -it dalaal-postgres psql -U postgres
```

## Database Management

```bash
# Run migrations (inside backend container)
docker exec -it dalaal-backend npx prisma migrate dev

# Open Prisma Studio
docker exec -it dalaal-backend npx prisma studio

# Reset database
docker exec -it dalaal-backend npx prisma migrate reset
```

## Environment Variables

Copy `.env.docker` to `.env` and update values:

```bash
cp .env.docker .env
```

Key variables:
- `DB_PASSWORD` - PostgreSQL password
- `SMTP_*` - Email configuration
- `STREAM_*` - Video/chat API (optional)

## Dalaal-app (Mobile) Connection

The mobile app connects to the backend via:

**Development:**
```env
# Android Emulator (use 10.0.2.2 for localhost)
API_URL=http://10.0.2.2:3002/api

# iOS Simulator
API_URL=http://localhost:3002/api
```

**Production:**
```env
# After deploying to server
API_URL=http://your-server-ip/api
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 80
netstat -ano | findstr :80

# Or use Docker port check
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify database is healthy
docker-compose ps
```

### Backend Build Fails
```bash
# Clear node_modules and rebuild
docker-compose down
docker volume rm dalaal_backend_node_modules
docker-compose up --build
```

### Web Hot Reload Not Working
```bash
# Ensure volume mounts are correct
# Check docker-compose.yml has:
volumes:
  - ./web:/app
  - /app/node_modules
```

## Production Build

For production deployment, use the production Dockerfiles:

```bash
# Edit docker-compose.yml to use:
# build: ./backend  (uses Dockerfile, not Dockerfile.dev)

# Build and start
docker-compose -f docker-compose.yml up -d --build
```

## Cleanup

```bash
# Remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker system prune -a
```

## License

MIT