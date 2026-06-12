# Proposal: Keep Portfolio Headings Single-Line

## Intent

Portfolio visitors should see the “PROYECTOS DESTACADOS” and “DESARROLLO AGÉNTICO” section headings on one line whenever the available layout width safely supports it. Explicit line breaks currently force a two-line presentation at every viewport, weakening the intended editorial hierarchy. The change must preserve readable mobile wrapping and prevent hidden horizontal overflow.

## Scope

### In Scope
- Remove the forced line breaks from both portfolio section headings.
- Add targeted responsive typography so headings remain single-line only at verified fitting widths.
- Add responsive regression coverage that checks heading wrapping and element bounds.

### Out of Scope
- Forcing project card titles onto one line.
- Redesigning the portfolio typography, grid, content, or display font.
- Changing unrelated routes or shared application styling.

## Capabilities

### New Capabilities
- `portfolio-responsive-headings`: Defines responsive wrapping and overflow-safe behavior for prominent portfolio section headings.

### Modified Capabilities
- None; no existing OpenSpec capability covers this landing-page behavior.

## Approach

Remove the `<br />` elements in `Projects.tsx` and `AiSection.tsx`. Preserve natural wrapping at narrow widths, then apply `white-space: nowrap` only from a breakpoint proven to fit both headings within the section grid. If required near the tablet transition, make a small targeted adjustment to the responsive heading size. Do not change card-title wrapping. Verification must inspect heading and container bounds because `overflow-x: hidden` can conceal defects.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/portfolio/Projects.tsx` | Modified | Remove the forced heading break. |
| `src/components/portfolio/AiSection.tsx` | Modified | Remove the forced heading break. |
| `src/styles/portfolio.css` | Modified | Add overflow-safe responsive heading behavior. |
| `tests/e2e/Visual.e2e.ts` | Modified | Cover representative mobile, transition, and desktop widths. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Heading overflow near the two-column breakpoint | Medium | Enable nowrap only after measured element-bound verification. |
| Typography hierarchy becomes weaker | Low | Keep sizing changes targeted and minimal. |
| Regression remains hidden by overflow clipping | Medium | Assert element bounds, not only scrollbar absence. |

## Rollback Plan

Revert the two heading markup changes, responsive CSS rule, and associated test coverage as one isolated change.

## Dependencies

- Existing portfolio display font, section grid, and current heading copy.

## Success Criteria

- [ ] Both target headings render on one line at verified desktop widths.
- [ ] Headings wrap naturally on narrow screens without clipping or horizontal overflow.
- [ ] Heading bounds remain within their containers at representative mobile, 760px-transition, and desktop widths.
- [ ] Project card titles retain natural wrapping.
