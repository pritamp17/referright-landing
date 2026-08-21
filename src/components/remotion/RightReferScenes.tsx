import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
 * Scene palette.
 *
 * Every value references a design token rather than a literal colour. The
 * Remotion player renders as real DOM inside the page (not a canvas), so these
 * custom properties inherit from `:root` and re-resolve automatically when the
 * theme is switched — the films retheme themselves with no re-render and no
 * theme prop threaded through the scene tree.
 *
 * The token names are the same ones the product application uses.
 */
const token = (name: string): string => `rgb(var(${name}))`;

const colors = {
	/* Accent — was burnt orange, now the locked LinkedIn blue. */
	orange: token('--color-primary'),
	orangeSoft: token('--color-primary-soft'),
	/* Deep brand panels. */
	blue950: token('--color-brand-panel'),
	blue900: token('--color-brand-panel'),
	blue700: token('--color-primary'),
	/* Neutral scale. */
	blue200: token('--color-border'),
	blue100: token('--color-elevated'),
	blue50: token('--color-canvas'),
	cream: token('--color-canvas'),
	surface: token('--color-surface'),
	ink: token('--color-ink'),
	muted: token('--color-muted'),
	border: token('--color-border'),
	success: token('--color-success'),
	successSoft: token('--color-success-soft'),
	/* Chrome inside the mocked product screens. */
	subtle: token('--color-elevated'),
	/* Foreground for text sitting on a filled accent. Constant across themes,
	   because the accent it sits on is constant across themes. */
	onAccent: token('--color-primary-ink'),
};

const font = "'Inter', ui-sans-serif, system-ui, sans-serif";
const display = "'Inter', ui-sans-serif, system-ui, sans-serif";
const clamp = {
	extrapolateLeft: 'clamp' as const,
	extrapolateRight: 'clamp' as const,
};

const reveal = (frame: number, start: number, distance = 14): CSSProperties => ({
	opacity: interpolate(frame, [start, start + 13], [0, 1], clamp),
	transform: `translateY(${interpolate(frame, [start, start + 18], [distance, 0], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	})}px)`,
});

const pop = (frame: number, start: number): CSSProperties => ({
	opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
	transform: `scale(${interpolate(frame, [start, start + 16], [0.92, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	})})`,
});

const Card = ({
	children,
	style,
}: {
	children: ReactNode;
	style?: CSSProperties;
}) => (
	<div
		style={{
			border: `1px solid ${colors.border}`,
			borderRadius: 22,
			background: colors.surface,
			boxShadow: '0 20px 55px rgba(18,56,79,.1)',
			...style,
		}}
	>
		{children}
	</div>
);

const Pill = ({
	children,
	tone = 'blue',
	style,
}: {
	children: ReactNode;
	tone?: 'blue' | 'orange' | 'green' | 'neutral';
	style?: CSSProperties;
}) => {
	const tones = {
		blue: { background: colors.blue100, color: colors.blue700, border: colors.blue200 },
		orange: { background: colors.orangeSoft, color: colors.orange, border: colors.orange },
		green: { background: colors.successSoft, color: colors.success, border: colors.success },
		neutral: { background: colors.subtle, color: colors.muted, border: colors.border },
	};
	const selected = tones[tone];

	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 7,
				padding: '8px 12px',
				border: `1px solid ${selected.border}`,
				borderRadius: 999,
				background: selected.background,
				color: selected.color,
				fontSize: 14,
				fontWeight: 800,
				lineHeight: 1,
				...style,
			}}
		>
			{children}
		</span>
	);
};

const GmailLogo = ({ size = 30 }: { size?: number }) => (
	<img src="/gmail-icon.svg" alt="" style={{ width: size, height: size * 0.75, objectFit: 'contain' }} />
);

const MicrosoftLogo = ({ size = 34 }: { size?: number }) => (
	<img src="/microsoft-logo.svg" alt="" style={{ width: size, height: size, objectFit: 'contain' }} />
);

const Avatar = ({
	initials,
	color,
	size = 36,
}: {
	initials: string;
	color: string;
	size?: number;
}) => (
	<span
		style={{
			display: 'grid',
			width: size,
			height: size,
			flex: '0 0 auto',
			placeItems: 'center',
			borderRadius: '50%',
			background: color,
			color: colors.onAccent,
			fontSize: size * 0.28,
			fontWeight: 800,
		}}
	>
		{initials}
	</span>
);

const MailTopbar = ({ compact = false }: { compact?: boolean }) => (
	<div
		style={{
			display: 'grid',
			height: compact ? 62 : 66,
			gridTemplateColumns: compact ? '38px 120px 1fr 36px' : '48px 180px 1fr 42px',
			alignItems: 'center',
			gap: compact ? 11 : 17,
			padding: compact ? '0 15px' : '0 21px',
			borderBottom: `1px solid ${colors.border}`,
			background: colors.subtle,
		}}
	>
		<div style={{ display: 'grid', gap: 4 }}>
			<span style={{ width: 20, height: 2, background: colors.muted }} />
			<span style={{ width: 20, height: 2, background: colors.muted }} />
			<span style={{ width: 20, height: 2, background: colors.muted }} />
		</div>
		<div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: compact ? 17 : 20 }}>
			<GmailLogo size={compact ? 27 : 31} />
			<strong>Gmail</strong>
		</div>
		<div
			style={{
				height: compact ? 36 : 42,
				display: 'flex',
				alignItems: 'center',
				padding: compact ? '0 13px' : '0 17px',
				borderRadius: 999,
				background: colors.subtle,
				color: colors.muted,
				fontSize: compact ? 13 : 15,
				fontWeight: 600,
			}}
		>
			Search mail
		</div>
		<Avatar initials="JM" color={colors.blue900} size={compact ? 32 : 38} />
	</div>
);

