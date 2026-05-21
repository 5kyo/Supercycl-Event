# Event Closed — 2-Week Registration Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the post-event registration window from 30 days to 14 days, redesign the `EventClosed` page as a minimal goodbye with a conditional reward CTA, and remove the post-event NPS modal end-to-end.

**Architecture:** Single source of truth for the cutoff date stays `REGISTRATION_CUTOFF` in `mock-state/initial.ts`. All literal "Aug 6" copy is replaced by a derived `shortDate(REGISTRATION_CUTOFF)`. A new selector `daysUntilCutoff` computes the countdown the same way `daysUntilEnd` already does. The NPS modal and its supporting files (`ModalRoot`, `modalPriority`, `dismissedFlags.npsModal`, `modal.nps` copy) are removed wholesale — they are unused once the modal goes away.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind, Vitest + Testing Library.

---

## File Structure Overview

**Modified**
- `src/lib/mock-state/initial.ts` — change `REGISTRATION_CUTOFF` constant.
- `src/lib/mock-state/selectors.ts` — add `daysUntilCutoff`, clean comment.
- `src/lib/mock-state/types.ts` — drop `npsModal` from `DismissedFlags`.
- `src/lib/mock-state/index.ts` — export `daysUntilCutoff`.
- `src/content/en.ts` — export `shortDate`, drop `modal.nps`, add EventClosed copy keys.
- `src/components/hub/HubExpired.tsx` — derive date strings from `REGISTRATION_CUTOFF`.
- `src/components/debug/TimeSection.tsx` — update cutoff preset.
- `src/components/EventClosed.tsx` — full rewrite per design (single layout, conditional reward card).
- `src/app/page.tsx` — remove `ModalRoot` import + render.
- `tests/mock-state/selectors.test.ts` — update boundary dates, add `daysUntilCutoff` cases.
- `tests/mock-state/reducer.test.ts` — swap `npsModal` fixture for `surveyCompleteSeen`.

**Deleted**
- `src/components/modals/NpsModal.tsx`
- `src/components/modals/ModalRoot.tsx`
- `src/lib/modalPriority.ts`

**Created**
- `tests/components/EventClosed.test.tsx` — new component tests for the rewritten page.

---

## Task 1: Update REGISTRATION_CUTOFF Constant (TDD)

**Files:**
- Modify: `tests/mock-state/selectors.test.ts:49-52`
- Modify: `src/lib/mock-state/initial.ts:8`

- [ ] **Step 1: Update the failing selector test for the new boundary**

Edit `tests/mock-state/selectors.test.ts`, replace the `registrationCutoffPassed` test (lines 49–52):

```ts
  it('registrationCutoffPassed after 2026-07-21', () => {
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-07-21' })).toBe(false);
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-07-22' })).toBe(true);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- selectors`
Expected: FAIL on `registrationCutoffPassed after 2026-07-21` — `2026-07-21` currently evaluates `false` (passes), but `2026-07-22` is still `<= 2026-08-06`, so it also returns `false` instead of the expected `true`.

- [ ] **Step 3: Update the constant**

Edit `src/lib/mock-state/initial.ts` line 8:

```ts
export const REGISTRATION_CUTOFF = '2026-07-21';
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- selectors`
Expected: PASS for all selector tests, including the new boundary.

- [ ] **Step 5: Commit**

```bash
git add tests/mock-state/selectors.test.ts src/lib/mock-state/initial.ts
git commit -m "feat: shorten registration cutoff from Aug 6 to Jul 21 (14d)"
```

---

## Task 2: Add `daysUntilCutoff` Selector (TDD)

**Files:**
- Modify: `tests/mock-state/selectors.test.ts` (append new describe block)
- Modify: `src/lib/mock-state/selectors.ts`
- Modify: `src/lib/mock-state/index.ts`

- [ ] **Step 1: Add failing test for the new selector**

In `tests/mock-state/selectors.test.ts`, add to the import block:

```ts
import {
  isQualifiedForUsdt,
  daysUntilEnd,
  daysUntilCutoff,
  bannerType,
  surveyTrackOpen,
  tradingTrackOpen,
  registrationCutoffPassed,
  effectiveIcxPayout,
} from '@/lib/mock-state/selectors';
```

