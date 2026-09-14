# ==============================================================================
# Stage 1: Frontend Builder
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

RUN npm ci

# Run security audit during build phase (non-blocking audit check)
RUN npm audit --audit-level=high || true

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
# Stage 3: Production Runner (lean — non-root)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/todos.sqlite
ENV STATIC_DIR=/app/frontend/dist

COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN apk add --no-cache python3 make g++ && \
    npm ci --omit=dev && npm cache clean --force && \
    apk del python3 make g++

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Fast targeted chown for non-root user
RUN mkdir -p /app/data && chown -R node:node /app/data /app/backend/dist /app/frontend/dist /app/package.json

USER node

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/todos || exit 1

CMD ["node", "backend/dist/main"]
