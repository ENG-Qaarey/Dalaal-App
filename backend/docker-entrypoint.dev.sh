#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Syncing schema..."
npx prisma db push --accept-data-loss --skip-generate

echo "Starting backend..."
exec npm run start:dev