export const GmailReferralSequence = () => {
	const frame = useCurrentFrame();
	const opened = frame >= 73;
	const activeWidth = interpolate(frame, [45, 72], [0, 100], clamp);

	return (
		<AbsoluteFill style={{ padding: 28, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: colors.surface }}>
				<MailTopbar />
				<div style={{ display: 'grid', height: 'calc(100% - 66px)', gridTemplateColumns: '62px 330px 1fr' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 22,
							paddingTop: 21,
							borderRight: `1px solid ${colors.border}`,
							background: colors.subtle,
						}}
					>
						<div
							style={{
								display: 'grid',
								width: 38,
								height: 38,
								placeItems: 'center',
								borderRadius: 12,
								background: colors.orangeSoft,
								color: colors.orange,
								fontSize: 22,
							}}
						>
							+
						</div>
						{[0, 1, 2, 3].map((item) => (
							<span
								key={item}
								style={{
									width: 19,
									height: 14,
									border: `2px solid ${item === 0 ? colors.blue700 : colors.muted}`,
									borderRadius: 4,
									background: item === 0 ? colors.blue100 : 'transparent',
								}}
							/>
						))}
					</div>

					<div style={{ borderRight: `1px solid ${colors.border}`, background: colors.surface }}>
						<div
							style={{
								display: 'flex',
								height: 62,
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '0 17px',
								borderBottom: `1px solid ${colors.border}`,
							}}
						>
							<strong style={{ fontSize: 17 }}>Primary</strong>
							<span style={{ color: colors.muted, fontSize: 12 }}>1 fresh match</span>
						</div>

						<div
							style={{
								position: 'relative',
								minHeight: 112,
								padding: '18px 16px',
								borderBottom: `1px solid ${colors.border}`,
								background: opened ? colors.orangeSoft : colors.surface,
								boxShadow: opened ? `inset 4px 0 ${colors.orange}` : undefined,
								...reveal(frame, 18, 12),
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
									<MicrosoftLogo size={23} />
									<strong style={{ fontSize: 15 }}>Microsoft</strong>
								</div>
								<span style={{ color: colors.muted, fontSize: 11 }}>Now</span>
							</div>
							<p style={{ margin: '9px 0 0', fontSize: 14, fontWeight: 800 }}>Product Manager</p>
							<p style={{ margin: '3px 0 0', color: colors.muted, fontSize: 12 }}>Job ID R6565XX98</p>
							<div
								style={{
									position: 'absolute',
									right: 14,
									bottom: 14,
									width: 64,
									height: 4,
									overflow: 'hidden',
									borderRadius: 999,
									background: colors.blue100,
								}}
							>
								<span
									style={{
										display: 'block',
										width: `${activeWidth}%`,
										height: '100%',
										borderRadius: 999,
										background: colors.orange,
									}}
								/>
							</div>
						</div>

						{['Your company watchlist', 'Weekly role summary', 'Application status update'].map((label) => (
							<div key={label} style={{ padding: '17px 16px', borderBottom: `1px solid ${colors.border}`, opacity: 0.78 }}>
								<strong style={{ fontSize: 14 }}>RightRefer</strong>
								<p style={{ margin: '5px 0 0', color: colors.muted, fontSize: 13 }}>{label}</p>
							</div>
						))}
					</div>

					<div
						style={{
							position: 'relative',
							overflow: 'hidden',
							padding: '25px 30px',
							background: `linear-gradient(135deg, ${colors.subtle}, ${colors.surface} 48%)`,
						}}
					>
						<div style={{ display: 'flex', gap: 18, color: colors.muted, fontSize: 18 }}>
							<span>&larr;</span><span>~</span><span>...</span>
						</div>

						<div style={{ marginTop: 23, ...reveal(frame, 73, 14) }}>
							<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
								<div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
									<MicrosoftLogo size={42} />
									<div>
										<p
											style={{
												margin: '0 0 6px',
												color: colors.orange,
												fontSize: 11,
												fontWeight: 800,
												letterSpacing: '.09em',
												textTransform: 'uppercase',
											}}
										>
											Seen at the right time
										</p>
										<h3 style={{ margin: 0, fontFamily: display, fontSize: 34, fontWeight: 500, lineHeight: 1.03 }}>
											Product Manager at Microsoft
										</h3>
										<span style={{ color: colors.muted, fontSize: 12 }}>Job ID R6565XX98</span>
									</div>
								</div>
								<Pill tone="orange">Posted 18 min ago</Pill>
							</div>

							<div style={{ marginTop: 22 }}>
								<strong style={{ display: 'block', fontSize: 15 }}>RightRefer</strong>
								<span style={{ color: colors.muted, fontSize: 11 }}>to you · now</span>
							</div>

							<p style={{ maxWidth: 590, margin: '20px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.62 }}>
								Microsoft posted a role aligned with your background. You are seeing it while the
								application window is still fresh.
							</p>

							<div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18, ...reveal(frame, 111, 10) }}>
								<Pill tone="blue">3 years industry experience</Pill>
								<Pill tone="green">Early application window</Pill>
							</div>

							<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 19, ...pop(frame, 146) }}>
								<div
									style={{
										display: 'inline-flex',
										height: 47,
										alignItems: 'center',
										padding: '0 21px',
										borderRadius: 999,
										background: colors.orange,
										color: colors.onAccent,
										fontSize: 14,
										fontWeight: 800,
										boxShadow: '0 14px 30px rgba(196,58,0,.22)',
									}}
								>
									View referrers
								</div>
								<Pill tone="green">Referral path available</Pill>
							</div>

							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginTop: 20,
									padding: '13px 15px',
									border: `1px solid ${colors.blue200}`,
									borderRadius: 15,
									background: colors.blue50,
									...reveal(frame, 179, 8),
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
									<div style={{ display: 'flex' }}>
										{[
											['AK', colors.blue900],
											['NV', colors.orange],
											['RS', colors.blue700],
										].map(([initials, color], index) => (
											<span key={initials} style={{ marginLeft: index === 0 ? 0 : -7 }}>
												<Avatar initials={initials} color={color} size={30} />
											</span>
										))}
									</div>
									<strong style={{ fontSize: 13 }}>3 Microsoft referrers available</strong>
								</div>
								<span style={{ color: colors.muted, fontSize: 11 }}>Choose who fits your request</span>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</AbsoluteFill>
	);
};

