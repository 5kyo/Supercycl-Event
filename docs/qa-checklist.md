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
- [ ] $500 reached + OKX linked                        → USDT chip flips to "Awaiting payout" with masked OKX UID line
- [ ] USDT Status=PENDING_PAYOUT                       → chip "Pending payout", masked UID still visible
- [ ] USDT Status=PAID + tx                            → chip "Paid", TX prefix shown
- [ ] Slot capacity full (Status=CAP_FULL)             → cap-full message visible
- [ ] simulatedDate=2026-06-15, surveyTrackOpen=false  → "Survey opens June 29" disabled
- [ ] simulatedDate=2026-06-29, Survey CTA            → SurveyModal opens
- [ ] Survey Completed=true, ICX Status=AWAITING_PAYOUT → ICX chip "Awaiting payout", masked UID line visible
- [ ] simulatedDate=2026-07-08                         → EventClosed page renders (hero + recap + open-app), no auto-modal, no reward CTA

## Modals
- [ ] Survey: navigate 12 questions, Submit shows mini-report
- [ ] SurveyCompleteModal: copy mentions "linked OKX UID via Internal Transfer", only a Done button (no register CTA)
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
- [ ] Toggling OKX linked surfaces / clears the masked OKX UID line on the reward cards
- [ ] Quick-jump dates work for the date presets (D-day, End-trade, Start-survey, D-3, End)
- [ ] Viewport buttons (auto/mobile-390/tablet-768/desktop-1280) frame the page at the chosen width
- [ ] Export copies JSON to clipboard
- [ ] Import accepts pasted JSON
- [ ] Reset all restores initial state and clears localStorage
- [ ] Reset all dismissed re-enables modals

## Accessibility
- [ ] Keyboard-only completion of Landing → Hub → Survey modal submit
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
- [ ] State persisted under an older build (with `usdtRegistration` / `icxAddress` / `AWAITING_REGISTRATION` / `EXPIRED`) loads cleanly — legacy keys stripped, statuses migrated to `AWAITING_PAYOUT`

## Build
- [ ] `npm test` passes (selectors + components)
- [ ] `npm run typecheck` passes (main + test tsconfigs)
- [ ] `npm run build` produces .next/ without errors (metadataBase warning is acceptable)
- [ ] `npm start` serves production build at http://localhost:3000

---

## Known limitations / Open Issues from spec

- F-3: OG image placeholder (`/og-image.png`) needs design asset
- F-4: Favicon placeholder
- F-5: Non-trader ICX payout amount TBD (pending operations decision)
- F-6: Slot counter 5-min polling not implemented (mock-only — use DebugDrawer to adjust)
- A11y: Manual screen-reader + Lighthouse audit must be done in-browser
- `metadataBase`: Build warning — add `metadataBase: new URL(SITE_URL)` in metadata when production URL is known
