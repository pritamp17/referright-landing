# RightRefer landing — design system

> Current as of the premium redesign of everything below the hero.
> The palette is mirrored from the product application; do not invent colour
> values here, compose the existing tokens instead.

---

## 1. Principle

The landing page and the signed-in product are one company. Every colour,
radius and shadow on this page resolves from the **same token names** the
application declares in its `tailwind.config.ts` and `src/styles/tokens.css`.

The application consumes them through Tailwind as
`rgb(var(--token) / <alpha-value>)`. This page has no Tailwind and consumes
them directly as CSS custom properties. Same names, same values, same two
themes — with one intentional divergence noted in §2.3.

---

## 2. Tokens

All tokens live in `src/styles/tokens.css`. Colour values are **space-separated
RGB channels**, not hex, so any token can be used at partial alpha:

```css
color: rgb(var(--color-ink));
border-color: rgb(var(--color-primary) / 28%);
```

### 2.1 Mirrored from the product application

Re-synced 2026-09-06 against the surface-ladder and status-colour work in the
unified PRD (§8.11, §8.13). The families:

| Family | Meaning | Light | Dark |
|---|---|---|---|
| `canvas` / `shell` | the page ground | `251 248 242` | `5 5 5` |
| `surface-sunken` · `surface` · `elevated` | the depth ladder | `246 248 251` · `255 253 248` · `238 242 247` | `12 14 17` · `20 22 26` · `32 36 42` |
| `hairline` · `border` · `border-strong` | three weights of line | `236 240 246` · `216 225 234` · `178 190 203` | `29 32 37` · `48 54 62` · `72 80 90` |
| `ink` · `muted` | type | `23 33 43` · `83 97 112` | `245 247 250` · `174 181 189` |
| `primary` (+ `-hover -strong -soft -ink`) | LinkedIn blue, primary actions | `10 102 194` | same, `-strong` lifts to `112 181 249` |
| `progress` (+ `-soft -ink`) | teal — in flight, in someone else's hands | `13 148 136` | `45 212 191` |
| `warning` (+ `-soft -ink`) | amber — waiting on the reader | `180 83 9` | `245 158 11` |
| `success` (+ `-soft -ink`) | green — done | `21 128 61` | `74 222 128` |
| `reward` (+ `-soft -ink`) | violet — money | `109 40 217` | `167 139 250` |
| `danger` (+ `-soft -ink`) | red | `185 28 28` | `248 113 113` |
| `trust` · `focus` · `sonar` · `overlay` · `band-from/-to` | as in the product | | |

**`reward` is violet, not a second blue, and this matters here.** It was
blue-600 in both files, which made `--color-reward-soft` and
`--color-primary-soft` byte-identical in dark mode (`16 42 67`). That is why an
earlier version of this document recorded that the three offerings had to share
one accent. They no longer do — see §16.

### 2.2 Landing-only extensions

| Token | Purpose |
|---|---|
| `--color-brand-panel` / `-ink` | Deep blue surface for inverted panels. Stays blue in **both** themes so an inverted panel never washes out. |
| `--glass-bg` / `-border` / `-highlight` / `-shadow` / `-blur` | The glass recipe, composed entirely from existing tokens. See §6. |
| `--shadow-panel` / `--shadow-media` | Two heavier steps than the product needs, for hero-scale surfaces. |
| `--radius-sm` · `--radius-lg` · `--radius-xxl` · `--radius-pill` | `xl`/`2xl` are the product's; the larger steps exist for hero-scale media. |
| `--shell` / `--shell-gutter` / `--section-space` | Layout rhythm. |
| `--ease-spring` · `--dur-reveal` · `--stagger` | Motion vocabulary added with the shared reveal system. |

### 2.3 Intentional divergence — `--color-surface` in light mode

The product sets `--color-surface: 255 255 255` in light mode. On the landing
page that reads as clinical against the warm `#FBF8F2` canvas, so **light-mode
`--color-surface` here is `255 253 248`** — a faint cream, a few points off
white. Card chrome still separates cleanly from the canvas, but the whole page
sits on one warm register instead of white cards floating on cream.

Dark mode is unaffected. This is the only value that does not match the product
1:1. If the product ever moves off pure white too, drop the override.

