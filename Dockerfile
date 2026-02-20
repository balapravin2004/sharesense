# ------------ Stage 1: Builder ------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install all dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Initialize database during build
ENV DATABASE_URL=file:./dev.db
RUN npx prisma db push --force-reset

# Copy entire project
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
#ARG SUPABASE_SERVICE_ROLE_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
#ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Build app
RUN npm run build

#--------------------------------------------------------------------------------------------------------------------------

# ------------ Stage 2: Production ------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create writable DB folder and initialize database
RUN mkdir -p /data && chown -R appuser:appgroup /data
USER root
ENV DATABASE_URL=file:/data/dev.db
RUN npx prisma db push --force-reset
USER appuser

VOLUME ["/data"]

USER appuser

EXPOSE 3000

CMD ["npm", "run", "start:socket"]
