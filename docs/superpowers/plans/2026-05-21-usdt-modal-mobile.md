# USDT Modal — Default & Mobile Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `OKX exchange` the default receiving method and reduce the visual density of the USDT registration modal (title, header, tabs, TRC20 warning, exchange subtitle, terms link).

**Architecture:** Pure UI change. Files touched: `src/content/en.ts` (string updates), `src/components/modals/UsdtRegistrationModal.tsx` (header card → slot chip), `src/components/hub/UsdtRegistrationForm.tsx` (default method, warning consolidation, drop `exchangeFixed`, inline View terms). New tests live in `tests/components/UsdtRegistrationModal.test.tsx`. State contract (`SET_USDT_REGISTRATION`, `SET_USDT_PAYOUT_STATUS('대기')`, `validateTermsAgreement`) is unchanged.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind, Vitest + @testing-library/react, jsdom.

**Spec:** `docs/superpowers/specs/2026-05-21-usdt-modal-mobile-design.md`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/content/en.ts` | All user-visible USDT modal strings. |
| `src/components/modals/UsdtRegistrationModal.tsx` | Modal frame + slot chip + form mount. |
| `src/components/hub/UsdtRegistrationForm.tsx` | Method tabs, wallet/exchange field sets, checkboxes, submit. |
| `tests/components/UsdtRegistrationModal.test.tsx` | New file — covers title, slot chip, tab labels, default tab, wallet flow (warning + checkbox), exchange flow (no `Exchange: OKX` line), inline View terms. |

All changes are co-located; no new shared components.

---

## Common test scaffolding (used by every task that adds a test)

Tests mock `useMockState` exactly the way `tests/components/IcxRewardCard.surveyCta.test.tsx` does — fully controlled state, no provider hydration. The helper below is local to the test file.

```ts
// tests/components/UsdtRegistrationModal.test.tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import * as mockState from '@/lib/mock-state';
import type { MockState } from '@/lib/mock-state';

function mockUseStateWith(overrides: Partial<MockState> = {}) {
  const state: MockState = { ...mockState.initialState, ...overrides };
  vi.spyOn(mockState, 'useMockState').mockReturnValue({
    state,
    dispatch: vi.fn(),
  });
}

const noop = () => {};

afterEach(() => {
  vi.restoreAllMocks();
});
```

Each task below appends its own `describe` block and `it(...)` cases to this file. Don't re-create the imports/helpers between tasks — assume they are already at the top of the file from Task 1.

---

## Task 1: Modal title — "Receive 20 USDT"

**Files:**
- Create: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/content/en.ts` (key `modal.usdt.title`)

- [ ] **Step 1: Create the test file with the scaffolding above, then add the failing test**

```ts
// Append below the scaffolding shown in "Common test scaffolding"

describe('UsdtRegistrationModal — title', () => {
  it('renders the shortened title "Receive 20 USDT"', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(
      screen.getByRole('heading', { name: /^Receive 20 USDT$/i })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — title still contains "How would you like to receive 20 USDT?".

- [ ] **Step 3: Update the title string**

In `src/content/en.ts`, change the value of `modal.usdt.title`:

```ts
usdt: {
  title: 'Receive 20 USDT',
  // ... other keys unchanged
},
```

- [ ] **Step 4: Run test — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/en.ts tests/components/UsdtRegistrationModal.test.tsx
git commit -m "feat(usdt-modal): shorten title to 'Receive 20 USDT'"
```

---

## Task 2: Header card → slot chip

