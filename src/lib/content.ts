import { Accent, OfferingKind, OUTCOME_DISCLAIMER, POLICY, SignUpIntent } from './constants';

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
/* The three paths                                                     */
/* ------------------------------------------------------------------ */

export interface PathStep {
	readonly index: string;
	readonly title: string;
	/** One sentence. If it needs two, the title is not doing its job. */
	readonly detail: string;
}

export interface ProductPath {
	readonly kind: OfferingKind;
	/** Short label for the switch. Two or three words. */
	readonly tab: string;
	readonly title: string;
	readonly steps: readonly PathStep[];
	readonly ctaLabel: string;
	readonly ctaHref: string;
	readonly accent: Accent;
}

/*
 * The product has three core things a member can do, and they are parallel,
 * not sequential: ask for a referral, give one, or hear about roles early.
 *
 * An earlier version told a single linear story from the seeker's side, which
 * read well and was wrong about the product twice over. It buried giving and
 * peer openings into two links at the bottom, and it put the thank-you at the
 * very end, after the referral had landed. The thank-you is chosen on the
 * request form, before anything is sent (PRD §5.2 step 7, §0.11), and getting
 * that backwards misrepresents the one part of the flow involving money.
 *
 * Three parallel paths want a switch, not a scroll.
 */
export const PRODUCT_PATHS: readonly ProductPath[] = [
	{
		kind: OfferingKind.AskForReferral,
		tab: 'Ask for a referral',
		title: 'Ask someone on the inside.',
		accent: Accent.Primary,
		ctaLabel: 'Ask for a referral',
		ctaHref: signUpWith(SignUpIntent.Seeker),
		steps: [
			{
				index: '01',
				title: 'Name the role',
				detail: 'The company and the job you want, with your resume attached.',
			},
			{
				index: '02',
				title: 'Choose who sees it',
				detail: 'Employees there whose jobs are verified through LinkedIn, and nobody else.',
			},
			{
				index: '03',
				title: 'Add a thank-you, or do not',
				detail: 'You set an optional amount here, before you send. Zero is always allowed.',
			},
			{
				index: '04',
				title: 'Get proof, or get refunded',
				detail: `A timestamped screenshot, and ${POLICY.confirmationWindowHours} hours to dispute it.`,
			},
		],
	},
	{
		kind: OfferingKind.GiveReferral,
		tab: 'Give a referral',
		title: 'Refer someone you can vouch for.',
		accent: Accent.Success,
		ctaLabel: 'Start referring',
		ctaHref: signUpWith(SignUpIntent.Giver),
		steps: [
			{
				index: '01',
				title: 'See who is asking',
				detail: 'Requests from people at companies where your job is verified.',
			},
			{
				index: '02',
				title: 'Claim one',
				detail: 'It becomes yours alone, and nobody else can act on it.',
			},
			{
				index: '03',
				title: 'Submit it with proof',
				detail: 'Refer them inside your own system and attach the screenshot.',
			},
			{
				index: '04',
				title: 'Get thanked',
				detail: 'Whatever they chose to add is yours once the referral is confirmed.',
			},
		],
	},
	{
		kind: OfferingKind.PeerSignal,
		tab: 'Hear about openings',
		title: 'Hear about roles first.',
		accent: Accent.Progress,
		ctaLabel: 'Get peer openings',
		ctaHref: signUpWith(SignUpIntent.Peer),
		steps: [
			{
				index: '01',
				title: 'Follow the companies you want',
				detail: 'Tell us where you would like to work, and how often to write.',
			},
			{
				index: '02',
				title: 'Roles reach you early',
				detail: 'Senior roles often get filled before they are ever posted.',
			},
			{
				index: '03',
				title: 'Ask in one step',
				detail: 'The request opens already filled in. You review it and send.',
			},
		],
	},
] as const;

/* ------------------------------------------------------------------ */
/* Proof line                                                          */
/* ------------------------------------------------------------------ */

/*
 * What used to be four trust cards.
 *
 * Each fact is now stated inside the beat it belongs to, so this line is a
 * recap rather than an argument: four short facts on one row, closing the
 * story rather than opening a new section about it.
 */
export const PRODUCT_PROOF: readonly string[] = [
	'LinkedIn-verified employment',
	'Timestamped proof, shown to you',
	`${POLICY.confirmationWindowHours}h to dispute, decided by a person`,
	'Free to ask',
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
