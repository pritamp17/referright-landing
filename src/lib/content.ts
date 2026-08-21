import { Accent, LifecycleStage, OfferingKind, POLICY, SignUpIntent } from './constants';

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */

const SIGNUP_BASE: string = import.meta.env.PUBLIC_APP_SIGNUP_URL || '/signup';

/** Append a sign-up intent without assuming whether the base URL already has a
 *  query string. */
export const signUpWith = (intent: SignUpIntent): string =>
	`${SIGNUP_BASE}${SIGNUP_BASE.includes('?') ? '&' : '?'}intent=${intent}`;

export const SIGNUP_URL: string = SIGNUP_BASE;
export const CONTACT_EMAIL: string = import.meta.env.PUBLIC_CONTACT_EMAIL || 'hello@rightrefer.com';

/** Verified private-beta outcome shown in the landing-page proof module. */
export const PRIVATE_BETA_REFERRAL_COUNT = 78;

/* ------------------------------------------------------------------ */
/* Offerings                                                           */
/* ------------------------------------------------------------------ */

/**
 * One offering, as a single diagram node rather than a chapter.
 *
 * The three offerings used to each get a full chapter: an eyebrow, a
 * sentence-length title, a summary paragraph, and three bullets that mostly
 * restated the title in longer words. That is now a triptych — one verified
 * network, three roles radiating from it — so each offering only needs a
 * short label, one line under ten words, and its existing call to action.
 */
export interface Offering {
	readonly kind: OfferingKind;
	readonly title: string;
	/** Always ten words or fewer — this is the node's entire explanation. */
	readonly line: string;
	readonly ctaLabel: string;
	readonly ctaHref: string;
	readonly accent: Accent;
}

export const OFFERINGS: readonly Offering[] = [
	{
		kind: OfferingKind.AskForReferral,
		title: 'Ask for a referral',
		line: 'A verified employee there sees your request.',
		ctaLabel: 'Ask for a referral',
		ctaHref: signUpWith(SignUpIntent.Seeker),
		accent: Accent.Primary,
	},
	{
		kind: OfferingKind.GiveReferral,
		title: 'Give a referral',
		line: 'See requests, claim one, submit it with proof.',
		ctaLabel: 'Start referring',
		ctaHref: signUpWith(SignUpIntent.Giver),
		accent: Accent.Success,
	},
	{
		kind: OfferingKind.PeerSignal,
		title: 'Hear about openings',
		line: 'Senior roles reach you before they are posted.',
		ctaLabel: 'Get peer openings',
		ctaHref: signUpWith(SignUpIntent.Peer),
		accent: Accent.Reward,
	},
] as const;

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

export interface LifecycleStep {
	readonly stage: LifecycleStage;
	readonly index: string;
	readonly title: string;
	readonly detail: string;
	/** Short mono timing label, or null where no clock applies. */
	readonly timing: string | null;
}

export const LIFECYCLE: readonly LifecycleStep[] = [
	{
		stage: LifecycleStage.Requested,
		index: '01',
		title: 'You ask',
		detail: 'Share the role and a little context about your background.',
		timing: null,
	},
	{
		stage: LifecycleStage.Claimed,
		index: '02',
		title: 'An employee claims it',
		detail: 'Verified employees of that company see the request. One takes it on.',
		timing: `${POLICY.claimWindowHours}h window`,
	},
	{
		stage: LifecycleStage.Referred,
		index: '03',
		title: 'The referral goes in',
		detail: 'They submit it internally and attach a timestamped screenshot as proof.',
		timing: 'with proof',
	},
	{
		stage: LifecycleStage.Confirmed,
		index: '04',
		title: 'You confirm, or dispute',
		detail: 'Check the proof. Confirm it, or raise a dispute and we review it.',
		timing: `${POLICY.confirmationWindowHours}h to review`,
	},
	{
		stage: LifecycleStage.Paid,
		index: '05',
		title: 'You say thank you',
		detail: 'Send a small token of appreciation if you would like to. Entirely optional.',
		timing: 'your call',
	},
] as const;

/* ------------------------------------------------------------------ */
/* Trust pillars                                                       */
/* ------------------------------------------------------------------ */

export interface TrustPillar {
	readonly title: string;
	readonly detail: string;
	readonly accent: Accent;
}

export const TRUST_PILLARS: readonly TrustPillar[] = [
	{
		title: 'LinkedIn-verified employment',
		detail: `Referrers sign in with LinkedIn only. Employment is re-checked every ${POLICY.employmentRecheckDays} days, so a referrer who has left the company stops receiving requests.`,
		accent: Accent.Primary,
	},
	{
		title: 'Every referral carries proof',
		detail:
			'A referral is not marked done on someone’s word. It is submitted with a timestamped screenshot from the internal system, and you see it.',
		accent: Accent.Success,
	},
	{
		title: 'A window to disagree',
		detail: `You have ${POLICY.confirmationWindowHours} hours after proof is submitted to confirm or dispute. Disputes are reviewed by a person, not closed automatically.`,
		accent: Accent.Trust,
	},
	{
		title: 'Nothing is owed upfront',
		detail:
			'Asking costs you nothing. If you choose to send a thank-you afterwards, it only ever reaches your referrer once the referral is confirmed.',
		accent: Accent.Reward,
	},
] as const;

/* ------------------------------------------------------------------ */
/* Hero trust strip                                                    */
/* ------------------------------------------------------------------ */

export interface TrustStripItem {
	readonly value: string;
	readonly label: string;
}

/*
 * Three signals, chosen to answer the questions a first-time visitor actually
 * has: is this person real, what if it goes wrong, and who sees my search.
 * Deliberately no commercial claim — the hero is not the place to raise money.
 */
export const TRUST_STRIP: readonly TrustStripItem[] = [
	{ value: 'LinkedIn', label: 'Verified employment' },
	{ value: `${POLICY.confirmationWindowHours}h`, label: 'To confirm or dispute' },
	{ value: 'Private', label: 'Your search stays yours' },
] as const;