export const CompactGmailReferralSequence = () => {
	const frame = useCurrentFrame();
	const opened = frame >= 55;
	const cardOpacity = interpolate(frame, [44, 55], [1, 0], clamp);

	return (
		<AbsoluteFill style={{ padding: 22, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: colors.surface }}>
				<MailTopbar compact />
				<div style={{ position: 'absolute', inset: '62px 0 0', padding: 28, background: colors.blue50 }}>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							width: 'calc(100% - 56px)',
							padding: 24,
							border: `1px solid ${colors.blue200}`,
							borderRadius: 20,
							background: colors.surface,
							boxShadow: '0 20px 55px rgba(18,56,79,.11)',
							opacity: cardOpacity,
							transform: 'translate(-50%, -50%)',
							...reveal(frame, 24, 10),
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
							<MicrosoftLogo size={45} />
							<div>
								<Pill tone="orange">Fresh match</Pill>
								<h3 style={{ margin: '13px 0 4px', fontFamily: display, fontSize: 35, fontWeight: 500 }}>
									Product Manager
								</h3>
								<p style={{ margin: 0, color: colors.muted, fontSize: 15 }}>Microsoft · R6565XX98</p>
							</div>
						</div>
					</div>

					<div style={{ ...reveal(frame, 55, 12), opacity: opened ? 1 : 0 }}>
						<div style={{ display: 'flex', gap: 17, color: colors.muted, fontSize: 17 }}>
							<span>&larr;</span><span>~</span><span>...</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 19 }}>
							<MicrosoftLogo size={41} />
							<div>
								<Pill tone="orange">Posted 18 min ago</Pill>
								<h3 style={{ margin: '13px 0 5px', fontFamily: display, fontSize: 38, fontWeight: 500, lineHeight: 1.02 }}>
									Product Manager at Microsoft
								</h3>
								<span style={{ color: colors.muted, fontSize: 13 }}>Job ID R6565XX98</span>
							</div>
						</div>
						<p style={{ margin: '20px 0 0', color: colors.muted, fontSize: 17, lineHeight: 1.55 }}>
							A strong-fit role arrived while the application window is still fresh.
						</p>
						<div style={{ display: 'grid', gap: 9, marginTop: 18, ...reveal(frame, 89, 8) }}>
							<Pill tone="blue">3 years industry experience</Pill>
							<Pill tone="green">Early application window</Pill>
						</div>
						<div
							style={{
								display: 'flex',
								height: 49,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 18,
								borderRadius: 999,
								background: colors.orange,
								color: colors.onAccent,
								fontSize: 15,
								fontWeight: 800,
								...pop(frame, 126),
							}}
						>
							View referrers
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginTop: 16,
								padding: '14px 15px',
								border: `1px solid ${colors.blue200}`,
								borderRadius: 15,
								background: colors.surface,
								...reveal(frame, 161, 8),
							}}
						>
							<strong style={{ fontSize: 14 }}>Referral path available</strong>
							<span style={{ color: colors.muted, fontSize: 12 }}>3 Microsoft referrers</span>
						</div>
					</div>
				</div>
			</Card>
		</AbsoluteFill>
	);
};

