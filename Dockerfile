# ==============================================================================
# Stage 1: Frontend Builder
# Uses root monorepo lockfile so npm ci works correctly.
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install native build tools (needed by some npm packages)
RUN apk add --no-cache python3 make g++

# Copy root workspace manifests first (layer-cache friendly)
COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

# Install ALL workspace deps using the root lockfile
RUN npm ci

# Copy frontend source and build
COPY frontend/ ./frontend/
RUN npm --workspace=frontend run build

# ==============================================================================
# Stage 2: Backend Builder
# ==============================================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

COPY backend/ ./backend/
RUN npm --workspace=backend run build

# ==============================================================================
# Stage 3: Production Runner  (lean — no devDeps, no build tools)
# security: OWASP A05 - run as non-root, no extra packages
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/todos.sqlite
ENV STATIC_DIR=/app/frontend/dist

# Install only production deps using the root lockfile
COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled artefacts from builder stages
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Ensure writable data dir and fix ownership before switching user
RUN mkdir -p /app/data && chown -R node:node /app

# security: OWASP A05 - unprivileged non-root user
USER node

EXPOSE 3000
CMD ["node", "backend/dist/main"]