Add a new test after the existing `registrationCutoffPassed` test:

```ts
  it('daysUntilCutoff counts days to 2026-07-21', () => {
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-08' })).toBe(13);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-14' })).toBe(7);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-21' })).toBe(0);
    expect(daysUntilCutoff({ ...initialState, simulatedDate: '2026-07-22' })).toBe(-1);
  });
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- selectors`
Expected: FAIL with `daysUntilCutoff is not exported` (or compile error in test).

- [ ] **Step 3: Add the selector**

In `src/lib/mock-state/selectors.ts`, just after `daysUntilEnd` (around line 24–26), add:

```ts
export function daysUntilCutoff(s: MockState): number {
  return diffDays(REGISTRATION_CUTOFF, s.simulatedDate);
}
```

- [ ] **Step 4: Re-export from the barrel**

In `src/lib/mock-state/index.ts` line 4, the line `export * from './selectors';` already re-exports everything from selectors — no change needed. Verify by reading the file.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- selectors`
Expected: PASS.

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/mock-state/selectors.ts tests/mock-state/selectors.test.ts
git commit -m "feat: add daysUntilCutoff selector for post-event countdown"
```

---

## Task 3: Export `shortDate` Helper

**Files:**
- Modify: `src/content/en.ts:1`

- [ ] **Step 1: Make `shortDate` exportable**

Edit `src/content/en.ts` line 1:

```ts
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
```

Only change: add `export` keyword. No other edits in this task.

- [ ] **Step 2: Verify nothing breaks**

Run: `npm run typecheck`
Expected: no errors.

Run: `npm test`
Expected: all tests pass (this is a non-breaking widening of visibility).

- [ ] **Step 3: Commit**

```bash
git add src/content/en.ts
git commit -m "refactor: export shortDate helper for cross-module reuse"
```

---

## Task 4: Replace "Aug 6" Hardcoded Strings in HubExpired

**Files:**
- Modify: `src/components/hub/HubExpired.tsx`

- [ ] **Step 1: Wire `shortDate` + `REGISTRATION_CUTOFF` into HubExpired**

Edit `src/components/hub/HubExpired.tsx`. Replace lines 1–6 (imports + comment):

```tsx
'use client';

import { HubHeader } from './HubHeader';
import { useMockState, isQualifiedForUsdt, REGISTRATION_CUTOFF } from '@/lib/mock-state';
import { shortDate } from '@/content/en';

/** V2 Hub — Expired (past registration cutoff with un-registered rewards). */
```

Then derive the date once inside the component (replace line 9):

```tsx
export function HubExpired() {
  const { state } = useMockState();
  const slot = state.userSlotNumber ?? Math.max(1, 500 - state.slotsRemaining);
  const cutoffLabel = shortDate(REGISTRATION_CUTOFF); // e.g. "Jul 21"
```

Replace the four hardcoded date strings:

- Line 17 — `note: \`Slot #${slot} secured · Aug 6 cutoff missed\`,` →
  ```tsx
  note: `Slot #${slot} secured · ${cutoffLabel} cutoff missed`,
  ```

- Line 25 — `note: 'Survey completed · Aug 6 cutoff missed',` →
  ```tsx
  note: `Survey completed · ${cutoffLabel} cutoff missed`,
  ```

- Line 34 — `<p className="upper-label text-text-tertiary">EXPIRED · AUG 6</p>` →
  ```tsx
  <p className="upper-label text-text-tertiary">EXPIRED · {cutoffLabel.toUpperCase()}</p>
  ```

- Line 47 — `Your reward expired because no receiving info was registered before Aug 6, 2026.` →
  ```tsx
  Your reward expired because no receiving info was registered before {cutoffLabel}, 2026.
  ```

- [ ] **Step 2: Run typecheck + tests**

Run: `npm run typecheck && npm test`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/hub/HubExpired.tsx
git commit -m "refactor: derive cutoff date in HubExpired from REGISTRATION_CUTOFF"
```

---

## Task 5: Update Debug TimeSection Preset

**Files:**
- Modify: `src/components/debug/TimeSection.tsx:12`

- [ ] **Step 1: Replace the preset**

Edit `src/components/debug/TimeSection.tsx` line 12, in the `JUMPS` array:

```ts
  { label: '14d-cutoff',    date: '2026-07-22' },
```

