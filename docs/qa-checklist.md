# QA Checklist — Supercycl Event Page Prototype

Run with `npm run dev`. Use the DebugDrawer (⌘+\ or Ctrl+\) to drive state.

## Landing (logged_out)
- [ ] Mobile (Viewport=mobile-390): single-column scroll, Join CTA full-width
- [ ] Desktop (Viewport=desktop-1280): hero left/right split, max-w applied, countdown visible
- [ ] Hero festival-gradient renders
- [ ] LiveSlotCounter shows "423 / 500" with no tension class
- [ ] Set SlotsRemaining → 100: counter turns amber
- [ ] → 50: orange · → 10: red + pulse animation (off when reduced motion enabled)

## Hub — 12 personas
For each: toggle DebugDrawer values, refresh page, verify UI.

- [ ] New signup (logged_in, KYC off, OKX off)         → ProgressTracker shows STEP 1 in-progress
- [ ] OKX linked, no trades                            → STEP 2 in-progress, MyProgressMeter $0/$500
- [ ] Mid trade $237                                   → meter at ~47%
- [ ] Half reached $250                                → MilestoneCardModal appears
- [ ] $500 reached + Claim slot                        → SlotSecuredModal with slot #
- [ ] USDT Registration=Wallet, Status=대기            → UsdtRewardCard chip "Pending payout"
- [ ] USDT Status=완료 + tx                            → chip "Paid", TX prefix shown
- [ ] Slot capacity full (Status=슬롯_마감_후_도달)     → cap-full message visible
- [ ] simulatedDate=2026-06-15, surveyTrackOpen=false  → "Survey opens June 29" disabled
- [ ] simulatedDate=2026-06-29, Survey CTA            → SurveyModal opens
- [ ] Survey Completed=true, ICX Status=수령 정보 미등록 → IcxRewardCard "Registration required"
- [ ] simulatedDate=2026-07-07                         → NpsModal appears
- [ ] simulatedDate=2026-08-07                         → "Registration closed" enforced

## Modals
- [ ] Survey: navigate 13 questions, Submit shows mini-report
- [ ] USDT/wallet: invalid TRC20 → error inline; valid + terms checked → registration submits
- [ ] USDT/exchange: invalid UID/email → errors inline; valid + terms → submits
- [ ] USDT: terms unchecked → error shown
- [ ] USDT/wallet: network warning checkbox required
- [ ] ICX: invalid ICON address → error inline
- [ ] Terms viewer modal opens from each registration modal and closes independently
- [ ] NPS: 0–10 scale interaction
- [ ] Escape closes the active modal, focus returns to invoker
- [ ] Tab cycles within modal only

## TopBanner
- [ ] simulatedDate=2026-06-08 + SlotsRemaining=500   → campaign-running
- [ ] SlotsRemaining=100                              → slots-100 (amber)
- [ ] → 50                                            → slots-50 (orange)
- [ ] → 10                                            → slots-10 (red)
- [ ] simulatedDate=2026-07-04                        → d-3 (overrides slot variants per priority)

## DebugDrawer
- [ ] ⌘+\ (Mac) or Ctrl+\ (Linux/Windows) toggles drawer
- [ ] Mobile: bottom sheet · Desktop: right drawer
- [ ] Every section's toggles update the corresponding UI live
- [ ] Quick-jump dates work for all 7 presets (D-day, Mid, End-trade, Start-survey, D-3, End, 30d-cutoff)
- [ ] Viewport buttons (auto/mobile-390/tablet-768/desktop-1280) frame the page at the chosen width
- [ ] Export copies JSON to clipboard
- [ ] Import accepts pasted JSON
- [ ] Reset all restores initial state and clears localStorage
- [ ] Reset all dismissed re-enables modals
- [ ] InconsistentStateWarning appears when forcing impossible combos
      (e.g., USDT Status=완료 with Registration=none — guard prevents direct transition;
       force via Import)

## Accessibility
- [ ] Keyboard-only completion of Landing → Hub → USDT modal submit → Survey modal submit
- [ ] Skip-link visible on first Tab press, jumps to #main-content
- [ ] :focus-visible ring visible on all interactive elements
- [ ] Modal focus trap + Esc to close, focus returns to invoker
- [ ] prefers-reduced-motion silences shimmer, pulse, burst (DevTools → Rendering)
- [ ] Lighthouse a11y score ≥ 95 on Landing and Hub
- [ ] Status chip contrast ≥ 4.5:1 for AA (manually verify amber/orange/red against bg-surface-solid)

## Persistence
- [ ] Change state, hard reload — state restored
- [ ] Delete localStorage key `supercycl-event-mock-state` in DevTools, reload — back to initialState
- [ ] Open Import with garbage text — graceful "Invalid JSON" alert

## Legal pages
- [ ] /terms renders standalone with placeholder content
- [ ] /privacy renders standalone with placeholder content
- [ ] Both linked via TermsViewerModal "View terms" button from inside USDT/ICX modals

## Build
- [ ] `npm test` passes (validators + selectors + components)
- [ ] `npm run typecheck` passes (main + test tsconfigs)
- [ ] `npm run build` produces .next/ without errors (metadataBase warning is acceptable)
- [ ] `npm start` serves production build at http://localhost:3000

---

## Known limitations / Open Issues from spec

- F-1: OKX UID regex is tentative — refine when OKX spec is finalized
- F-2: Legal MDX placeholders — replace with legal team's final content before launch
- F-3: OG image placeholder (`/og-image.png`) needs design asset
- F-4: Favicon placeholder
- F-5: Non-trader ICX payout amount TBD (pending operations decision)
- F-6: Slot counter 5-min polling not implemented (mock-only — use DebugDrawer to adjust)
- A11y: Manual screen-reader + Lighthouse audit must be done in-browser
- `metadataBase`: Build warning — add `metadataBase: new URL(SITE_URL)` in metadata when production URL is known
