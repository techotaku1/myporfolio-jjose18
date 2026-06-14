<!-- NEXT-AGENTS-MD-START -->

# Repository Agent Instructions

How AI coding agents must work in this repository. The user describes changes in plain natural language; the agent infers the workflow, keeps token usage minimal, and protects the repo.

## Context Loading

`CLAUDE.md` must contain only `@AGENTS.md`. Never `@`-import skills, docs, or other files into session context — they are read on demand, per task.

## Natural Language First

The user says things like "make these titles fit on one line on desktop" — nothing more. From that, the agent infers the size and risk of the change, the relevant files, whether SDD/OpenSpec or Engram is needed, and the smallest sufficient validation. Never require the user to name modes, workflows, or tooling; this file controls that behavior.

## Language Contract

- Replies to the user: always Spanish.
- Code, comments, UI copy, docs, commits, PRs, and all generated artifacts: English, unless the user explicitly requests otherwise or the existing project context requires it.

## Token Budget (hard rules)

- Use the smallest workflow that safely solves the task.
- Read only files likely relevant to the change. Never crawl the repo or `node_modules`.
- No web search unless the task needs current external information or the user asks.
- No subagents for tiny or local changes.
- No SDD/OpenSpec artifacts for tiny direct changes.
- Do not read skills or documentation for small copy, typography, spacing, color, or Tailwind-class edits.
- Engram: at most ~3 calls before implementation; only when continuing prior work or recording a real decision.
- Never store screenshots, base64 images, logs, or large code dumps in Engram, specs, or prompts. If the user provides an image, summarize the visual issue in 1-2 sentences.
- If a small task grows, stop and explain before escalating.

## Automatic Work Mode Selection

Classify every implementation request silently — the user never names the mode. There is no mode called "SDD Lite".

| Mode | Use when | Behavior |
| --- | --- | --- |
| `DIRECT` | Tiny, low-risk change in 1 file or a small local area: copy, typography, spacing, color, Tailwind classes, a label, a typo, an isolated bug fix | No SDD, no subagents, no web, no broad reading; touch only the exact files |
| `SDD CONTROLLED` (`strict_tdd: false`) | 1-3 related files; limited UI behavior, component structure, validation, data fetching, or tests; reversible; no new architecture | Short plan and traceability only when useful; no RED/GREEN/REFACTOR; at most 1 focused skill |
| `SDD STRICT` (`strict_tdd: true`) | 4+ files; database schema/migrations, auth, Clerk, middleware, caching, i18n architecture, routing, public APIs, server actions, payments, security, CI; new features or integrations; ambiguous or high-risk work; user explicitly asks for SDD/TDD | Full SDD/OpenSpec discipline, Engram recovery, small batches, verification |

Tie-breaks: DIRECT vs CONTROLLED → choose DIRECT and stop if scope grows. CONTROLLED vs STRICT → choose STRICT. If the user explicitly picks a mode, follow it unless unsafe. Never turn a tiny visual change into SDD STRICT. Do not edit global/project SDD config to toggle `strict_tdd` for one change without explicit approval.

Escalation: DIRECT → CONTROLLED when more files or non-trivial behavior appear; CONTROLLED → STRICT when architecture, database, auth, cache, i18n, routes, public APIs, or a 4th file appears. De-escalate only after explaining why.

### Workflow per mode

`DIRECT`: inspect only the exact relevant files → tell the user briefly in Spanish (small direct change, likely files, short plan) → wait for approval only if the user asked to approve first or the impact is not obvious → make the minimal change → run the smallest relevant allowed validation only when it adds real signal → summarize in 1-3 lines.

`SDD CONTROLLED`: check `git status` → inspect only relevant files → keep proposal/tasks short, and only when they truly help or the user asked → explain briefly in Spanish (workflow, files, plan, validation) → wait for approval unless risk is trivial → smallest coherent change → relevant allowed checks only → save an Engram memory only for real decisions or non-trivial fixes → summarize.

`SDD STRICT`: recover Engram context → check `git status` and OpenSpec state (initialize SDD context if missing; reuse an active relevant change) → proposal/design/tasks before implementing → explain in Spanish (change name, files, plan, validation strategy, risks) → wait for explicit approval → apply in small batches → verify against specs → run relevant checks → sync/archive after verification with approval → save an Engram session summary.

## Next.js Documentation Rule

Read the relevant installed doc under `node_modules/next/dist/docs/` only when the task depends on Next.js behavior (routing, Server Components, caching, metadata, route handlers, middleware/proxy, App Router conventions). Never for visual-only Tailwind, copy, typography, or spacing edits. Read only the exact relevant file; if it is missing, fall back to local skills and installed versions — do not fail the task.

## Skills

Skills live in `.agents/skills/` (source of truth; `skills-lock.json` is the install record). Before an action matching "Use for" below, read only that skill's `SKILL.md`. At most one skill for small changes; load more only when the task genuinely spans several domains — and never for tiny copy/style edits.

