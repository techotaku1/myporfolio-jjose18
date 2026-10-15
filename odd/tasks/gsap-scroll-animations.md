# GSAP scroll animations

## Objective

Give the portfolio the motion language of the Dribbble reference "Genio – AI Operations Platform": staggered hero entrance with count-up stats, word-by-word heading reveals, a pinned section with scroll-driven tabs 01–0N, staggered grid reveals and subtle parallax, built with GSAP (ScrollTrigger + SplitText + `@gsap/react`).

## Problem

The page reveals content with a home-made `IntersectionObserver` hook (`useReveal` in `PortfolioLanding.tsx`) plus a CSS `.reveal` fade. It cannot stagger, scrub, pin or split text, and its CSS hides `.reveal` content even when JavaScript never runs.

## Why

The reference relies on scroll-linked choreography that `IntersectionObserver` cannot express. GSAP covers every preset the ui-ux-pro-max catalog matched (scroll reveal #5, pinned scroll section #6, staggered grid #8, SplitText #9, parallax #13), and all its plugins ship free in the `gsap` package.

## Scope

- In: `gsap` and `@gsap/react` dependencies, plugin registration, page-level motion hook, hero entrance and count-up, heading reveals, pinned AI tabs, batch reveals, parallax, reduced-motion handling.
- Out: the showcase video (Brag, separate), Remotion, new copy or content, changes to data in `data.ts` beyond what the tabs need, ScrollSmoother.

## Constraints

- React Compiler: no `useMemo`/`useCallback`; GSAP code runs only inside `useGSAP()` with a scoped ref.
- Register plugins once in `src/libs/Gsap.ts`; ScrollTrigger only on top-level tweens or timelines; never `scrub` with `toggleActions`; create triggers top to bottom or set `refreshPriority`; no `markers`.
- `gsap.matchMedia()` gates every animation on `(prefers-reduced-motion: no-preference)`; with `reduce`, content shows in its final state and nothing pins or scrubs.
- Content stays visible without JavaScript: initial hidden states apply only under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.
- No visible-then-hidden flash on hydration.
- The hero `h1` (LCP candidate) is never set to opacity 0; it may move with transforms only.
- Pinned tabs run only at `(min-width: 1024px)` with no-preference; tabs are real buttons, keyboard reachable, with `aria-selected`; mobile and reduced motion keep a static grid.
- UI copy stays in Spanish, hard-coded; code, comments and commits in English.
- `scroll-behavior: smooth` on `html` (portfolio.css:142) can fight ScrollTrigger refresh and programmatic scrolls; watch for it in T5 and T7.

## Tasks

- [x] T1 — Install `gsap` and `@gsap/react`; add `src/libs/Gsap.ts` that registers `useGSAP` and `ScrollTrigger` once and re-exports them. Merged into T2: knip (`check:deps`) fails on an unused module and unused dependencies, so T1 cannot pass the gate alone. `SplitText` registration moves to T4, where it is first used.
- [x] T2 — Replace `useReveal` with GSAP `ScrollTrigger.batch` reveals in a page-level `usePortfolioMotion` hook; move the `.reveal` hidden state under the scripting/no-preference media query; remove the inline `transitionDelay` in `Projects.tsx`.
  - Route: direct inline. Trigger evidence: one non-trivial new file (the hook); the CSS, `PortfolioLanding.tsx`, `Projects.tsx` and `Contact.tsx` edits are mechanical.
  - Test-first exception: scroll-triggered DOM behavior needs a real browser and scroll; proof is visual verification in the Browser pane.
  - Extra: removed `reveal` from the contact `form-ok` message, which mounts after the reveal setup and stayed at opacity 0 (existing bug).
- [x] T3 — Hero entrance timeline (tagline, h1 by transform, lead, actions, console), console bars fill from 0, count-up for 92/78/96/03.
  - Route: direct inline (planned as a delegated writer). The parent already held the hook, CSS and `Hero.tsx` context, and each edit was small; a writer would have re-read the same files.
  - Test-first: `parseCountTarget` and `formatCount` in `src/components/portfolio/motion.ts` with `motion.test.ts` (node), RED before GREEN.
  - Start state lives in CSS (`.enter`, `h1`, bars) under the scripting/no-preference query, and every tween goes `to` the final state, so hydration never flashes. A CSS failsafe (`enter-failsafe`, 3s delay) settles the hero on its final state when JavaScript is slow or broken; CSS animations override inline styles, so it also wins over a half-run timeline.
  - Count-up writes the span text and restores the original labels in the `matchMedia` cleanup. Count spans get `min-width: 3ch` and tabular figures so the row never shifts.
- [x] T4 — SplitText reveals for `.sec-head`: eyebrow, `h2.display` by words, `.rule` scaleX, sub paragraph.
  - Route: direct inline (planned as a delegated writer). One new function in the hook, a plugin registration and CSS; the five `.sec-head` markup edits are a mechanical class removal.
  - Test-first exception: text splitting is DOM- and font-dependent; proof is visual verification plus checking the accessible name of each `h2`.
  - `.sec-head` no longer carries `reveal`; each head gets its own `once` timeline. Words split into `span`s (valid inside `h2`) with `mask: 'words'`; `aria: 'auto'` labels the `h2` while split, and the split is reverted on complete, so the settled DOM is the original markup.
  - Start state in CSS: eyebrow and sub hidden and lowered, `h2` at opacity 0, rule at `scaleX(0)`. The title is shown only after the `from` tween has pushed its words below their masks, so nothing flashes. Mask padding with a matching negative margin keeps accents, underscores and the last glyph (negative letter-spacing) from being clipped.
  - No failsafe yet for below-the-fold heads, same as `.reveal`; reviewed in T7.
- [ ] T5 — Reshape `AiSection` into a pinned section with scroll-driven tabs 01–0N (left list, right panel) on desktop; tabs clickable and keyboard accessible; static grid on mobile and reduced motion.
  - Route: delegated writer with `frontend-design`. Trigger evidence: reshaping a major component (`AiSection.tsx`, CSS, motion helpers, tests).
  - Test-first: `progressToIndex` and `indexToProgress` in `motion.ts` with `motion.test.ts`, RED before GREEN.
- [ ] T6 — Subtle parallax on the hero background and console (scrub), gated by no-preference.
  - Route: direct inline or writer, decided at T6 start. Trigger evidence: expected one hook file plus a CSS tweak.
  - Test-first exception: scrubbed transforms need a real scroll; proof is visual verification.
- [ ] T7 — Polish and close: `ScrollTrigger.refresh()` after fonts and images settle, `scroll-behavior` interplay, reduced-motion audit, visual verification, `design:accessibility-review` and `design:design-critique`.
  - Route: parent verification plus one writer only if fixes span 2+ files.

## Acceptance criteria

- Every animated element reaches its final readable state with `prefers-reduced-motion: reduce`, with no pin, scrub or parallax.
- With JavaScript disabled, every section's content is visible.
- No ScrollTrigger `markers`, no console errors, no layout jump when the pin starts or ends.
- The pinned tabs switch at evenly spaced scroll points, clicking a tab scrolls to its segment, and Tab/Enter/Space work.
- The hero `h1` paints at full opacity in the first frame.
- `motion.test.ts` covers the count parser/formatter and the progress↔index mapping.

## Checks

Gate before each work-unit commit (placeholder `DATABASE_URL` only on the command line):

- `npm run lint`
- `npm run check:types`
- `npm run check:deps`
- `npm run check:i18n` (already fails on unused boilerplate keys in `src/locales/en.json`; compare against that baseline)
- `DATABASE_URL=postgres://placeholder@localhost:5432/x npm test`

## Delivery

- Branch: `feat/gsap-scroll-animations`, one Conventional Commit per task.
- Forecast: about 600 changed lines across 7 tasks, above the 400-line review heuristic. Strategy `ask-on-risk`; the chain/split question is deferred because no push or PR is authorized.
- RDD: `disabled/unmanaged`.
- A push to `main` deploys to production; merge this branch before shipping.

## Progress

| Task | Status | Commit |
| ---- | ------ | ------ |
| T1 | merged into T2 | `8f690de` |
| T2 | done | `8f690de` |
| T3 | done | `4684469` |
| T4 | done | `1817976` |
| T5 | pending | — |
| T6 | pending | — |
| T7 | pending | — |

## Evidence

- 2026-10-13: dev server 500 traced to a corrupted Turbopack persistent cache (`task is missing in memory or persistent storage`); cleared `.next/dev`, restarted, page renders with no server or overlay errors. Not caused by this feature.
- 2026-10-13: ui-ux-pro-max UX search (now runnable with scoop Python 3.15) flags parallax and scroll-jacking as high-severity motion-sensitivity issues unless `prefers-reduced-motion` is honored.

- 2026-10-13 (T2): Windows "Animation effects" is off on this machine (`SPI_GETCLIENTAREAANIMATION` = False), so Chromium reports `prefers-reduced-motion: reduce`. Reduced-motion path verified in the Browser pane: 36 `.reveal` elements, all at computed opacity 1, `(scripting: enabled)` matches, no overlay.
- 2026-10-13 (T2): the no-preference path could not be exercised in-page (patching `window.matchMedia` does not re-run `useGSAP` on hot updates). Pending for T7 with Windows animation effects enabled.
- 2026-10-13 (T3): RED observed (`motion.test.ts` could not resolve `./motion`), then GREEN 7/7. Gate: lint, `check:types`, `check:deps` pass; `npm test` 9/9; `check:i18n` fails only on the boilerplate baseline.
- 2026-10-13 (T3): reduced-motion path verified in the Browser pane: hero `.enter` blocks and `h1` at opacity 1 with no transform, bars at `transform: none`, stat labels intact (`92%`, `78%`, `96%`, `03`), no app console errors (only Spotlight `:8969` refused, which this preview does not run). The no-preference timeline stays pending for T7; `npm run test:e2e` would start a second `next dev` beside the running preview.

- 2026-10-13 (T4): gate: lint, `check:types`, `check:deps` pass; `npm test` 9/9; `check:i18n` fails only on the 48-row boilerplate baseline. Reduced-motion path verified in the Browser pane: 5 `.sec-head` titles with their original text and no leftover `aria-label` or split spans, eyebrow/title/sub at opacity 1, rule at `transform: none`; `GET /` 200 with no new server or console errors. The no-preference timeline stays pending for T7.

## Next step

T5: pinned `AiSection` tabs on desktop; write `progressToIndex`/`indexToProgress` tests first (RED), then load `frontend-design`.
