#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
npx prisma db push --skip-generate

echo "🌱 Seeding database if not already seeded..."
npm run db:seed || echo "Seed skipped or already populated."

echo "🚀 Starting SamadhanSetu Backend Server..."
exec node dist/server.js
