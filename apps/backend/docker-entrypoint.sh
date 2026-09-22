#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️ ERROR: DATABASE_URL environment variable is missing!"
  echo "Please add DATABASE_URL in your hosting provider's Environment Variables settings."
  exit 1
fi

echo "⏳ Syncing database schema with Prisma..."
npx prisma db push --skip-generate || echo "Notice: db push finished with warnings."

echo "🌱 Ensuring initial data seed..."
npm run db:seed || echo "Notice: database already seeded or skipped."

echo "🚀 Starting SamadhanSetu Backend Server..."
exec node dist/server.js