---

## 3. Theming

Explicit two-value theme, `ThemeMode.Light | ThemeMode.Dark`. Deliberately no
`system` value — the product persists an explicit choice, and this page matches
it so a visitor's preference survives the hand-off into the app.

- Applied as `data-theme` on `<html>`.
- Persisted under the `rightrefer-theme` localStorage key, **shared with the
  product**.
- Resolved by an `is:inline` prepaint script in `BaseLayout.astro`, before first
  paint. Without it a returning dark-mode visitor gets a flash of the light
  canvas.
- **Light is the default and the only first-visit theme.** `prefers-color-scheme`
  is deliberately not consulted: this page is a first impression, and it should
  be the same first impression for everyone. Dark is opt-in and remembered.
- The same script stamps `js` on `<html>`. Every scroll-reveal rule is gated
  behind that class, so a visitor whose bundle never loads reads a fully visible
  page rather than a blank one.
- `ThemeToggle.astro` dispatches `rightrefer:themechange` on switch.

---

## 4. Typography

| Role | Family | Used for |
|---|---|---|
| Body / UI | **Inter** | All copy, labels, buttons, navigation. |
| Display | **Louize** | Headlines (`.display-1/2/3`), section titles, pull-quotes, and the large numerals in `.numeral`. |
| Mono | system mono stack | Deadlines, reference codes, eyebrows, small index markers. |

**Louize is banned inside the product application.** Here it is display type
only — never body, never UI.

**Louize sets figures old-style by default**, where the zero is x-height and the
one is an unserifed stroke, so `01` reads as `OI`. `.numeral` therefore asks for
`font-variant-numeric: lining-nums tabular-nums`, and anything that prints a
number in Louize must do the same.

---

## 5. Components

| File | Responsibility |
|---|---|
| `Brand.astro` | Wordmark + mark. `onBrandSurface` for saturated panels. |
| `ThemeToggle.astro` | Light/dark switch. |
| `SiteHeader.astro` | Sticky header. Transparent over the hero; gains a translucent canvas, a heavier blur and a hairline on scroll. Marks the section being read. |
| `DoorWall.astro` | The hand-inked wall of doors, as a token-painted alpha mask. `hero` and `bookend` variants. See §9. |
| `Hero.astro` | Full-fold split: copy left, wall right, two glass proof cards in the quiet pockets. |
| `CompanyField.astro` | Company logo marquee. Belongs to the hero block, not to a section of its own. Pauses offscreen and under the pointer. |
| `ProductStory.astro` + `PathCard.astro` | The three things the product does, as a switch. See §10. |
| `BetaProof.astro` + `TestimonialStage.astro` | Private-beta count and the quote marquee. |
| `Faq.astro` | Nine questions as native `<details>`. See §15. |
| `ClosingSection.astro` | The bookend, the primary call to action, and the footer. |

Section CSS lives in each component's scoped `<style>`. `global.css` holds only
shared vocabulary.

---

## 6. Shared vocabulary

`global.css` owns exactly five things beyond the reset and the type scale:

- **`.glass`** — a low-alpha surface with a heavy backdrop blur and an inset top
  highlight, so whatever is behind it reads through. It began as the hero proof
  card and is now the page's floating-object recipe: the request stage, the
  signal cards, the appreciation card and the quote cards all use it.
- **`.lift`** — a two-pixel hover rise onto `--shadow-panel`.
- **`.reveal` / `.reveal-group`** — fade-up on first read; a group staggers its
  children by `--i × --stagger`. Both gated on `.js`.
- **`.button-*` / `.text-link`** — the primary button carries one sheen that
  crosses it on hover; the text link draws its underline in from the left.
- **`.accent-*`** — five accent triads, each mapping to a semantic token family
  and never to a raw colour.

`src/lib/motion.ts` is the behaviour half: `revealObserver`, `motionGate`,
`countUp`, `stageController` and `navSpy`. `src/lib/card-cycle.ts` rotates a
pool of cards through a fixed number of slots and is shared by the hero and the
signal stack. There is no animation library.

`[data-reveal-mark]` is a third reveal form that takes `is-visible` and no
styling. Use it where an element must stay painted — a cell in a shared frame,
where fading the cell would show the frame's own gap colour through the hole —
but something inside it still needs to start when it is read.

