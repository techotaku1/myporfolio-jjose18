# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project

Single-page, Spanish-language freelance portfolio for Jose David Gonzalez (Cali, Colombia), deployed on Vercel at `https://josedavid-portfolio.vercel.app`. Built on the ixartz Next.js boilerplate: Next.js 16.4 App Router (Turbopack, Cache Components, Partial Prefetching, React Compiler), React 19.3, Tailwind CSS 4, TypeScript 7, npm, Node >= 24.

The boilerplate's Clerk auth, dashboard, sign-in/up, about and counter pages were removed; do not assume Clerk exists. Leftovers still in the tree: the `counter` table and `/api/counter` route, `src/locales/en.json`, and the `tests/e2e` specs (`Sanity`, `I18n`, `Visual`, `Counter`), which still target removed boilerplate pages. `PORTFOLIO_HTML/` and `project/` are the original design-handoff prototype (reference only).

## Commands

- `npm run dev` runs a PGlite server on `local.db` (applies `migrations/` via `scripts/db-migrate.mjs`), Next.js and Spotlight in parallel.
- `npm run lint` is `ultracite check --type-aware --type-check` (Oxlint + Oxfmt); `lint:fix` fixes. `check:types` (tsc), `check:deps` (knip), `check:i18n` (i18n-check against `src/locales/en.json`).
- `npm run test` is Vitest with two projects: `unit` (`src/**/*.test.{js,ts}`, node) and `ui` (`*.test.tsx`, `src/hooks/**/*.test.ts`, Chromium browser mode). Single file: `npx vitest run src/utils/Helpers.test.ts`.
- `npm run test:e2e` is Playwright (`tests/**/*.e2e.ts`, `*.integ.ts`); `*.check.e2e.ts` specs are also run by Checkly against deployed environments.
- `npm run build-local` builds against an in-memory PGlite. Plain `build` and `npm test` need `DATABASE_URL`, because T3 Env validates it on import (even the unit test fails without it); a placeholder such as `postgres://placeholder@localhost:5432/x` in the command line is enough to compile and test, never in a file. With `agentRules: false`, `next dev` no longer creates `AGENTS.md`.
- Agent allowlist (no permission prompt; `DEV/CLAUDE.md` validation timing still decides when to run them): `lint`, `check:types`, `check:deps`, `check:i18n`, `test`, `test:e2e`, `build-local`. `db:generate|migrate|studio`, `build` and `dev` need explicit user approval. Do not invent or rename scripts.
- Check gate before an authorized commit/push: `lint`, `check:types`, `check:deps`, `check:i18n`, `test`. `check:i18n` already fails on unused boilerplate keys in `src/locales/en.json`, independent of code changes, so compare it against that baseline instead of treating it as a regression. Lefthook pre-commit already runs `ultracite fix` (stages fixes) and knip; commit-msg runs commitlint. Central lint config: `oxlint.config.ts`, `oxfmt.config.ts`, `tsconfig.json` (Markdown is excluded from Oxfmt).

## Architecture

