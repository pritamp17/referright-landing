# RightRefer landing page

The public marketing site for RightRefer, built as a static Astro application.

## Design system

Use [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) as the source of truth for visual
tokens, page composition, components, motion, responsiveness, accessibility and
design QA.

## Local development

Requires Node.js `22.12+`.

```sh
npm install
cp .env.example .env
npm run dev
```

The development server runs at `http://localhost:4321`.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `SITE_URL` | Production origin, used for canonical URLs and the sitemap | `https://www.rightrefer.com` |
| `PUBLIC_APP_SIGNUP_URL` | Auth handoff used by every call to action | `https://app.rightrefer.com/` |
| `PUBLIC_CONTACT_EMAIL` | Support address in the FAQ and the footer | `rightrefer.team@gmail.com` |
| `PUBLIC_PRIVACY_URL` | Hosted privacy policy | unset — the footer link is not rendered |
| `PUBLIC_TERMS_URL` | Hosted terms | unset — the footer link is not rendered |

Every call to action points at `PUBLIC_APP_SIGNUP_URL` directly. `signUpWith`
still takes a `SignUpIntent` for call-site clarity, but the intent is not
appended to the URL.

## Analytics

Vercel Web Analytics is injected once through `src/layouts/BaseLayout.astro`.
Enable **Web Analytics** for the project in the Vercel dashboard before
deploying; the `/_vercel/insights/*` routes are provided by Vercel, so a local
`npm run preview` will log one 404 for that script and nothing else.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Generate the production site in `dist/` |
| `npm run preview` | Preview the production build |

## Page structure

Five blocks, and adding a sixth is a design decision, not a routine one. See
`DESIGN_SYSTEM.md` §14.

1. `Hero.astro` plus the company marquee, as one opening block.
2. `BetaProof.astro`, the private-beta count and the quote marquee. Proof comes
   before mechanism.
3. `ProductStory.astro`, all three things the product does, as a switch.
4. `Faq.astro`.
5. `ClosingSection.astro`, a plain call to action and the footer.

## What this page ships

- **RightRefer identity.** The three-piece Forward symbol and outlined Louize
  wordmark share geometry in `src/lib/brand.ts`. Copy-ready SVG/PNG/WebP assets
  and the ZIP are in `public/brand`; see [`brand notes`](./docs/brand/README.md).

- **No framework runtime.** The page is Astro plus roughly 7 KB of hand-written
  JavaScript across seven small island scripts. There is no React, no animation
  library and no video.
- **One image.** `public/ink-doors-mask.webp` is the hand-inked wall of doors,
  shipped as a single-channel alpha mask and painted with theme tokens, so one
  file serves both themes. It is preloaded, and it is reused by the closing
  section as the page's bookend.
- **Two typefaces.** Louize is self-hosted from `public/Louize.woff2` and used
  for display type and the outlined logo; Inter is loaded from Google Fonts
  for UI and body text.
- **Company logos** are rendered from the CC0-licensed Simple Icons package at
  build time. They remain the property of their respective owners and do not
  imply affiliation. Microsoft's four squares are drawn inline, because their
  brand guidelines forbid recolouring the mark to a single colour.

## Launch checklist

- [ ] **Testimonial copy is prototype content.** `testimonialBatches` in
      `src/pages/index.astro` must be replaced with verified, consented customer
      quotes before a public launch.
- [ ] **The private-beta figure must be verified.**
      `PRIVATE_BETA_REFERRAL_COUNT` in `src/lib/content.ts` is currently `78`.
- [ ] **Set `PUBLIC_PRIVACY_URL` and `PUBLIC_TERMS_URL`.** The footer renders
      each link only once its URL exists, so an unset value shows nothing rather
      than a link to a page that is not there.
- [ ] **Confirm Louize's production embedding rights**, file provenance and any
      required attribution. If they cannot be confirmed, the fallback is a
      licensed editorial serif chosen before release, with the semantic font
      roles unchanged.
- [ ] **Keep `POLICY` in step with the product.** Every deadline in page copy
      interpolates it, so a policy change in the application is a change here in
      the same pull request.
- [ ] **The peer-signal examples name real employers.** They describe a role and
      never a person, and they claim only that a referral path exists — confirm
      that still matches what the product checks before launch.
