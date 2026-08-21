/*
 * Build a single self-contained HTML file from `dist/`.
 *
 * There is no headless browser in this sandbox (the npm registry blocks new
 * packages, so Playwright cannot be installed) and the remote browser cannot
 * reach localhost. The way to verify a real render is therefore to fold the
 * built output — stylesheet, fonts, images, the hero film — into one file that
 * can be published and opened from anywhere.
 *
 * Usage: node tools/snapshot.mjs [outFile] [theme]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const outFile = process.argv[2] ?? 'snapshot.html';
const theme = process.argv[3] ?? 'light';

const MIME = {
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpeg': 'image/jpeg',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.mp4': 'video/mp4',
	'.js': 'text/javascript',
};

/** Inline a dist-relative asset as a data URI, or return null if absent. */
const dataUri = (rel) => {
	const path = join(DIST, rel.replace(/^\//, ''));
	if (!existsSync(path)) return null;
	const mime = MIME[extname(path)] ?? 'application/octet-stream';
	return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
};

let html = readFileSync(join(DIST, 'index.html'), 'utf8');

/* 1. Stylesheet -> inline <style>, with its own url() references resolved. */
const cssHref = html.match(/<link rel="stylesheet" href="([^"]+\.css)"/)?.[1];
if (cssHref) {
	let css = readFileSync(join(DIST, cssHref.replace(/^\//, '')), 'utf8');
	css = css.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (whole, _q, ref) => {
		const uri = dataUri(ref);
		return uri ? `url(${uri})` : whole;
	});
	html = html.replace(
		new RegExp(`<link rel="stylesheet" href="${cssHref}"[^>]*>`),
		`<style>${css}</style>`,
	);
}

/* 2. Local media -> data URIs. Remote font CSS is left alone; it still loads. */
for (const attr of ['src', 'href', 'poster']) {
	html = html.replace(
		new RegExp(`${attr}="(/[^"]+\\.(?:webp|png|jpe?g|svg|mp4|woff2))"`, 'g'),
		(whole, ref) => {
			const uri = dataUri(ref);
			return uri ? `${attr}="${uri}"` : whole;
		},
	);
}

/* 3. Module scripts are dropped: the islands cannot resolve their imports from
 *    a data-URI document, and they are not what a layout audit is checking. */
html = html.replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g, '');

/* 4. Pin the theme so the audit is deterministic rather than storage-dependent. */
html = html.replace(/<html([^>]*)data-theme="[^"]*"/, `<html$1data-theme="${theme}"`);
html = html.replace(
	/<script>\(function\(\)\{try\{[\s\S]*?\}\)\(\);<\/script>/,
	`<script>document.documentElement.dataset.theme=${JSON.stringify(theme)};</script>`,
);

writeFileSync(outFile, html);
console.log(`${outFile} (${theme}) — ${(html.length / 1024 / 1024).toFixed(2)} MB`);
