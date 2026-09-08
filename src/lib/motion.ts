/**
 * Motion primitives shared by every section.
 *
 * All of these are progressive enhancement. The stylesheet renders every
 * element in its final state when motion is reduced, when
 * IntersectionObserver is missing, or when this script never runs; these
 * helpers only ever add the transition in between.
 */

export const prefersReducedMotion = (): boolean =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasObserver = (): boolean => 'IntersectionObserver' in window;

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

/**
 * `.reveal` fades up once when it first enters the viewport. `.reveal-group`
 * does the same for each of its children in turn — every child receives its
 * index as `--i`, which the stylesheet turns into a transition delay.
 *
 * `[data-reveal-mark]` is the third form: it takes `is-visible` and nothing
 * else. Use it where the element must stay fully painted — a cell in a shared
 * frame, say, where fading the cell would show the frame's gap colour through
 * the hole — but something inside it still wants to start when it is read.
 */
export function revealObserver(root: ParentNode = document): void {
	for (const group of root.querySelectorAll<HTMLElement>('.reveal-group')) {
		Array.from(group.children).forEach((child, index) => {
			(child as HTMLElement).style.setProperty('--i', String(index));
		});
	}

	const targets = root.querySelectorAll<HTMLElement>('.reveal, .reveal-group, [data-reveal-mark]');

	if (prefersReducedMotion() || !hasObserver()) {
		targets.forEach((target) => target.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
	);

	targets.forEach((target) => observer.observe(target));
}

/* ------------------------------------------------------------------ */
/* Play/pause gate for continuous motion                               */
/* ------------------------------------------------------------------ */

/**
 * Marquees and ambient loops only run while they are on screen. The element's
 * `data-motion-state` flips between `playing` and `paused`, and the stylesheet
 * reads it through `animation-play-state`.
 */
export function motionGate(element: HTMLElement, threshold = 0.15): void {
	if (prefersReducedMotion()) return;

	if (!hasObserver()) {
		element.dataset.motionState = 'playing';
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				element.dataset.motionState = entry.isIntersecting ? 'playing' : 'paused';
			}
		},
		{ threshold },
	);

	observer.observe(element);
}

/* ------------------------------------------------------------------ */
/* Counting numerals                                                   */
/* ------------------------------------------------------------------ */

const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Counts `data-count-to` up from zero the first time the element is seen.
 * Any prefix or suffix stays in the markup around the element; only its own
 * text changes.
 */
export function countUp(element: HTMLElement, durationMs = 1100): void {
	const target = Number(element.dataset.countTo);
	if (!Number.isFinite(target)) return;

	const format = (value: number): string => Math.round(value).toLocaleString('en-IN');
	const finish = (): void => {
		element.textContent = format(target);
	};

	if (prefersReducedMotion() || !hasObserver()) {
		finish();
		return;
	}

	element.textContent = '0';

	const run = (): void => {
		const start = performance.now();
		const frame = (now: number): void => {
			const t = Math.min(1, (now - start) / durationMs);
			element.textContent = format(target * easeOutExpo(t));
			if (t < 1) requestAnimationFrame(frame);
			else finish();
		};
		requestAnimationFrame(frame);
	};

	const observer = new IntersectionObserver(
		(entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			observer.disconnect();
			run();
		},
		{ threshold: 0.4 },
	);

	observer.observe(element);
}

/* ------------------------------------------------------------------ */
/* Scroll-driven stage                                                 */
/* ------------------------------------------------------------------ */

/**
 * A section with `[data-step]` blocks and one sticky `[data-stage]`. Whichever
 * step is crossing the middle band of the viewport is active: the stage
 * receives `data-active-step`, that step gets `.is-active`, and the section
 * carries `--stage-progress` (0–1) for a progress rail. Under reduced motion
 * the stage simply shows its final state.
 */
export function stageController(section: HTMLElement): void {
	const steps = Array.from(section.querySelectorAll<HTMLElement>('[data-step]'));
	const stage = section.querySelector<HTMLElement>('[data-stage]');
	if (steps.length === 0 || !stage) return;

	const activate = (index: number): void => {
		const step = steps[index];
		if (!step) return;
		stage.dataset.activeStep = step.dataset.step ?? String(index);
		steps.forEach((candidate, i) => candidate.classList.toggle('is-active', i === index));
		section.style.setProperty(
			'--stage-progress',
			String(steps.length > 1 ? index / (steps.length - 1) : 1),
		);
	};

	if (prefersReducedMotion() || !hasObserver()) {
		activate(steps.length - 1);
		return;
	}

	activate(0);

	const observer = new IntersectionObserver(
		(entries) => {
			const hit = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
				.at(-1);
			if (!hit) return;
			activate(steps.indexOf(hit.target as HTMLElement));
		},
		{ rootMargin: '-45% 0px -45% 0px', threshold: 0 },
	);

	steps.forEach((step) => observer.observe(step));
}

/* ------------------------------------------------------------------ */
/* Navigation spy                                                      */
/* ------------------------------------------------------------------ */

interface NavPair {
	readonly link: HTMLAnchorElement;
	readonly section: HTMLElement;
}

/**
 * Marks the header link whose section is currently under the reader with
 * `aria-current="true"`. Reaching a section with no link (the hero) clears it.
 */
export function navSpy(links: Iterable<HTMLAnchorElement>, clearOn?: HTMLElement | null): void {
	if (!hasObserver()) return;

	const pairs: NavPair[] = [];
	for (const link of links) {
		const id = link.getAttribute('href')?.replace(/^#/, '');
		const section = id ? document.getElementById(id) : null;
		if (section) pairs.push({ link, section });
	}
	if (pairs.length === 0) return;

	const mark = (active: Element | null): void => {
		for (const pair of pairs) {
			if (pair.section === active) pair.link.setAttribute('aria-current', 'true');
			else pair.link.removeAttribute('aria-current');
		}
	};

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				mark(entry.target === clearOn ? null : entry.target);
			}
		},
		{ rootMargin: '-35% 0px -55% 0px', threshold: 0 },
	);

	pairs.forEach((pair) => observer.observe(pair.section));
	if (clearOn) observer.observe(clearOn);
}