---

## 6A. Copy density

**A section carries one idea, one object, and as few words as will hold it up.**
This is a rule because the page broke it once: every section below the hero had
an eyebrow, a heading, a two-sentence lede, a labelled artifact, a paragraph per
item and a line of fine print underneath, and the result read as homework rather
than as a product.

What the rule means in practice:

- **A supporting line is one sentence.** If it needs two, the heading is not
  doing its job.
- **An item's description is one short sentence.** The FAQ carries the detail;
  a card carries the claim.
- **Nothing is said twice on one screen.** An eyebrow that paraphrases its own
  heading, a chip that repeats the sentence above it, and a note explaining a
  control that already shows its own options were all deleted for this reason.
- **A visible control beats a sentence describing it.** Three named cadences
  say "you choose how often" better than a line of copy saying so.
- **No internal vocabulary.** A visitor has not been told the product has
  numbered offerings, so nothing on the page refers to "Offering 03".

**No em dashes, en dashes or double hyphens in visible copy.** Rewrite the
sentence instead. A dash almost always marks a clause that could have been its
own short sentence, or one that could have been cut.

---

## 7. Commercial restraint

**A design rule, not a copy preference.** A first-time visitor must not meet a
fee table. Amounts, fees, payout schedules and refund mechanics belong inside
the product, after someone has decided to take part.

1. **No pricing section.** No fee breakdown, no worked receipt, no percentage,
   no payout schedule, no withdrawal language anywhere in page copy.
2. **The hero raises no commercial claim** beyond stating that asking is free.
   Its trust strip answers "is this person real", "what does this cost me" and
   "how long will this take". Note that `100% Free` is a commercial claim and
   is there deliberately; if the model changes, that line changes first.
3. **One honest sentence, late in the page.** `Appreciation.astro` says a
   thank-you is optional, never required to ask, and never changes whether you
   get referred. That is the entire commercial surface.
4. **The request card may show example amounts**, because that is where the
   product asks for them. Nowhere else. `Nothing` is the first of the three
   tiles at exactly the same size: zero is always allowed, and a card where the
   free option is smaller than the paid ones would contradict the step beside
   it.
5. **The FAQ may answer "is it free", in words, with no numbers.** Refusing to
   answer the most common question a visitor has reads as evasion, which costs
   more trust than the restraint buys. `FAQ_ITEMS[0]` says plainly that asking
   costs nothing and names no amount, fee, percentage or schedule.

---

## 8. Honesty constraints

1. `OUTCOME_DISCLAIMER` — *"A referral is an introduction, never a guaranteed
   outcome."* — next to every primary call to action.
2. **"Employer verified" is banned.** The product verifies *employment via
   LinkedIn*, a different and weaker claim.
3. No guaranteed-outcome language anywhere.
4. Peer-signal copy states that peers see **the opening**, never the identity of
   the person who asked. `PEER_SIGNALS` therefore carries a role, an employer, a
   location and an age — and nothing about a person.
5. Every deadline in copy interpolates `POLICY`, so the page cannot advertise a
   window the product does not keep.

---

## 9. The wall of doors

The page's one piece of artwork, and the only image it loads:
`public/ink-doors-mask.webp`, a single-channel alpha mask of a hand-inked wall
of doors with one of them opening from the inside.

It is never a flat picture. `DoorWall.astro` paints it through three nested
masks — one fades it out before it reaches the copy, one fades its top and
bottom edges, one carries the drawing — and colours it with tokens:
`.ink-base` takes the ink colour, `.ink-accent` repaints only the strokes within
a small radius of the open door in brand blue, and `.hero-glow` is the light
spilling out of the doorway behind the linework. One asset, both themes, no
second dark-mode export.

**Copy never sits on top of it.** The copy occupies its own column on the page
canvas; the wall occupies the rest. There is no `text-shadow` anywhere in this
codebase, because nothing needs one.

Two variants:

- `hero` — right-hand side, wiping on left to right over 1500ms so the closed
  doors are established before the open one lights up.
- `bookend` — centred and mirrored, kept for reference and **not currently
  used**. The closing block ran it behind its headline as a bookend, and at the
  alphas that made the drawing read, the words in front of it did not. Line art
  behind a headline is texture competing with letterforms, and the headline has
  to win. Nothing goes behind display type on this page.