const ReferrerRow = ({
	name,
	role,
	initials,
	color,
	selected,
	style,
}: {
	name: string;
	role: string;
	initials: string;
	color: string;
	selected: boolean;
	style?: CSSProperties;
}) => (
	<div
		style={{
			display: 'grid',
			gridTemplateColumns: '36px 1fr 24px',
			alignItems: 'center',
			gap: 10,
			padding: '10px 11px',
			border: `1px solid ${selected ? colors.orange : colors.border}`,
			borderRadius: 13,
			background: selected ? colors.orangeSoft : colors.surface,
			...style,
		}}
	>
		<Avatar initials={initials} color={color} size={36} />
		<div style={{ minWidth: 0 }}>
			<strong style={{ display: 'block', fontSize: 13 }}>{name}</strong>
			<span style={{ display: 'block', overflow: 'hidden', color: colors.muted, fontSize: 10, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
				{role}
			</span>
		</div>
		<span
			style={{
				display: 'grid',
				width: 22,
				height: 22,
				placeItems: 'center',
				border: `1px solid ${selected ? colors.orange : colors.blue200}`,
				borderRadius: 7,
				background: selected ? colors.orange : colors.surface,
				color: colors.onAccent,
				fontSize: 12,
				fontWeight: 800,
			}}
		>
			{selected ? '\u2713' : ''}
		</span>
	</div>
);

const JourneyRail = ({ frame, compact = false }: { frame: number; compact?: boolean }) => {
	const stages = [
		{ label: 'Follow Microsoft', start: 21 },
		{ label: 'Pick referrers', start: 93 },
		{ label: 'Track referral', start: 171 },
	];

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)',
				gap: compact ? 8 : 20,
			}}
		>
			{stages.map((stage, index) => {
				const active = frame >= stage.start;
				return (
					<div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<span
							style={{
								display: 'grid',
								width: compact ? 28 : 32,
								height: compact ? 28 : 32,
								flex: '0 0 auto',
								placeItems: 'center',
								borderRadius: '50%',
								background: active ? colors.orange : colors.blue100,
								color: active ? colors.surface : colors.blue700,
								fontSize: 12,
								fontWeight: 800,
							}}
						>
							{index + 1}
						</span>
						<strong style={{ color: active ? colors.ink : colors.muted, fontSize: compact ? 13 : 14 }}>
							{stage.label}
						</strong>
						{!compact && index < stages.length - 1 && (
							<span style={{ height: 2, flex: 1, borderRadius: 999, background: frame >= stages[index + 1].start ? colors.orange : colors.blue100 }} />
						)}
					</div>
				);
			})}
		</div>
	);
};

