# ICX Reward Card — Payout Info & Survey Open Date

**Date:** 2026-05-21
**Scope:** `IcxRewardCard`, ICX-related copy in `en.ts`.

## Problem

The ICX reward card surfaces the condition (`Complete the 13-question survey`) but hides two facts that matter to users *before* they invest 13 questions of effort:

1. **Payout tiering** — only trading-mission completers get the fixed `100 ICX`; everyone else who finishes the survey shares a remaining pool. This logic already exists in `effectiveIcxPayout()`, but the card doesn't say it.
2. **Survey opening date** — the survey track opens 2026-06-29 (constant `SURVEY_TRACK_START`), but a logged-in user looking at the locked card today has no idea when "Start survey" will appear.

## Goal

Surface both facts inside the ICX card in a way that:

- Reads as informational, not a CTA.
- Doesn't compete with the existing condition line, hero amount, or `Start survey` button.
- Hides itself once the user has completed the survey (the card pivots to a registration CTA at that point — the info block becomes noise).

## Design

### Placement

A single `surface-2` info block, rendered directly under the condition line and above any CTA / wallet preview. Same visual primitive as the existing `outsideWindow.registrationClosed` notice but without italics and slightly more structure (heading + bullets).

```
┌─────────────────────────────────────────┐
│ ✦ REWARD                       Locked   │
│                                         │
│ Bonus ICX                               │
│ Complete the 13-question survey         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Survey opens Jun 29                 │ │  ← only before SURVEY_TRACK_START
│ │ • Traders ($500+): 100 ICX          │ │
│ │ • Non-traders: share of the         │ │
│ │   remaining pool                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [ Start survey ]                        │  ← when surveyTrackOpen(state)
└─────────────────────────────────────────┘
```

### Visibility

- **Show** when `!state.surveyCompleted`. The card is still in "earn this" mode.
- **Hide** when `state.surveyCompleted`. The card is now in "register your wallet" mode; the static info block would distract from that CTA.
- The block is shown to logged-out users too — it's marketing-relevant.

### Date heading

The `Survey opens Jun 29` heading uses the existing `shortDate(SURVEY_TRACK_START)` helper for consistency with other date renderings in `en.ts`.

- **Show heading** only when `state.simulatedDate < SURVEY_TRACK_START`. Once the survey window opens, the heading goes away and only the two payout-tier bullets remain.
- **Always show bullets** while the block is visible (i.e., while `!state.surveyCompleted`).

### Copy (`src/content/en.ts`)

Add a new `rewards.icxPayoutInfo` object grouping the three strings so the component can compose them:

```ts
icxPayoutInfo: {
  surveyOpens: (start: string) => `Survey opens ${shortDate(start)}`,
  traderTier: 'Traders ($500+): 100 ICX',
  nonTraderTier: 'Non-traders: share of the remaining pool',
}
```

No existing keys removed or repurposed. `en.hub.icxNonTrader` stays — it's used by the condition line *after* a non-trader finishes the survey, which is a different surface from the always-on info block.

### Component change (`src/components/hub/IcxRewardCard.tsx`)

Insert the info block between the existing hero/condition `<div>` (line 57–62) and the wallet-preview `<p>` (line 63):

```tsx
{!state.surveyCompleted && (
  <div
    className="flex flex-col gap-1.5 rounded-md text-body-sm"
    style={{ background: 'var(--surface-2)', padding: '10px 12px' }}
  >
    {state.simulatedDate < SURVEY_TRACK_START && (
      <p className="text-text-secondary">
        {en.rewards.icxPayoutInfo.surveyOpens(SURVEY_TRACK_START)}
      </p>
    )}
    <ul className="flex flex-col gap-1 text-text-tertiary">
      <li>{en.rewards.icxPayoutInfo.traderTier}</li>
      <li>{en.rewards.icxPayoutInfo.nonTraderTier}</li>
    </ul>
  </div>
)}
```

`SURVEY_TRACK_START` is imported from `@/lib/mock-state`.

## What is explicitly out of scope

- USDT card — request is ICX-only.
- Localization — copy is English-only, matching the rest of `en.ts`.
- Visual aura/glow on the block — keep it quiet, like the existing notice block.
- Behavior of the `Start survey` button — unchanged.

## Testing

- Existing `tests/components/IcxRewardCard.surveyCta.test.tsx` — must continue to pass. New tests are not required: the info block is presentational and its visibility is a direct read of two existing state fields. Manual verification in the running dev server covers the four states (logged-out, pre-survey-window, in-window, post-survey-completion).
- `npm run test` to confirm no regression.

## Files touched

- `src/content/en.ts` — add `rewards.icxPayoutInfo` (3 new keys, no removals).
- `src/components/hub/IcxRewardCard.tsx` — import `SURVEY_TRACK_START`, render the info block.