(Label `14d-cutoff` and date `2026-07-22` — one day past the new cutoff so toggling lands in the expired state.)

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/debug/TimeSection.tsx
git commit -m "chore(debug): update time preset to 14d-cutoff"
```

---

## Task 6: Clean Up Stale Comment in selectors.ts

**Files:**
- Modify: `src/lib/mock-state/selectors.ts:52`

- [ ] **Step 1: Replace the comment**

Edit `src/lib/mock-state/selectors.ts` line 52:

```ts
  // Expired: past registration cutoff with at least one unredeemed reward.
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/mock-state/selectors.ts
git commit -m "chore: remove hardcoded date from selectors comment"
```

---

## Task 7: Remove NPS Modal — Delete Files

**Files:**
- Delete: `src/components/modals/NpsModal.tsx`
- Delete: `src/components/modals/ModalRoot.tsx`
- Delete: `src/lib/modalPriority.ts`

- [ ] **Step 1: Delete the three files**

```bash
rm src/components/modals/NpsModal.tsx
rm src/components/modals/ModalRoot.tsx
rm src/lib/modalPriority.ts
```

- [ ] **Step 2: Verify nothing references the deleted files yet**

Run: `npm run typecheck`
Expected: FAIL — `app/page.tsx` still imports `ModalRoot`, and `types.ts` still has `npsModal` in `DismissedFlags`, and `en.ts` still has `modal.nps`. The next tasks fix each call site. (Do not commit yet.)

---

## Task 8: Remove `ModalRoot` Render from page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Delete the import and render**

Edit `src/app/page.tsx`. Remove line 7:

```tsx
import { ModalRoot } from '@/components/modals/ModalRoot';
```

Remove line 38 (`<ModalRoot />`) so the return becomes:

```tsx
  return (
    <>
      <TopBanner variant={bannerType(state)} />
      <div id="main-content">
        {closed ? (
          <>
            <EventClosed
              onRegisterUsdt={() => setClosedOpen('usdt')}
              onRegisterIcx={() => setClosedOpen('icx')}
            />
            {closedOpen === 'usdt' && (
              <UsdtRegistrationModal onClose={() => setClosedOpen(null)} />
            )}
            {closedOpen === 'icx' && (
              <IcxRegistrationModal onClose={() => setClosedOpen(null)} />
            )}
          </>
        ) : (
          <Hub />
        )}
      </div>
    </>
  );
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: still failing — types.ts and en.ts still reference NPS bits. Continue.

---

## Task 9: Remove `npsModal` from DismissedFlags Type

**Files:**
- Modify: `src/lib/mock-state/types.ts:29`

- [ ] **Step 1: Delete the line**

Edit `src/lib/mock-state/types.ts`. The current block (lines 27–31):

```ts
export type DismissedFlags = {
  welcomeCard?: boolean;
  npsModal?: boolean;
  surveyCompleteSeen?: boolean;
};
```

becomes:

```ts
export type DismissedFlags = {
  welcomeCard?: boolean;
  surveyCompleteSeen?: boolean;
};
```

- [ ] **Step 2: Update reducer test fixture**

Edit `tests/mock-state/reducer.test.ts` line 63 — replace the fixture so the test still covers "multiple flags cleared":

```ts
    const dirty = { ...initialState, dismissedFlags: { welcomeCard: true, surveyCompleteSeen: true } };
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm test`
Expected: typecheck still fails because `en.ts` still has `modal.nps`. Tests pass. Continue.

---

## Task 10: Remove `modal.nps` from en.ts

**Files:**
- Modify: `src/content/en.ts:102-106`

- [ ] **Step 1: Delete the nps block**

Edit `src/content/en.ts`. Remove lines 102–106 (the `nps:` entry inside `modal:`):

```ts
    nps: {
      title: 'One last question',
      body: 'How likely are you to recommend Supercycl to a friend?',
      registerReminder: 'Don’t forget to register your reward info before the cutoff.',
    },
```

After removal, the `modal` object ends with `icx: { ... }` then `terms: { ... }`. Verify the closing brace of `modal` is balanced.

- [ ] **Step 2: Run full check**

Run: `npm run typecheck && npm test`
Expected: typecheck passes. All tests pass.