---

## 10. Three paths, one switch

`ProductStory.astro` is how the product explains itself, and it explains all
three of the things the product does: ask for a referral, give one, hear about
roles early.

**Parallel choices want a switch, not a scroll.** Two earlier versions got this
wrong in opposite directions. The first gave each path its own section, which
made a reader start over three times. The second told one linear story from the
seeker's side, which read beautifully and was wrong about the product twice: it
demoted giving and peer openings to two links at the bottom, and it put the
thank-you at the very end, after the referral had landed.

**The thank-you is chosen on the request form, before anything is sent**
(PRD §5.2 step 7, §0.11). It appears on the ASK card and nowhere else, with
`Nothing` first and the same size as the amounts, because zero is a real option
in the product and has to look like one here.

The section is a real `tablist`: one selected tab, roving tabindex so the group
is a single tab stop, arrow keys plus Home and End, and every panel in the DOM
at all times so find-on-page reaches a hidden step and printing carries all
three. With the script absent the first panel is visible and the section is
still readable.

Each panel is a numbered list on one side and `PathCard.astro` on the other:
the request form with its optional thank-you, the incoming request a referrer
can claim, the opening that arrives before the role is public. Below 64rem the
card moves above the call to action, so the order is pick a path, see the
thing, read how it goes.

**A sticky element is never a grid item.** Measured in Chromium: a sticky grid
item that may stretch over its (very tall) grid area is pushed down by its own
`top` offset, and neither `align-self: start` nor `height: fit-content` fixes
it. `Faq` therefore sticks an element *inside* the grid item.

---

## 11. Responsive contract

**Mobile-first source order.** Unqualified CSS *is* the phone layout. Media
queries only add layout changes upward.

| Query | Change |
|---|---|
| `min-width: 48rem` (768px) | The footer goes three-up. |
| `min-width: 62rem` (992px) | Header navigation appears. |
| `min-width: 64rem` (1024px) | Hero splits two-column; the product story splits with the card on the right; the FAQ splits with its head on the left. |

### Verification matrix

Every change is rendered and checked at **1440 / 1024 / 768 / 390 / 360** in
**both themes**:

- `document.documentElement.scrollWidth <= window.innerWidth` — zero horizontal
  overflow, asserted in the browser.
- Every `<a>` and `<button>` is at least 44px in its smallest dimension.
- The hero primary CTA is above the fold at 390×844.
- Text contrast clears WCAG AA (4.5:1).
- A run with `prefers-reduced-motion: reduce` renders every section in its
  final state, with nothing sticky and nothing mid-animation.

---

## 12. Motion

- All animation is gated behind `prefers-reduced-motion`, and every animated
  element has a resting state that IS its finished state — the blanket
  reduced-motion rule collapses animations to their first frame, so an element
  whose first frame is invisible would simply never appear.
- Only `opacity`, `transform`, `filter` and `clip-path` are animated.
- Both marquees, the signal stack and the trust orbit run only while on screen;
  the marquees and the signal stack also pause under the pointer, because a
  drifting click target is a hostile one.
- Reveals fire once and unobserve.
- There is no animation library and no video on this page.

---

## 13. One canvas, contrast at the component level

**Sections do not get their own background colours.** Every section sits on
`--color-canvas`, separated by a hairline and by section spacing. The one
exception the page has — a ~4% primary wash on `lifecycle` and `trust` — is
deliberately far too faint to read as a colour change.

This rule was learned by breaking it. The page below the hero genuinely was
flat, and the first attempt at a fix gave each section its own surface:
`canvas → raised → canvas → tint → canvas → tint → raised → canvas → deep blue`.
It technically satisfied "no two adjacent sections share a background" and it
looked *worse* — a striped page where every scroll position announces a new
band, and the eye reads the seams instead of the content. Alternating bands are
not rhythm; they are noise with a rule attached.

**Depth belongs to components, and rhythm belongs to layout.** What actually
fixed the flatness was giving the content real structure on one calm ground:

- the glass objects, above all the request card that carries the whole product
  story;
