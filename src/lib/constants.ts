/**
 * Shared, typed vocabulary for the landing page.
 *
 * Every string that appears in more than one place — section anchors, analytics
 * event names, theme values, offering identity — is declared here as an enum so
 * that a rename is a compile error rather than a silently dead selector.
 */

/** Explicit, user-selected theme. There is deliberately no `system` value: the
 *  product application persists an explicit choice, and the landing page matches
 *  that behaviour so the preference survives the hand-off into `/app`. */
export enum ThemeMode {
	Light = 'light',
	Dark = 'dark',
}

/** localStorage key. Shared with the product application so a visitor who picks
 *  dark on the landing page stays in dark after signing in. */
export const THEME_STORAGE_KEY = 'rightrefer-theme' as const;

/** The three core offerings. These drive the offering section, its anchors, and
 *  the intent parameter appended to sign-up links. */
export enum OfferingKind {
	/** A seeker asks for a referral and sends a coffee as thanks. */
	AskForReferral = 'ask',
	/** An employee refers a candidate into their own company and earns. */
	GiveReferral = 'give',
	/** A peer at another company is told the opening exists, as an opportunity
	 *  for themselves. Never exposes who asked. */
	PeerSignal = 'peer',
}

/** Sign-up intent, appended as `?intent=` so the app can pre-select a path. */
export enum SignUpIntent {
	Seeker = 'seeker',
	Giver = 'giver',
	Peer = 'peer',
}

/** Section anchors. Used by both the nav and the `id` attributes so the two can
 *  never drift. */
export enum SectionId {
	Top = 'top',
	Offerings = 'offerings',
	HowItWorks = 'how-it-works',
	PeerSignal = 'peer-signal',
	Trust = 'trust',
	Appreciation = 'appreciation',
	Stories = 'stories',
	Contact = 'contact',
}

/** Analytics event names emitted via `data-track`. */
export enum TrackEvent {
	HeroPrimary = 'hero-primary',
	HeroSecondary = 'hero-secondary',
	NavPrimary = 'nav-primary',
	OfferingAsk = 'offering-ask',
	OfferingGive = 'offering-give',
	OfferingPeer = 'offering-peer',
	AppreciationPrimary = 'appreciation-primary',
	ClosingPrimary = 'closing-primary',
	ContactEmail = 'contact-email',
}

/** Visual accent for a card or badge. Maps to a semantic token triad, never to a
 *  raw colour. */
export enum Accent {
	Primary = 'primary',
	Trust = 'trust',
	Reward = 'reward',
	Success = 'success',
	Danger = 'danger',
}

/** Lifecycle stages shown in the "how it works" rail. Mirrors the product's
 *  `ReferralRequestState` progression at a marketing level of detail. */
export enum LifecycleStage {
	Requested = 'requested',
	Claimed = 'claimed',
	Referred = 'referred',
	Confirmed = 'confirmed',
	Paid = 'paid',
}

/* ------------------------------------------------------------------ */
/* Product policy constants                                            */
/* ------------------------------------------------------------------ */

/**
 * Values that must stay in step with the product's policy layer. Sourced from
 * `rightrefer-unified-technical-prd.md`. If a policy changes in the product,
 * it changes here too — the landing page must never advertise a promise the
 * application does not keep.
 */
export const POLICY = {
	/** Hours a referrer has to act before the claim expires back to the pool. */
	claimWindowHours: 48,
	/** Hours a seeker has to confirm or dispute after proof is submitted. */
	confirmationWindowHours: 24,
	/** How often LinkedIn-backed employment is re-verified. */
	employmentRecheckDays: 10,
	/** Withdrawal windows, as day-of-month. */
	withdrawalDays: [15, 30] as const,
	/** Currency shown on the landing page. India-only at launch. */
	currency: 'INR',
} as const;

/**
 * The single honesty constraint that appears near every call to action.
 * The product bans guaranteed-outcome copy; the landing page must not
 * reintroduce it.
 */
export const OUTCOME_DISCLAIMER =
	'A referral is an introduction, never a guaranteed outcome.' as const;
