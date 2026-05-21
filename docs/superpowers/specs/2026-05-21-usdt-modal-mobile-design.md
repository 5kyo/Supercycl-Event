# USDT Registration Modal — Default Method & Mobile Readability

**Status:** Approved · 2026-05-21
**Scope:** `UsdtRegistrationModal` + `UsdtRegistrationForm` + matching strings in `en.usdt`
**Out of scope:** ICX modal, inline (non-modal) USDT registration card

## Goals

1. Open the modal with **OKX exchange** pre-selected as the receiving method (currently defaults to TRC20 wallet).
2. Reduce visual density of the modal — particularly on mobile — across four trouble areas: title, header card, method tabs, TRC20 warning + checkbox, terms checkbox.

## Non-Goals

- Adding a "remember my last choice" preference. Default is a fixed initial value.
- Responsive (mobile-only) variants. Changes apply to both mobile and desktop for simplicity.
- Restructuring the form's submit/validation contract. `SET_USDT_REGISTRATION` + `SET_USDT_PAYOUT_STATUS('대기')` dispatch behaviour is unchanged.
- Touching the ICX registration modal in this change (may follow as a separate spec).

## Design Changes

### 1. Modal title

| Before | After |
|---|---|
| `How would you like to receive 20 USDT?` (wraps to 2 lines on mobile) | `Receive 20 USDT` (single line) |

String key: `en.modal.usdt.title`.

### 2. Header card → slot chip

The current large header card contains three pieces of information that overlap with content already visible elsewhere:
- A "🎉 SLOT #1 / 500 SECURED" badge
- A subtitle "Tell us where to send it."
- A large "20 USDT" amount on the right

Two of these duplicate the modal title (which already contains `20 USDT`) and the form below (which is self-explanatory).

**Replace the entire card** with a single accent-coloured chip placed directly under the title:

```
🎉 Slot #1 / 500 secured
```

- Chip styling: small pill, `accent` text colour, soft accent background — same visual language as the existing badge but without the card frame, subtitle, or right-side amount.
- Remove the `20 USDT` amount block and "Tell us where to send it." subtitle entirely.

### 3. Method tabs — one-line labels

| Tab | Before | After |
|---|---|---|
| Wallet | `Receive to TRC20 wallet` | `TRC20 wallet` |
| Exchange | `Receive to exchange balance` | `OKX exchange` |

String keys: `en.modal.usdt.methodWallet`, `en.modal.usdt.methodExchange`.

Both labels fit on a single line at mobile widths. Tab control structure (radiogroup, two equal-width buttons, accent gradient on selected) is unchanged.

### 4. Default selection

`useState<'wallet' | 'exchange'>('wallet')` → `useState<'wallet' | 'exchange'>('exchange')` in `UsdtRegistrationForm`.

On open, the **OKX exchange** tab is highlighted and the OKX UID + email fields are shown by default. Users tap **TRC20 wallet** to switch.

### 5. TRC20 warning + network checkbox — consolidate

The wallet flow currently shows:
- A large orange warning box: `Sending to a non-TRC20 network may result in loss of funds. Double-check the network.`
- A separate checkbox: `I have confirmed the network`

**Replace** with a single checkbox whose label conveys what the user is confirming, plus a small inline warning underneath:

```
☐  I confirmed this is a TRC20 address
   ⚠ Wrong network = lost funds
```

- Remove the bordered orange warning box entirely.
- Checkbox label (`en.modal.usdt.networkCheck`): `I confirmed this is a TRC20 address`
- Inline helper (new string, e.g. `en.modal.usdt.networkHelper`): `Wrong network = lost funds` (rendered in warning colour, no box, no border, sits as a small line directly under the checkbox label).
- `en.modal.usdt.trc20Warning` string is no longer rendered. Either delete it from `en.ts` or repurpose its key for the new helper — implementation plan to decide.
- Validation contract unchanged: `validateTermsAgreement({ ..., requireNetwork: true })` for wallet flow still requires this checkbox to be ticked.

### 6. Exchange flow — drop redundant "Exchange: OKX" line

The exchange flow currently shows `Exchange: OKX` (`en.modal.usdt.exchangeFixed`) as a small line above the OKX UID field. With the tab itself labelled "OKX exchange" and the next field labelled "OKX UID", this line is fully redundant.

**Remove** the `exchangeFixed` rendering from the form. The `en.modal.usdt.exchangeFixed` string can be deleted from `en.ts`.

### 7. Terms checkbox — inline "View terms" link

| Before | After |
|---|---|
| `I agree to the event terms and privacy policy` *(next line)* `View terms` | `I agree to the event terms and privacy policy (View terms)` |

- Move the `View terms` link inside the checkbox label, inside parentheses, retaining the accent-coloured underlined link behaviour.
- Strings are unchanged (`en.modal.usdt.termsCheck`, `en.cta.viewTerms`) — only the JSX layout changes from two stacked elements to a single inline line.

## Affected Files

| File | Change |
|---|---|
| `src/components/modals/UsdtRegistrationModal.tsx` | Remove header card markup; render slot-chip directly above the form. |
| `src/components/hub/UsdtRegistrationForm.tsx` | Change default `method` to `'exchange'`; remove orange warning box; update network-checkbox label + add small inline helper; drop `exchangeFixed` line from exchange flow; inline `View terms` link inside terms checkbox. |
| `src/content/en.ts` | Update `modal.usdt.title`, `methodWallet`, `methodExchange`, `networkCheck`. Replace `trc20Warning` value with the shorter "Wrong network = lost funds" copy (or rename to `networkHelper`). Delete `exchangeFixed`. |

## Visual Effect (Mobile, approximate)

**Before:** ~10 vertical regions of dense text (title 2L, header card 3L, tabs 2L×2, address label + helper, input, warning box 3L, network checkbox 1L, terms checkbox 2L, buttons).

**After:** ~7 vertical regions, mostly single-line (title 1L, slot chip 1L, tabs 1L, OKX UID label + input, OKX email label + input, terms checkbox 1–2L, buttons). Exchange flow being the default means the warning + network checkbox don't appear at all on first view.

## Risks / Notes

- "OKX exchange" tab label specifies the exchange name where the previous "Receive to exchange balance" was generic. OKX is the only supported exchange today, so naming it on the tab is fine and lets the redundant `exchangeFixed` line be dropped (see §6). If more exchanges are added later, the tab label and §6 will need to be revisited together.
- Changing the default to exchange means users who actually want a TRC20 wallet payout must tap to switch. Acceptable since both flows are equally surfaced and the chip-based header keeps both tabs visible above the fold.
- The inline `View terms` link inside a `<label>` requires care: the `<button>` for "View terms" must `stopPropagation` so clicking it doesn't also toggle the checkbox. Current implementation already uses a `<button>` nested in `<label><span>` — verify behaviour holds after the layout change.
