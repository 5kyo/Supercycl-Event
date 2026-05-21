# Event Closed — 2-Week Registration Window — Design

**Date:** 2026-05-21
**Scope:** `EventClosed` page redesign, registration cutoff change (30d → 14d), and removal of the post-event NPS modal.

## Problem

When the campaign ends on 2026-07-07, users land on the `EventClosed` page. Two issues:

1. The current page reuses the in-campaign visual language (4-stat grid, "D-29 cutoff to register" celebration tile) and treats every visitor the same regardless of whether they actually need to register a payout address. The "Haven't registered yet?" CTA is buried beneath the stats, so the people who most need it have to scroll past festival-recap content first.
2. A `NpsModal` ("One last question") auto-opens for every visitor after 2026-07-07. It exists in the codebase but is not part of the campaign deliverable — it interrupts the registration flow rather than supporting it.

Separately, the spec currently defines the post-event registration window as **30 days** (cutoff 2026-08-06). Operations has shortened this to **14 days** (cutoff 2026-07-21).

## Goal

Make the post-event page a thank-you screen that quietly drives late registrations:

1. **One layout, conditional reward card.** Hero is goodbye copy. The registration CTA appears only when the visitor has an unredeemed reward *and* is still inside the 14-day window. Everyone else (logged out, not qualified, already paid, post-cutoff) sees the same minimal goodbye.
2. **Shorten the registration window** to 14 days (cutoff 2026-07-21) and update every site that displays or compares against this date.
3. **Delete the NPS modal** and the supporting plumbing (priority, dismissed-flag, copy, tests).

## Design

### Page structure (`EventClosed.tsx`)

Center-aligned, minimal. Replaces the current left-aligned hero + 2-column stat grid + warning card.

```
─────────────────────────────────────────
        SUPERCYCL MOBILE LAUNCH FESTIVAL          ← eyebrow label

             Thanks for
             riding with us.                       ← hero (accent gradient on line 2)

        2026.06.08 ─ 07.07 · Ended                 ← subtitle
─────────────────────────────────────────
  [Conditional reward card — see below]
─────────────────────────────────────────
      527        738         $1.2M                 ← recap row (3 stats, horizontal)
   traders    surveys     volume
─────────────────────────────────────────
        [Open Supercycl app →]                     ← single secondary CTA
─────────────────────────────────────────
```

**Hero zone**
- Eyebrow: `SUPERCYCL MOBILE LAUNCH FESTIVAL` using `.upper-label` + `--text-tertiary`.
- Title: two-line, `font-bold`, ~44px, line-height 0.98, letter-spacing -0.03em. Second line `<span class="accent-text">` for gradient fill — matches the existing in-campaign `accent-text` treatment.
- Subtitle: campaign date range + `· Ended`. `text-body-md` + `--text-secondary-strong`.
- The two `aura` decorative elements from the current page stay (top-right accent aura, mid-left cyan aura) — they're cheap, on-brand, and the hero needs the visual lift.

**Reward card zone (conditional)**

Rendered only when **all** of:
- User has at least one unredeemed reward (`isQualifiedForUsdt(state) && state.usdtPayoutStatus !== '완료'`, OR `state.surveyCompleted && state.icxPayoutStatus !== '완료'`).
- Registration cutoff has not passed (`!registrationCutoffPassed(state)`).
- User is logged in (`state.authStatus === 'logged_in'`).

A single card — not one per reward. Card surfaces the most-urgent unregistered reward by priority:
1. USDT needs registration (qualified but `usdtRegistration.status === 'none'`)
2. ICX needs registration (survey done but `!state.icxAddress`)
3. USDT/ICX registered, awaiting payout — card not shown (registration already done).

Card visual: same warning treatment used today (`linear-gradient(135deg, rgba(255,167,38,0.10), transparent)`, `border: 1px solid var(--warning-border)`), center-aligned content to match the hero.

```
┌──────────────────────────────────────┐
│  YOUR REWARD IS WAITING                │  ← label-tag (warning)
│                                        │
│      20 USDT                           │  ← amount, ~24px bold
│                                        │
│  D-14 until rewards expire · Jul 21    │  ← warning countdown
│                                        │
│      [Register wallet →]               │  ← btn-primary
└──────────────────────────────────────┘
```

- Amount: `20 USDT` for USDT-needs-registration; for ICX, `{amount} ICX` from `effectiveIcxPayout(state)` (falls back to `Bonus ICX` if amount is null per existing helper).
- Countdown: `D-{daysUntilCutoff}` — computed from `REGISTRATION_CUTOFF - simulatedDate` using the same `diffDays` helper already in `selectors.ts`. Caps at `D-0` on the cutoff date itself.
- CTA: opens `UsdtRegistrationModal` or `IcxRegistrationModal` matching the surfaced reward. Existing wiring in `app/page.tsx` is preserved — the page still receives `onRegisterUsdt` / `onRegisterIcx` handlers.

**Recap row**

Horizontal three-stat strip, between top and bottom borders. `display:flex; justify-content:space-around`. Each cell: bold value (~16px), `.upper-label`-styled sub. Values stay as today's mock numbers (`527`, `738`, `$1.2M`) — real values are an ops-time content update, not a design concern.

