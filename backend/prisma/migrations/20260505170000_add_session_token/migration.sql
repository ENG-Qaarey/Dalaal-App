-- Add session_token for single-device sessions
ALTER TABLE "users" ADD COLUMN "session_token" TEXT;