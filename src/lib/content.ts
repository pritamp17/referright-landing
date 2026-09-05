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
		accent: Accent.Warning,
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
			'Yes. Asking costs you nothing, and nothing is owed upfront. If a referral lands and you feel it was worth it, you can send a small token of appreciation afterwards — but it is entirely optional, it is never required in order to ask, and it never changes whether you get referred.',
	},
	{
		question: 'Who actually sees my request?',
		answer:
			'Only people whose employment at that company has been verified through LinkedIn. Your request is not published to a public board and it is not broadcast to recruiters. Your search stays yours.',
	},
	{
		question: 'What happens if nobody picks up my request?',
		answer: `Every request carries one clock: ${POLICY.claimWindowHours} hours from the moment it goes live. If no verified employee claims it in that window, the request closes and tells you plainly that nobody picked it up — rather than sitting open indefinitely. You are free to send it again.`,
	},
	{
		question: 'How do I know the referral was actually submitted?',
		answer:
			'Because you see the proof. A referral is not marked done on someone’s word — the referrer submits it inside their company’s own system and attaches a timestamped screenshot of having done so. That evidence is shown to you.',
	},
	{
		question: 'What if the proof looks wrong?',
		answer: `You have ${POLICY.confirmationWindowHours} hours after the proof is submitted to confirm it or raise a dispute. Disputes are read and decided by a person, never closed automatically: the referral either stands, or it is overturned and you are refunded. Where the evidence genuinely is not conclusive either way, it is closed without a penalty to either side.`,
	},
	{
		question: 'Does a referral guarantee an interview?',
		answer: `No, and anyone promising otherwise is not being straight with you. ${OUTCOME_DISCLAIMER} It puts your application in front of a real person inside the company at a moment when the role is still open, which is the part that is genuinely hard to arrange on your own. The hiring decision remains entirely theirs.`,
	},
	{
		question: 'How do you know a referrer really works there?',
		answer: `Referrers sign in with LinkedIn, and their employment is re-checked every ${POLICY.employmentRecheckDays} days. Someone who has left the company stops receiving requests. This is employment verified through LinkedIn — we do not claim their employer has endorsed or approved anything.`,
	},
	{
		question: 'If I am a referrer, do I have to refer everyone who asks?',
		answer:
			'Not at all. You see the role and the person’s background first, and you decide whether you can genuinely vouch for them. Nothing is auto-assigned to you, and passing on a request costs you nothing. A referral is worth something precisely because it was a choice.',
	},
	{
		question: 'What are peer openings?',
		answer:
			'Senior roles are often filled quietly and only get posted publicly once the internal search has failed. Peer openings tell you a relevant role exists while that window is still open. You are shown the opening itself — never the identity of whoever asked about it. You control how often they arrive, and you can turn them off at any time.',
	},
] as const;
