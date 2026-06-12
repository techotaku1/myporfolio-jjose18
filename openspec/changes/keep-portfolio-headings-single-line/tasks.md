# Tasks: Keep Portfolio Headings Single-Line

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 90–150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|---|---|---|---|
| 1 | Responsive heading behavior and regression coverage | PR 1 | One isolated change; include focused test evidence and verification |

## Phase 1: Targeted Heading Behavior

- [ ] 1.1 Update `src/components/portfolio/Projects.tsx` to remove the presentation `<br />` and apply `portfolio-section-title` only to the target `<h2>`.
- [ ] 1.2 Update `src/components/portfolio/AiSection.tsx` identically, preserving its existing spacing and copy.
- [ ] 1.3 Update `src/styles/portfolio.css` so `.portfolio-section-title` wraps normally by default and, inside `@media (min-width: 1200px)`, uses `white-space: nowrap` with `font-size: clamp(3.5rem, 5.2vw, 4rem)`; leave `.card-body h3` unchanged.

## Phase 2: Focused Responsive Coverage

- [ ] 2.1 Extend `tests/e2e/Visual.e2e.ts` with role-based locators for “PROYECTOS DESTACADOS” and “DESARROLLO AGÉNTICO”, wait for `document.fonts.ready`, and add reusable line-count, element/container-bound, clipping, and document-overflow measurements.
- [ ] 2.2 Add viewport scenarios for 320px, 759px, 760px, 761px, 1200px, 1280px, and 1440px: require natural wrapping below 1200px, one line at/above 1200px, containment at every width, and no forced `<br>` elements.
- [ ] 2.3 Add a 280px-card assertion proving `.card-body h3` retains normal wrapping and full visibility.
- [ ] 2.4 Run `bun run test:e2e -- tests/e2e/Visual.e2e.ts` and confirm the focused responsive assertions pass.

## Phase 3: Verification

- [ ] 3.1 Run `bun run test`, `bun run check:types`, `bun run lint`, `bun run test:e2e`, and `bun run build-local`; document unrelated pre-existing failures without modifying unrelated files.
