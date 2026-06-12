## Exploration: Use `user-icon.png` for App Router icons

### Current State
The application keeps four legacy icon assets in `public/` and manually declares them through `metadata.icons` in `src/app/[locale]/layout.tsx`. No App Router icon convention files or web app manifest exist. The installed Next.js 16 documentation and the current official reference state that `src/app/favicon.ico`, `src/app/icon*.png`, and `src/app/apple-icon.png` are evaluated automatically and produce their own `<link>` metadata, including image type and dimensions.

`public/user-icon.png` is the intended 1024×1024 RGBA source. The installed dependency tree already contains `sharp`, but it is transitive rather than declared directly. No ICO conversion package or ImageMagick installation is available; Windows `convert.exe` is a filesystem utility, not an image converter. Existing Playwright tests do not assert icon metadata.

### Affected Areas
- `public/user-icon.png` — canonical 1024×1024 source image; keep it as the visual source.
- `src/app/favicon.ico` — new root-only App Router favicon containing 16×16, 32×32, and 48×48 PNG-compressed frames.
- `src/app/icon1.png` — new 32×32 browser PNG icon.
- `src/app/icon2.png` — new 192×192 high-resolution browser/application PNG icon.
- `src/app/apple-icon.png` — new 180×180 Apple touch icon.
- `src/app/[locale]/layout.tsx` — remove manual `metadata.icons`; file conventions should own icon metadata.
- `public/favicon.ico` — remove after the convention-based replacement exists.
- `public/favicon-16x16.png` — remove after `src/app/icon1.png` replaces it.
- `public/favicon-32x32.png` — remove after `src/app/icon1.png` and the multi-size ICO replace it.
- `public/apple-touch-icon.png` — remove after `src/app/apple-icon.png` replaces it.
- `tests/e2e/Sanity.check.e2e.ts` or a focused icon metadata E2E test — verify generated head links and dimensions without snapshotting cache-busting query strings.

### Approaches
1. **Static App Router convention files** — generate fixed assets from `public/user-icon.png`, remove manual icon metadata, and delete superseded public assets.
   - Pros: Directly follows installed and official Next.js conventions; automatic `rel`, MIME type, and `sizes`; no runtime icon route; smallest application-code change.
   - Cons: Derived binary files must be regenerated when the source changes; requires a deterministic one-time generation procedure.
   - Effort: Low

2. **Generated `icon.tsx` and `apple-icon.tsx` routes plus static favicon** — resize the source at build time with route code.
   - Pros: Keeps generated PNG behavior close to the source and can emit multiple sizes.
   - Cons: Cannot generate `favicon.ico`; adds runtime/build code and source-loading complexity for assets that are static; unnecessary for this repository.
   - Effort: Medium

3. **Keep `public/` assets and manual `metadata.icons`** — replace legacy binaries in place.
   - Pros: Minimal path churn.
   - Cons: Ignores the requested App Router conventions, retains manual metadata that Next.js can derive, and leaves icon behavior coupled to the locale layout.
   - Effort: Low

### Recommendation
Use static App Router convention files and remove `metadata.icons` from the locale layout. Numbered PNG files are warranted because the requirement explicitly calls for multiple useful PNG variants and Next.js supports `icon1.png`, `icon2.png`, and lexical ordering. Use exactly 32×32 and 192×192 PNG variants: 32×32 covers standard browser UI, while 192×192 provides a useful high-resolution application/browser icon without adding an unnecessary 512×512 link icon when no manifest exists. Use 180×180 for `apple-icon.png`.

Create a true multi-image `src/app/favicon.ico` containing 16×16, 32×32, and 48×48 frames. Avoid adding a dependency: use the already installed `sharp` implementation in a one-time Node command to resize the source into PNG buffers, then assemble the ICO header, directory entries, and PNG payloads directly. The ICO directory width/height bytes can represent these sizes directly, and PNG-compressed ICO frames preserve alpha. Do not add a permanent generator unless repeated icon regeneration becomes a demonstrated workflow need.

Remove all four legacy public icon assets after the new convention files are present. Keep `public/user-icon.png` as the canonical source. Do not add a manifest solely for icons; the repository has no manifest today, and manifest installation behavior is outside this change.

Verification should inspect image dimensions and ICO frame entries, run the allowed type/lint/build checks relevant to the layout change, and use Playwright against the rendered page to assert one App Router favicon link, two PNG icon links with `32x32` and `192x192`, and one `180x180` Apple touch link. Assertions should match `rel`, `type`, and `sizes`, not generated query strings or exact hashed URLs.

### Risks
- Small icon sizes may lose detail when downscaled from the 1024×1024 source; implementation should visually inspect 16×16 and 32×32 outputs.
- Next.js adds generated query parameters to convention-file URLs, so brittle exact-URL tests would fail.
- `sharp` is currently transitive; a one-time generation command is acceptable for implementation, but a committed generator would require making the dependency explicit.
- PNG-compressed ICO frames are broadly supported by modern browsers, but the ICO container must be validated because `sharp` itself does not write ICO files.

### Ready for Proposal
Yes. The proposal can scope the change to static App Router convention files, removal of manual and legacy icon references, deterministic asset generation from `public/user-icon.png`, and focused metadata/container verification. The separately blocked `keep-portfolio-headings-single-line` change remains untouched.
