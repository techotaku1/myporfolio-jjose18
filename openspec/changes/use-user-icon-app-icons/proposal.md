# Proposal: Adopt User Icon App Icons

## Intent

Replace manually configured legacy icons with Next.js App Router icon conventions. Visitors should see a consistent personal icon in browser tabs, bookmarks, Apple home-screen shortcuts, and search surfaces, while maintainers have one canonical source image and framework-owned metadata.

## Scope

### In Scope
- Keep `public/user-icon.png` as the canonical source.
- Add `src/app/favicon.ico` with 16×16, 32×32, and 48×48 frames.
- Add `src/app/icon1.png` (32×32), `src/app/icon2.png` (192×192), and `src/app/apple-icon.png` (180×180).
- Remove manual `metadata.icons` from `src/app/[locale]/layout.tsx`.
- Remove `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, and `public/apple-touch-icon.png`.
- Verify generated head links, PNG dimensions, ICO frame dimensions, and container validity.

### Out of Scope
- Adding a web app manifest or installable-PWA behavior.
- Adding runtime icon-generation routes or a permanent generation dependency.
- Modifying `keep-portfolio-headings-single-line` or unrelated workspace changes.

## Capabilities

### New Capabilities
- `app-router-icon-metadata`: Defines canonical icon assets, automatic App Router metadata, required dimensions, and verification behavior.

### Modified Capabilities
- None.

## Approach

Generate static derivatives from `public/user-icon.png`. Place them at official App Router convention paths so Next.js derives `rel`, `type`, `sizes`, and generated URLs. Build a valid PNG-compressed multi-frame ICO without adding a manifest or runtime route. Remove superseded metadata and public assets only after replacements exist.

## Affected Areas

| Area | Impact | Description |
| --- | --- | --- |
| `src/app/favicon.ico` | New | Multi-frame root favicon |
| `src/app/icon1.png`, `src/app/icon2.png` | New | Browser/application icon variants |
| `src/app/apple-icon.png` | New | Apple touch icon |
| `src/app/[locale]/layout.tsx` | Modified | Remove manual icon metadata |
| `public/user-icon.png` | Retained | Canonical source |
| `public/favicon*`, `public/apple-touch-icon.png` | Removed | Delete superseded assets |
| `tests/e2e/` | Modified | Assert generated icon metadata |

## Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Small icons lose visual clarity | Medium | Inspect 16×16 and 32×32 outputs |
| Tests depend on generated query strings | Medium | Assert semantic attributes and dimensions |
| ICO container is malformed | Low | Parse and verify all frame entries |

## Rollback Plan

Restore the four public assets and `metadata.icons`, then remove the App Router icon files and icon-specific assertions.

## Dependencies

- Installed Next.js 16 App Router file conventions.
- Existing image tooling used only during implementation.

## Success Criteria

- [ ] Next.js emits one favicon, two PNG icon, and one Apple touch link with expected types and sizes.
- [ ] PNGs are 32×32, 192×192, and 180×180; ICO contains valid 16×16, 32×32, and 48×48 frames.
- [ ] No manual icon metadata, superseded public icon, manifest, or unrelated-change modification remains.