const ConnectedJourney = ({ compact = false }: { compact?: boolean }) => {
	const frame = useCurrentFrame();
	const subscribed = frame >= 42;
	const firstSelected = frame >= 129;
	const secondSelected = frame >= 140;
	const coffeeSelected = frame >= 160;
	const progressIndex = frame < 178 ? -1 : Math.min(3, Math.floor((frame - 178) / 6));
	const panelStyle: CSSProperties = {
		position: 'relative',
		overflow: 'hidden',
		padding: compact ? 18 : 20,
		border: `1px solid ${colors.border}`,
		borderRadius: 19,
		background: colors.surface,
	};

	return (
		<AbsoluteFill style={{ padding: compact ? 22 : 28, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ width: '100%', height: '100%', padding: compact ? 22 : 27, overflow: 'hidden' }}>
				<JourneyRail frame={frame} compact={compact} />
				<div
					style={{
						display: 'grid',
						height: compact ? 'calc(100% - 125px)' : 'calc(100% - 58px)',
						gridTemplateColumns: compact ? '1fr' : '0.82fr 1.22fr 0.96fr',
						gap: compact ? 12 : 15,
						marginTop: compact ? 18 : 24,
					}}
				>
					<div style={{ ...panelStyle, ...reveal(frame, 21, 12) }}>
						<Pill tone="blue">Step 1</Pill>
						<div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 17 }}>
							<MicrosoftLogo size={compact ? 39 : 45} />
							<div>
								<strong style={{ display: 'block', fontFamily: display, fontSize: compact ? 23 : 27, fontWeight: 500 }}>
									Microsoft
								</strong>
								<span style={{ color: colors.muted, fontSize: 11 }}>Company subscription</span>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginTop: compact ? 13 : 22,
								padding: '12px 13px',
								borderRadius: 14,
								background: subscribed ? colors.successSoft : colors.blue50,
							}}
						>
							<strong style={{ color: subscribed ? colors.success : colors.blue700, fontSize: 12 }}>
								{subscribed ? 'Subscribed' : 'Subscribe'}
							</strong>
							<span
								style={{
									position: 'relative',
									width: 39,
									height: 22,
									borderRadius: 999,
									background: subscribed ? colors.success : colors.blue200,
								}}
							>
								<i
									style={{
										position: 'absolute',
										top: 3,
										left: subscribed ? 20 : 3,
										width: 16,
										height: 16,
										borderRadius: '50%',
										background: colors.surface,
										transition: 'none',
									}}
								/>
							</span>
						</div>
						{!compact && (
							<div style={{ marginTop: 22, color: colors.muted, fontSize: 11, lineHeight: 1.6 }}>
								Relevant Microsoft openings now come to you.
							</div>
						)}
					</div>

					<div style={{ ...panelStyle, ...reveal(frame, 93, 12) }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Pill tone="orange">Step 2</Pill>
							<span style={{ color: colors.muted, fontSize: 10 }}>Select multiple</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 13 }}>
							<MicrosoftLogo size={28} />
							<div>
								<strong style={{ display: 'block', fontSize: 13 }}>Product Manager</strong>
								<span style={{ color: colors.muted, fontSize: 10 }}>R6565XX98</span>
							</div>
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr 1fr', gap: 8, marginTop: 12 }}>
							<ReferrerRow name="Aditi K." role="Product · Microsoft" initials="AK" color={colors.blue900} selected={firstSelected} />
							<ReferrerRow name="Nikhil V." role="Platform · Microsoft" initials="NV" color={colors.orange} selected={secondSelected} />
							{!compact && (
								<>
									<ReferrerRow name="Rhea S." role="Growth · Microsoft" initials="RS" color={colors.blue700} selected={false} />
									<ReferrerRow name="Karan M." role="Cloud · Microsoft" initials="KM" color={colors.success} selected={false} />
								</>
							)}
						</div>
						<div style={{ display: 'flex', gap: 8, marginTop: 12, ...reveal(frame, 153, 8) }}>
							<Pill tone={coffeeSelected ? 'neutral' : 'green'}>Referral request</Pill>
							<Pill tone={coffeeSelected ? 'orange' : 'neutral'}>Coffee {'\u20B9'}100 · optional</Pill>
						</div>
					</div>

					<div style={{ ...panelStyle, ...reveal(frame, 171, 12) }}>
						<Pill tone="green">Step 3</Pill>
						<h3 style={{ margin: '15px 0 0', fontFamily: display, fontSize: compact ? 23 : 27, fontWeight: 500 }}>
							Request in progress
						</h3>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginTop: 14,
								padding: '12px 13px',
								borderRadius: 14,
								background: colors.orangeSoft,
							}}
						>
							<strong style={{ fontSize: 12 }}>2 referrers</strong>
							<span style={{ color: colors.orange, fontSize: 12, fontWeight: 800 }}>{'\u20B9'}100 optional</span>
						</div>
						<div style={{ display: 'grid', gap: compact ? 7 : 10, marginTop: 15 }}>
							{['Sent', 'Viewed', 'Accepted', 'Referred'].map((label, index) => {
								const complete = progressIndex >= index;
								return (
									<div key={label} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', alignItems: 'center', gap: 9 }}>
										<span
											style={{
												display: 'grid',
												width: 21,
												height: 21,
												placeItems: 'center',
												borderRadius: '50%',
												background: complete ? colors.success : colors.blue100,
												color: colors.onAccent,
												fontSize: 11,
											}}
										>
											{complete ? '\u2713' : ''}
										</span>
										<span style={{ color: complete ? colors.ink : colors.muted, fontSize: 12, fontWeight: complete ? 800 : 600 }}>
											{label}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</Card>
		</AbsoluteFill>
	);
};

export const ConnectedJourneyScene = () => <ConnectedJourney />;
export const CompactConnectedJourneyScene = () => <ConnectedJourney compact />;

export const AppreciationScene = () => {
	const frame = useCurrentFrame();
	const { width } = useVideoConfig();
	const compact = width <= 760;
	const selected = frame >= 47;
	const paid = frame >= 99;
	const submitting = frame >= 155 && frame < 183;
	const success = frame >= 183;
	const selectionSpring = spring({
		frame: Math.max(0, frame - 47),
		fps: 30,
		config: { damping: 14, stiffness: 145 },
	});

	return (
		<AbsoluteFill style={{ padding: compact ? 22 : 28, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ position: 'relative', width: '100%', height: '100%', padding: compact ? 25 : 33, overflow: 'hidden' }}>
				<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
					<div>
						<p
							style={{
								margin: 0,
								color: colors.orange,
								fontSize: compact ? 11 : 13,
								fontWeight: 800,
								letterSpacing: '.1em',
								textTransform: 'uppercase',
							}}
						>
							Referral request
						</p>
						<h3 style={{ margin: '8px 0 0', fontFamily: display, fontSize: compact ? 29 : 34, fontWeight: 500 }}>
							Optional appreciation
						</h3>
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 7 }}>
						<Pill tone="blue">Optional</Pill>
						<Pill tone="neutral">No guarantee</Pill>
					</div>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)',
						gap: compact ? 9 : 12,
						marginTop: compact ? 20 : 27,
						...reveal(frame, 19, 10),
					}}
				>
					{[
						{ icon: '\u2615', label: 'Coffee', amount: '\u20B9100' },
						{ icon: '\u{1F355}', label: 'Pizza', amount: '\u20B9500' },
						{ icon: '+', label: 'Custom', amount: 'Choose amount' },
					].map((option, index) => {
						const active = index === 0 && selected;
						return (
							<div
								key={option.label}
								style={{
									display: 'grid',
									gridTemplateColumns: compact ? '42px 1fr auto' : '1fr',
									alignItems: 'center',
									gap: compact ? 10 : 7,
									padding: compact ? '11px 13px' : 17,
									border: `${active ? 2 : 1}px solid ${active ? colors.orange : colors.border}`,
									borderRadius: 17,
									background: active ? colors.orangeSoft : colors.surface,
									textAlign: compact ? 'left' : 'center',
									transform: active ? `scale(${0.96 + selectionSpring * 0.04})` : 'scale(1)',
								}}
							>
								<span style={{ fontSize: compact ? 24 : 29 }}>{option.icon}</span>
								<strong style={{ fontSize: 14 }}>{option.label}</strong>
								<span style={{ color: active ? colors.orange : colors.muted, fontSize: 12, fontWeight: 800 }}>
									{option.amount}
								</span>
							</div>
						);
					})}
				</div>

				<div style={{ position: 'absolute', right: compact ? 25 : 33, bottom: compact ? 25 : 33, left: compact ? 25 : 33 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 13,
							padding: '12px 14px',
							border: `1px solid ${colors.blue200}`,
							borderRadius: 14,
							background: colors.blue50,
							...reveal(frame, 75, 8),
						}}
					>
						<span style={{ color: colors.muted, fontSize: 12 }}>Selected appreciation</span>
						<strong style={{ color: colors.orange, fontSize: 14 }}>Coffee · {'\u20B9'}100</strong>
					</div>

					<div
						style={{
							height: 53,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 999,
							background: success ? colors.success : paid ? colors.blue900 : colors.orange,
							color: colors.onAccent,
							fontSize: 15,
							fontWeight: 800,
							boxShadow: success
								? '0 14px 30px rgba(47,122,77,.22)'
								: '0 14px 30px rgba(196,58,0,.2)',
							...pop(frame, 75),
						}}
					>
						{success
							? 'Referral request sent successfully'
							: submitting
								? 'Submitting referral request...'
								: paid
									? 'Submit referral request'
									: 'Pay Now'}
					</div>

					<div
						style={{
							marginTop: 11,
							color: success ? colors.success : colors.muted,
							fontSize: 11,
							fontWeight: success ? 800 : 600,
							textAlign: 'center',
							...reveal(frame, 183, 6),
						}}
					>
						Referrers decide independently. Appreciation never guarantees a referral.
					</div>
				</div>
			</Card>
		</AbsoluteFill>
	);
};

