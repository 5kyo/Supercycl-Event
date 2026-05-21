# Reward Card Emphasis — Design

**Date:** 2026-05-21
**Scope:** `UsdtRewardCard`, `IcxRewardCard`, and reward-related copy in `en.ts`.

## Problem

The two reward cards on the hub read like task cards instead of reward cards. Current titles ("20 USDT — Trade $500", "ICX — Complete survey") mix the reward and the condition with equal weight, and the visual treatment is flat text on a glass card. The locked state (`🔒 Sign in to view`) further pushes the cards toward feeling deactivated rather than aspirational.

## Goal

Make the cards immediately read as *"this is what you can earn"* before *"this is what you need to do."* Reinforce on two axes:

1. **Copy** — separate the reward (hero) from the condition (subtitle).
2. **Visual** — give the reward amount real typographic and color weight using existing accent tokens.

## Design

### Card structure

Both cards share the same three-zone layout inside `card-elevated`:

```
┌─────────────────────────────────────────┐
│ ✦ EARN                 [status badge]    │  zone 1: eyebrow + status
│                                          │
│  20 USDT                                 │  zone 2: hero amount (gradient)
│  Trade $500 to unlock                    │  zone 3: condition (secondary)
│                                          │
│  [registration form / CTA — when used]   │  existing behavior preserved
└─────────────────────────────────────────┘
```

**Zone 1 — eyebrow + status**
- Eyebrow: `✦ EARN` using `.upper-label` class, colored with `--accent`. Acts as the category tag.
- Status badge (right): unchanged behavior; only the logged-out preview is upgraded from a plain `🔒 Sign in to view` text span to a `.chip-muted` chip for visual parity with the other status states.

**Zone 2 — hero amount**
- USDT card: `20 USDT`
- ICX card: `Bonus ICX` by default; if `effectiveIcxPayout(state).amount` is known, render `{amount} ICX`.
- Styled with `.accent-text` (gradient fill via `background-clip: text`) at display-lg size (`var(--font-display-lg)` = 700 28/34).
- This replaces the current `<h3 className="text-title-md">` card title.

**Zone 3 — condition**
- USDT card: `Trade $500 to unlock` (default). When `usdtPayoutStatus === '미달성'`, the existing dynamic line `Trade $X more to unlock.` continues to be used in this same slot — they collapse into one element instead of being separate title + paragraph.
- ICX card: `Complete the 13-question survey`. The current non-trader fallback (`en.hub.icxNonTrader`) stays in this slot when applicable.
- Uses `.text-body-md` + `--text-secondary`.

### Copy changes (`src/content/en.ts`)

Replace the two combined titles with split keys so the component can compose eyebrow/hero/condition cleanly:

```ts
rewards: {
  // existing keys preserved (heading, usdtLine, icxLine)
  eyebrow: 'Earn',
  usdtAmount: '20 USDT',
  usdtCondition: 'Trade $500 to unlock',
  usdtConditionRemaining: (remaining: number) => `Trade $${remaining} more to unlock`,
  icxAmount: 'Bonus ICX',
  icxAmountWithValue: (amount: number) => `${amount} ICX`,
  icxCondition: 'Complete the 13-question survey',
}
```

The old `usdtCardTitle` and `icxCardTitle` keys are removed. They are only referenced by the two cards under change.

### Logged-out badge

Replace the inline span:

```tsx
<span className="text-label-md inline-flex items-center gap-1.5 text-text-tertiary">
  <span aria-hidden>🔒</span>
  Sign in to view
</span>
```

with the existing `.chip` primitive:

```tsx
<span className="chip chip-muted">
  <span aria-hidden>🔒</span>
  Sign in to view
</span>
```

Visual parity with `RewardStatusLabel`'s chip and keeps the card from looking like a disabled task tile.

## What is explicitly out of scope

- `RewardStatusLabel` — used in other places; do not restyle.
- `UsdtRegistrationForm` / `IcxRegistrationForm` — inline form rendering stays exactly as-is.
- Other hub cards (progress, slot, etc.).
- No new aura/glow effects in this pass. The gradient hero amount carries enough weight; adding a decorative aura risks visual noise next to the other cards.

## Testing

- Existing tests:
  - `tests/components/RewardStatusLabel.test.tsx` — should be unaffected (component not changed).
  - `tests/components/IcxRewardCard.surveyCta.test.tsx` — verify the survey CTA still renders given the new card structure; update query selectors if they depended on the removed `h3` title text.
- Manual check (logged-out + logged-in states for both cards) via the running dev server.

## Files touched

- `src/content/en.ts` — copy keys (add 6 new, remove 2 old).
- `src/components/hub/UsdtRewardCard.tsx` — header restructure.
- `src/components/hub/IcxRewardCard.tsx` — header restructure.
- Possibly `tests/components/IcxRewardCard.surveyCta.test.tsx` — selector updates if any.