- [ ] **Step 3: Commit the NPS removal as one logical change**

```bash
git add src/components/modals/NpsModal.tsx src/components/modals/ModalRoot.tsx src/lib/modalPriority.ts src/app/page.tsx src/lib/mock-state/types.ts tests/mock-state/reducer.test.ts src/content/en.ts
git commit -m "refactor: remove post-event NPS modal and its plumbing"
```

(Note: deleted files are picked up by `git add` of the directory paths because git tracks deletions when staged.)

---

## Task 11: Add EventClosed Copy Keys to en.ts

**Files:**
- Modify: `src/content/en.ts`

- [ ] **Step 1: Add an `eventClosed` block before `hub`**

Edit `src/content/en.ts`. After the closing brace of `modal:` (and before `hub:`), insert:

```ts
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
      traders: 'traders',
      surveys: 'surveys',
      volume: 'volume',
    },
    openApp: 'Open Supercycl app',
  },
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/content/en.ts
git commit -m "content: add EventClosed page copy keys"
```

---

## Task 12: Write Failing Tests for the New EventClosed (TDD)

**Files:**
- Create: `tests/components/EventClosed.test.tsx`

- [ ] **Step 1: Create the test file**

Write the entire file `tests/components/EventClosed.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventClosed } from '@/components/EventClosed';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState>) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

const noop = () => {};

describe('EventClosed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('always renders the hero and recap (logged out user, after event end)', () => {
    mockUseStateWith({
      authStatus: 'logged_out',
      simulatedDate: '2026-07-08',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/Thanks for/i)).toBeInTheDocument();
    expect(screen.getByText(/riding with us/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Supercycl app/i)).toBeInTheDocument();
  });

  it('hides the reward card when the user has no unredeemed rewards', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 0,
      surveyCompleted: false,
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('hides the reward card when the user is logged out (even if state would qualify)', () => {
    mockUseStateWith({
      authStatus: 'logged_out',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('shows USDT reward card with countdown when USDT registration is pending and cutoff not passed', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-14', // D-7
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/YOUR REWARD IS WAITING/i)).toBeInTheDocument();
    expect(screen.getByText(/20 USDT/i)).toBeInTheDocument();
    expect(screen.getByText(/D-7/i)).toBeInTheDocument();
    expect(screen.getByText(/Jul 21/i)).toBeInTheDocument();
  });

  it('calls onRegisterUsdt when CTA clicked for USDT-priority case', () => {
    const onRegisterUsdt = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={onRegisterUsdt} onRegisterIcx={noop} />);
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterUsdt).toHaveBeenCalledTimes(1);
  });

  it('shows ICX reward card when only ICX needs registration', () => {
    const onRegisterIcx = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      surveyCompleted: true,
      isTrader: true,
      icxAddress: null,
      icxPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={onRegisterIcx} />);
    expect(screen.getByText(/YOUR REWARD IS WAITING/i)).toBeInTheDocument();
    expect(screen.getByText(/100 ICX/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterIcx).toHaveBeenCalledTimes(1);
  });

  it('prefers USDT over ICX when both need registration', () => {
    const onRegisterUsdt = vi.fn();
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-08',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: '수령 정보 미등록',
      surveyCompleted: true,
      isTrader: true,
      icxAddress: null,
      icxPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={onRegisterUsdt} onRegisterIcx={vi.fn()} />);
    expect(screen.getByText(/20 USDT/i)).toBeInTheDocument();
    expect(screen.queryByText(/100 ICX/i)).not.toBeInTheDocument();
    screen.getByRole('button', { name: /Register wallet/i }).click();
    expect(onRegisterUsdt).toHaveBeenCalledTimes(1);
  });

  it('hides the reward card after registration cutoff passes (Jul 22)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-22',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.queryByText(/YOUR REWARD IS WAITING/i)).not.toBeInTheDocument();
  });

  it('shows D-0 on the cutoff date itself (Jul 21)', () => {
    mockUseStateWith({
      authStatus: 'logged_in',
      simulatedDate: '2026-07-21',
      tradingVolume: 500,
      hasOkxLinked: true,
      usdtRegistration: { status: 'none' },
      usdtPayoutStatus: '수령 정보 미등록',
    });
    render(<EventClosed onRegisterUsdt={noop} onRegisterIcx={noop} />);
    expect(screen.getByText(/D-0/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- EventClosed`
