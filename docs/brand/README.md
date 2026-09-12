# RightRefer — Forward

Three softly rounded planes form an upward-right gesture. The complete wordmark introduces the name; the symbol can support the product as it expands beyond referrals.

## Product grounding

Reviewed the live website and the user-supplied canonical PRD v3.4, updated 11 September 2026, at `jobMadeEasy/docs/rightrefer-unified-technical-prd.md`. RightRefer connects job seekers with eligible company insiders for referral requests and helps people discover relevant career opportunities. Privacy, clear request states, and evidence handling matter. A referral does not guarantee an interview or a job. The user also described a longer-term professional network.

The latest Supermemory search for RightRefer / ReferRight brand context returned no matching memories. Earlier searches also returned no matches. No memory-derived facts were assumed.

## References and design decision

The user's Microsoft references informed the compact geometry and separation of symbol from name. Their Sprinklr references informed the colorful, open silhouette. Neither company's artwork is included in the deliverables.

- [Microsoft's identity announcement](https://blogs.microsoft.com/blog/2012/08/23/microsoft-unveils-a-new-look/) explains its symbol/logotype system and connection between colors and product portfolio.
- [Sprinklr's story](https://www.sprinklr.com/our-story/) supplied company context. The user's screenshots supplied the visual reference; no unverified explanation of Sprinklr's logo is assumed.
- The current wordmark uses the website's existing **Louize** font, outlined at an optically adjusted size to match the symbol. This implements the user's requested match with the site's display typography.
- [Manrope source and licence](https://github.com/google/fonts/tree/main/ofl/manrope): Manrope now appears only in presentation-board labels and the social caption. It was the previous wordmark font. The font and SIL Open Font License remain here.

Explored a fan, flowing bands, and folded forward planes using the built-in image-generation tool. The folded planes were selected for a compact silhouette and clearer direction. The fan was close to Sprinklr; the flowing form was less recognizable at small sizes. These are design judgments, not user-testing findings.

The final logo is manually constructed SVG geometry with three flat fills and transparent gaps. It is not a bitmap crop from the concept sheet. The diagonal gap was widened after small-size inspection. Blue connects it to the existing product; teal and sky soften the combination. The wordmark stays one color.

Exploration: `forward-concept-study.png`. Exact generation prompt: `forward-concept-prompt.txt`. Mode: built-in image generation. Prior identity boards remain in `archive/`.

## Usage

- Keep the full **RightRefer** lockup in headers and footers, with capital R's and one-color lettering.
- Minimum full lockup width: **144px**. Use the colored symbol at **24px** or larger; use the monochrome symbol or padded app icon for tiny placements.
- Preserve proportions and spacing. Reserve half the visible symbol height around standalone artwork when space permits.
- Use ink lettering on light surfaces and white lettering on dark neutral surfaces. Use a fully white lockup on saturated brand panels.
- Use the blue tile with white symbol for browser/app icons. Do not put a tile around the complete wordmark.
- Keep all three pieces. Do not close gaps, rotate the mark, or add outlines, gradients, or shadows.

| Brand role | Value | Token |
| --- | --- | --- |
| Anchor blue | `#0A66C2` | `--color-primary` |
| Teal artwork accent | `#149FA5` | `--color-brand-teal` |
| Sky artwork accent | `#64ACE8` | `--color-brand-sky` |
| Light-theme wordmark | `#17212B` | `--color-ink` in light theme |
| Dark-theme wordmark | `#F5F7FA` | `--color-ink` in dark theme |

The two accents are a logo-only exception for this user-requested redesign. They live in `src/styles/tokens.css`, remain stable across themes, and do not change product UI control/status colors. Static exports read colors from that file. Pure-white exports use the existing primary-ink token.

## Deliverables

- `public/brand/rightrefer-{ink,white,blue}.svg`: colored symbol with the named wordmark color.
- `public/brand/rightrefer-mono-{ink,white,blue}.svg`: complete one-color lockups.
- `public/brand/rightrefer-mark-{color,ink,white,blue}.svg`: standalone symbols.
- `public/brand/rightrefer-app-icon.svg`: blue app tile with white symbol.
- Each brand SVG has matching PNG and lossless WebP exports. Full lockups are 2048px wide; symbols and app icons are 1024 × 1024px. Backgrounds are transparent outside the artwork.
- `public/rightrefer-logo.svg`, `.png`, `.webp`: compatibility exports of the colored symbol.
- `public/favicon.svg`, `favicon.png`, `apple-touch-icon.png`: small icon assets.
- `public/og-image.svg`, `.png`: 1200 × 630 social preview.
- `docs/brand/rightrefer-identity.svg`, `.png`: presentation board of actual assets.
- `public/brand/README.md`: quick asset selection and main-app usage instructions.
- `public/brand/rightrefer-logo-3-louize.zip`: all current public artwork and usage instructions, with icon and social files in separate folders. A matching copy remains at `docs/brand/rightrefer-brand-kit.zip`.

The historical `public/referright-logo.png` is not used by the page.

## Implementation and regeneration

`scripts/generate-brand.py` is the geometry source. It writes SVG exports and `src/lib/brand.ts`, used by the shared header/footer component `Brand.astro`. The live wordmark inherits the theme's ink; saturated surfaces can reverse all pieces to white. The website loads no additional font or logo dependency.

With Python/fonttools (including Brotli for WOFF2) and npm dependencies
installed, run from the repo root. The generator uses `public/Louize.woff2`,
the font retained by main's asset cleanup:

```sh
python scripts/generate-brand.py
node scripts/render-brand.mjs
python scripts/package-brand.py
npm run build
```

The prior revision's hero line remains **The right referral. Your way in.** Its supporting sentence covers asking, giving, and discovering relevant openings.

## Verification — 12 September 2026

Build, layout, and export results are in `verification.md`. This revision is local; production has not been deployed.

## Content discrepancy found while reading the PRD

Existing landing copy claims LinkedIn-verified employment. The updated PRD distinguishes LinkedIn OIDC login from identity/employment verification, using self-confirmed career information and email-scoped badges. The logo makes no employment-verification claim. The site's existing trust copy needs a separate reconciliation with current product rules.
