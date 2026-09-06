import { Accent, LifecycleStage, OfferingKind, OUTCOME_DISCLAIMER, POLICY, SignUpIntent } from './constants';

/* ------------------------------------------------------------------ */
/* Links                                                               */
/* ------------------------------------------------------------------ */

const SIGNUP_BASE: string = import.meta.env.PUBLIC_APP_SIGNUP_URL || 'https://app.rightrefer.com/';

/** All CTAs redirect to the app's landing page directly — no intent query
 *  string. The `intent` param is kept for call-site clarity/future use but is
 *  intentionally unused here. */
export const signUpWith = (_intent: SignUpIntent): string => SIGNUP_BASE;

export const SIGNUP_URL: string = SIGNUP_BASE;
export const CONTACT_EMAIL: string =
	import.meta.env.PUBLIC_CONTACT_EMAIL || 'rightrefer.team@gmail.com';

/**
 * Policy pages, rendered in the footer only once they exist.
 *
 * The README lists hosted privacy and terms pages as a launch blocker. The
 * footer has the slots; a link appears the moment its URL is configured, and
 * until then nothing is shown — a dead link to a policy is worse than no link,
 * because it looks like the policy exists.
 */
export const PRIVACY_URL: string | undefined = import.meta.env.PUBLIC_PRIVACY_URL || undefined;
export const TERMS_URL: string | undefined = import.meta.env.PUBLIC_TERMS_URL || undefined;

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
		detail: `Re-checked every ${POLICY.employmentRecheckDays} days. Someone who has left stops receiving requests.`,
		accent: Accent.Primary,
	},
	{
		title: 'Every referral carries proof',
		detail: 'A timestamped screenshot from the company\u2019s own system, shown to you.',
		accent: Accent.Success,
	},
	{
		title: 'A window to disagree',
		detail: `${POLICY.confirmationWindowHours} hours to confirm or dispute. A person decides, never a timer.`,
		accent: Accent.Warning,
	},
	{
		title: 'Nothing is owed upfront',
		detail: 'Asking is free. A thank-you only ever follows a confirmed referral.',
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
 * Four signals, chosen to answer the questions a first-time visitor actually
 * has: is this person real, what does it cost me, and how long will it take.
 *
 * Note that `100% Free` is a commercial claim, which DESIGN_SYSTEM.md §7 rule 2
 * says the hero does not make. It is here deliberately and the rule has not
 * been re-litigated; if the pricing model ever changes, this line is the first
 * thing that has to change with it.
 */
export const TRUST_STRIP: readonly TrustStripItem[] = [
	{ value: 'LinkedIn', label: 'Verified employment' },
	{ value: 'Referrer Appreciation, Your Way', label: 'Add an optional thank-you amount.' },
	{ value: '100% Free', label: 'No payment required' },
	{ value: '2-Day Response', label: 'Get clarity, sooner. ' },
] as const;

/* ------------------------------------------------------------------ */
/* Peer openings                                                       */
/* ------------------------------------------------------------------ */

/**
 * One opening as a member would meet it.
 *
 * These describe the ROLE and nothing else. A peer opening never carries the
 * identity of whoever asked about it (DESIGN_SYSTEM.md §8 rule 4), and
 * nothing here claims we are hiring at these employers or that a referral is
 * assured — `path` says a route exists, which is exactly what the product
 * checks.
 */
export interface PeerSignal {
	readonly role: string;
	readonly company: string;
	readonly location: string;
	readonly posted: string;
	readonly path: string;
}

export const PEER_SIGNALS: readonly PeerSignal[] = [
	{
		role: 'Product Manager',
		company: 'Microsoft',
		location: 'Bengaluru',
		posted: '18 minutes ago',
		path: 'Referral path available',
	},
	{
		role: 'Senior Backend Engineer',
		company: 'Atlassian',
		location: 'Bengaluru',
		posted: '40 minutes ago',
		path: 'Referral path available',
	},
	{
		role: 'Design Systems Lead',
		company: 'Figma',
		location: 'Remote, India',
		posted: '1 hour ago',
		path: 'Referral path available',
	},
	{
		role: 'Staff Data Engineer',
		company: 'Stripe',
		location: 'Bengaluru',
		posted: '2 hours ago',
		path: 'Referral path available',
	},
	{
		role: 'Engineering Manager',
		company: 'Netflix',
		location: 'Mumbai',
		posted: '3 hours ago',
		path: 'Referral path available',
	},
] as const;

/* ------------------------------------------------------------------ */
/* Frequently asked questions                                          */
/* ------------------------------------------------------------------ */

export interface FaqItem {
	readonly question: string;
	/** One or two short paragraphs. Kept as plain strings so the same array can
	 *  feed both the rendered section and the page's structured data. */
	readonly answer: string;
}

/*
 * Nine questions, in the order a real visitor arrives at them: what this costs
 * and who sees my request, then what happens if it goes wrong, then the two
 * questions a prospective referrer asks, then peer openings.
 *
 * Two rules govern this copy.
 *
 * 1. COMMERCIAL RESTRAINT (DESIGN_SYSTEM.md §7). "Is it free" is the single
 *    most common question a first-time visitor has, and refusing to answer it
 *    reads as evasion — so it IS answered here, in plain words. What it must
 *    never carry is a number: no amount, no fee, no percentage, no payout
 *    schedule. Those belong inside the product, after someone has decided to
 *    take part.
 * 2. HONESTY (§8). Every window below interpolates POLICY rather than naming a
 *    literal, so this section cannot promise a deadline the product does not
 *    keep. "Employment verified through LinkedIn" is the accurate claim;
 *    "employer verified" is banned because it says something stronger than the
 *    product actually checks.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
	{
		question: 'Is it free to ask for a referral?',
		answer:
			'Yes. Asking costs nothing and nothing is owed upfront. If a referral lands you can send a small thank-you afterwards, which is always optional and never changes whether you get referred.',
	},
	{
		question: 'Who actually sees my request?',
		answer:
			'Only people whose employment at that company is verified through LinkedIn. Your request is never published publicly and never sent to recruiters.',
	},
	{
		question: 'What happens if nobody picks up my request?',
		answer: `It closes after ${POLICY.claimWindowHours} hours and tells you plainly that nobody picked it up, rather than sitting open. You are free to send it again.`,
	},
	{
		question: 'How do I know the referral was actually submitted?',
		answer:
			'The referrer submits it inside their company\u2019s own system and attaches a timestamped screenshot. You see that proof.',
	},
	{
		question: 'What if the proof looks wrong?',
		answer: `You have ${POLICY.confirmationWindowHours} hours to raise a dispute. A person reads it and decides. If it is overturned, you are refunded.`,
	},
	{
		question: 'Does a referral guarantee an interview?',
		answer: `No. ${OUTCOME_DISCLAIMER} It puts you in front of a real person while the role is still open. The hiring decision stays entirely theirs.`,
	},
	{
		question: 'How do you know a referrer really works there?',
		answer: `They sign in with LinkedIn and their employment is re-checked every ${POLICY.employmentRecheckDays} days. This is employment verified through LinkedIn, not approval from their employer.`,
	},
	{
		question: 'If I am a referrer, do I have to refer everyone who asks?',
		answer:
			'No. You see the role and the person\u2019s background first, then decide. Nothing is auto-assigned and passing costs you nothing.',
	},
	{
		question: 'What are peer openings?',
		answer:
			'Senior roles are often filled before they are ever posted. Peer openings tell you a relevant role exists while that window is open. You are shown the role, never who asked.',
	},
] as const;