- One public page: `src/app/[locale]/(portfolio)/page.tsx` (metadata + JSON-LD) renders the client component `PortfolioLanding`, which composes the sections in `src/components/portfolio/`. All copy and facts (`PROFILE`, `SERVICES`, `SKILLS`, `EXPERIENCE`, `PROJECTS`, phone/WhatsApp link) are hard-coded Spanish in `data.ts` / `constants.ts`, not in next-intl messages.
- `llms.txt/route.ts` is generated from those same constants and has no `dynamic` export (under Cache Components a handler that reads only constants prerenders by itself; request-time reads there would make it dynamic); `robots.ts` explicitly allows a list of AI crawlers and disallows only `/api/`; `sitemap.ts` emits one URL with no `alternates`.
- `src/proxy.ts` (the Next.js 16 middleware) runs Arcjet bot detection only when `ARCJET_KEY` is set, then next-intl routing. It allows search-engine, AI, preview and monitor bot categories: blocking AI bots would silently cancel the crawl permissions in `robots.ts`. Its matcher skips `api`, `_next`, `_vercel`, `monitoring` and dotted paths.
- i18n: next-intl with a single locale `en` and `localePrefix: 'as-needed'` (`src/utils/AppConfig.ts`), while `<html lang>` is `CONTENT_LANG = 'es'`. Do not add locales or sitemap alternates; they would signal duplicate Spanish content.
- `AppConfig.ts` also holds `SITE_URL`, `GOOGLE_SITE_VERIFICATION` (public, hard-coded on purpose) and `CONTENT_LAST_MODIFIED` (sitemap `lastmod`). Bump it only when visible content actually changes; never derive it from `new Date()`.
- Rendering: no route carries `instant = false`. `/en` is fully static and `/[locale]` is its fallback shell (unknown paths such as `/xx` return 404). The root layout awaits `params` only for `hasLocale`/`notFound()`, and `src/libs/I18n.ts` reads the locale through `next/root-params` instead of `setRequestLocale`. Keep new request-time reads (`cookies()`, `headers()`, `searchParams`) inside `<Suspense>`. The app has no `<Link>` or `router.prefetch` call.
- Contact form: `Contact.tsx` posts to `/api/contact`, which validates with Zod and sends through a Gmail nodemailer transport using `PASS_NODEMAILER` (503 when unset) to the owner's hard-coded address. `/api/icon` renders PNG favicons from `public/user-icon-base.svg`.
- Data: Drizzle + `pg` Pool (`src/libs/DB.ts`, `src/utils/DBConnection.ts`); PGlite locally, Neon in production; `migrations/` is bundled into the `/` output via `outputFileTracingIncludes`. The only table is the leftover `counter`.
- Observability: Sentry via `withSentryConfig` in `next.config.ts` (skipped when `NEXT_PUBLIC_SENTRY_DISABLED` is set; tunnel route `/monitoring`), LogTape (`src/libs/Logger.ts`), Checkly (`checkly.config.ts`). Sentry 11 has no `enableLogs` option (logs flow through `consoleLoggingIntegration()`) and takes `reactComponentAnnotation` at the top level of `withSentryConfig` (`webpack.reactComponentAnnotation` is deprecated). Arcjet packages are `serverExternalPackages` because their WASM does not resolve under Turbopack.

## Rules and pitfalls

- UI copy is Spanish and lives in code (see above); the boilerplate rule about `useTranslations`/`getTranslations` does not apply to the portfolio sections.
- Extra high-risk area: i18n architecture (locales, routing, proxy).
- Env vars are validated in `src/libs/Env.ts` (T3 Env; add new keys to both the schema and `runtimeEnv`). Do not read `process.env` in app code (`src/proxy.ts` and `next.config.ts` are the deliberate exceptions). Names: `DATABASE_URL`, `ARCJET_KEY`, `PASS_NODEMAILER`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_LOGGING_LEVEL`, `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`, `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`; build-time `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`, `NEXT_PUBLIC_SENTRY_DISABLED`, `ANALYZE`.
- No dependency is currently retained below its latest major (vitest 5, Sentry 11, nodemailer 10, TypeScript 7). nodemailer 10 needs the named import `import { createTransport } from 'nodemailer'` (the default import trips `import(no-named-as-default-member)`). `npm audit` still lists dev-only highs from release tooling (the semantic-release chain, `braces`, ultracite and `@lingual/i18n-check` transitives, and the `npm` bundled inside `@semantic-release/npm`) whose only fix is a downgrade; never run `npm audit fix --force`.
- Database: never run `drizzle-kit push` without approval; prefer reviewable migrations. If Drizzle asks whether a table was created or renamed, stop and ask; never choose rename on your own.
- React conventions: no `useMemo`/`useCallback` (React Compiler); avoid `useEffect` unless syncing with an external system. Components take a single `props` parameter with an inline type and access `props.foo` without destructuring. Named exports except where Next.js requires default; page components end with `Page`; absolute imports via `@/`; `import type * as z from 'zod'`.
- JSDoc: `/**` above the symbol, sentence-case present-tense description, tags ordered description, `@param`, `@returns`, `@throws` (only if it throws).
- Tests: `*.test.ts(x)` co-located; top-level `describe` names the subject; `it` titles are third-person present tense, sentence case, no trailing period, no "should/works/handles/checks/validates". Describe what the test demonstrates, not how; avoid mocking unless necessary.
- Escape glob characters in shell commands for paths like `src/app/[locale]/`.
