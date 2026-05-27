export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const shortDateWithWeekday = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

export const en = {
  meta: {
    title: 'Supercycl Mobile Launch Event',
    tagline: 'TRADE DIFFERENT · RIDE THE SUPERCYCL',
    period: 'Jun 8 – Jul 7, 2026 · 1 MONTH',
    eventLabel: 'Mobile launch event',
  },
  hero: {
    youthMetaNotice: 'Open to YouthMeta members only',
  },
  cta: {
    joinNow: 'Join now',
    tradeNow: 'Trade now',
    startSurvey: 'Start survey',
    goToMain: 'Open Supercycl app',
  },
  rewards: {
    heading: 'Rewards',
    usdtLine: 'Trade $500: 20 USDT',
    icxLine: 'Complete survey: ICX reward',
    eyebrow: 'Reward',
    usdtAmount: '20 USDT',
    usdtCondition: 'Trade $500 to unlock',
    usdtConditionRemaining: (remaining: number) => `Trade $${remaining} more to unlock`,
    usdtConditionReady: '$500 reached',
    // Shared payout-date copy — USDT (weekly Monday batch) and ICX (single
    // post-campaign batch on CAMPAIGN_END) both render this format with the
    // appropriate date computed at the call site.
    payoutOn: (date: string) =>
      `Payout: ${shortDateWithWeekday(date)} · 10:00 KST`,
    usdtConditionNeedsOkx: 'Connect OKX to unlock',
    usdtClosed: 'Trade window closed — reward no longer available',
    // Placeholder headline for the non-trader pool while the per-user
    // amount is still pending (`nonTraderIcxAmount === null`). Once
    // operations confirms the number, state flips and the headline
    // becomes the normal `N ICX` shape via `icxAmountWithValue`.
    icxAmountPending: '?? ICX',
    icxAmountWithValue: (amount: number) =>
      amount === 100 ? `${amount} ICX (~$5 airdrop)` : `${amount} ICX`,
    // Pre-survey headline framing — non-trader users may end up with a pool
    // share smaller than the trader tier, so the cap is communicated up
    // front with "Up to N ICX".
    icxAmountUpTo: (amount: number) =>
      amount === 100 ? `Up to ${amount} ICX (~$5 airdrop)` : `Up to ${amount} ICX`,
    icxCondition: 'Complete the survey',
    icxConditionReady: 'Survey complete — payout scheduled',
    icxTradeUrl: 'https://www.okx.com/trade-spot/icx-usdt',
    icxTradeLinkLabel: 'Trade ICX on OKX',
    payoutChannel: (uid: string) =>
      `OKX UID: ${uid} · payout via Internal Transfer`,
    paidNotice: 'Sent to your OKX Main Account.',
    icxPayoutInfo: {
      traderTier: 'Trade $500+ → earn 100 ICX each',
      nonTraderTier: 'Otherwise → share of the remaining pool',
    },
  },
  steps: {
    heading: 'How to participate',
    step1: 'Sign up + connect OKX',
    step1OkxNotConnected: 'OKX not connected',
    step2: 'Trade $500 →\nGet 20 USDT',
    step3: 'Complete survey →\nGet ICX (~$5)',
    step4: 'Receive 20 USDT',
    step5: 'Receive ICX airdrop (~$5)',
  },
  slot: {
    label: 'Trading slots remaining',
    suffix: '/ 500',
    rewardCardHeading: 'Trade reward slots',
    fullBadge: 'Full',
  },
  progress: {
    heading: 'My progress',
    volume: (vol: number) => `Cumulative volume on Supercycl $${vol} / $500`,
    remaining: (rem: number) => `${rem > 0 ? `$${rem} to go` : 'Goal reached!'}`,
    remainingNeedsOkx: 'Volume reached — connect OKX to claim',
    daysLeft: (d: number) => `${d > 0 ? `${d} days until end` : 'Campaign ended'}`,
  },
  status: {
    locked: 'Locked',
    open: 'Open',
    awaitingPayout: 'Awaiting payout',
    completed: 'Paid',
  },
  banner: {
    campaignRunning: (start: string, end: string) =>
      `Mobile Launch Event is live · ${shortDate(start)} – ${shortDate(end)}`,
    slots100: '100 slots left! Start trading now',
    slots50: '50 slots left! Don’t miss out',
    slots10: '10 slots left! Final call',
    d3: (daysLeft: number) =>
      daysLeft <= 0
        ? 'Final day — campaign ends today'
        : daysLeft === 1
          ? '1 day until the campaign ends'
          : `${daysLeft} days until the campaign ends`,
  },
  modal: {
    survey: {
      doneCta: 'Done',
    },
  },
  eventClosed: {
    eyebrow: 'SUPERCYCL MOBILE LAUNCH FESTIVAL',
    titleLine1: 'Thanks for',
    titleLine2: 'riding with us.',
    subtitle: '2026.06.08 ─ 07.07 · Ended',
  },
  hub: {
    stepDone: 'Done',
    stepInProgress: 'In progress',
    stepLocked: 'Up next',
    youthMetaGate: {
      title: 'YouthMeta members only',
      description:
        "This festival is exclusive to YouthMeta members. You're signed in, but your account isn't on the YouthMeta roster.",
      homeCta: 'Go to Home',
    },
  },
  account: {
    heading: 'My account',
    addressLabel: 'Supercycl account address',
    uidLabel: 'OKX UID',
    okxNotConnected: 'Not connected',
    okxConnectCta: 'Connect OKX',
  },
  outsideWindow: {
    surveyClosed: 'Survey opens June 29',
    surveyEnded: 'Survey closed',
  },
  errors: {
    required: 'This field is required',
    persistenceReset: 'Mock state reset due to corruption',
  },
};

export type En = typeof en;
