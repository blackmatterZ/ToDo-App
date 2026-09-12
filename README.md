# Ionic + NestJS + Docker Todo App

A fullstack Todo Application built with **Ionic React**, **NestJS**, and **SQLite (TypeORM)**, containerized with **Docker** and **Docker Compose**.

## Project Goals

- **Zero-configuration execution**: Spin up the complete application via `docker compose up`.
- **Integrated Architecture**: NestJS serves both the backend REST API (`/api/todos`) and the compiled Ionic React static SPA frontend.
- **OWASP Top 10 Security**: Comprehensive security best practices baked into every layer (strict input validation, security headers via Helmet, restricted CORS, production error masking, unprivileged Docker non-root user, rate limiting, and zero hardcoded credentials).
- **Atomic Commits**: Structured according to the Angular Commit Convention with clear provenance and security annotations.
