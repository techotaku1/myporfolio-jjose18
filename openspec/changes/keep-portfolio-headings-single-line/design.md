# Design: Keep Portfolio Headings Single-Line

## Technical Approach

Keep the existing App Router structure and route-scoped `portfolio.css` import. Remove the presentation-only `<br />` elements from the two target headings, add the same explicit class (for example, `portfolio-section-title`) to both `<h2>` elements, and preserve normal wrapping by default.

At `min-width: 1200px`, apply `white-space: nowrap` and a targeted `font-size: clamp(3.5rem, 5.2vw, 4rem)` to that class. This rule is based on measurements using the generated Inter Tight and Space Grotesk assets: at 1200px, the section grid leaves approximately 759.8px for the heading after wrapper padding, the 1rem gap, and the 32ch subtitle column; “PROYECTOS DESTACADOS” measures approximately 743.4px at 62.4px. The longer heading therefore retains about 16px of safety. Below 1200px, the current `.sec-head h2` sizing remains active and wrapping stays available.

The installed Next.js CSS documentation permits stylesheet imports from App Router layouts. The existing portfolio layout import remains unchanged.

## Architecture Decisions

| Decision | Alternatives considered | Rationale |
|---|---|---|
| Use semantic inline heading text without `<br />` | Toggle break visibility responsively | Wrapping is presentation behavior; keeping it in CSS avoids breakpoint-coupled markup. |
| Target only the two requested headings with a shared class | Apply nowrap to `.sec-head h2` or `.display` | Broad selectors would affect `TRAYECTORIA`, hero typography, or future section headings. |
| Enable nowrap at 1200px with a small responsive size adjustment | Enable it at the existing 760px grid breakpoint; reduce all headings globally | The 760px heading column cannot contain the text. The verified 1200px rule fits without weakening global typography. |
| Preserve card-title rules unchanged | Reuse the heading nowrap rule for cards | Project cards can be 280px wide and contain longer titles; natural wrapping is required. |
| Verify geometry, not only screenshots or page scroll width | Rely on visual snapshots | `.portfolio-root { overflow-x: hidden; }` can conceal clipping and horizontal overflow. |

## Data Flow

Static heading copy → semantic `<h2>` text → route-scoped responsive CSS → browser line layout → Playwright line-count and bounds assertions.

No server, authentication, database, or client-state flow changes.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/components/portfolio/Projects.tsx` | Modify | Remove `<br />` and add the targeted heading class. |
| `src/components/portfolio/AiSection.tsx` | Modify | Remove `<br />` and add the same heading class. |
| `src/styles/portfolio.css` | Modify | Add the verified 1200px nowrap and size rule; retain mobile wrapping. |
| `tests/e2e/Visual.e2e.ts` | Modify | Add responsive behavioral and visual regression coverage for the localized landing. |

## Interfaces / Contracts

No TypeScript, API, data, translation, or component-prop contracts change. The CSS contract is:

- Below 1200px: `white-space: normal`; headings may wrap.
- At or above 1200px: one rendered text line and no horizontal clipping.
- `.card-body h3` behavior and styles remain unchanged.

## Testing Strategy

Extend the existing Playwright suite rather than adding a new test framework. Use role-based heading locators and representative widths: 375px mobile, 760px grid transition, 1200px nowrap threshold, and 1440px desktop.

After `document.fonts.ready`, inspect each heading with `Range.getClientRects()` and element/container rectangles:

- At 1200px and 1440px, each heading has one text-line rectangle.
- At every width, heading left/right bounds stay within its heading column and `scrollWidth <= clientWidth`.
- At 375px and 760px, computed `white-space` remains `normal`.
- Project card headings retain computed normal wrapping behavior.
- Keep snapshots as secondary visual evidence.

## Security, Failure Modes, and Rollout

There are no security or data-boundary implications. Primary failure modes are font-metric drift, overflow masked by clipping, and accidental selector expansion. Geometry assertions and the targeted class mitigate them.

No migration, feature flag, or phased rollout is required. Rollback is a single revert of the two markup edits, CSS rule, and test additions.

## Open Questions

None.
