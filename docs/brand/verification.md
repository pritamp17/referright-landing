# Forward identity verification — 12 September 2026

## Louize wordmark and public asset handoff

Replaced the wordmark with outlined Louize from the website's existing font.
Inspected the identity board and the actual 144px and 240px lockups on light
and dark backgrounds using `louize-size-proof.png`. The header component keeps
its 144px width and 44px minimum link height. SVGs remain font-independent.
Rebuilt SVG, PNG, and lossless WebP variants and checked the ZIP contents and
archive integrity. The production build and whitespace checks pass. The local
preview server remains stopped, as requested; this revision was checked using
static exports rather than a new browser session.

## Earlier symbol revision — before the Louize change

- `npm run build`: passed after the final favicon/export changes.
- `git diff --check`: passed.
- Inspected actual header artwork in the production preview, including both wordmark colors and all three symbol fills.
- Inspected the rendered identity board, monochrome symbol samples at 16/24/32/48px, app icon, and 1200 × 630 social image.
- Widened the diagonal gap between the top and right planes for small-size legibility. The favicon also uses a larger symbol than the app tile.
- Browser error log: empty during verification.

| Viewport | Themes | Horizontal overflow | Visible header targets |
| --- | --- | --- | --- |
| 360 × 800 | Light, dark | 0px | All at least 44 × 44px |
| 390 × 844 | Light, dark | 0px | All at least 44 × 44px |
| 768 × 1024 | Light, dark | 0px | All at least 44 × 44px |
| 1024 × 900 | Light, dark | 0px | All at least 44 × 44px |
| 1440 × 900 | Light, dark | 0px | All at least 44 × 44px |

These are implementation and visual checks, not a recognition/trust study with users. The preview was restored to light theme and the temporary viewport override cleared. Production was not deployed.
