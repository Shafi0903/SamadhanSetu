FROM node:22-slim AS builder

WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/types/package.json ./packages/types/

# Install monorepo dependencies
RUN npm ci

# Copy frontend source and types
COPY packages/types ./packages/types
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

ARG NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production Runner
FROM node:22-slim AS runner

WORKDIR /app/apps/frontend

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy node modules and built application
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/frontend/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
