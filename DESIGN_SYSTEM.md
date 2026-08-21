# RightRefer landing — design system

> Status: current as of the "premium three-offering" redesign.
> The palette is **locked**. Do not introduce new colour values.

---

## 1. Principle

The landing page and the signed-in product are one company. Every colour, radius
and shadow on this page resolves from the **same token names** the application
declares in its `tailwind.config.ts` and `src/styles/tokens.css`.

The application consumes them through Tailwind as `rgb(var(--token) / <alpha-value>)`.
This page has no Tailwind and consumes them directly as CSS custom properties.
Same names, same values, same two themes — with one intentional divergence
noted in §2.3.

---

## 2. Tokens

All tokens live in `src/styles/tokens.css`. Colour values are **space-separated
RGB channels**, not hex, so any token can be used at partial alpha:

```css
color: rgb(var(--color-ink));
border-color: rgb(var(--color-primary) / 28%);
```

### 2.1 Mirrored from the product application

| Token | Light | Dark |
|---|---|---|
| `--color-canvas` | `251 248 242` (#FBF8F2) | `5 5 5` (#050505) |
| `--color-shell` | `255 255 255` | `0 0 0` |
| `--color-elevated` | `241 245 249` | `23 26 29` |
| `--color-field` | `255 255 255` | `11 13 15` |
| `--color-ink` | `23 33 43` (#17212B) | `245 247 250` |
| `--color-muted` | `83 97 112` | `174 181 189` |
| `--color-border` | `216 225 234` | `43 48 54` |
| `--color-primary` | `10 102 194` (#0A66C2) | `10 102 194` |
| `--color-primary-hover` | `0 65 130` (#004182) | `0 65 130` |
| `--color-primary-strong` | `0 65 130` | `112 181 249` |
| `--color-primary-soft` | `234 243 248` | `16 42 67` |
| `--color-primary-ink` | `255 255 255` | `255 255 255` |

Plus the semantic triads `trust`, `reward`, `danger`, `success` (each with
`-soft` and `-ink`), and `--color-focus` / `--color-focus-contrast`.

### 2.2 Landing-only extensions

| Token | Purpose |
|---|---|
| `--color-brand-panel` | Deep blue surface for inverted panels. Stays blue in **both** themes so an inverted panel never washes out. |
| `--color-brand-panel-ink` | Foreground on that panel. |
| `--shadow-raised` / `--shadow-panel` / `--shadow-media` | Three-step elevation ladder. |
| `--radius-sm` · `--radius-xl` · `--radius-2xl` · `--radius-lg` · `--radius-xxl` | `xl` and `2xl` are the product's; the larger steps exist for hero-scale media. |
| `--shell` / `--shell-gutter` / `--section-space` | Layout rhythm. |

### 2.3 Intentional divergence — `--color-surface` in light mode

The product application sets `--color-surface: 255 255 255` (pure white) in
light mode. On the landing page this reads as clinical against the warm
`#FBF8F2` canvas, so **light-mode `--color-surface` here is `255 253 248`** — a
faint cream, a few points off white. Card chrome still separates cleanly from
the canvas, but the whole page now sits on one warm register instead of white
cards floating on a cream canvas.

Dark mode is unaffected (`--color-surface: 16 18 20`, unchanged). This is the
only value in this file that does not match the product 1:1 — every other
token is mirrored exactly. If the product ever moves off pure white too, drop
this override and go back to mirroring.

---

## 3. Theming

Explicit two-value theme, `ThemeMode.Light | ThemeMode.Dark`. Deliberately no
`system` value — the product persists an explicit choice, and this page matches
it so a visitor's preference survives the hand-off into `/app`.

- Applied as `data-theme` on `<html>`.
- Persisted under the `rightrefer-theme` localStorage key — **shared with the
  product**.
- Resolved by an `is:inline` prepaint script in `BaseLayout.astro`, before first
  paint. Without it, a returning dark-mode visitor gets a flash of the light
  canvas.
- First-ever visit falls back to `prefers-color-scheme`.
- `ThemeToggle.astro` dispatches `rightrefer:themechange` on switch.

---

## 4. Typography

| Role | Family | Used for |
|---|---|---|
| Body / UI | **Inter** | Everything. All copy, labels, buttons, navigation. |
| Display | **Louize** | Landing headlines only (`.display-1/2/3`) and pull-quotes. |
| Mono | system mono stack | Numbers, deadlines, reference codes, index markers. |

**Louize is banned inside the product application.** Here it is limited to
display type — never body, never UI, and (unlike the previous system) **never
mono**.

---

## 5. Components

| File | Responsibility |
|---|---|
| `Brand.astro` | Wordmark + mark. `onBrandSurface` for saturated panels. |
| `ThemeToggle.astro` | Light/dark switch. |
| `SiteHeader.astro` | Sticky header, condenses on scroll. |
| `Hero.astro` | Asymmetric split, aurora field, contained media panel, trust strip. |
| `Offerings.astro` → `OfferingChapter.astro` | The three-offering spine. |
| `PeerSignalDiagram.astro` | Cross-company matching illustration. |
| `PeerSignalSection.astro` | Offering 03 deep dive + signal film. |
| `Lifecycle.astro` | Five-stage rail + journey film. |
| `TrustSection.astro` | Light-blue trust panel, four pillars. |
| `Appreciation.astro` | The light thank-you note + appreciation film. |
| `TestimonialStage.astro` | Beta feedback marquee. |
| `CompanyField.astro` | Company logo marquee. |
| `ClosingSection.astro` | Final CTA + footer. |

Section CSS lives in each component's scoped `<style>`. `global.css` holds only
shared vocabulary plus Remotion player sizing (whose class names are generated
inside the React island and cannot be reached from a scoped block).

---

## 6. Typed vocabulary

`src/lib/constants.ts` — every string used in more than one place is an enum:
`ThemeMode` · `OfferingKind` · `SignUpIntent` · `SectionId` · `TrackEvent` ·
`Accent` · `LifecycleStage`.

`src/lib/content.ts` — single source of truth for offerings, lifecycle steps,
trust pillars, the hero trust strip, and the peer-matching example.

### Policy constants

`POLICY` mirrors the product's policy layer: claim window (48h), confirmation
window (24h), employment re-check (10 days). If a policy changes in the
product, change it here in the same PR.

---

## 7. Commercial restraint

**A design rule, not a copy preference.** A first-time visitor must not meet a
fee table. Amounts, fees, payout schedules and refund mechanics belong inside
the product, after someone has decided to take part.

1. **No pricing section.** No fee breakdown, no worked receipt, no percentage,
   no payout schedule, no UPI/withdrawal language anywhere in page copy.
2. **The hero raises no commercial claim at all.** Its trust strip answers "is
   this person real / will anything happen / what if it goes wrong / who sees
   my search" — never "what does it cost".
3. **One honest sentence, late in the page.** `Appreciation.astro` says a
   thank-you is optional, never required to ask, and never changes whether you
   get referred. That is the entire commercial surface.
4. The appreciation film may show example amounts — it appears *inside* that
   section and depicts the actual flow. Nowhere else.

---

## 8. Honesty constraints

1. `OUTCOME_DISCLAIMER` — *"A referral is an introduction, never a guaranteed
   outcome."* — next to every primary call to action.
2. **"Employer verified" is banned.** The product verifies *employment via
   LinkedIn*, a different and weaker claim.
3. No guaranteed-outcome language anywhere.
4. Peer-signal copy states that peers see **the opening**, never the identity of
   the person who asked.

---

## 9. Hero composition

The single most important rule on this page, and the failure the redesign
fixed: **copy never sits on top of the film.** The previous hero laid centred
text over a full-bleed video at `scale(1.3)`, then patched the resulting
illegibility with `text-shadow` — a structural failure wearing a cosmetic fix.

Now:

- Copy occupies its own column on the page canvas. The film occupies a
  contained, masked panel beside it. They never overlap.
- **There is no `text-shadow` anywhere in the hero.**
- One headline, one primary action, one line of fine print. No supporting
  paragraph — the film and the proof card carry that weight visually.
- Atmosphere comes from the **aurora field**: three heavily blurred radial
  blobs drifting on long, offset cycles, animating only `transform` so it stays
  on the compositor — no layout, no paint, no canvas, no JavaScript.

---

## 10. Trust section register

`TrustSection.astro` deliberately does **not** use the deep `--color-brand-panel`
the way the closing section does. A wall of dark blue reads as marketing
theatre; a mechanism-and-evidence section reads better on a **light blue
field** — `--color-primary-soft` in light mode, a dim desaturated blue-black in
dark mode — with ink-coloured text. The four pillar cards sit on the page
surface, not on an inverted panel, so the copy stays legible without a
brand-panel-ink override.

---

## 11. Responsive contract

**Mobile-first source order.** Unqualified CSS *is* the phone layout. Media
queries only add layout changes upward.

| Query | Change |
|---|---|
| `min-width: 48rem` (768px) | Trust pillars and peer nodes go two-up; hero strip goes four-up. |
| `min-width: 62rem` (992px) | Header navigation appears. |
| `min-width: 64rem` (1024px) | Hero splits two-column; offering chapters split and alternate; lifecycle rail turns horizontal. |

### Verification matrix

Every change is rendered and checked at **1440 / 1024 / 768 / 390 / 360** in
**both themes**:

- `document.documentElement.scrollWidth <= window.innerWidth` — zero horizontal
  overflow, asserted in the browser.
- Every `<a>` and `<button>` is at least 44px in its smallest dimension.
- The hero primary CTA is above the fold at 390×844.
- Text contrast clears WCAG AA (4.5:1).

---

## 12. Motion

- All animation is gated behind `prefers-reduced-motion`.
- The hero film and both marquees play only while on screen
  (`IntersectionObserver`), and pause when scrolled away or the tab is hidden.
- The hero video is `preload="none"` and only upgrades to `auto` on entering the
  viewport.
- `.reveal` elements are **visible by default** when motion is reduced.

---

## 13. Remotion films

Three compositions in `src/components/remotion/RightReferScenes.tsx`: `signal`,
`journey`, `appreciation`. Their palette is a single `colors` object where
**every value is a token reference**, e.g. `rgb(var(--color-primary))`. Because
the player renders as real DOM, those custom properties re-resolve on theme
switch — the films retheme themselves with no re-render.

There are **no hex literals** in that file. Keep it that way.
