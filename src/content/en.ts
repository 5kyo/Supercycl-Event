export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const en = {
  meta: {
    title: 'Supercycl Mobile Launch Event',
    tagline: 'TRADE DIFFERENT · RIDE THE SUPERCYCL',
    period: 'Jun 8 – Jul 7, 2026 · 1 MONTH',
    eventLabel: 'Mobile launch event',
  },
  cta: {
    joinNow: 'Join now',
    tradeNow: 'Trade now',
    startSurvey: 'Start survey',
    registerUsdt: 'Register USDT info',
    registerIcx: 'Register ICX wallet',
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
    usdtConditionReady: '$500 reached — register payout info',
    usdtClosed: 'Trade window closed — reward no longer available',
    icxAmount: 'Bonus ICX',
    icxAmountWithValue: (amount: number) => `${amount} ICX`,
    icxCondition: 'Complete the 12-question survey',
    icxConditionReady: 'Survey complete — register your ICON wallet',
    icxPayoutInfo: {
      surveyOpens: (start: string) => `Survey opens ${shortDate(start)}`,
      traderTier: 'Traders ($500+): 100 ICX',
      nonTraderTier: 'Non-traders: share of the remaining pool',
    },
  },
  steps: {
    heading: 'How to participate',
    step1: 'Sign up + connect OKX',
    step2: 'Trade $500 → 20 USDT',
    step3: 'Complete survey → ICX',
  },
  slot: {
    label: 'Trading slots remaining',
    suffix: '/ 500',
  },
  progress: {
    heading: 'My progress',
    volume: (vol: number) => `Cumulative volume $${vol} / $500`,
    remaining: (rem: number) => `${rem > 0 ? `$${rem} to go` : 'Goal reached!'}`,
    daysLeft: (d: number) => `${d > 0 ? `${d} days until end` : 'Campaign ended'}`,
    slotsLeft: (n: number) => `${n} slots remaining`,
  },
  status: {
    locked: 'Locked',
    open: 'Open',
    notRegistered: 'Registration required',
    pending: 'Pending payout',
    review: 'Under review (max 7 days)',
    completed: 'Paid',
    expired: 'Expired',
    capFull: '$500 reached — slot capacity full. Thank you.',
  },
  banner: {
    campaignRunning: (start: string, end: string) =>
      `Mobile Launch Event is live · ${shortDate(start)} – ${shortDate(end)}`,
    slots100: '100 slots left! Start trading now',
    slots50: '50 slots left! Don’t miss out',
    slots10: '10 slots left! Final call',
    d3: '3 days until the campaign ends',
  },
  modal: {
    survey: {
      title: 'Profile & Earn — 12 questions',
      submit: 'Submit',
      next: 'Next',
      previous: 'Back',
      completeTitle: 'Thanks for completing the survey!',
      completeBody: 'Your mini-report is below. Register your ICX wallet to receive the reward.',
      registerIcxCta: 'Register ICX wallet',
    },
    usdt: {
      title: 'Receive 20 USDT',
      methodWallet: 'TRC20 wallet',
      methodExchange: 'OKX exchange',
      trc20Label: 'TRC20 USDT wallet address',
      trc20Warning: 'Wrong network = lost funds',
      networkCheck: 'I confirmed this is a TRC20 address',
      okxUidLabel: 'OKX UID',
      okxEmailLabel: 'OKX registered email',
      submit: 'Register',
    },
    icx: {
      title: 'Register your ICX wallet',
      addressLabel: 'ICON wallet address (hx…)',
      submit: 'Register',
    },
  },
  eventClosed: {
    eyebrow: 'SUPERCYCL MOBILE LAUNCH FESTIVAL',
    titleLine1: 'Thanks for',
    titleLine2: 'riding with us.',
    subtitle: '2026.06.08 ─ 07.07 · Ended',
    rewardLabel: 'YOUR REWARD IS WAITING',
    countdownExpires: (d: number, cutoff: string) =>
      `D-${Math.max(0, d)} until rewards expire · ${cutoff}`,
    registerCta: 'Register wallet',
    recap: {
      traderCount: '527',
      traderLabel: 'traders',
      surveyCount: '738',
      surveyLabel: 'surveys',
      volumeAmount: '$1.2M',
      volumeLabel: 'volume',
    },
    openApp: 'Open Supercycl app',
  },
  hub: {
    stepDone: 'Done',
    stepInProgress: 'In progress',
    stepLocked: 'Up next',
    icxNonTrader: 'Non-trader pool reward: TBD (pending operations decision)',
  },
  outsideWindow: {
    surveyClosed: 'Survey opens June 29',
    surveyEnded: 'Survey closed',
    registrationClosed: 'Registration closed',
  },
  errors: {
    required: 'This field is required',
    inconsistentState: 'Inconsistent mock state',
    persistenceReset: 'Mock state reset due to corruption',
  },
};

export type En = typeof en;
