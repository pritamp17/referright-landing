# RightRefer — logo 3, Louize wordmark

Copy this folder into your main app's public folder. The SVGs are standalone
vector artwork with transparent backgrounds and outlined lettering; they do
not need a font download or CSS to display correctly.

## Choose an asset

| Filename stem | Use |
| --- | --- |
| `rightrefer-ink` | Full-color symbol + dark Louize wordmark; light backgrounds |
| `rightrefer-white` | Full-color symbol + white Louize wordmark; dark backgrounds |
| `rightrefer-blue` | Full-color symbol + blue Louize wordmark |
| `rightrefer-mono-ink` | Entire logo in dark ink |
| `rightrefer-mono-white` | Entire logo in white; dark or blue backgrounds |
| `rightrefer-mono-blue` | Entire logo in blue |
| `rightrefer-mark-color` | Colored symbol alone |
| `rightrefer-mark-ink` / `-white` / `-blue` | One-color symbol alone |
| `rightrefer-app-icon` | White symbol on a rounded blue tile |

Every filename stem has `.svg`, `.png`, and lossless `.webp` versions.
Full logo PNG/WebP files are 2048px wide. Symbol and app-icon files are
1024 × 1024px. SVG is the preferred format for web headers and sharp resizing.

```html
<a href="/" aria-label="RightRefer home">
  <img src="/brand/rightrefer-ink.svg" alt="RightRefer" width="160" />
</a>
```

Choose `rightrefer-white.svg` in dark mode. Display the full logo at 144px wide
or larger and keep its aspect ratio. Use the colored symbol at 24px or larger;
use a monochrome mark for smaller placements. Keep the three pieces, gaps,
colors, and spacing as supplied.

The wordmark is Louize from the existing website font. The previous Manrope
wordmark has been replaced in the current exports. Colors: blue `#0A66C2`,
teal `#149FA5`, sky `#64ACE8`, ink `#17212B`, white `#FFFFFF`.

The downloadable `rightrefer-logo-3-louize.zip` includes this collection,
favicon PNG/SVG, Apple touch icon, and social preview PNG/SVG in separate
folders. You only need the artwork files for runtime use.