| Skill | Use for |
| --- | --- |
| `accessibility` | WCAG, ARIA, keyboard navigation, focus management, contrast |
| `clerk` | General Clerk questions and skill routing |
| `clerk-setup` | First-time Clerk installation and configuration |
| `clerk-nextjs-patterns` | Clerk middleware/proxy, `auth()`, Server Components, Server Actions, route protection |
| `clerk-react-patterns` | Clerk hooks (`useUser`, `useAuth`, `useClerk`) in client components |
| `clerk-custom-ui` | Custom sign-in/sign-up flows and component appearance |
| `clerk-orgs` | Organizations, roles, invitations, multi-tenant auth |
| `clerk-backend-api` | Server-side Clerk Backend API calls |
| `clerk-webhooks` | Clerk webhooks, Svix verification, data sync |
| `clerk-testing` | Testing Clerk-protected flows |
| `composition-patterns` | Component APIs: children, slots, compound components, variants |
| `drizzle` | Drizzle ORM schemas, queries, migrations, database models |
| `frontend-design` | Layout, visual hierarchy, responsive UI, interface polish |
| `next-best-practices` | App Router, RSC boundaries, Server Actions, async APIs, routing, metadata, route handlers |
| `next-cache-components` | `use cache`, cache lifetimes, cache tags, revalidation |
| `next-upgrade` | Next.js upgrades, migration guides, codemods |
| `nodejs-backend-patterns` | API route handlers, server logic, middleware, backend errors |
| `nodejs-best-practices` | Node.js architecture, async, security, performance |
| `oxlint` | Oxlint/Ultracite configuration, diagnostics, fixes |
| `playwright-best-practices` | Integration and E2E tests, selectors, debugging, CI |
| `react-best-practices` | Writing/refactoring React components, rerender hygiene |
| `react-hook-form` | Client-side forms, validation, field arrays |
| `seo` | Metadata, sitemap, robots, Open Graph, structured data |
| `tailwind-css-patterns` | Tailwind utilities, responsive layouts, theme-driven styling |
| `typescript-advanced-types` | Generics, conditional/mapped types, narrowing, type utilities |
| `vitest` | Unit and component tests, mocking, Vitest config |
| `zod` | Zod schemas, parsing, composition, type inference |

Sync rule: keep this table aligned with the actual directories in `.agents/skills/`. Read a new skill's `SKILL.md` before documenting it; if its trigger is unclear, write `PENDING: review trigger for <skill>`.

## Project Overview

Production-oriented Next.js boilerplate (App Router).

| Area | Location | Stack |
| --- | --- | --- |
| Application | `src/app/` | Next.js 16, React 19, Server Components |
| Components | `src/components/` | React, TypeScript, Tailwind CSS 4 |
| Auth | `src/app/[locale]/`, `src/libs/` | Clerk |
| Database | `src/models/Schema.ts`, `migrations/` | Drizzle ORM, PostgreSQL, PGlite local / Neon production |
| Styling | `src/styles/global.css` | Tailwind CSS 4, CSS theme tokens |
| i18n | `src/locales/`, `src/libs/I18n.ts` | next-intl |
| Env | `src/libs/Env.ts` | T3 Env validation |
| Tests | `src/**/*.test.*`, `tests/` | Vitest (+ Browser mode), Playwright |
| Tooling | root configs | Ultracite, Oxlint, Oxfmt, Lefthook, Commitlint, Knip |
| Monitoring | `checkly.config.ts`, Sentry config | Checkly, Sentry, LogTape |

Node.js >= 24. Match existing patterns; prefer minimal, focused changes; never revert unrelated work. Escape glob characters in shell commands against paths like `src/app/[locale]/`.

## Commands

Run scripts through the project's package manager (`npm run`; `bun run` is also acceptable if installed). Agent command allowlist:

```bash
npm run lint
npm run check:types
npm run check:deps
npm run check:i18n
npm run test
npm run test:e2e
npm run build-local
```

For tiny visual or copy changes, choose the smallest relevant validation — never the full suite. Scripts outside the allowlist (`db:*`, `storybook*`, `build`, `dev`) require explicit user approval. Do not invent or rename commands.

## Code Quality

- Clarity over cleverness; keep components and functions short.
- TypeScript everywhere; avoid `any` unless isolated and justified; prefer narrowing over casting.
- Named exports except where Next.js requires default exports; absolute imports via `@/`.
- Let the compiler infer return types unless an annotation adds clarity; options object for 3+ parameters.
- Import Zod types with `import type * as z from 'zod';`.
- Follow `oxlint.config.ts`, `oxfmt.config.ts`, `tsconfig.json`, `lefthook.yml`; never reformat unrelated code (Markdown is excluded from Oxfmt).
- JSDoc: `/**` above the symbol, sentence-case present-tense description, tags ordered description → `@param` → `@returns` → `@throws` (only if it throws).
- Env vars: validate in `src/libs/Env.ts`; never read `process.env` directly in app code; never read, print, or store secret values.
- Debug from hypotheses: 1-3 likely causes, validate the most likely first.

## Database

