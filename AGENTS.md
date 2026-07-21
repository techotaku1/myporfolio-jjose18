<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Repository Agent Instructions

How AI coding agents must work in this repository. The user describes changes in plain natural language; the agent infers the workflow, keeps token usage minimal, and protects the repo.

## Core Rules

Shared agent rules — work modes (DIRECT / SDD CONTROLLED / SDD STRICT), token budget, language contract, commits and integrity, Engram scope, GGA, and safety — live in the user-level global `~/.claude/CLAUDE.md` under "Shared Repo Rules — Next.js Projects (DEV)" and apply here without repetition. Repo-specific deltas:

- Extra SDD STRICT triggers: Clerk, i18n architecture.
- Cross-agent handoff: save an Engram handoff before leaving an agent; update `docs/ai-handoff/CURRENT.md` if it exists; on arrival search Engram, read the handoff file, check `git status` and OpenSpec, and summarize before touching files.
- GGA rules use `REJECT if` / `REQUIRE` / `PREFER`; first response line must be exactly `STATUS: PASSED` or `STATUS: FAILED`.

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

## Model Routing

Plan expensive, execute cheap. For medium/large changes (several files, new behavior, architecture, DB/auth): do the analysis and a written implementation plan with the strongest available model (Opus-class), hand implementation to a cheaper model (Sonnet-class; Haiku-class for mechanical edits), then review the diff against the plan on the strong model. Plans for a cheaper executor must be self-contained: exact file paths, current-state code excerpts, this repo's check-gate commands as verification steps, an explicit out-of-scope list, and STOP conditions. Tiny one-file changes skip the split — plan/delegate overhead costs more than it saves.

## Integrated Browser

When a change affects visible UI, when debugging layout/hydration/console errors, or when the user asks, verify it in the agent's own integrated browser against the local dev server — `npm run dev`, default `http://localhost:3000` — instead of asking the user for screenshots. Integrated browser means the browser built into the agent's native app: Claude Code Browser pane (`mcp__Claude_Browser__*` tools), Codex app browser. NEVER use the Playwright MCP, chrome-devtools MCP, `playwright-cli`, or anything that opens an external Google Chrome window for this — those are only for explicit Playwright/E2E test requests. Reuse a running dev server; never start a second instance on another port without saying so. Skip for logic-only changes with no visual surface.

## Installed Plugins / Extensions

Use the tooling already installed instead of reinventing it or giving a generic answer. In Claude Code these are plugins (skills, agents, slash commands, MCP servers, hooks); in Codex they are complementos/extensiones. Before doing a task by hand, check whether an installed plugin/complemento already covers it — a dedicated MCP for a service, a domain skill, a review agent, a workflow command — and prefer the most specific installed tool. Do not install new ones or enable disabled ones on your own; only use what is installed, and if a clearly-relevant one is missing, say so and let the user decide.