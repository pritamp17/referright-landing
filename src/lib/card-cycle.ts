/**
 * Rotates a pool of cards through a fixed number of visible slots.
 *
 * Each slot shows one card. Every `cycleMs` the next slot in turn fades out
 * (`.is-exiting`), takes the next card the reader has not seen, and fades back
 * in (`.is-entering`). The stylesheet owns every transition; this only flips
 * classes and content. Used by the hero proof cards and the peer-signal stack.
 */
export interface CardCycleOptions<Card> {
	/** Wrapper that receives `.is-ready` once the slots may show. */
	readonly stack: HTMLElement;
	/** Visible slots. Each carries `data-cycle-index` for the card it shows. */
	readonly slots: readonly HTMLElement[];
	readonly pool: readonly Card[];
	/** Writes one card's content into a slot. */
	readonly render: (slot: HTMLElement, card: Card) => void;
	/** How long a card stays before the next swap. */
	readonly cycleMs: number;
	/** Must match the slot's CSS transition duration. */
	readonly transitionMs: number;
	/** Air between `ready` resolving and the slots appearing. */
	readonly revealDelayMs?: number;
	/** Resolves when the surrounding scene is ready for the cards. */
	readonly ready?: Promise<void>;
}

export function startCardCycle<Card>(options: CardCycleOptions<Card>): void {
	const {
		stack,
		slots,
		pool,
		render,
		cycleMs,
		transitionMs,
		revealDelayMs = 0,
		ready = Promise.resolve(),
	} = options;

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* Nothing to rotate through: show what is there and stop. */
	if (slots.length === 0 || pool.length <= slots.length) {
		stack.classList.add('is-ready');
		return;
	}

	let nextSlot = 0;
	let cursor = slots.length % pool.length;
	let inView = true;

	/* Swaps only happen while the stack is on screen and the tab is visible;
	   nobody should come back to a card mid-fade. */
	if ('IntersectionObserver' in window) {
		inView = false;
		new IntersectionObserver(
			(entries) => {
				for (const entry of entries) inView = entry.isIntersecting;
			},
			{ threshold: 0.2 },
		).observe(stack);
	}

	const nextCardIndex = (): number => {
		const visible = new Set(slots.map((slot) => Number(slot.dataset.cycleIndex)));
		for (let offset = 0; offset < pool.length; offset += 1) {
			const index = (cursor + offset) % pool.length;
			if (visible.has(index)) continue;
			cursor = (index + 1) % pool.length;
			return index;
		}
		return -1;
	};

	const swap = (): void => {
		if (!inView || document.hidden) return;

		const slot = slots[nextSlot];
		const index = nextCardIndex();
		const card = pool[index];
		if (!slot || card === undefined) return;

		nextSlot = (nextSlot + 1) % slots.length;
		slot.classList.remove('is-entering');
		slot.classList.add('is-exiting');

		window.setTimeout(() => {
			slot.classList.remove('is-exiting');
			slot.dataset.cycleIndex = String(index);
			render(slot, card);
			slot.classList.add('is-entering');
			window.requestAnimationFrame(() => {
				window.requestAnimationFrame(() => slot.classList.remove('is-entering'));
			});
		}, transitionMs);
	};

	void ready.then(() => {
		window.setTimeout(() => {
			stack.classList.add('is-ready');
			if (!reducedMotion) window.setInterval(swap, cycleMs);
		}, revealDelayMs);
	});
}