export const MobileSignalScene = () => {
	const frame = useCurrentFrame();
	const opened = frame >= 58;
	const notificationOpacity = interpolate(frame, [48, 61], [1, 0], clamp);
	const notificationReveal = reveal(frame, 12, 10);
	const detailReveal = reveal(frame, 58, 10);

	return (
		<AbsoluteFill style={{ padding: 14, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 24, background: colors.surface }}>
				<div
					style={{
						display: 'flex',
						height: 50,
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 17px',
						borderBottom: `1px solid ${colors.border}`,
						background: colors.subtle,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
						<GmailLogo size={27} />
						<strong style={{ fontSize: 16 }}>Inbox</strong>
					</div>
					<Avatar initials="JM" color={colors.blue900} size={30} />
				</div>

				<div style={{ position: 'absolute', inset: '50px 0 0', background: colors.blue50 }}>
					<div
						style={{
							position: 'absolute',
							inset: 18,
							display: 'grid',
							alignContent: 'center',
							...notificationReveal,
							opacity: notificationOpacity * (notificationReveal.opacity as number),
						}}
					>
						<p
							style={{
								margin: 0,
								color: colors.orange,
								fontSize: 11,
								fontWeight: 800,
								letterSpacing: '.09em',
								textTransform: 'uppercase',
							}}
						>
							New role alert
						</p>
						<h3 style={{ margin: '9px 0 16px', fontFamily: display, fontSize: 30, fontWeight: 500, lineHeight: 1.02 }}>
							A strong-fit role just opened.
						</h3>
						<div
							style={{
								padding: 17,
								border: `1px solid ${colors.blue200}`,
								borderRadius: 18,
								background: colors.surface,
								boxShadow: '0 18px 42px rgba(18,56,79,.1)',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								<MicrosoftLogo size={39} />
								<div>
									<strong style={{ display: 'block', fontSize: 17 }}>Product Manager</strong>
									<span style={{ color: colors.muted, fontSize: 12 }}>Microsoft · Posted 18 min ago</span>
								</div>
							</div>
							<p style={{ margin: '15px 0 0', color: colors.muted, fontSize: 13, lineHeight: 1.5 }}>
								You are seeing it while the application window is still fresh.
							</p>
						</div>
						<div
							style={{
								display: 'flex',
								height: 48,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
								borderRadius: 999,
								background: colors.orange,
								color: colors.onAccent,
								fontSize: 14,
								fontWeight: 800,
								...pop(frame, 31),
							}}
						>
							Open role alert
						</div>
					</div>

					<div
						style={{
							position: 'absolute',
							inset: 0,
							padding: 18,
							background: colors.surface,
							...detailReveal,
							opacity: opened ? detailReveal.opacity : 0,
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
							<Pill tone="orange" style={{ fontSize: 11, padding: '7px 10px' }}>Posted 18 min ago</Pill>
							<span style={{ color: colors.muted, fontSize: 11 }}>Job ID R6565XX98</span>
						</div>
						<div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 14 }}>
							<MicrosoftLogo size={38} />
							<h3 style={{ margin: 0, fontFamily: display, fontSize: 29, fontWeight: 500, lineHeight: 1.02 }}>
								Product Manager at Microsoft
							</h3>
						</div>
						<p style={{ margin: '15px 0 0', color: colors.muted, fontSize: 14, lineHeight: 1.5 }}>
							This role matches your background, and a referral path is already available.
						</p>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14, ...reveal(frame, 91, 7) }}>
							<Pill tone="blue" style={{ fontSize: 11, padding: '7px 9px' }}>Strong experience match</Pill>
							<Pill tone="green" style={{ fontSize: 11, padding: '7px 9px' }}>Early application</Pill>
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginTop: 14,
								padding: '12px 13px',
								border: `1px solid ${colors.blue200}`,
								borderRadius: 15,
								background: colors.blue50,
								...reveal(frame, 121, 7),
							}}
						>
							<div style={{ display: 'flex' }}>
								{[
									['AK', colors.blue900],
									['NV', colors.orange],
									['RS', colors.blue700],
								].map(([initials, color], index) => (
									<span key={initials} style={{ marginLeft: index === 0 ? 0 : -7 }}>
										<Avatar initials={initials} color={color} size={30} />
									</span>
								))}
							</div>
							<div style={{ textAlign: 'right' }}>
								<strong style={{ display: 'block', fontSize: 12 }}>3 referrers available</strong>
								<span style={{ color: colors.muted, fontSize: 10 }}>Choose who fits your request</span>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								height: 48,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 14,
								borderRadius: 999,
								background: colors.orange,
								color: colors.onAccent,
								fontSize: 14,
								fontWeight: 800,
								boxShadow: '0 14px 30px rgba(196,58,0,.2)',
								...pop(frame, 153),
							}}
						>
							View referrers
						</div>
					</div>
				</div>
			</Card>
		</AbsoluteFill>
	);
};

