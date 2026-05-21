# Mobile Optimization — Design

**Date:** 2026-05-21
**Scope:** Debug-drawer mobile preview accuracy, then targeted real-mobile fixes.

## Problem

The `mobile-390` debug viewport simulates mobile by setting a 390px-wide container, but Tailwind responsive breakpoints (`lg:`) key off the real browser viewport. On a desktop browser this means desktop-only layouts (`lg:flex-row`, `lg:grid-cols-2`, `lg:flex` right column in `CampaignHero`) keep firing inside the narrow frame, producing a squeezed layout that doesn't match what a real phone user sees.

Today's symptoms in the 390px frame on a desktop browser:
- `CampaignHero` two-column layout collapses the headline into a narrow left column → headline wraps to ~5 lines.
- Reward-card section renders 2 columns side-by-side at 390px → status chips overlap.
- Tagline "TRADE DIFFERENT · RIDE THE SUPERCYCL" breaks one word per line.

The real phone view is likely fine for most of these (since `lg:` would not fire), but we can't verify without an accurate simulation, and there are likely real mobile issues hiding behind that uncertainty.

## Goals

1. **Make the debug viewport simulate mobile accurately** so designers and the team can trust the preview.
2. **Audit and fix real mobile layout issues** that surface once the simulation is accurate.

## Part A — Accurate viewport simulation via iframe

Replace the current `<div>`-based `ViewportFrame` with an `<iframe>` when a non-auto viewport is selected. An iframe is a separate browsing context with its own `window.innerWidth`, so Tailwind's `lg:` media queries respect the iframe width. This costs zero refactor of existing responsive utilities.

### Architecture

- **`ViewportFrame`** (parent context):
  - `debugViewport === 'auto'` → render children inline (unchanged).
  - Otherwise → render an `<iframe src="/?embed=1">` at the selected width.
- **`/` rendered inside iframe** (`?embed=1`):
  - `ViewportFrame` is a no-op (renders children directly — no nested frame).
  - `DebugDrawer` does not render (kept in parent only).
  - `MockStateProvider` subscribes to `storage` events: when the parent's `DebugDrawer` mutates state, the iframe receives the `storage` event and dispatches `IMPORT_STATE` to re-render.

### Detection of embed mode

Use a URL search param: `?embed=1`. Server-renderable, no race vs hydration, no localStorage flag needed.

A small client component (`useIsEmbedded()`) reads `window.location.search`. SSR returns `false`; the post-hydration value flips to `true` if the param is present. The brief flash of "non-embed" rendering on SSR is fine because the iframe content paint is hidden behind the iframe load anyway.

### State sync details

`MockStateProvider` already loads from `localStorage` on mount. We add one effect:

```ts
useEffect(() => {
  function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      const next = JSON.parse(e.newValue) as MockState;
      dispatch({ type: 'IMPORT_STATE', state: next });
    } catch {}
  }
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, []);
```

The `storage` event only fires in **other** documents than the one that wrote — so the parent doesn't get its own event back, and the iframe gets parent changes. Two-way is not required for this MVP (the iframe is preview-only; users interact via the parent's DebugDrawer).

### Tradeoffs considered

- **Container queries (`@container`)**: would also fix the simulation, but requires installing `@tailwindcss/container-queries` and rewriting all 18 `lg:` usages to `@lg:`. Bigger refactor, more risk.
- **JS-overridden `matchMedia`**: Tailwind ships CSS media queries; runtime JS overrides can't influence pre-compiled `@media (min-width: 1024px) { ... }`. Dead end.
- **CSS `transform: scale()`**: scales rendered pixels, not the layout viewport. Doesn't trigger media queries.

iframe is the lowest-touch path.

## Part B — Real-mobile audit

Once Part A is in, use `mobile-390` (and `tablet-768`) to audit each main view. Targets:

- **CampaignHero** at 390px: headline readability, padding, button width.
- **Reward cards** at 390px: stacking (already `lg:grid-cols-2`, so should stack), status chip ↔ eyebrow spacing in the new card layout, form input width.
- **ProgressTracker steps** at 390px: chip + label wrap behavior.
- **HubCtaBar** sticky bottom: safe-area padding, button stretch.
- **Modals** at 390px: bottom-sheet behavior (already keyed to `lg:items-center`), input field width.
- **TopBanner** at 390px: copy truncation vs wrap.

Fixes will be incremental and small (typography clamps, padding tweaks, occasional `flex-col` overrides). No structural changes anticipated; if any surface needs a redesign for mobile, we'll scope that separately.

## Out of scope

- Mobile-only navigation or chrome (no bottom nav, no hamburger).
- True-device fidelity (OS chrome, font rendering differences) — Chrome devtools and the iframe simulation are the verification surface.
- Container-query refactor.

## Testing

- Manual: toggle `mobile-390` / `tablet-768` / `desktop-1280` in the debug drawer and visually verify each view across both auth states.
- Existing unit tests cover state logic and a few component behaviors; they should be unaffected by the iframe change since the page tree itself is unchanged.
- Verify the iframe and parent stay in sync: change a value in DebugDrawer (e.g., trading volume slider) → iframe re-renders within ~one paint.

## Files touched

**Part A:**
- `src/components/ViewportFrame.tsx` — branch on embed; render iframe otherwise.
- `src/lib/mock-state/provider.tsx` — add `storage` event subscription.
- `src/app/layout.tsx` — make `DebugDrawer` conditional on non-embed.
- New: `src/lib/useIsEmbedded.ts` — tiny helper.

**Part B:**
- TBD — per audit findings. Likely small touches in `CampaignHero`, `Hub`, `HubCtaBar`, and possibly `ProgressTracker`.
