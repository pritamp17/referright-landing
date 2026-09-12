# RightRefer brand assets

Logo 3 (Forward symbol) with the Louize wordmark. Copy this entire folder
into your main app's `public` folder.

| Folder / asset | Where to use it |
| --- | --- |
| `logos/rightrefer-ink` | Header or footer on a light background; colored symbol + dark text |
| `logos/rightrefer-white` | Header or footer in dark mode; colored symbol + white text |
| `logos/rightrefer-blue` | Full logo when blue lettering is needed |
| `logos/rightrefer-mono-ink`, `-white`, `-blue` | One-color logo for printing or solid backgrounds |
| `symbols/rightrefer-mark-color` | Symbol alone: compact navigation, avatars, badges |
| `symbols/rightrefer-mark-ink`, `-white`, `-blue` | One-color symbol for small or monochrome placements |
| `icons/rightrefer-app-icon` | App tile or profile image: white symbol on blue |
| `icons/favicon.svg` / `.png` | Browser tab icon |
| `icons/apple-touch-icon.png` | iPhone/iPad home-screen icon (180 × 180px) |
| `social/og-image` | Link previews on social media (1200 × 630px) |
| `downloads/rightrefer-logo-3-louize.zip` | Complete copy-ready asset pack |

Use **SVG** for the sharpest web logo; the lettering is outlined and needs no
font installation. Logo, symbol, app-icon, and social files also have **PNG**
and lossless **WebP** versions. Full logos are 2048px wide; symbols/app tiles
are 1024 × 1024px. Logo backgrounds are transparent.

```html
<img src="/brand_assets/logos/rightrefer-ink.svg" alt="RightRefer" width="160" />
```

Switch to `rightrefer-white.svg` for dark mode. Keep the aspect ratio; display
the full logo at least 144px wide and the colored symbol at least 24px wide.
Keep the supplied colors and gaps. Use a monochrome symbol for smaller sizes.

Root-level website files such as `/favicon.png` and `/og-image.png` are
compatibility copies generated from this artwork. Design history and source
instructions live in `docs/brand`; they are not needed in your main app.