- the FAQ's ruled rows and the brand-panel stat card;
- and the block rhythm itself: full-fold, split, centred, split, centred.

**Corollary, and the tell that the banding was wrong: the primary CTA never
changes appearance.** `.button-primary` is brand blue with a white label in
every position on the page. When the closing section was briefly a deep blue
panel it needed an inverted button, which meant the page's single most important
action looked like two different controls depending on where you met it. If a
background forces a component to restyle itself, the background is wrong.

---

## 14. Five blocks, in this order

1. **Hero**, with the company marquee attached under it as one thin band.
2. **Reviews**, the private-beta count and the quote marquee.
3. **How it works**, the three paths (§10).
4. **Questions**, the FAQ.
5. **The way out**, a plain call to action and the footer.

There were nine. The rule that replaced them: a block exists because a reader
has a distinct question, not because the product has a distinct feature.

**Proof comes before mechanism.** The companies band and the beta quotes are
the two cheapest things on the page to read and the two most likely to earn the
next scroll, so they sit directly under the hero. Only then is it worth spending
a reader's attention on how the thing works, and the questions land last, where
somebody who is nearly convinced goes looking for the one detail that still
bothers them.

A new section is the most expensive thing that can be added to this page: it
costs an eyebrow, a heading, a lede, a visual and a closing line before it has
said anything at all. Before adding one, check whether it is a panel or a step
in something that already exists.

---

## 15. The FAQ

Native `<details>`/`<summary>`. No framework, and deliberately no
`aria-expanded` / `aria-controls`: browsers already map these elements to a
disclosure and expose the open state, so hand-wiring ARIA duplicates it. The APG
accordion pattern also wants `role="region"` per panel — omitted on purpose,
since it warns against landmark proliferation past ~6 simultaneously-open
panels and there are nine here.

Native buys three things a `display: none` accordion cannot do at all:
find-on-page reaches text inside a **closed** item and opens it, fragment
navigation opens the item it lands on, and the content survives reader mode. A
small progressive-enhancement script covers the two gaps the markup can't:
opening on `hashchange` (only Chromium does this natively) and expanding
everything before `beforeprint`, since a closed `<details>` prints nothing and
no stylesheet can set the `open` attribute.

Three choices with plausible opposites, recorded so they don't get "fixed":

- **Not `<details name>`.** That would make it an exclusive accordion where
  opening one answer closes another. It keeps the section short, but it stops a
  reader holding two answers side by side — and "is it free" and "does it
  guarantee an interview" are exactly the pair people compare.
- **The first item ships `open`.** Nine collapsed rows read as a nav list, and
  an all-closed accordion hides that it opens at all.
- **A chevron, not a plus.** In tested signifiers a caret reliably communicates
  "expands in place"; a plus performs no better than no icon at all.

The open row carries a rail, matching the product's convention that state is a
rail rather than a fill. The head and the contact line stick together beside the
list, so the way to ask a question that is not listed stays on screen.

Content lives in `FAQ_ITEMS` in `content.ts`, and the same array generates the
`FAQPage` JSON-LD in `BaseLayout.astro`, so the two cannot drift. That markup
earns **no rich result** — Google retired FAQ rich results on 2026-05-07 — it is
there to describe the Q&A to AI search surfaces.

---

## 16. Accent identity, resolved

An earlier version of this document recorded that `Offerings.astro` had to
render all three doors in one accent, because in dark mode
`--color-primary-soft` and `--color-reward-soft` were both `16 42 67` and
`--color-primary-strong` and `--color-reward-ink` were both `112 181 249`, so
two of the three would have rendered pixel-identical.

The token re-sync fixed that at the source. `reward` is violet in both themes
and `progress` is a new teal family, so the doors now read:

| Door | Accent | Why that one |
|---|---|---|
| Ask for a referral | `primary` | It is the page's primary action. |
| Give a referral | `success` | The giver's side completes things. |
| Hear about openings | `progress` | Something in flight, reaching you. |

The request card uses the same vocabulary as it moves through the story:
`primary` while the opening is live and the request is out, `progress` while it
is in somebody else's hands, `warning` at the beat that is waiting on the
reader, `success` when it is done. The rule that produced the original problem
still stands: never pick an accent because of how it looks, pick it because of
what it already means in the product.
