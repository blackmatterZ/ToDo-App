# Ionic + NestJS + Docker Todo App

A fullstack Todo Application built with **Ionic React**, **NestJS**, and **SQLite (TypeORM)**, containerized with **Docker** and **Docker Compose**.
A fullstack Todo Application built with **Ionic React**, **NestJS**, and **SQLite (TypeORM)**,
containerized with **Docker** and **Docker Compose**.

## Project Goals
---

- **Zero-configuration execution**: Spin up the complete application via `docker compose up`.
- **Integrated Architecture**: NestJS serves both the backend REST API (`/api/todos`) and the compiled Ionic React static SPA frontend.
- **OWASP Top 10 Security**: Comprehensive security best practices baked into every layer (strict input validation, security headers via Helmet, restricted CORS, production error masking, unprivileged Docker non-root user, rate limiting, and zero hardcoded credentials).
- **Atomic Commits**: Structured according to the Angular Commit Convention with clear provenance and security annotations.
## 🚀 One‑Command Quickstart (any OS)

> **Prerequisite**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose) must be installed.

```bash
docker compose up --build
```

That's it. Docker will:
1. Build the Ionic React frontend.
2. Build the NestJS backend.
3. Bundle both into a lean production image.
4. Start the container on **port 3000** with a persistent SQLite database.

Open **http://localhost:3000** in your browser. ✅

To stop:
```bash
docker compose down
```

To stop and **delete** the database volume:
```bash
docker compose down -v
```

---

## Architecture

```
docker compose up --build
        │
        ▼
┌──────────────────────────────┐
│   Docker Container (port 3000)│
│                              │
│  NestJS (node backend/dist)  │
│  ├── /api/*   → REST API     │
│  └── /*       → Ionic SPA    │
│       (frontend/dist)        │
│                              │
│  SQLite DB (/app/data/)      │
│  mounted → named volume      │
└──────────────────────────────┘
```

The backend serves the compiled Ionic React app as static files, so there is
only one process and one port to expose.

---

## Environment Variables

All variables have production‑safe defaults inside the image. Override them via
`docker-compose.yml` or by copying `.env.example` → `.env`.

| Variable       | Default (in image)        | Description                          |
|----------------|---------------------------|--------------------------------------|
| `NODE_ENV`     | `production`              | Node environment                     |
| `PORT`         | `3000`                    | Listening port                       |
| `DB_PATH`      | `/app/data/todos.sqlite`  | SQLite database file path            |
| `STATIC_DIR`   | `/app/frontend/dist`      | Path to compiled frontend assets     |
| `CORS_ORIGIN`  | `http://localhost:3000`   | Comma‑separated allowed CORS origins |
| `THROTTLE_TTL` | `60000`                   | Rate‑limit window in ms              |
| `THROTTLE_LIMIT`| `100`                    | Max requests per window per IP       |

---

## API Reference

Base URL: `http://localhost:3000/api`

| Method   | Endpoint         | Description         |
|----------|------------------|---------------------|
| `GET`    | `/todos`         | List all todos      |
| `POST`   | `/todos`         | Create a todo       |
| `GET`    | `/todos/:id`     | Get a single todo   |
| `PATCH`  | `/todos/:id`     | Update a todo       |
| `DELETE` | `/todos/:id`     | Delete a todo       |

**Create body example:**
```json
{ "title": "Buy milk", "completed": false }
```

---

## Security (OWASP Top 10)

| Risk | Mitigation |
|------|------------|
| A01 – Broken Access Control | SPA fallback excludes `/api/*` |
| A02 – Cryptographic Failures | No hardcoded secrets; env‑driven config; `.env` git‑ignored |
| A03 – Injection | TypeORM parameterized queries + global `ValidationPipe` |
| A04 – Insecure Design | Rate limiting via `@nestjs/throttler` |
| A05 – Security Misconfiguration | Helmet headers, X‑Powered‑By disabled, restrictive CORS |
| A06 – Vulnerable Components | Pinned base image, production‑only deps in runner stage |

---

## Development (without Docker)

**Backend**
```bash
cd backend
npm install
npm run start:dev   # http://localhost:3000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev         # http://localhost:5173 (proxies /api → :3000)
```

**Tests**
```bash
# Backend unit + e2e
cd backend && npm test && npm run test:e2e

# Frontend components
cd frontend && npm test
```
