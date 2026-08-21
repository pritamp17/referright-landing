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

/* ------------------------------------------------------------------ */
/* Offerings                                                           */
/* ------------------------------------------------------------------ */

export interface OfferingPoint {
	readonly label: string;
	readonly detail: string;
}

export interface Offering {
	readonly kind: OfferingKind;
	/** Two-digit chapter number rendered in mono. */
	readonly index: string;
	readonly eyebrow: string;
	readonly title: string;
	readonly summary: string;
	readonly points: readonly OfferingPoint[];
	readonly ctaLabel: string;
	readonly ctaHref: string;
	readonly accent: Accent;
	/** Background photograph, when one exists for this chapter. */
	readonly image?: string;
	readonly imageAlt?: string;
}

export const OFFERINGS: readonly Offering[] = [
	{
		kind: OfferingKind.AskForReferral,
		index: '01',
		eyebrow: 'If you are looking',
		title: 'Get referred from the inside.',
		summary:
			'Point us at the role. Verified employees of that exact company see your request, and one of them takes it on.',
		points: [
			{
				label: 'Real employees, checked',
				detail: `Every referrer signs in with LinkedIn and is re-verified every ${POLICY.employmentRecheckDays} days.`,
			},
			{
				label: 'Proof, not promises',
				detail: 'The referral is submitted with a timestamped screenshot you can see.',
			},
			{
				label: 'You always know where it stands',
				detail: 'Every stage has a deadline, and nothing is ever left sitting in silence.',
			},
		],
		ctaLabel: 'Ask for a referral',
		ctaHref: signUpWith(SignUpIntent.Seeker),
		accent: Accent.Primary,
		image: '/path-seeker.webp',
		imageAlt: '',
	},
	{
		kind: OfferingKind.GiveReferral,
		index: '02',
		eyebrow: 'If you can help',
		title: 'Help someone into your company.',
		summary:
			'See who is asking and why, read their background, then decide freely. Submit the referral, attach the screenshot, and you are done.',
		points: [
			{
				label: 'You choose, always',
				detail: 'Nothing is auto-assigned. You claim only the requests you genuinely want to help with.',
			},
			{
				label: `${POLICY.claimWindowHours}h to act`,
				detail: 'Claim a request and it is yours for two days. Change your mind and it returns to the pool.',
			},
			{
				label: 'Appreciated, when it lands',
				detail: 'Seekers can send a small thank-you afterwards. Many do, and it is always their choice.',
			},
		],
		ctaLabel: 'Start referring',
		ctaHref: signUpWith(SignUpIntent.Giver),
		accent: Accent.Success,
		image: '/path-giver.webp',
		imageAlt: '',
	},
	{
		kind: OfferingKind.PeerSignal,
		index: '03',
		eyebrow: 'If the role suits you',
		title: 'Hear about the opening before it reaches the market.',
		summary:
			'When someone asks for a referral into a senior role, we quietly tell the people who could fill it themselves — peers at other companies, same function, comparable seniority. The opening reaches you as an opportunity, not as a favour to do.',
		points: [
			{
				label: 'Matched on function and band',
				detail: 'Exact job-function match, and never more than one seniority band away from yours.',
			},
			{
				label: 'Opt in, and stay in control',
				detail: 'Off by default. You set how often you hear from us, or switch it off entirely.',
			},
			{
				label: 'Nobody is exposed',
				detail: 'You see the opening. You never see who asked for the referral.',
			},
		],
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
		title: 'You confirm — or dispute',
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
 * Four signals, chosen to answer the four questions a first-time visitor
 * actually has: is this person real, will anything actually happen, what if it
 * goes wrong, and who sees my search. Deliberately no commercial claim — the
 * hero is not the place to raise money.
 */
export const TRUST_STRIP: readonly TrustStripItem[] = [
	{ value: 'LinkedIn', label: 'Verified employment' },
	{ value: 'Screenshot', label: 'Proof on every referral' },
	{ value: `${POLICY.confirmationWindowHours}h`, label: 'To confirm or dispute' },
	{ value: 'Private', label: 'Your search stays yours' },
] as const;

/* ------------------------------------------------------------------ */
/* Peer-signal illustration                                            */
/* ------------------------------------------------------------------ */

export interface PeerNode {
	readonly role: string;
	readonly company: string;
	readonly matched: boolean;
	readonly reason: string;
}

/** The worked example rendered in the peer-signal diagram. */
export const PEER_EXAMPLE = {
	opening: {
		role: 'VP of Engineering',
		company: 'Microsoft',
	},
	nodes: [
		{
			role: 'Director of Engineering',
			company: 'Oracle',
			matched: true,
			reason: 'One band below · same function',
		},
		{
			role: 'VP of Engineering',
			company: 'Salesforce',
			matched: true,
			reason: 'Exact band · same function',
		},
		{
			role: 'VP of Engineering',
			company: 'Adobe',
			matched: true,
			reason: 'Exact band · same function',
		},
		{
			role: 'VP of Marketing',
			company: 'Oracle',
			matched: false,
			reason: 'Different function · not notified',
		},
	] as readonly PeerNode[],
} as const;
