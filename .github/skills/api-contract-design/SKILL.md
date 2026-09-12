---
name: api-contract-design
description: "Design, review, or implement maintainable HTTP and REST APIs as stable contracts. Use for resource-oriented URLs, status codes, DTOs, error contracts, validation, pagination, filtering, sorting, security, authorization, versioning, and API design checklists."
argument-hint: "Describe the API use case, endpoint, or design you want to create or review"
---

# API Contract Design

Design the API as a contract between the server and its clients, not as a direct projection of the database. Produce a clear endpoint contract, implementation guidance, and a verification checklist.

## When to Use

- Design a new endpoint or resource
- Review an existing HTTP or REST API
- Define request, response, error, and status-code contracts
- Separate API DTOs from domain or persistence models
- Plan pagination, filtering, sorting, security, authorization, or versioning
- Diagnose inconsistent API behavior or breaking client changes

## Procedure

1. Understand the business use case and identify the clients that consume it.
2. Identify the resource or resources involved. Prefer nouns in URLs and HTTP methods for normal CRUD operations.
3. Define the operation and decide whether it is a normal resource operation or a genuine business action. Use a resource-scoped action such as `POST /orders/{id}/cancel` only when the business action deserves its own transition.
4. Define the URL, HTTP method, path parameters, query parameters, headers, and request DTO.
5. Define the response DTO from client needs. Do not expose database entities, internal fields, password hashes, tokens, secrets, or implementation details.
6. Define success and failure status codes. Keep the mapping semantic and consistent across endpoints.
7. Define a predictable error contract with a stable machine-readable code, human-readable message, and structured validation details when applicable.
8. Define authentication and authorization separately. Authentication identifies the caller; authorization checks whether the caller may perform the operation. Enforce authorization on the server.
9. Define server-side validation for required fields, types, allowed values, business rules, ownership, and constraints. Treat frontend validation as a UX aid, not a security boundary.
10. For collection endpoints, define pagination and consider filtering and sorting. Whitelist filter and sort fields and set safe page-size limits.
11. Consider HTTPS, rate limiting for sensitive or public endpoints, sensitive-data minimization, query performance, indexes, and large-data behavior.
12. Consider evolution. Identify breaking changes, decide whether versioning is needed, and preserve old contracts until clients can migrate.
13. Keep the HTTP layer thin. Route from the controller or handler to an application use case, then map the result to the response DTO.
14. Implement and test the contract, including success, validation, authentication, authorization, not-found, conflict, and unexpected-error paths.
15. Review the final design with the checklist below before declaring it ready.

## Resource and HTTP Rules

Use resource-oriented URLs for standard operations:

```text
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
```

Avoid action-oriented top-level URLs such as `/getUsers`, `/createUser`, and `/deleteUser/5`.

Use query parameters for bounded collection concerns:

```text
GET /users?status=active&sort=name&page=1&pageSize=20
```

Do not expose arbitrary database columns through filtering or sorting. Define an explicit allowlist and validate every query parameter.

## Status-Code Rules

Use status codes as part of the contract rather than returning `200 OK` for every outcome:

- `200 OK`: successful read or update with a response body
- `201 Created`: successful resource creation, preferably with a `Location` header when applicable
- `204 No Content`: successful operation with no response body
- `400 Bad Request`: malformed or invalid request structure
- `401 Unauthorized`: missing or invalid authentication
- `403 Forbidden`: authenticated caller lacks permission
- `404 Not Found`: requested resource does not exist
- `409 Conflict`: request conflicts with current state, such as a duplicate username
- `422 Unprocessable Entity`: validation or business-input errors when this convention is used consistently
- `500 Internal Server Error`: unexpected server failure; do not expose internal details

Choose one consistent convention for validation errors and apply it across the API.

## Contract Shape

Use consistent naming, date formats, null handling, identifiers, pagination metadata, and error structure across the API. A typical collection response may look like:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

A typical error response may look like:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "The requested user was not found.",
    "details": {}
  }
}
```

Keep request and response DTOs separate from persistence models. A `CreateUserRequest`, `UpdateUserRequest`, `UserResponse`, and `UserEntity` have different responsibilities even when they contain overlapping fields.

## Decision Rules

- Design from business and client needs, not from table columns.
- A new capability is not automatically a new top-level endpoint; first check whether it is a resource operation, a query concern, or a resource-scoped business action.
- `401` and `403` are not interchangeable: the former concerns identity, the latter permission.
- A new response field is usually backward-compatible; changing or removing an existing field, changing its meaning, or changing required input may be breaking.
- Add pagination before a collection can grow beyond a bounded, intentionally small size. Pagination alone is not enough; inspect query plans and indexes.
- Never rely on hidden frontend controls for security.
- Return only the data needed by the client and avoid leaking sensitive or internal fields.
- Do not put validation, business rules, persistence, external-service calls, and response mapping into one controller action.

## Final Checklist

### Resource and contract

- [ ] URLs represent clear resources.
- [ ] HTTP methods match the intended operation.
- [ ] Business actions are resource-scoped and justified.
- [ ] Request and response DTOs are explicit.
- [ ] API models are independent from database entities.
- [ ] Naming, dates, nulls, IDs, and metadata follow one convention.

### HTTP and errors

- [ ] Success and failure status codes have defined meanings.
- [ ] `201`, `401`, `403`, `404`, and validation responses are distinguished where applicable.
- [ ] Errors have stable machine-readable codes and predictable details.
- [ ] Unexpected errors do not reveal internal implementation details.

### Querying and scale

- [ ] Collection endpoints have appropriate pagination and page-size limits.
- [ ] Filtering and sorting use allowlisted fields.
- [ ] Query performance and indexes have been considered.
- [ ] The response size is appropriate for the client use case.

### Security and architecture

- [ ] HTTPS is used where credentials or private data are involved.
- [ ] Server-side validation is present.
- [ ] Authentication and authorization are separate.
- [ ] Authorization and ownership checks run on the server.
- [ ] Sensitive data is not returned unnecessarily.
- [ ] Rate limiting is considered for login, OTP, password reset, and public endpoints.
- [ ] Controllers or handlers remain thin and delegate business logic.

### Evolution and verification

- [ ] Breaking changes have been identified.
- [ ] Versioning or a migration strategy exists when needed.
- [ ] Contract tests cover success, errors, validation, authentication, and authorization.
- [ ] The design can evolve without silently breaking existing clients.
