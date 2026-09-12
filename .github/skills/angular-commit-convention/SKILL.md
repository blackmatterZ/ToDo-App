---
name: angular-commit-convention
description: "Create, review, or rewrite Git commit messages using the Angular convention with the allowed types feat, fix, refactor, test, docs, chore, build, ci, and perf."
argument-hint: "Describe the change or provide a commit message to validate"
---

# Angular Commit Convention

Create or validate Git commit messages with this format:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Allowed Types

Use only one of these types:

- `feat`: a new feature, endpoint, UI component, or user-visible capability
- `fix`: a correction to incorrect behavior
- `refactor`: a structural change with no behavior change
- `test`: tests only
- `docs`: README or documentation changes
- `chore`: configuration, dependency, or `.gitignore` changes
- `build`: Dockerfiles or build scripts
- `ci`: CI/CD automation or registry publishing
- `perf`: a performance improvement without behavior change

## Procedure

1. Identify the primary purpose of the change. If it combines unrelated purposes, recommend separate commits.
2. Select exactly one allowed type from the list above.
3. Choose a short, precise scope such as `api`, `ui`, `auth`, `deps`, or `ci`. Omit the scope only when no meaningful scope exists.
4. Write an imperative, concise subject after `:`, without a trailing period. Keep it focused on the result.
5. Add a body only when context, motivation, tradeoffs, or behavior details are needed. Separate it from the subject with one blank line.
6. Add a footer only for issue references, breaking-change notes, or other repository-required metadata. Separate it from the body with one blank line.
7. Validate that the type is allowed, the header follows `<type>(<scope>): <subject>`, and the message describes the actual change.

## Decision Rules

- New behavior is `feat`; correcting existing behavior is `fix`.
- Code organization without behavior change is `refactor`.
- Changes limited to tests are `test`; changes limited to documentation are `docs`.
- Tooling and dependency maintenance are `chore`, unless the change specifically belongs to build or CI automation.
- Use `perf` only when the purpose is performance improvement and behavior remains unchanged.
- Do not invent new types or silently relabel a change to fit the convention. Explain the closest valid type when the change is ambiguous.

## Examples

```text
feat(auth): add password reset endpoint
fix(ui): preserve form values after validation errors
refactor(api): extract request validation helper
test(users): cover duplicate email handling
docs(readme): document local setup
chore(deps): update validation library
build(docker): add production image target
ci(github): run tests on pull requests
perf(search): cache normalized query terms
```

When reviewing an existing message, report the violation and provide a corrected message without changing the intended meaning.