Expected: most tests FAIL — the current `EventClosed.tsx` renders different copy (`"That's a wrap"`, `Aug 6`, `D-29`), has no `Register wallet` button label, and doesn't honor `authStatus` gating. These failures define the rewrite target.

---

## Task 13: Rewrite EventClosed.tsx to Pass the Tests

**Files:**
- Modify: `src/components/EventClosed.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire file**

Write `src/components/EventClosed.tsx`:

```tsx
'use client';

import {
  useMockState,
  isQualifiedForUsdt,
  daysUntilCutoff,
  registrationCutoffPassed,
  effectiveIcxPayout,
  REGISTRATION_CUTOFF,
} from '@/lib/mock-state';
import { en, shortDate } from '@/content/en';

type Props = { onRegisterUsdt: () => void; onRegisterIcx: () => void };

/**
 * Post-campaign goodbye page. Renders a minimal "thanks for riding with us"
 * hero for every visitor, plus a conditional reward card that only appears
 * while a logged-in user still has an unredeemed reward inside the 14-day
 * registration window.
 */
export function EventClosed({ onRegisterUsdt, onRegisterIcx }: Props) {
  const { state } = useMockState();
  const cutoffLabel = shortDate(REGISTRATION_CUTOFF);

  const needsUsdt =
    state.authStatus === 'logged_in' &&
    isQualifiedForUsdt(state) &&
    state.usdtRegistration.status === 'none' &&
    state.usdtPayoutStatus !== '완료';

  const needsIcx =
    state.authStatus === 'logged_in' &&
    state.surveyCompleted &&
    !state.icxAddress &&
    state.icxPayoutStatus !== '완료';

  const showCard =
    !registrationCutoffPassed(state) && (needsUsdt || needsIcx);

  // USDT takes priority when both need registration.
  const cardKind: 'usdt' | 'icx' | null = needsUsdt ? 'usdt' : needsIcx ? 'icx' : null;
  const days = daysUntilCutoff(state);

  const icxAmount = effectiveIcxPayout(state).amount;
  const cardAmount =
    cardKind === 'usdt' ? '20 USDT' : icxAmount != null ? `${icxAmount} ICX` : 'Bonus ICX';
  const onCardClick = cardKind === 'usdt' ? onRegisterUsdt : onRegisterIcx;

  return (
    <main className="relative" style={{ paddingBottom: 32 }}>
      <div
        aria-hidden
        className="aura aura-accent"
        style={{ top: -80, right: -60, width: 260, height: 260 }}
      />
      <div
        aria-hidden
        className="aura aura-cyan"
        style={{ top: 200, left: -100, width: 220, height: 220 }}
      />

      <section className="relative mx-auto max-w-6xl px-6 py-2xl text-center">
        <p className="upper-label text-text-tertiary">{en.eventClosed.eyebrow}</p>
        <h1
          className="mt-md font-bold"
          style={{ fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em' }}
        >
          {en.eventClosed.titleLine1}
          <br />
          <span className="accent-text">{en.eventClosed.titleLine2}</span>
        </h1>
        <p className="mt-md text-body-md text-text-secondary-strong">
          {en.eventClosed.subtitle}
        </p>
      </section>

      {showCard && cardKind && (
        <section className="relative mx-auto max-w-6xl px-6 py-md">
          <div
            className="card-elevated relative overflow-hidden text-center"
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, rgba(255,167,38,0.10), transparent)',
              border: '1px solid var(--warning-border)',
            }}
          >
            <p className="upper-label text-warning" style={{ fontSize: 11 }}>
              {en.eventClosed.rewardLabel}
            </p>
            <p
              className="mt-sm font-bold"
              style={{ fontSize: 26, lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {cardAmount}
            </p>
            <p
              className="mt-sm text-body-sm"
              style={{ color: 'rgba(255,167,38,0.85)' }}
            >
              {en.eventClosed.countdownExpires(days, cutoffLabel)}
            </p>
            <button
              type="button"
              onClick={onCardClick}
              className="btn-primary-sm mt-md"
            >
              {en.eventClosed.registerCta} →
            </button>
          </div>
        </section>
      )}

      <section
        className="relative mx-auto max-w-6xl px-6 py-md"
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>527</div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.traders}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>738</div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.surveys}
            </p>
          </div>
          <div>
            <div className="tabnum font-bold" style={{ fontSize: 18, lineHeight: 1 }}>$1.2M</div>
            <p className="upper-label text-text-tertiary mt-xs" style={{ fontSize: 10 }}>
              {en.eventClosed.recap.volume}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-md">
        <a
          href="https://supercycl-mobile.vercel.app"
          className="btn-secondary w-full"
        >
          {en.eventClosed.openApp} →
        </a>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Run the EventClosed tests**

Run: `npm test -- EventClosed`
Expected: all 9 tests pass.

- [ ] **Step 3: Run the full suite + typecheck**

Run: `npm run typecheck && npm test`
Expected: all tests pass, no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/EventClosed.tsx tests/components/EventClosed.test.tsx
git commit -m "feat(event-closed): minimal goodbye page with conditional reward CTA"
```

---

## Task 14: Manual Verification

**Files:**
- None — interactive validation only.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` (or next free port).

- [ ] **Step 2: Walk through Debug TimeSection presets**

Open the page, expose the Debug panel, and step through each state below. For each, confirm what should and shouldn't appear.

| Preset (Debug) | Date | Auth | Trading / Survey state | Reward card? | Countdown |
|----------------|------|------|------------------------|--------------|-----------|
| `End` | 2026-07-07 | logged_in | not qualified | hidden | — |
| `End` | 2026-07-07 | logged_in | $500 + OKX, USDT none | shown — USDT | "D-14 … Jul 21" |
| Pick date manually | 2026-07-14 | logged_in | $500 + OKX, USDT none | shown — USDT | "D-7 … Jul 21" |
| Pick date manually | 2026-07-21 | logged_in | $500 + OKX, USDT none | shown — USDT | "D-0 … Jul 21" |
| `14d-cutoff` | 2026-07-22 | logged_in | $500 + OKX, USDT none | hidden | — |
| `End` | 2026-07-07 | logged_in | survey done, no ICX addr | shown — ICX | "D-14 … Jul 21" |
| `End` | 2026-07-07 | logged_out | n/a | hidden | — |
| `End` | 2026-07-07 | logged_in | both paid (status `완료`) | hidden | — |

- [ ] **Step 3: Confirm no auto-modal opens after Jul 7**

From any post-event preset (`End`, `14d-cutoff`), confirm no NPS modal pops up on load. Refresh the page once with `End` set to be sure.

- [ ] **Step 4: Click "Register wallet" → verify modal opens**

With `End` preset + USDT-qualified-unregistered state, click `Register wallet →`. The `UsdtRegistrationModal` should open. Close it. Repeat with ICX-only state — `IcxRegistrationModal` should open.

- [ ] **Step 5: Stop the dev server**

`Ctrl+C` in the terminal.

- [ ] **Step 6 (only if regressions found): file follow-ups, do not commit fixes here**

If anything diverges from the table above, note it and address as a separate task. This task is verification only — no code changes commit here.

---

## Self-Review (Performed Before Handoff)

**Spec coverage:**
- Page redesign (single layout, hero/card/recap/CTA) → Task 13 ✓
- Cutoff change 30d → 14d → Task 1 ✓
- All `Aug 6` / `D-29` references derived from constant → Tasks 1, 4, 5 ✓
- NPS modal removal end-to-end (component, ModalRoot, modalPriority, type, copy, test fixture, page wiring) → Tasks 7, 8, 9, 10 ✓
- `selectors.test.ts` boundary update → Task 1 ✓
- TimeSection preset → Task 5 ✓
- YAGNI items (no i18n work, no "✓ Registered" status card, no archive mode) → Honored in Task 13 implementation ✓
- Test plan items (boundary, manual presets, no auto-modal) → Tasks 1, 14 ✓

**Type consistency:**
- `daysUntilCutoff` introduced in Task 2, consumed in Task 13 ✓
- `shortDate` exported in Task 3, consumed in Tasks 4 and 13 ✓
- `REGISTRATION_CUTOFF` already re-exported from `mock-state/index.ts` (Task 2 verifies) ✓
- `en.eventClosed.*` keys added in Task 11 match consumption in Task 13 ✓