The current "D-29 · cutoff to register" tile is removed from the stats; the countdown lives inside the reward card where it has context.

**Bottom CTA**

`Open Supercycl app →` as `.btn-secondary`, full width on mobile. Same link as today.

### Cutoff change

`src/lib/mock-state/initial.ts`:
- `REGISTRATION_CUTOFF: '2026-08-06'` → `'2026-07-21'`.

All hardcoded cutoff dates and `D-29` figures across the app must derive from this constant. The audit:

| File | Current | Fix |
|------|---------|-----|
| `EventClosed.tsx` | `'D-29'` string, `Aug 6` in copy (×2), `Aug 6 registration cutoff warning` comment | Replaced by full rewrite per design above; countdown derived from `REGISTRATION_CUTOFF`. |
| `HubExpired.tsx` | `Aug 6 cutoff missed` (×2), `before Aug 6, 2026` body copy, `past Aug 6 cutoff` comment | Replace literal date strings with `shortDate(REGISTRATION_CUTOFF)` (the helper already exists in `en.ts`). Comment updated to `past registration cutoff`. |
| `debug/TimeSection.tsx` | `{ label: '30d-cutoff', date: '2026-08-07' }` preset | `{ label: '14d-cutoff', date: '2026-07-22' }` (one day past cutoff so toggling lands in expired state). |
| `selectors.ts` | Comment `past Aug 6 cutoff with at least one unredeemed reward.` | `past registration cutoff …` (no literal date). |
| `tests/mock-state/selectors.test.ts` | Asserts boundary at `2026-08-06` / `2026-08-07` | Update to `2026-07-21` / `2026-07-22`. |

`CountdownTimer.test.tsx` asserts `D-29` derived from campaign **end** (Jun 8 → Jul 7), not cutoff — leave it alone.

### NPS modal removal

Delete:
- `src/components/modals/NpsModal.tsx`
- `modal.nps` block in `src/content/en.ts` (title, body, registerReminder)
- `'nps'` case in `src/components/modals/ModalRoot.tsx` — the switch becomes empty, so the component now always returns `null`; we delete the whole component (and its import in `app/page.tsx`) since there are no other auto-modals.
- `'nps'` from `ModalId` union and the corresponding case in `pickAutoModal` / `dismissKeyFor` in `src/lib/modalPriority.ts`. The remaining file becomes an empty union and unused functions — delete the file entirely and remove its imports.
- `npsModal` flag from `MockState.dismissedFlags` in `src/lib/mock-state/types.ts`.
- Any reducer test in `tests/mock-state/reducer.test.ts` that asserts dismissing `npsModal`.

After deletion, `app/page.tsx` no longer needs `<ModalRoot />` — drop that JSX node.

### Files touched (summary)

**Modified**
- `src/components/EventClosed.tsx` — full rewrite per design.
- `src/lib/mock-state/initial.ts` — cutoff constant.
- `src/lib/mock-state/types.ts` — drop `dismissedFlags.npsModal`.
- `src/lib/mock-state/selectors.ts` — comment cleanup.
- `src/components/hub/HubExpired.tsx` — date references derived from constant.
- `src/components/debug/TimeSection.tsx` — preset label/date.
- `src/content/en.ts` — drop `modal.nps`.
- `src/app/page.tsx` — remove `<ModalRoot />` and its import.
- `tests/mock-state/selectors.test.ts` — boundary dates.

**Deleted**
- `src/components/modals/NpsModal.tsx`
- `src/components/modals/ModalRoot.tsx`
- `src/lib/modalPriority.ts`

**Test fixture adjustment**
- `tests/mock-state/reducer.test.ts` — no test cases are NPS-specific, but the `RESET_DISMISSED` fixture references `npsModal: true`; swap it for another existing flag (e.g., `surveyCompleteSeen: true`) so the test still exercises "multiple flags cleared."

## YAGNI

- **No i18n work.** Project is English-only via `en.ts`. New strings go through `en.ts`; the multi-language scaffolding from the original spec (§7.5) is out of scope.
- **No "✓ Registered, awaiting payout" status card.** Single-layout decision: if registration is already done, the card is hidden — users see hero + recap + app CTA. Status of registered-but-unpaid rewards remains visible inside the Supercycl app, which the bottom CTA links to.
- **No archive-mode toggle.** Spec §13 item #10 asks how the page behaves long-term. Not solved here — once the cutoff passes, the reward card simply disappears. Long-term archive is a follow-up.
- **No new analytics events.** The post-event NPS metric is dropped along with the modal; if reinstated later, it can be re-added cleanly.

## Test plan

- `selectors.test.ts` boundary update — cutoff at 2026-07-21 / 2026-07-22 passes.
- Manual: dev server + Debug `TimeSection` presets — toggle between `event-end` (Jul 8), a mid-window date (Jul 14, D-7), `14d-cutoff` (Jul 22). Verify reward card visibility and countdown match the rules above for: not-qualified user, USDT-qualified-unregistered, USDT-registered-not-paid, both-paid, and post-cutoff unredeemed.
- Manual: from `2026-07-08`, confirm no modal auto-opens (NPS removed).