export const MobileJourneyScene = () => {
	const frame = useCurrentFrame();
	const stage = frame < 76 ? 0 : frame < 145 ? 1 : 2;
	const stageStarts = [12, 76, 145];
	const stages = ['Follow', 'Choose', 'Track'];
	const firstSelected = frame >= 102;
	const secondSelected = frame >= 120;

	return (
		<AbsoluteFill style={{ padding: 14, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ width: '100%', height: '100%', padding: 18, overflow: 'hidden', borderRadius: 24 }}>
				<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr auto', alignItems: 'center', gap: 7 }}>
					{stages.map((label, index) => (
						<div key={label} style={{ display: 'contents' }}>
							<div style={{ display: 'grid', justifyItems: 'center', gap: 5 }}>
								<span
									style={{
										display: 'grid',
										width: 30,
										height: 30,
										placeItems: 'center',
										borderRadius: '50%',
										background: stage >= index ? colors.orange : colors.blue100,
										color: stage >= index ? colors.surface : colors.blue700,
										fontSize: 12,
										fontWeight: 800,
									}}
								>
									{index + 1}
								</span>
								<strong style={{ color: stage >= index ? colors.ink : colors.muted, fontSize: 10 }}>{label}</strong>
							</div>
							{index < stages.length - 1 && (
								<span
									style={{ height: 2, marginBottom: 17, borderRadius: 999, background: stage > index ? colors.orange : colors.blue100 }}
								/>
							)}
						</div>
					))}
				</div>

				<div style={{ height: 'calc(100% - 58px)', marginTop: 14 }}>
					{stage === 0 && (
						<div
							style={{
								height: '100%',
								display: 'grid',
								alignContent: 'center',
								padding: 18,
								border: `1px solid ${colors.border}`,
								borderRadius: 19,
								background: colors.surface,
								...reveal(frame, stageStarts[0], 10),
							}}
						>
							<Pill tone="blue" style={{ justifySelf: 'start', fontSize: 11 }}>Step 1</Pill>
							<div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
								<MicrosoftLogo size={48} />
								<div>
									<h3 style={{ margin: 0, fontFamily: display, fontSize: 31, fontWeight: 500 }}>Follow Microsoft</h3>
									<span style={{ color: colors.muted, fontSize: 12 }}>Stay close to roles you want.</span>
								</div>
							</div>
							<p style={{ margin: '20px 0 0', color: colors.muted, fontSize: 14, lineHeight: 1.55 }}>
								RightRefer watches for relevant openings and alerts you while they are fresh.
							</p>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginTop: 21,
									padding: '14px 15px',
									borderRadius: 15,
									background: frame >= 38 ? colors.successSoft : colors.blue50,
								}}
							>
								<strong style={{ color: frame >= 38 ? colors.success : colors.blue700, fontSize: 13 }}>
									{frame >= 38 ? 'Following' : 'Follow company'}
								</strong>
								<span
									style={{
										position: 'relative',
										width: 43,
										height: 24,
										borderRadius: 999,
										background: frame >= 38 ? colors.success : colors.blue200,
									}}
								>
									<i
										style={{
											position: 'absolute',
											top: 3,
											left: frame >= 38 ? 22 : 3,
											width: 18,
											height: 18,
											borderRadius: '50%',
											background: colors.surface,
										}}
									/>
								</span>
							</div>
						</div>
					)}

					{stage === 1 && (
						<div
							style={{
								height: '100%',
								padding: 18,
								border: `1px solid ${colors.border}`,
								borderRadius: 19,
								background: colors.surface,
								...reveal(frame, stageStarts[1], 10),
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<Pill tone="orange" style={{ fontSize: 11 }}>Step 2</Pill>
								<span style={{ color: colors.muted, fontSize: 10 }}>Select more than one</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
								<MicrosoftLogo size={32} />
								<div>
									<strong style={{ display: 'block', fontSize: 15 }}>Product Manager</strong>
									<span style={{ color: colors.muted, fontSize: 11 }}>Microsoft · R6565XX98</span>
								</div>
							</div>
							<div style={{ display: 'grid', gap: 9, marginTop: 15 }}>
								<ReferrerRow name="Aditi K." role="Product · Microsoft" initials="AK" color={colors.blue900} selected={firstSelected} />
								<ReferrerRow name="Nikhil V." role="Platform · Microsoft" initials="NV" color={colors.orange} selected={secondSelected} />
								<ReferrerRow name="Rhea S." role="Growth · Microsoft" initials="RS" color={colors.blue700} selected={false} />
							</div>
							<div style={{ display: 'flex', gap: 7, marginTop: 13, ...reveal(frame, 126, 6) }}>
								<Pill tone="green" style={{ fontSize: 10, padding: '7px 9px' }}>Referral request</Pill>
								<Pill tone="orange" style={{ fontSize: 10, padding: '7px 9px' }}>Coffee optional</Pill>
							</div>
						</div>
					)}

					{stage === 2 && (
						<div
							style={{
								height: '100%',
								padding: 18,
								border: `1px solid ${colors.border}`,
								borderRadius: 19,
								background: colors.surface,
								...reveal(frame, stageStarts[2], 10),
							}}
						>
							<Pill tone="green" style={{ fontSize: 11 }}>Step 3</Pill>
							<h3 style={{ margin: '14px 0 0', fontFamily: display, fontSize: 30, fontWeight: 500 }}>
								Track every update
							</h3>
							<p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 13, lineHeight: 1.5 }}>
								Know when your request is seen, accepted, and referred.
							</p>
							<div style={{ display: 'grid', gap: 9, marginTop: 18 }}>
								{['Sent', 'Viewed', 'Accepted', 'Referred'].map((label, index) => {
									const complete = frame >= 154 + index * 11;
									return (
										<div
											key={label}
											style={{
												display: 'grid',
												gridTemplateColumns: '28px 1fr auto',
												alignItems: 'center',
												gap: 10,
												padding: '10px 12px',
												borderRadius: 13,
												background: complete ? colors.successSoft : colors.blue50,
											}}
										>
											<span
												style={{
													display: 'grid',
													width: 26,
													height: 26,
													placeItems: 'center',
													borderRadius: '50%',
													background: complete ? colors.success : colors.blue200,
													color: colors.onAccent,
													fontSize: 12,
												}}
											>
												{complete ? '\u2713' : ''}
											</span>
											<strong style={{ fontSize: 13 }}>{label}</strong>
											<span style={{ color: complete ? colors.success : colors.muted, fontSize: 10 }}>
												{complete ? 'Complete' : 'Waiting'}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</Card>
		</AbsoluteFill>
	);
};

export const MobileAppreciationScene = () => {
	const frame = useCurrentFrame();
	const selected = frame >= 43;
	const paid = frame >= 99;
	const submitting = frame >= 145 && frame < 174;
	const success = frame >= 174;

	return (
		<AbsoluteFill style={{ padding: 14, background: colors.blue100, fontFamily: font, color: colors.ink }}>
			<Card style={{ width: '100%', height: '100%', padding: 18, overflow: 'hidden', borderRadius: 24 }}>
				<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
					<div>
						<p
							style={{
								margin: 0,
								color: colors.orange,
								fontSize: 10,
								fontWeight: 800,
								letterSpacing: '.09em',
								textTransform: 'uppercase',
							}}
						>
							Referral request
						</p>
						<h3 style={{ margin: '7px 0 0', fontFamily: display, fontSize: 28, fontWeight: 500, lineHeight: 1.02 }}>
							Add a thank-you?
						</h3>
					</div>
					<Pill tone="blue" style={{ fontSize: 10, padding: '7px 9px' }}>Always optional</Pill>
				</div>

				<div style={{ display: 'grid', gap: 8, marginTop: 16, ...reveal(frame, 14, 7) }}>
					{[
						{ icon: '\u2615', label: 'Coffee', amount: '\u20B9100' },
						{ icon: '\u{1F355}', label: 'Pizza', amount: '\u20B9500' },
						{ icon: '+', label: 'Custom amount', amount: 'Choose' },
					].map((option, index) => {
						const active = index === 0 && selected;
						return (
							<div
								key={option.label}
								style={{
									display: 'grid',
									height: 50,
									gridTemplateColumns: '34px 1fr auto',
									alignItems: 'center',
									gap: 9,
									padding: '0 12px',
									border: `${active ? 2 : 1}px solid ${active ? colors.orange : colors.border}`,
									borderRadius: 15,
									background: active ? colors.orangeSoft : colors.surface,
								}}
							>
								<span style={{ fontSize: 21, textAlign: 'center' }}>{option.icon}</span>
								<strong style={{ fontSize: 13 }}>{option.label}</strong>
								<span style={{ color: active ? colors.orange : colors.muted, fontSize: 11, fontWeight: 800 }}>
									{option.amount}
								</span>
							</div>
						);
					})}
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginTop: 13,
						padding: '11px 12px',
						border: `1px solid ${colors.blue200}`,
						borderRadius: 14,
						background: colors.blue50,
						...reveal(frame, 50, 6),
					}}
				>
					<span style={{ color: colors.muted, fontSize: 11 }}>Your optional thank-you</span>
					<strong style={{ color: colors.orange, fontSize: 13 }}>Coffee · {'\u20B9'}100</strong>
				</div>

				<div
					style={{
						display: 'flex',
						height: 50,
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 12,
						borderRadius: 999,
						background: success ? colors.success : paid ? colors.blue900 : colors.orange,
						color: colors.onAccent,
						fontSize: 13,
						fontWeight: 800,
						boxShadow: success ? '0 14px 30px rgba(47,122,77,.22)' : '0 14px 30px rgba(196,58,0,.2)',
						...pop(frame, 30),
					}}
				>
					{success
						? 'Referral request sent successfully'
						: submitting
							? 'Submitting referral request...'
							: paid
								? 'Submit referral request'
								: 'Pay Now'}
				</div>
				<p
					style={{
						margin: '10px auto 0',
						maxWidth: 310,
						color: success ? colors.success : colors.muted,
						fontSize: 10,
						fontWeight: success ? 800 : 600,
						lineHeight: 1.45,
						textAlign: 'center',
					}}
				>
					Referrers decide independently. Appreciation never guarantees a referral.
				</p>
			</Card>
		</AbsoluteFill>
	);
};
