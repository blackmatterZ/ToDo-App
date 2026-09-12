---
name: grill-with-docs
description: "Perform a rigorous code, configuration, Docker, API, or architecture review backed by official documentation. Use for critical review, bug hunting, risk assessment, and evidence-based findings with severity, exact locations, and actionable fixes."
argument-hint: "Describe what to review and which official documentation or framework rules matter"
user-invocable: true
---

# Grill With Docs

Perform a skeptical, evidence-based review. Look for bugs, security risks, behavioral regressions, reliability problems, portability issues, and missing tests. Be direct, but distinguish proven defects from risks, recommendations, and open questions.

## When to Use

- Review code, Dockerfiles, CI configuration, infrastructure, APIs, or architecture
- Investigate a build failure or runtime failure
- Validate implementation against framework, language, library, or platform documentation
- Audit security, performance, compatibility, or operational readiness
- Challenge a proposed fix before it is merged

## Procedure

1. Identify the review target and the behavior or requirement being evaluated.
2. Read the current files and nearby configuration, tests, call sites, and lockfiles needed to understand the execution path. Respect user changes and do not assume earlier versions are still present.
3. Form a local hypothesis for each suspected issue and identify the cheapest check that could disprove it.
4. Run focused validation where available: a targeted test, build, lint, typecheck, container build, configuration validation, or minimal reproduction.
5. Consult authoritative documentation for claims about tool behavior, supported configuration, security guidance, compatibility, or best practices. Prefer official project documentation and pin the relevant version when possible.
6. Separate direct evidence from documentation guidance. A documentation warning is not automatically a bug; explain how it applies to this implementation.
7. Report findings first, ordered by severity. Each finding should include:
   - Severity: `critical`, `high`, `medium`, or `low`
   - Exact file and line or the smallest useful code location
   - The concrete problem and why it matters
   - Evidence from code, command output, test behavior, or official documentation
   - A focused remediation
8. Report open questions and assumptions after findings. Do not hide uncertainty inside assertive wording.
9. Summarize the change or review scope only after findings and assumptions.
10. If asked to fix issues, make the smallest root-cause change, then rerun the same focused validation and any relevant regression check.

## Evidence Rules

- Do not report style preferences as defects unless they violate an explicit project rule or cause a concrete problem.
- Do not claim a command passed unless it actually ran and completed successfully.
- Treat warnings separately from failures.
- Reproduce failures when practical and preserve the exact error that supports the finding.
- For dependency or image findings, check the lockfile, package manager behavior, image tag, and build context rather than guessing.
- For security findings, state the threat, affected boundary, exploit or failure condition, and mitigation.
- For performance findings, identify the resource cost, triggering scale or workload, and measurement or reasoning behind the concern.
- For breaking-change findings, identify the existing contract and the client behavior that would be affected.
- Keep unrelated repository issues out of the review unless they block the requested scope.

## Documentation Workflow

1. Determine which tool, framework, library, or standard controls the behavior.
2. Prefer official documentation, release notes, security advisories, or maintainer guidance.
3. Check the documentation version against the repository's declared version or image tag.
4. Quote or paraphrase only the relevant rule; do not bury the finding in a documentation summary.
5. Link the official source in the finding when links are available.
6. If authoritative documentation is unavailable, say so and label the conclusion as an assumption or lower-confidence risk.

## Review Output

Use this structure:

```text
Findings

[severity] path/to/file:line or symbol
Problem: ...
Impact: ...
Evidence: ...
Fix: ...

Open questions and assumptions
- ...

Summary
- Scope reviewed: ...
- Validation run: ...
- Remaining risk or test gap: ...
```

If there are no findings, say so clearly and list the remaining test gaps or residual risks. Do not manufacture findings to make the review look thorough.

## Completion Checklist

- [ ] Current files and relevant surrounding configuration were inspected.
- [ ] Findings are ordered by severity and grounded in exact locations.
- [ ] Each finding has concrete impact and a focused remediation.
- [ ] Official documentation was consulted for external behavior claims.
- [ ] Tool output is reported accurately, including failures and skipped checks.
- [ ] Security, reliability, compatibility, performance, and test coverage were considered where relevant.
- [ ] Uncertainty, assumptions, and residual risks are explicit.
- [ ] No unrelated refactors or speculative defects were added.