Drizzle ORM + PostgreSQL (PGlite local, Neon production). Schema in `src/models/Schema.ts`, migrations in `migrations/`, `drizzle.config.ts` uses `DATABASE_URL`.

- `db:generate` / `db:migrate` / `db:studio` exist but are outside the allowlist — explicit approval required.
- Never use `drizzle-kit push` without explicit approval; prefer reviewable migrations.
- If Drizzle asks whether a table was created or renamed, stop and ask the user; never choose rename without explicit confirmation.

## Testing

- `*.test.ts(x)` unit/component tests co-located with implementation; `*.integ.ts` integration and `*.e2e.ts` Playwright tests in `tests/`.
- Top-level `describe` names the subject; `it` titles in third-person present tense (`verb + object + context`), sentence case, no trailing period, no "should/works/handles/checks/validates".
- State what the test demonstrates, not how it is implemented. Avoid mocking unless necessary.

## React, Next.js, i18n, Styling

- No `useMemo`/`useCallback` (React Compiler handles memoization); avoid `useEffect` unless syncing with an external system.
- One `props` parameter with inline type; access as `props.foo`; do not destructure props. Use `React.ReactNode`.
- Default-exported page components end with `Page`; reused page prop aliases end with `PageProps`.
- Locale pages receive `props: { params: Promise<{ locale: string }> }`, await `props.params`, then `setRequestLocale(locale)`.
- Dashboard pages sit behind auth; define shared metadata once in the relevant layout.
- Never hard-code user-visible strings in localized code. `getTranslations` on the server, `useTranslations` in client components; context-specific keys (`card_title`, `meta_description`); namespaces end with `Page`; `t.rich(...)` for markup; sentence case.
- Tailwind CSS 4 utilities and existing theme tokens; reuse shared components; keep layouts responsive; no unnecessary utility classes.

## Commits and PRs

Conventional commits without scope: `type: short specific summary` (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert). `BREAKING CHANGE:` footer when required. Never add Co-Authored-By or AI attribution. Run relevant allowed checks before committing; screenshots for visible UI changes; no unrelated formatting churn. Never commit, push, or open a PR without explicit user approval.

### Push convention (MANDATORY)

When the user asks to push, deploy, or "subir todo al repo", the commit MUST pass the `lefthook` pre-commit gate (`ultracite` + `knip`). NEVER use `git commit --no-verify` to bypass it. The correct flow is:

1. Run `npm run lint` (ultracite, type-aware) and `npm run check:deps` (knip) first.
2. Fix every reported error by correcting the real cause. For vendored/tooling files that are not part of the app (e.g. `.agents/`, `.claude/`), exclude them at the config level (`oxlint.config.ts` `ignorePatterns`, `tsconfig.json` `exclude`, `knip.config.ts` `ignore`).
3. Only then run a normal `git commit` so the hook validates a clean tree.

**No cheating (MANDATORY):** NEVER add `// oxlint-disable`, `// oxlint-disable-next-line`, `// eslint-disable`, `@ts-ignore`, or `@ts-expect-error` to make the linter pass. These hide real problems. Fix the underlying code instead (hoist nested components, refactor deprecated APIs, use proper types, make decorative elements `aria-hidden`, etc.). A rule that genuinely does not apply to the whole project may be turned off once in the central `oxlint.config.ts` with a justification comment — but never silenced inline per file or per line. `git commit --no-verify` is likewise forbidden.

If the hook still fails, stop and fix the cause — bypassing the gate hides real problems and ships broken code.

## Engram Memory

Use Engram only for: continuing prior work ("continúa", "retoma", "vengo de otro agente"), meaningful decisions, non-trivial bug fixes, architecture/DB/auth/integration/testing-strategy changes, end-of-session summaries, and cross-agent handoffs (objective, files changed, commands run, risks, what not to do, next safe step). When a topic resurfaces, search memory before re-deriving context. Never store secrets, `DATABASE_URL`, base64, screenshots, logs, or code dumps. Not for tiny visual or copy edits.

Cross-agent handoff: save a handoff memory before leaving an agent; update `docs/ai-handoff/CURRENT.md` if it exists. When arriving: search Engram, read the handoff file if present, check `git status` and OpenSpec active changes, then summarize before touching files. "Continúa con lo último" → recover context automatically.

## GGA Code Review

GGA (Gentleman Guardian Angel) reviews staged files on pre-commit when `.gga` exists. Point its `RULES_FILE` to a short, scannable review file (e.g. `docs/CODE-REVIEW.md`) using `REJECT if` / `REQUIRE` / `PREFER`; first response line must be exactly `STATUS: PASSED` or `STATUS: FAILED`. Treat failures as real review feedback and fix the reported violations; never bypass with `git commit --no-verify` (see Push convention above). Never weaken its rules without approval.

## Final Safety Rules

- Never commit, push, deploy, or run migrations without explicit user approval.
- Never expose secrets or `.env` values; keep `.env*` out of git.
- Never overwrite or revert unrelated work.
- Never run destructive database operations without explicit approval.
- Never convert a tiny visual change into a full SDD STRICT workflow.
- If unsure, ask one concise question in Spanish and stop.
