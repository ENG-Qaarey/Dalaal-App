-- Add user presence fields
ALTER TABLE "users" ADD COLUMN "last_seen_at" TIMESTAMP(3);

ALTER TABLE "users"
ADD COLUMN "is_online" BOOLEAN NOT NULL DEFAULT false;