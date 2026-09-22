FROM node:22-slim AS builder

WORKDIR /app

# Install openssl for Prisma engine compatibility
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy root and package manifests
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/backend/package.json ./apps/backend/

# Install monorepo dependencies
RUN npm ci

# Copy types and backend source
COPY packages/types ./packages/types
COPY apps/backend ./apps/backend

# Generate Prisma client and compile TypeScript
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN npm run build

# Production Runner
FROM node:22-slim AS runner

WORKDIR /app/apps/backend

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=5000

# Copy workspace dependencies and built artifacts
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=builder /app/apps/backend/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
