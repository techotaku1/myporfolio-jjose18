## Exploration: Keep portfolio headings single-line

### Current State
The portfolio landing renders the two target section headings in `Projects.tsx` and `AiSection.tsx`. Both headings contain an explicit `<br />`, so “PROYECTOS DESTACADOS” and “DESARROLLO AGÉNTICO” always render on two lines regardless of available width. Their shared `.sec-head h2` rule uses `font-size: clamp(2.2rem, 6vw, 4rem)`, while `.sec-head` becomes a two-column grid at 760px. Card titles use `.card-body h3 { font-size: 1.5rem; }` and wrap naturally inside cards that can be as narrow as 280px.

The route-scoped stylesheet is imported by the portfolio App Router layout, matching the installed Next.js guidance for route-level global CSS. Existing E2E/visual tests cover boilerplate portfolio routes, not this localized portfolio landing or its responsive typography.

### Affected Areas
- `src/components/portfolio/Projects.tsx` — contains the forced line break in “PROYECTOS DESTACADOS” and renders project card titles.
- `src/components/portfolio/AiSection.tsx` — contains the forced line break in “DESARROLLO AGÉNTICO”.
- `src/styles/portfolio.css` — owns the shared display typography, section-heading sizing, 760px two-column breakpoint, card-title sizing, and overflow containment.
- `src/components/portfolio/data.ts` — supplies card-title lengths that must be checked against the 280px minimum card width.
- `src/app/[locale]/(portfolio)/layout.tsx` — imports the route-scoped stylesheet and configures the display font; no structural change is expected.
- `tests/e2e/Visual.e2e.ts` — current visual coverage does not target the localized portfolio landing, so responsive regression coverage may need extension.

### Approaches
1. **Remove forced breaks and add breakpoint-aware wrapping** — render each section title as normal inline text, keep wrapping allowed on narrow screens, and apply `white-space: nowrap` only where the heading column has enough room. Slightly tune the responsive `clamp()` or add a title-specific class if measured widths require it.
   - Pros: Matches the intent, preserves mobile safety, remains a small semantic/CSS change, and lets headings stay single-line whenever space permits.
   - Cons: Requires viewport verification around the 760px layout transition and may need a targeted font-size adjustment.
   - Effort: Low

2. **Keep explicit breaks and hide/swap them responsively** — retain `<br />` elements and toggle their display by breakpoint, optionally pairing this with responsive font sizing.
   - Pros: Gives exact control over where the title breaks.
   - Cons: Adds presentation markup and breakpoint coupling for behavior CSS can express more cleanly; still needs overflow testing.
   - Effort: Low

3. **Globally force all prominent titles to nowrap** — apply `white-space: nowrap` broadly to section and card headings.
   - Pros: Minimal CSS.
   - Cons: High overflow risk on mobile and narrow cards, especially “Automatización de Workflows”; violates the responsive requirement.
   - Effort: Low

### Recommendation
Use approach 1. Remove the explicit `<br />` elements from the two section headings, add a shared or targeted heading class, and enable nowrap only from a verified breakpoint where the heading column can contain the text. Preserve normal wrapping below that breakpoint. If measurement shows the current maximum size is too wide near tablet widths, slightly reduce the section-heading clamp rather than changing the display font or visual identity.

Do not apply nowrap globally to card titles. Evaluate card titles separately: preserve natural wrapping at the 280px card minimum, and only add a wider-breakpoint single-line rule if all current titles fit without shrinking them enough to weaken hierarchy. Add or update responsive visual/E2E coverage for the localized landing at representative mobile, tablet-transition, and desktop widths.

### Risks
- Applying nowrap at the existing 760px two-column breakpoint may still overflow because the subtitle column reduces heading width.
- A global font-size reduction could weaken the established editorial hierarchy across every section heading.
- Card titles have materially different lengths; one rule may fit “Apps Web Freelance” but overflow “Automatización de Workflows”.
- The existing `overflow-x: hidden` can conceal typography overflow, so verification must inspect element bounds rather than relying only on the absence of a scrollbar.
- Current automated visual tests do not exercise this landing, leaving responsive regressions undetected unless coverage is added.

### Ready for Proposal
Yes — the smallest coherent change is limited to the two heading components, targeted route-scoped typography CSS, and responsive regression coverage. The proposal should require single-line rendering only at widths where measured content fits and explicitly preserve wrapping on narrow screens.
