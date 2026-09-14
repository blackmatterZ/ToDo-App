# Ionic + NestJS Cross-Platform Todo App (v2)

A production-ready Todo application built with Ionic React (frontend), NestJS (backend), SQLite (database), and Docker Compose. Designed to run seamlessly across **Linux**, **macOS**, and **Windows** with a single command.

---

## ⚡ Quick Start (Single Command)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (macOS/Windows) or [Docker Engine + Compose v2](https://docs.docker.com/engine/install/) (Linux).

### Run Application
Clone the repository and launch the container with a single command:

```bash
git clone https://github.com/blackmatterZ/ToDo-App.git
cd Todo-App
docker compose up -d
```

Access the app in your browser at: **[http://localhost:3000](http://localhost:3000)**

*(Optional) If pulling the image from Docker Hub fails, you can build it manually:*
```bash
docker build -t 0xhurricane/todo-app:v1 .
docker compose up -d
```

---

## 🌟 Key Features (v2)

- **Todos Management**: Create, list, toggle completion, and delete todos.
- **Debounced Search**: Real-time title search (`GET /api/todos?search=<text>`).
- **Categories**: Create and assign custom-colored categories to todos. Filter by category.
- **Statistics Dashboard**: Live summary cards (Total, Completed, Pending) and category distribution donut chart.
- **Design System (Light & Dark Mode)**: Modern UI inspired by modern dashboard aesthetics, featuring CSS variables, status pills, and persisted local storage theme toggle.
- **Cross-Platform Compatibility**: Uses `.gitattributes` to force LF line endings across systems and Docker named volumes for SQLite to prevent host permission mismatches across Linux, macOS, and Windows.

---

## 🛠️ Tech Stack & Monorepo Structure

```text
interviewTask/
├── backend/            # NestJS + TypeORM + SQLite
│   └── src/
│       ├── todos/      # Todos Module (CRUD, Search, Filter, Pagination)
│       ├── categories/ # Categories Module (CRUD)
│       ├── statistics/ # Statistics Module (Aggregations)
│       └── common/     # Global filters & pipes
├── frontend/           # Ionic React + Vite + TypeScript + Recharts
│   └── src/
│       ├── pages/      # Todos, Categories, Statistics views
│       ├── components/ # Shared Layout (Sidebar, Topbar, Theme Toggle)
│       ├── theme/      # Light & Dark theme tokens
│       └── services/   # Typed API client
├── docs/
│   ├── api-contract.md # Formal API Contract Specification
│   └── review.md       # Grill-with-docs Quality Review
├── Dockerfile          # Multi-stage container build (non-root runner)
├── docker-compose.yml  # One-command compose deployment with volume & healthcheck
├── .gitattributes      # Enforces LF line endings for cross-platform builds
├── .env.example        # Environment variable template
└── README.md
```

---

## 🖥️ Cross-Platform Execution Details

| Operating System | Command | Notes |
|---|---|---|
| **Linux** | `docker compose up -d` | Uses Docker Engine v2 |
| **macOS** | `docker compose up -d` | Works on Intel and Apple Silicon (ARM64) via Docker Desktop |
| **Windows** | `docker compose up -d` | Works in PowerShell / CMD / WSL2 via Docker Desktop |

### Why Single Command Works Reliably Across All Operating Systems:
1. **Line Endings (`.gitattributes`)**: Enforces `LF` line endings for `Dockerfile`, scripts, and configuration files regardless of git `core.autocrlf` setting on Windows.
2. **Named Volume Storage (`todo-data`)**: Uses a Docker named volume instead of a host bind mount for SQLite, eliminating Windows/Linux host path format incompatibilities and permission failures.
3. **Compose V2 Syntax**: Standardized `docker compose` command supported natively on Docker Desktop and modern Docker CLI plugins.

---

## 📡 API Reference Summary

All endpoints are served under the `/api` prefix:

| Method | Endpoint | Description | Query Params |
|---|---|---|---|
| `GET` | `/api/todos` | List todos | `page`, `pageSize`, `search`, `categoryId` |
| `POST` | `/api/todos` | Create todo | - |
| `GET` | `/api/todos/:id` | Get single todo | - |
| `PATCH` | `/api/todos/:id` | Update todo | - |
| `DELETE` | `/api/todos/:id` | Delete todo | - |
| `GET` | `/api/categories` | List categories | `page`, `pageSize` |
| `POST` | `/api/categories` | Create category | - |
| `DELETE` | `/api/categories/:id` | Delete category | - |
| `GET` | `/api/statistics` | Get aggregations | - |

---

## 🔒 Security Scope & OWASP Alignment

- **OWASP A03 (Injection)**: Prevented via TypeORM parameterized query builders.
- **OWASP A05 (Security Misconfiguration)**: Non-root container user (`USER node`), Helmet HTTP security headers, disabled `X-Powered-By`, explicit CORS whitelist.

### Known Limitations

- No rate limiting is implemented on any API endpoint.
- Input DTOs validate type/shape only, not length or format constraints.

---

## 📜 License

MIT License