Replace the large header card (slot badge + subtitle + big "20 USDT") with a single accent chip rendered directly under the modal title.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx` (append cases)
- Modify: `src/components/modals/UsdtRegistrationModal.tsx`

- [ ] **Step 1: Add failing tests**

Append to `tests/components/UsdtRegistrationModal.test.tsx`:

```ts
describe('UsdtRegistrationModal — slot chip', () => {
  it('renders the slot chip "Slot #1 / 500 secured"', () => {
    mockUseStateWith({ slotsRemaining: 500 });
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByText(/Slot #1 \/ 500 secured/i)).toBeInTheDocument();
  });

  it('does not render the old subtitle or large "20 USDT" amount', () => {
    mockUseStateWith({ slotsRemaining: 500 });
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.queryByText(/Tell us where to send it/i)).not.toBeInTheDocument();
    // The number "20" appearing solo (large amount block) should be gone.
    // We assert by checking there is no element whose text is exactly "20".
    expect(screen.queryByText(/^20$/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL on both new cases (subtitle + solo "20" still present).

- [ ] **Step 3: Rewrite the modal body**

Replace the contents of `src/components/modals/UsdtRegistrationModal.tsx` with:

```tsx
'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { UsdtRegistrationForm } from '@/components/hub/UsdtRegistrationForm';

/**
 * UsdtRegistrationModal — modal wrapper around the shared
 * `UsdtRegistrationForm`. Opened from the "Register USDT info" CTA inside
 * `UsdtRewardCard` (default Hub) and from `EventClosed` after the campaign
 * ends. The form dispatches `SET_USDT_REGISTRATION` and
 * `SET_USDT_PAYOUT_STATUS('대기')` on submit.
 */
export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { state } = useMockState();
  const slotNumber = Math.max(1, 500 - state.slotsRemaining);

  return (
    <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
      <p
        className="mb-lg inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm uppercase tracking-[0.18em] text-accent"
        style={{
          background: 'rgba(0,230,118,0.12)',
          border: '1px solid var(--accent-border-soft)',
        }}
      >
        🎉 Slot #{slotNumber} / 500 secured
      </p>

      <UsdtRegistrationForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS on the two new chip cases and the Task 1 title case.

- [ ] **Step 5: Commit**

```bash
git add src/components/modals/UsdtRegistrationModal.tsx tests/components/UsdtRegistrationModal.test.tsx
git commit -m "refactor(usdt-modal): replace header card with slim slot chip"
```

---

## Task 3: Method tab labels — one-liners

Shorten `Receive to TRC20 wallet` → `TRC20 wallet` and `Receive to exchange balance` → `OKX exchange`.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/content/en.ts`

- [ ] **Step 1: Add failing tests**

Append:

```ts
describe('UsdtRegistrationModal — method tab labels', () => {
  it('renders short tab labels "TRC20 wallet" and "OKX exchange"', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByRole('radio', { name: 'TRC20 wallet' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'OKX exchange' })).toBeInTheDocument();
  });

  it('does not render the old long tab labels', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(
      screen.queryByRole('radio', { name: /Receive to TRC20 wallet/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: /Receive to exchange balance/i })
    ).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — current strings are still the long form.

- [ ] **Step 3: Update strings**

In `src/content/en.ts`, change two values under `modal.usdt`:

```ts
methodWallet: 'TRC20 wallet',
methodExchange: 'OKX exchange',
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/en.ts tests/components/UsdtRegistrationModal.test.tsx
git commit -m "feat(usdt-modal): shorten method tab labels to one line"
```

---

## Task 4: Default method = exchange

Change the form's initial `method` state from `'wallet'` to `'exchange'`.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/components/hub/UsdtRegistrationForm.tsx`

- [ ] **Step 1: Add failing tests**

Append:

```ts
describe('UsdtRegistrationModal — default method', () => {
  it('selects "OKX exchange" by default on open', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    const exchangeTab = screen.getByRole('radio', { name: 'OKX exchange' });
    const walletTab = screen.getByRole('radio', { name: 'TRC20 wallet' });
    expect(exchangeTab).toHaveAttribute('aria-checked', 'true');
    expect(walletTab).toHaveAttribute('aria-checked', 'false');
  });

  it('shows OKX UID + email fields on initial open (exchange flow visible)', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.getByText('OKX UID')).toBeInTheDocument();
    expect(screen.getByText('OKX registered email')).toBeInTheDocument();
    expect(screen.queryByText(/TRC20 USDT wallet address/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — wallet tab is currently the default.

- [ ] **Step 3: Change the default**

In `src/components/hub/UsdtRegistrationForm.tsx`, line 34:

```tsx
const [method, setMethod] = useState<'wallet' | 'exchange'>('exchange');
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS on the two new cases.

- [ ] **Step 5: Commit**

```bash
git add src/components/hub/UsdtRegistrationForm.tsx tests/components/UsdtRegistrationModal.test.tsx
git commit -m "feat(usdt-modal): default receiving method to OKX exchange"
```

---

## Task 5: Consolidate TRC20 warning into checkbox + inline helper

Remove the large bordered warning box. Replace with: checkbox labelled "I confirmed this is a TRC20 address" and a small inline warning line "Wrong network = lost funds" underneath.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/content/en.ts`
- Modify: `src/components/hub/UsdtRegistrationForm.tsx`

- [ ] **Step 1: Add failing tests**

Append:

```ts
describe('UsdtRegistrationModal — TRC20 warning consolidation', () => {
  async function openWalletTab() {
    const user = userEvent.setup();
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    await user.click(screen.getByRole('radio', { name: 'TRC20 wallet' }));
    return user;
  }

  it('removes the long orange warning sentence', async () => {
    await openWalletTab();
    expect(
      screen.queryByText(/Sending to a non-TRC20 network may result in loss of funds/i)
    ).not.toBeInTheDocument();
  });

  it('renders the short network checkbox label', async () => {
    await openWalletTab();
    expect(
      screen.getByText('I confirmed this is a TRC20 address')
    ).toBeInTheDocument();
  });

  it('renders the small inline warning helper "Wrong network = lost funds"', async () => {
    await openWalletTab();
    expect(screen.getByText(/Wrong network = lost funds/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — the old warning sentence is still present, the new copy is not.

- [ ] **Step 3: Update string values in `src/content/en.ts`**

Under `modal.usdt`, change two values and keep `trc20Warning` as the helper key (repurposed):

```ts
networkCheck: 'I confirmed this is a TRC20 address',
trc20Warning: 'Wrong network = lost funds',
```

(Key name `trc20Warning` is retained for diff minimalism; the value is the new short helper copy.)

- [ ] **Step 4: Rewrite ONLY the wallet branch in `UsdtRegistrationForm.tsx`**

The file currently has a ternary `{method === 'wallet' ? (<wallet-jsx>) : (<exchange-jsx>)}`. Replace **only the wallet-jsx** (the contents between the `(` and the `)` after `?`, currently spanning lines ~119-161 — from the opening `<div className="flex flex-col gap-md">` through its closing `</div>` just before `) : (`). Do not touch the `: (...)` exchange branch — Task 6 modifies that next.

New wallet-jsx (replaces the existing wallet-branch contents in-place):

```tsx
<div className="flex flex-col gap-md">
  <label className="flex flex-col gap-xs">
    <span className="flex justify-between text-label-lg text-text-secondary">
      {en.modal.usdt.trc20Label}
      <span className="font-mono text-body-sm tracking-[0.08em] text-text-tertiary">
        STARTS WITH T
      </span>
    </span>
    <input
      aria-invalid={!!errors.trc20}
      aria-describedby={errors.trc20 ? 'err-trc20' : undefined}
      value={trc20}
      onChange={(e) => setTrc20(e.target.value)}
      className="input"
      placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    />
    {errors.trc20 && (
      <span id="err-trc20" className="text-body-sm text-sell">
        {errors.trc20}
      </span>
    )}
  </label>
  <div className="flex flex-col gap-1">
    <label className="flex items-start gap-sm text-body-md">
      <input
        type="checkbox"
        checked={networkOk}
        onChange={(e) => setNetworkOk(e.target.checked)}
        className="mt-1 accent-accent"
      />
      <span>{en.modal.usdt.networkCheck}</span>
    </label>
    <p className="pl-7 text-body-sm" style={{ color: 'var(--warning)' }}>
      ⚠ {en.modal.usdt.trc20Warning}
    </p>
  </div>
</div>
```

Versus the current wallet-jsx:
- The old orange bordered `<div className="rounded-md p-3 text-body-sm" style={{ background: 'rgba(255,167,38,0.10)', ... }}>{en.modal.usdt.trc20Warning}</div>` block is deleted.
- The network checkbox `<label>` is now wrapped together with a small inline helper `<p>` inside a `flex flex-col gap-1` container, so the helper sits visually directly under the checkbox label. The helper uses `pl-7` to left-align past the checkbox itself.

- [ ] **Step 5: Run tests — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS on the three new cases (plus all previous ones still pass).

- [ ] **Step 6: Commit**

```bash
git add src/content/en.ts src/components/hub/UsdtRegistrationForm.tsx tests/components/UsdtRegistrationModal.test.tsx
git commit -m "refactor(usdt-modal): fold TRC20 warning into checkbox label + helper"
```

---

## Task 6: Drop redundant "Exchange: OKX" line

The exchange branch renders `Exchange: OKX` above the OKX UID field. With the tab labelled "OKX exchange" and the next field labelled "OKX UID", this is redundant.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/content/en.ts`
- Modify: `src/components/hub/UsdtRegistrationForm.tsx`

- [ ] **Step 1: Add failing test**

Append:

```ts
describe('UsdtRegistrationModal — exchange flow cleanup', () => {
  it('does not render the "Exchange: OKX" subtitle', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    expect(screen.queryByText(/^Exchange: OKX$/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — "Exchange: OKX" is still rendered (exchange is now default per Task 4).

- [ ] **Step 3: Remove the exchangeFixed rendering**

In `src/components/hub/UsdtRegistrationForm.tsx`, locate the exchange branch and delete the `<p>` line that renders `en.modal.usdt.exchangeFixed`:

```tsx
) : (
  <div className="flex flex-col gap-md">
    {/* DELETE THIS LINE:
        <p className="text-label-lg text-text-secondary">
          {en.modal.usdt.exchangeFixed}
        </p>
    */}
    <label className="flex flex-col gap-xs">
      <span className="text-label-lg text-text-secondary">
        {en.modal.usdt.okxUidLabel}
      </span>
      {/* ...rest of exchange branch unchanged... */}
```

After deletion, the exchange branch starts directly with the OKX UID label.

- [ ] **Step 4: Remove the `exchangeFixed` key from `en.ts`**

In `src/content/en.ts`, delete the line:

```ts
exchangeFixed: 'Exchange: OKX',
```

- [ ] **Step 5: Run tests + typecheck — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS on the new case and all previous.

Run: `npm run typecheck`
Expected: PASS. (Deleting the key would break any consumer; this confirms only the one site referenced it.)

- [ ] **Step 6: Commit**

```bash
git add src/content/en.ts src/components/hub/UsdtRegistrationForm.tsx tests/components/UsdtRegistrationModal.test.tsx
git commit -m "refactor(usdt-modal): drop redundant 'Exchange: OKX' line"
```

---

## Task 7: Inline "View terms" link inside terms checkbox label

Move the `View terms` link from its own line into the terms checkbox label, in parentheses.

**Files:**
- Modify: `tests/components/UsdtRegistrationModal.test.tsx`
- Modify: `src/components/hub/UsdtRegistrationForm.tsx`

- [ ] **Step 1: Add failing test**

Append:

```ts
describe('UsdtRegistrationModal — inline View terms link', () => {
  it('renders View terms inside the terms checkbox label', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    const termsText = screen.getByText(
      /I agree to the event terms and privacy policy/i
    );
    // The "View terms" button is a sibling/descendant of the same <label>.
    const enclosingLabel = termsText.closest('label');
    expect(enclosingLabel).not.toBeNull();
    const viewTermsBtn = screen.getByRole('button', { name: /View terms/i });
    expect(enclosingLabel!.contains(viewTermsBtn)).toBe(true);
  });

  it('renders the link with a leading "(" so it reads inline', () => {
    mockUseStateWith();
    render(<UsdtRegistrationModal onClose={noop} />);
    // Look for the literal "(" character preceding the View terms button.
    expect(screen.getByText(/\(View terms\)/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: FAIL — View terms is currently rendered on its own line under the label, no "(...)" wrapper.

- [ ] **Step 3: Restructure the terms label JSX**

In `src/components/hub/UsdtRegistrationForm.tsx`, replace the existing terms `<label>` (lines ~205-222) with:

```tsx
<label className="mt-lg flex items-start gap-sm text-body-md">
  <input
    type="checkbox"
    checked={termsOk}
    onChange={(e) => setTermsOk(e.target.checked)}
    className="mt-1 accent-accent"
  />
  <span>
    {en.modal.usdt.termsCheck} (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowTerms(true);
      }}
      className="text-accent underline hover:text-accent-light"
    >
      {en.cta.viewTerms}
    </button>
    )
  </span>
</label>
```

Two changes versus the current code:
1. The `(View terms)` button is now inside the same `<span>` as the agreement text, wrapped in literal parentheses.
2. The button's `onClick` calls `e.preventDefault()` + `e.stopPropagation()` so clicking it opens the terms modal without also toggling the parent label's checkbox.

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx vitest run tests/components/UsdtRegistrationModal.test.tsx`
Expected: PASS on the two new cases and all prior cases.

- [ ] **Step 5: Commit**

```bash
git add src/components/hub/UsdtRegistrationForm.tsx tests/components/UsdtRegistrationModal.test.tsx
git commit -m "refactor(usdt-modal): inline View terms link inside terms label"
```

---

## Task 8: Final verification

Run the full quality gates and eyeball the modal in the dev server.

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: PASS for the entire suite (no regressions in existing tests; the new `UsdtRegistrationModal.test.tsx` file has all green cases from Tasks 1–7).

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual smoke (dev server)**

Run: `npm run dev`

Open `http://localhost:3000` in the browser and trigger the USDT registration modal (from the USDT reward card CTA once $500 is "traded" in the mock state, or from `EventClosed` after the campaign window). Visually confirm on a narrow viewport (≤ 390px):

- Title is "Receive 20 USDT" on one line.
- Slot chip ("🎉 Slot #1 / 500 secured") sits as a single line under the title — no large card, no large "20 USDT" amount, no "Tell us where to send it." text.
- Two tabs read "TRC20 wallet" and "OKX exchange" on one line each.
- "OKX exchange" is highlighted on open; OKX UID + email fields are visible.
- Tap "TRC20 wallet": the orange bordered box is gone; the checkbox label reads "I confirmed this is a TRC20 address" with "⚠ Wrong network = lost funds" as a small line below.
- Tap "OKX exchange": no "Exchange: OKX" subtitle above OKX UID.
- Terms line reads "I agree to the event terms and privacy policy (View terms)" with View terms as an inline accent-coloured link. Tapping View terms opens the terms modal without toggling the checkbox.

- [ ] **Step 5: No commit needed if all green**

If steps 1–4 all pass, the work is done — no further commits.

If a step fails: do not patch the failing case with another check — go back to the offending task, write or correct the test that should have caught it, fix the implementation, and commit.
