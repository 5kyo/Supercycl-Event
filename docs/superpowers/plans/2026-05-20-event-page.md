# Supercycl Event Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Supercycl Mobile Launch Festival event page as a Next.js frontend prototype with 100% mocked state, supporting all 9 in-app triggers, 7 modal types, and 6+1 reward states across mobile/desktop viewports.

**Architecture:** Single-URL Next.js App Router app with login-state content branching. All app data lives in a single MockStateProvider (Context + reducer) with localStorage persistence. UI is read-only against the store; the DebugDrawer is the only mutation surface besides form submission. Components reuse Supercycl-Mobile design tokens with event-specific accents layered on top. Mobile-first responsive via Tailwind breakpoints — same components, layout shifts at `md:` and `lg:`.

**Tech Stack:** Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Vitest · @testing-library/react · pnpm

**Reference spec:** `docs/superpowers/specs/2026-05-20-event-page-design.md`
**Source campaign spec:** `supercycl_event_spec.md` (in repo root)
**Sibling project for tokens:** `../Supercycl-Mobile/assets/design-spec/styles/tokens-design.css`

---

## File Structure

```
Supercycl-Event/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                          # Root layout: MockStateProvider, DebugDrawer mount
│  │  ├─ page.tsx                            # Single entry — branches on authStatus
│  │  ├─ (legal)/terms/page.tsx              # Terms meta page (direct URL/SEO)
│  │  └─ (legal)/privacy/page.tsx            # Privacy meta page (direct URL/SEO)
│  ├─ components/
│  │  ├─ landing/
│  │  │  ├─ Landing.tsx                      # Composes Hero/RewardSummary/ThreeStep/JoinCta
│  │  │  ├─ LandingHero.tsx
│  │  │  ├─ RewardSummaryCard.tsx
│  │  │  ├─ ThreeStepGuide.tsx
│  │  │  └─ JoinCta.tsx
│  │  ├─ hub/
│  │  │  ├─ Hub.tsx                          # Composes Header/Progress/Slot/Rewards/Cta
│  │  │  ├─ HubHeader.tsx                    # Title + welcome card
│  │  │  ├─ ProgressTracker.tsx              # STEP 1/2/3
│  │  │  ├─ MyProgressMeter.tsx              # Trading volume meter + CTA
│  │  │  ├─ UsdtRewardCard.tsx
│  │  │  ├─ IcxRewardCard.tsx
│  │  │  └─ HubCtaBar.tsx
│  │  ├─ modals/
│  │  │  ├─ ModalRoot.tsx                    # Priority queue + auto-dismiss
│  │  │  ├─ Modal.tsx                        # Generic dialog primitive (focus trap, Esc)
│  │  │  ├─ TermsViewerModal.tsx
│  │  │  ├─ UsdtRegistrationModal.tsx
│  │  │  ├─ IcxRegistrationModal.tsx
│  │  │  ├─ SurveyModal.tsx
│  │  │  ├─ SlotSecuredModal.tsx
│  │  │  ├─ MilestoneCardModal.tsx
│  │  │  └─ NpsModal.tsx
│  │  ├─ banners/
│  │  │  └─ TopBanner.tsx                    # 5 variants
│  │  ├─ shared/
│  │  │  ├─ RewardStatusLabel.tsx            # 7-state chip
│  │  │  ├─ LiveSlotCounter.tsx              # 423/500 + tension state
│  │  │  ├─ ProgressBar.tsx                  # With shimmer at lg:
│  │  │  ├─ CountdownTimer.tsx               # D-XX + HH:MM:SS
│  │  │  └─ Toast.tsx
│  │  └─ debug/
│  │     ├─ DebugDrawer.tsx                  # Top-level drawer shell
│  │     ├─ AuthSection.tsx
│  │     ├─ TradingSection.tsx
│  │     ├─ SlotsSection.tsx
│  │     ├─ UsdtSection.tsx
│  │     ├─ SurveySection.tsx
│  │     ├─ IcxSection.tsx
│  │     ├─ TimeSection.tsx
│  │     ├─ ViewportSection.tsx
│  │     └─ FlagsSection.tsx
│  ├─ lib/
│  │  ├─ mock-state/
│  │  │  ├─ types.ts                         # MockState, Action types
│  │  │  ├─ initial.ts                       # initialState
│  │  │  ├─ reducer.ts                       # Pure reducer + guards
│  │  │  ├─ selectors.ts                     # Derived values
│  │  │  ├─ persistence.ts                   # localStorage middleware
│  │  │  └─ provider.tsx                     # MockStateProvider + useMockState hook
│  │  ├─ validators/
│  │  │  ├─ trc20.ts
│  │  │  ├─ okxUid.ts
│  │  │  ├─ email.ts
│  │  │  ├─ iconAddress.ts
│  │  │  └─ termsAgreement.ts
│  │  ├─ modalPriority.ts                    # Modal queue logic
│  │  └─ a11y/
│  │     ├─ useFocusTrap.ts
│  │     └─ useReducedMotion.ts
│  └─ content/
│     ├─ en.ts                               # All English UI strings
│     ├─ survey-ko.ts                        # 13 Korean survey questions
│     └─ legal/
│        ├─ terms.mdx                        # Placeholder
│        └─ privacy.mdx                      # Placeholder
├─ tests/
│  ├─ validators/                            # One file per validator
│  ├─ mock-state/                            # reducer.test.ts, selectors.test.ts
│  └─ components/                            # RTL tests
├─ tailwind.config.ts
├─ tsconfig.json
├─ vitest.config.ts
├─ next.config.js
├─ package.json
├─ public/
│  └─ og-image.png                           # Placeholder
└─ docs/
   └─ qa-checklist.md
```

---

## Task 0: Bootstrap Next.js + TypeScript + Tailwind + Vitest

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`, `vitest.setup.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `.eslintrc.json`, `tests/smoke.test.ts`

- [ ] **Step 1: Initialize package.json**

Run from `/Users/okyokwon/Desktop/Projects/Supercycl-Event/`:

```bash
cat > package.json <<'EOF'
{
  "name": "supercycl-event",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
EOF
pnpm install
```

- [ ] **Step 2: TypeScript + Next config**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`next.config.js`:
```js
/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true };
```

- [ ] **Step 3: Tailwind config (token-aware base)**

`postcss.config.js`:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Placeholder tokens — Task 1 will replace these with Supercycl token mapping
        bg: 'var(--color-bg, #0a0d0f)',
        surface: 'var(--color-surface, #11161a)',
        'mono-green': 'var(--color-mono-green, #00d68f)',
        amber: 'var(--color-amber, #fbbf24)',
        orange: 'var(--color-orange, #fb923c)',
        red: 'var(--color-red, #ef4444)',
        blue: 'var(--color-blue, #38bdf8)',
        text: 'var(--color-text, #e6edf3)',
        muted: 'var(--color-muted, #8b949e)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Vitest config + setup**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Minimal app shell + globals**

`src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #0a0d0f;
  --color-surface: #11161a;
  --color-mono-green: #00d68f;
  --color-amber: #fbbf24;
  --color-orange: #fb923c;
  --color-red: #ef4444;
  --color-blue: #38bdf8;
  --color-text: #e6edf3;
  --color-muted: #8b949e;
}

html, body { background: var(--color-bg); color: var(--color-text); }
```

`src/app/layout.tsx`:
```tsx
import './globals.css';

export const metadata = {
  title: 'Supercycl Mobile Launch Festival',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:
```tsx
export default function Page() {
  return <main>Supercycl Event Page (placeholder)</main>;
}
```

- [ ] **Step 6: .gitignore + .eslintrc**

`.gitignore`:
```
node_modules/
.next/
out/
.env*
!.env.example
*.log
.DS_Store
coverage/
```

`.eslintrc.json`:
```json
{ "extends": "next/core-web-vitals" }
```

- [ ] **Step 7: Smoke test**

`tests/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `pnpm test`
Expected: `1 passed`

Run: `pnpm build`
Expected: build succeeds, `.next/` created.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js + Tailwind + Vitest project shell"
```

---

## Task 1: Wire Supercycl design tokens

**Files:**
- Create: `src/lib/tokens/event-accents.css`
- Modify: `src/app/globals.css`, `tailwind.config.ts`

**Why:** Replace placeholder color values with real Supercycl tokens, and layer event-specific accents on top.

- [ ] **Step 1: Read source tokens**

```bash
cat ../Supercycl-Mobile/assets/design-spec/styles/tokens-design.css | head -100
```

Extract the canonical values for these tokens (record them in your scratch space, you'll inline them):
- `--color-bg` (page background)
- `--color-surface` (card surface)
- `--color-mono-green` (primary accent)
- `--color-text` / `--color-muted`
- Any neutral scale (gray-100..900) the source defines

Use these to replace the placeholder hex values in `src/app/globals.css :root`. If the source defines tokens like `--bg-1`, `--text-primary`, etc., add aliases:

```css
:root {
  /* Mirror of Supercycl-Mobile tokens (source: ../Supercycl-Mobile/assets/design-spec/styles/tokens-design.css) */
  --color-bg: /* paste real value */;
  --color-surface: /* paste real value */;
  --color-mono-green: /* paste real value */;
  --color-text: /* paste real value */;
  --color-muted: /* paste real value */;
  /* status palette */
  --color-amber: #fbbf24;
  --color-orange: #fb923c;
  --color-red: #ef4444;
  --color-blue: #38bdf8;
  --color-green: var(--color-mono-green);
}
```

- [ ] **Step 2: Create event accents stylesheet**

`src/lib/tokens/event-accents.css`:
```css
/* Event-specific accents — used only on landing/modals/celebration moments.
   See spec §6 for usage rules. */

/* Festival gradient: low-saturation Mono Green → Cyan → Magenta */
.event-gradient {
  background: linear-gradient(
    135deg,
    color-mix(in oklab, var(--color-mono-green) 70%, transparent),
    color-mix(in oklab, #22d3ee 60%, transparent),
    color-mix(in oklab, #d946ef 50%, transparent)
  );
}

/* Countdown numerals — tabular nums + subtle glow */
.event-countdown-numerals {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  text-shadow: 0 0 12px color-mix(in oklab, var(--color-mono-green) 40%, transparent);
}

/* Progress shimmer — slow loop, lg: only */
@media (min-width: 1024px) {
  .event-shimmer {
    position: relative;
    overflow: hidden;
  }
  .event-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in oklab, white 18%, transparent) 50%,
      transparent 100%
    );
    animation: event-shimmer 3s linear infinite;
  }
  @keyframes event-shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
}

/* Tension state colors for slot counter */
.event-tension-100 { color: var(--color-amber); }
.event-tension-50  { color: var(--color-orange); }
.event-tension-10  { color: var(--color-red); animation: event-pulse 1.2s ease-in-out infinite; }
@keyframes event-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

/* Celebration burst — used by SlotSecuredModal */
.event-burst {
  animation: event-burst 800ms ease-out;
}
@keyframes event-burst {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .event-shimmer::after,
  .event-tension-10,
  .event-burst {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Import accents in globals**

In `src/app/globals.css`, add at the very bottom:
```css
@import '../lib/tokens/event-accents.css';
```

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

Expected: build succeeds. Open `pnpm dev` and confirm the placeholder page renders with the dark Supercycl base color.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tokens/event-accents.css src/app/globals.css tailwind.config.ts
git commit -m "feat: wire Supercycl design tokens and event accents"
```

---

## Task 2: Validators (5 pure functions + tests)

**Files:**
- Create: `src/lib/validators/trc20.ts`, `okxUid.ts`, `email.ts`, `iconAddress.ts`, `termsAgreement.ts`, `index.ts`
- Test: `tests/validators/trc20.test.ts`, `okxUid.test.ts`, `email.test.ts`, `iconAddress.test.ts`, `termsAgreement.test.ts`

**Spec ref:** §5.2 of design doc, §5.7 of campaign spec.

- [ ] **Step 1: Write failing tests for all 5 validators**

`tests/validators/trc20.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateTrc20 } from '@/lib/validators/trc20';

describe('validateTrc20', () => {
  it('accepts a canonical TRC20 address', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQ')).toEqual({ ok: true });
  });
  it('rejects empty input', () => {
    expect(validateTrc20('').ok).toBe(false);
  });
  it('rejects address not starting with T', () => {
    expect(validateTrc20('XPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQ').ok).toBe(false);
  });
  it('rejects address with wrong length', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sxQAA').ok).toBe(false);
  });
  it('rejects address with invalid characters', () => {
    expect(validateTrc20('TPL66VK2gCXNCN7tXKZK6VeNcVtmJP5sx!@').ok).toBe(false);
  });
});
```

`tests/validators/okxUid.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateOkxUid } from '@/lib/validators/okxUid';

describe('validateOkxUid', () => {
  it('accepts 6-20 digit numeric UID', () => {
    expect(validateOkxUid('123456').ok).toBe(true);
    expect(validateOkxUid('12345678901234567890').ok).toBe(true);
  });
  it('rejects too-short UID', () => {
    expect(validateOkxUid('12345').ok).toBe(false);
  });
  it('rejects too-long UID', () => {
    expect(validateOkxUid('123456789012345678901').ok).toBe(false);
  });
  it('rejects non-numeric characters', () => {
    expect(validateOkxUid('1234abc').ok).toBe(false);
  });
  it('rejects empty input', () => {
    expect(validateOkxUid('').ok).toBe(false);
  });
});
```

`tests/validators/email.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/lib/validators/email';

describe('validateEmail', () => {
  it('accepts canonical addresses', () => {
    expect(validateEmail('user@example.com').ok).toBe(true);
    expect(validateEmail('a.b+tag@sub.example.co.kr').ok).toBe(true);
  });
  it('rejects missing @', () => {
    expect(validateEmail('userexample.com').ok).toBe(false);
  });
  it('rejects missing TLD', () => {
    expect(validateEmail('user@example').ok).toBe(false);
  });
  it('rejects whitespace', () => {
    expect(validateEmail('user @example.com').ok).toBe(false);
  });
  it('rejects empty', () => {
    expect(validateEmail('').ok).toBe(false);
  });
});
```

`tests/validators/iconAddress.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateIconAddress } from '@/lib/validators/iconAddress';

describe('validateIconAddress', () => {
  it('accepts hx + 40 hex chars', () => {
    expect(validateIconAddress('hx' + 'a'.repeat(40)).ok).toBe(true);
    expect(validateIconAddress('hx0123456789abcdef0123456789abcdef01234567').ok).toBe(true);
  });
  it('rejects wrong prefix', () => {
    expect(validateIconAddress('hy' + 'a'.repeat(40)).ok).toBe(false);
  });
  it('rejects wrong length', () => {
    expect(validateIconAddress('hx' + 'a'.repeat(39)).ok).toBe(false);
    expect(validateIconAddress('hx' + 'a'.repeat(41)).ok).toBe(false);
  });
  it('rejects uppercase hex (canonicalized lowercase)', () => {
    expect(validateIconAddress('hx' + 'A'.repeat(40)).ok).toBe(false);
  });
  it('rejects non-hex chars', () => {
    expect(validateIconAddress('hx' + 'z'.repeat(40)).ok).toBe(false);
  });
});
```

`tests/validators/termsAgreement.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateTermsAgreement } from '@/lib/validators/termsAgreement';

describe('validateTermsAgreement', () => {
  it('passes when both required boxes checked', () => {
    expect(validateTermsAgreement({ terms: true, network: true, requireNetwork: true }).ok).toBe(true);
  });
  it('fails when terms not checked', () => {
    const r = validateTermsAgreement({ terms: false, network: true, requireNetwork: true });
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/terms/i);
  });
  it('fails when network confirmation not checked but required', () => {
    const r = validateTermsAgreement({ terms: true, network: false, requireNetwork: true });
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/network/i);
  });
  it('passes when network confirmation not required', () => {
    expect(validateTermsAgreement({ terms: true, network: false, requireNetwork: false }).ok).toBe(true);
  });
});
```

Run: `pnpm test`
Expected: all 5 suites FAIL with "Cannot find module".

- [ ] **Step 2: Implement each validator**

`src/lib/validators/trc20.ts`:
```ts
export type ValidationResult = { ok: true } | { ok: false; message: string };

const TRC20_RE = /^T[A-Za-z0-9]{33}$/;

export function validateTrc20(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'Address is required' };
  if (!TRC20_RE.test(input)) return { ok: false, message: 'Invalid TRC20 address' };
  return { ok: true };
}
```

`src/lib/validators/okxUid.ts`:
```ts
import type { ValidationResult } from './trc20';

// Tentative — refine when OKX UID spec is finalized (Open Issue F-1)
const OKX_UID_RE = /^\d{6,20}$/;

export function validateOkxUid(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'OKX UID is required' };
  if (!OKX_UID_RE.test(input)) return { ok: false, message: 'Invalid OKX UID' };
  return { ok: true };
}
```

`src/lib/validators/email.ts`:
```ts
import type { ValidationResult } from './trc20';

// Pragmatic RFC 5322 subset — no whitespace, requires TLD
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'Email is required' };
  if (!EMAIL_RE.test(input)) return { ok: false, message: 'Invalid email' };
  return { ok: true };
}
```

`src/lib/validators/iconAddress.ts`:
```ts
import type { ValidationResult } from './trc20';

const ICON_RE = /^hx[0-9a-f]{40}$/;

export function validateIconAddress(input: string): ValidationResult {
  if (!input) return { ok: false, message: 'ICON address is required' };
  if (!ICON_RE.test(input)) return { ok: false, message: 'Invalid ICON address' };
  return { ok: true };
}
```

`src/lib/validators/termsAgreement.ts`:
```ts
import type { ValidationResult } from './trc20';

export function validateTermsAgreement(input: {
  terms: boolean;
  network: boolean;
  requireNetwork: boolean;
}): ValidationResult {
  if (!input.terms) return { ok: false, message: 'You must agree to the terms to continue' };
  if (input.requireNetwork && !input.network) {
    return { ok: false, message: 'You must confirm the network warning to continue' };
  }
  return { ok: true };
}
```

`src/lib/validators/index.ts`:
```ts
export { validateTrc20 } from './trc20';
export { validateOkxUid } from './okxUid';
export { validateEmail } from './email';
export { validateIconAddress } from './iconAddress';
export { validateTermsAgreement } from './termsAgreement';
export type { ValidationResult } from './trc20';
```

- [ ] **Step 3: Run tests**

```bash
pnpm test
```
Expected: all 5 validator suites PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/validators tests/validators
git commit -m "feat: add 5 input validators with full test coverage"
```

---

## Task 3: Mock state types + initial state

**Files:**
- Create: `src/lib/mock-state/types.ts`, `src/lib/mock-state/initial.ts`

- [ ] **Step 1: Define state types**

`src/lib/mock-state/types.ts`:
```ts
export type AuthStatus = 'logged_out' | 'logged_in';

export type UsdtRegistration =
  | { status: 'none' }
  | { status: 'wallet'; trc20Address: string }
  | { status: 'exchange'; okxUid: string; email: string };

export type UsdtPayoutStatus =
  | '미달성'
  | '수령 정보 미등록'
  | '대기'
  | '보류'
  | '완료'
  | '만료'
  | '슬롯_마감_후_도달';

export type IcxPayoutStatus =
  | '미달성'
  | '수령 정보 미등록'
  | '대기'
  | '보류'
  | '완료'
  | '만료';

export type DebugViewport = 'auto' | 'mobile-390' | 'tablet-768' | 'desktop-1280';

export type DismissedFlags = {
  welcomeCard?: boolean;
  halfwayMilestone?: boolean;
  slotSecuredModal?: boolean;
  npsModal?: boolean;
};

export type MockState = {
  // 1. auth
  authStatus: AuthStatus;
  // 2. eligibility
  hasKyc: boolean;
  hasOkxLinked: boolean;
  // 3. trading
  tradingVolume: number;          // 0..2000
  reachedAt: string | null;
  // 4. slots (global + user)
  slotsRemaining: number;          // 0..500
  userSlotNumber: number | null;
  // 5. USDT
  usdtRegistration: UsdtRegistration;
  usdtPayoutStatus: UsdtPayoutStatus;
  usdtTxHash: string | null;
  // 6. survey
  surveyCompleted: boolean;
  surveyCompletedAt: string | null;
  isTrader: boolean;
  // 7. ICX
  icxAddress: string | null;
  icxPayoutStatus: IcxPayoutStatus;
  icxTxHash: string | null;
  // 8. time
  simulatedDate: string;           // ISO yyyy-mm-dd
  // 9. dismiss flags
  dismissedFlags: DismissedFlags;
  // 10. viewport (debug only)
  debugViewport: DebugViewport;
};

export type Action =
  | { type: 'SET_AUTH'; status: AuthStatus }
  | { type: 'TOGGLE_KYC' }
  | { type: 'TOGGLE_OKX' }
  | { type: 'SET_TRADING_VOLUME'; value: number }
  | { type: 'SET_SLOTS_REMAINING'; value: number }
  | { type: 'CLAIM_SLOT'; slotNumber: number; reachedAt: string }
  | { type: 'SET_USDT_REGISTRATION'; registration: UsdtRegistration }
  | { type: 'SET_USDT_PAYOUT_STATUS'; status: UsdtPayoutStatus; txHash?: string | null }
  | { type: 'SET_SURVEY_COMPLETED'; isTrader: boolean; at: string }
  | { type: 'SET_ICX_ADDRESS'; address: string | null }
  | { type: 'SET_ICX_PAYOUT_STATUS'; status: IcxPayoutStatus; txHash?: string | null }
  | { type: 'SET_SIMULATED_DATE'; date: string }
  | { type: 'DISMISS'; key: keyof DismissedFlags }
  | { type: 'RESET_DISMISSED' }
  | { type: 'SET_VIEWPORT'; viewport: DebugViewport }
  | { type: 'RESET_ALL' }
  | { type: 'IMPORT_STATE'; state: MockState };
```

- [ ] **Step 2: Define initial state**

`src/lib/mock-state/initial.ts`:
```ts
import type { MockState } from './types';

export const CAMPAIGN_START = '2026-06-08';
export const CAMPAIGN_END = '2026-07-07';
export const SURVEY_TRACK_START = '2026-06-29';
export const SURVEY_TRACK_END = '2026-07-05';
export const TRADE_TRACK_END = '2026-06-28';
export const REGISTRATION_CUTOFF = '2026-08-06';

export const initialState: MockState = {
  authStatus: 'logged_out',
  hasKyc: false,
  hasOkxLinked: false,
  tradingVolume: 0,
  reachedAt: null,
  slotsRemaining: 500,
  userSlotNumber: null,
  usdtRegistration: { status: 'none' },
  usdtPayoutStatus: '미달성',
  usdtTxHash: null,
  surveyCompleted: false,
  surveyCompletedAt: null,
  isTrader: false,
  icxAddress: null,
  icxPayoutStatus: '미달성',
  icxTxHash: null,
  simulatedDate: CAMPAIGN_START,
  dismissedFlags: {},
  debugViewport: 'auto',
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock-state/types.ts src/lib/mock-state/initial.ts
git commit -m "feat: define mock state types and initial state"
```

---

## Task 4: Mock state reducer with guards + persistence

**Files:**
- Create: `src/lib/mock-state/reducer.ts`, `src/lib/mock-state/persistence.ts`
- Test: `tests/mock-state/reducer.test.ts`

**Spec ref:** §5.5 state transition guards.

- [ ] **Step 1: Write failing reducer tests**

`tests/mock-state/reducer.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { reducer } from '@/lib/mock-state/reducer';
import { initialState } from '@/lib/mock-state/initial';

describe('reducer', () => {
  it('SET_AUTH transitions logged_out -> logged_in', () => {
    const s = reducer(initialState, { type: 'SET_AUTH', status: 'logged_in' });
    expect(s.authStatus).toBe('logged_in');
  });

  it('SET_TRADING_VOLUME clamps to [0, 2000]', () => {
    const a = reducer(initialState, { type: 'SET_TRADING_VOLUME', value: -100 });
    expect(a.tradingVolume).toBe(0);
    const b = reducer(initialState, { type: 'SET_TRADING_VOLUME', value: 9999 });
    expect(b.tradingVolume).toBe(2000);
  });

  it('SET_SLOTS_REMAINING clamps to [0, 500]', () => {
    expect(reducer(initialState, { type: 'SET_SLOTS_REMAINING', value: -5 }).slotsRemaining).toBe(0);
    expect(reducer(initialState, { type: 'SET_SLOTS_REMAINING', value: 9999 }).slotsRemaining).toBe(500);
  });

  it('CLAIM_SLOT sets userSlotNumber and reachedAt', () => {
    const s = reducer(initialState, { type: 'CLAIM_SLOT', slotNumber: 237, reachedAt: '2026-06-15' });
    expect(s.userSlotNumber).toBe(237);
    expect(s.reachedAt).toBe('2026-06-15');
  });

  it('guard: USDT registration cannot change after payout complete', () => {
    const completed = {
      ...initialState,
      usdtRegistration: { status: 'wallet' as const, trc20Address: 'T' + 'a'.repeat(33) },
      usdtPayoutStatus: '완료' as const,
    };
    const s = reducer(completed, {
      type: 'SET_USDT_REGISTRATION',
      registration: { status: 'exchange', okxUid: '123456', email: 'a@b.co' },
    });
    expect(s.usdtRegistration).toEqual(completed.usdtRegistration);
  });

  it('guard: USDT payout cannot go to 완료 without registration', () => {
    const s = reducer(initialState, { type: 'SET_USDT_PAYOUT_STATUS', status: '완료' });
    expect(s.usdtPayoutStatus).toBe(initialState.usdtPayoutStatus);
  });

  it('SET_USDT_PAYOUT_STATUS 완료 stores tx hash when registered', () => {
    const registered = {
      ...initialState,
      usdtRegistration: { status: 'wallet' as const, trc20Address: 'T' + 'a'.repeat(33) },
    };
    const s = reducer(registered, { type: 'SET_USDT_PAYOUT_STATUS', status: '완료', txHash: '0xabc' });
    expect(s.usdtPayoutStatus).toBe('완료');
    expect(s.usdtTxHash).toBe('0xabc');
  });

  it('DISMISS flips the named flag', () => {
    const s = reducer(initialState, { type: 'DISMISS', key: 'welcomeCard' });
    expect(s.dismissedFlags.welcomeCard).toBe(true);
  });

  it('RESET_DISMISSED clears all flags', () => {
    const dirty = { ...initialState, dismissedFlags: { welcomeCard: true, npsModal: true } };
    expect(reducer(dirty, { type: 'RESET_DISMISSED' }).dismissedFlags).toEqual({});
  });

  it('RESET_ALL returns initialState', () => {
    const dirty = { ...initialState, tradingVolume: 700 };
    expect(reducer(dirty, { type: 'RESET_ALL' })).toEqual(initialState);
  });

  it('IMPORT_STATE replaces whole state', () => {
    const imported = { ...initialState, tradingVolume: 1234 };
    expect(reducer(initialState, { type: 'IMPORT_STATE', state: imported })).toEqual(imported);
  });
});
```

Run: `pnpm test` → FAIL (module missing).

- [ ] **Step 2: Implement reducer with guards**

`src/lib/mock-state/reducer.ts`:
```ts
import type { Action, MockState } from './types';
import { initialState } from './initial';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function reducer(state: MockState, action: Action): MockState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, authStatus: action.status };

    case 'TOGGLE_KYC':
      return { ...state, hasKyc: !state.hasKyc };

    case 'TOGGLE_OKX':
      return { ...state, hasOkxLinked: !state.hasOkxLinked };

    case 'SET_TRADING_VOLUME':
      return { ...state, tradingVolume: clamp(action.value, 0, 2000) };

    case 'SET_SLOTS_REMAINING':
      return { ...state, slotsRemaining: clamp(action.value, 0, 500) };

    case 'CLAIM_SLOT':
      return {
        ...state,
        userSlotNumber: action.slotNumber,
        reachedAt: action.reachedAt,
      };

    case 'SET_USDT_REGISTRATION': {
      // Guard: cannot change after payout complete (spec §5.7)
      if (state.usdtPayoutStatus === '완료') return state;
      return { ...state, usdtRegistration: action.registration };
    }

    case 'SET_USDT_PAYOUT_STATUS': {
      // Guard: cannot transition to 완료 without registration
      if (action.status === '완료' && state.usdtRegistration.status === 'none') return state;
      return {
        ...state,
        usdtPayoutStatus: action.status,
        usdtTxHash: action.txHash ?? state.usdtTxHash,
      };
    }

    case 'SET_SURVEY_COMPLETED':
      return {
        ...state,
        surveyCompleted: true,
        surveyCompletedAt: action.at,
        isTrader: action.isTrader,
      };

    case 'SET_ICX_ADDRESS':
      return { ...state, icxAddress: action.address };

    case 'SET_ICX_PAYOUT_STATUS':
      return {
        ...state,
        icxPayoutStatus: action.status,
        icxTxHash: action.txHash ?? state.icxTxHash,
      };

    case 'SET_SIMULATED_DATE':
      return { ...state, simulatedDate: action.date };

    case 'DISMISS':
      return { ...state, dismissedFlags: { ...state.dismissedFlags, [action.key]: true } };

    case 'RESET_DISMISSED':
      return { ...state, dismissedFlags: {} };

    case 'SET_VIEWPORT':
      return { ...state, debugViewport: action.viewport };

    case 'RESET_ALL':
      return initialState;

    case 'IMPORT_STATE':
      return action.state;
  }
}
```

- [ ] **Step 3: localStorage persistence helpers**

`src/lib/mock-state/persistence.ts`:
```ts
import type { MockState } from './types';
import { initialState } from './initial';

const KEY = 'supercycl-event-mock-state';

export function loadState(): MockState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as MockState;
    // Merge to fill in any new fields added to schema after persistence
    return { ...initialState, ...parsed, dismissedFlags: { ...parsed.dismissedFlags } };
  } catch {
    return initialState;
  }
}

export function saveState(state: MockState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded etc. — silently ignore, state will reset next load
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```
Expected: reducer suite PASSES.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mock-state tests/mock-state
git commit -m "feat: mock state reducer with guards + localStorage persistence"
```

---

## Task 5: Selectors (derived values)

**Files:**
- Create: `src/lib/mock-state/selectors.ts`
- Test: `tests/mock-state/selectors.test.ts`

**Spec ref:** §2.3 of design doc.

- [ ] **Step 1: Write failing tests**

`tests/mock-state/selectors.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import {
  isQualifiedForUsdt,
  daysUntilEnd,
  bannerType,
  surveyTrackOpen,
  tradingTrackOpen,
  registrationCutoffPassed,
  effectiveIcxPayout,
} from '@/lib/mock-state/selectors';
import { initialState } from '@/lib/mock-state/initial';

describe('selectors', () => {
  it('isQualifiedForUsdt: needs $500 + OKX linked', () => {
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 500, hasOkxLinked: true })).toBe(true);
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 499, hasOkxLinked: true })).toBe(false);
    expect(isQualifiedForUsdt({ ...initialState, tradingVolume: 500, hasOkxLinked: false })).toBe(false);
  });

  it('daysUntilEnd counts days to 2026-07-07', () => {
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-04' })).toBe(3);
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-07' })).toBe(0);
    expect(daysUntilEnd({ ...initialState, simulatedDate: '2026-07-08' })).toBe(-1);
  });

  it('bannerType priority: d-3 > slots-10 > slots-50 > slots-100 > campaign-running', () => {
    const base = { ...initialState, simulatedDate: '2026-06-15', slotsRemaining: 500 };
    expect(bannerType(base)).toBe('campaign-running');
    expect(bannerType({ ...base, slotsRemaining: 100 })).toBe('slots-100');
    expect(bannerType({ ...base, slotsRemaining: 50 })).toBe('slots-50');
    expect(bannerType({ ...base, slotsRemaining: 10 })).toBe('slots-10');
    expect(bannerType({ ...base, simulatedDate: '2026-07-04', slotsRemaining: 100 })).toBe('d-3');
  });

  it('surveyTrackOpen window 2026-06-29..2026-07-05', () => {
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-06-28' })).toBe(false);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-06-29' })).toBe(true);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-07-05' })).toBe(true);
    expect(surveyTrackOpen({ ...initialState, simulatedDate: '2026-07-06' })).toBe(false);
  });

  it('tradingTrackOpen window 2026-06-08..2026-06-28', () => {
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-07' })).toBe(false);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-08' })).toBe(true);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-28' })).toBe(true);
    expect(tradingTrackOpen({ ...initialState, simulatedDate: '2026-06-29' })).toBe(false);
  });

  it('registrationCutoffPassed after 2026-08-06', () => {
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-08-06' })).toBe(false);
    expect(registrationCutoffPassed({ ...initialState, simulatedDate: '2026-08-07' })).toBe(true);
  });

  it('effectiveIcxPayout: 100 for trader, "TBD" for non-trader (Open Issue F-5)', () => {
    expect(effectiveIcxPayout({ ...initialState, isTrader: true, surveyCompleted: true }).amount).toBe(100);
    expect(effectiveIcxPayout({ ...initialState, isTrader: false, surveyCompleted: true }).amount).toBe(null);
  });
});
```

Run: `pnpm test` → FAIL (module missing).

- [ ] **Step 2: Implement selectors**

`src/lib/mock-state/selectors.ts`:
```ts
import type { MockState } from './types';
import {
  CAMPAIGN_END,
  CAMPAIGN_START,
  REGISTRATION_CUTOFF,
  SURVEY_TRACK_END,
  SURVEY_TRACK_START,
  TRADE_TRACK_END,
} from './initial';

export type BannerType = 'campaign-running' | 'slots-100' | 'slots-50' | 'slots-10' | 'd-3' | null;

function diffDays(a: string, b: string): number {
  // Day-resolution diff. a - b in whole days.
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((da - db) / 86_400_000);
}

export function isQualifiedForUsdt(s: MockState): boolean {
  return s.tradingVolume >= 500 && s.hasOkxLinked;
}

export function daysUntilEnd(s: MockState): number {
  return diffDays(CAMPAIGN_END, s.simulatedDate);
}

export function inCampaignWindow(s: MockState): boolean {
  return s.simulatedDate >= CAMPAIGN_START && s.simulatedDate <= CAMPAIGN_END;
}

export function tradingTrackOpen(s: MockState): boolean {
  return s.simulatedDate >= CAMPAIGN_START && s.simulatedDate <= TRADE_TRACK_END;
}

export function surveyTrackOpen(s: MockState): boolean {
  return s.simulatedDate >= SURVEY_TRACK_START && s.simulatedDate <= SURVEY_TRACK_END;
}

export function registrationCutoffPassed(s: MockState): boolean {
  return s.simulatedDate > REGISTRATION_CUTOFF;
}

export function bannerType(s: MockState): BannerType {
  if (!inCampaignWindow(s)) return null;
  const d = daysUntilEnd(s);
  if (d <= 3 && d >= 0) return 'd-3';
  if (s.slotsRemaining <= 10) return 'slots-10';
  if (s.slotsRemaining <= 50) return 'slots-50';
  if (s.slotsRemaining <= 100) return 'slots-100';
  return 'campaign-running';
}

export type IcxPayout = { amount: number | null; reason?: string };

export function effectiveIcxPayout(s: MockState): IcxPayout {
  if (!s.surveyCompleted) return { amount: null, reason: 'Survey not completed' };
  if (s.isTrader) return { amount: 100 };
  // Open Issue F-5 — non-trader amount TBD by operations
  return { amount: null, reason: 'TBD (non-trader pool — pending operations decision)' };
}

export type SlotTension = 'none' | 'tension-100' | 'tension-50' | 'tension-10';

export function slotTension(s: MockState): SlotTension {
  if (s.slotsRemaining <= 10) return 'tension-10';
  if (s.slotsRemaining <= 50) return 'tension-50';
  if (s.slotsRemaining <= 100) return 'tension-100';
  return 'none';
}
```

- [ ] **Step 3: Run tests**

```bash
pnpm test
```
Expected: selectors suite PASSES.

- [ ] **Step 4: Commit**

```bash
git add src/lib/mock-state/selectors.ts tests/mock-state/selectors.test.ts
git commit -m "feat: mock state derived selectors"
```

---

## Task 6: Mock state Provider + hook

**Files:**
- Create: `src/lib/mock-state/provider.tsx`, `src/lib/mock-state/index.ts`

- [ ] **Step 1: Create provider**

`src/lib/mock-state/provider.tsx`:
```tsx
'use client';

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { reducer } from './reducer';
import { loadState, saveState } from './persistence';
import { initialState } from './initial';
import type { Action, MockState } from './types';

type Ctx = { state: MockState; dispatch: (a: Action) => void };
const MockStateCtx = createContext<Ctx | null>(null);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <MockStateCtx.Provider value={{ state, dispatch }}>{children}</MockStateCtx.Provider>;
}

export function useMockState() {
  const ctx = useContext(MockStateCtx);
  if (!ctx) throw new Error('useMockState must be used within MockStateProvider');
  return ctx;
}
```

- [ ] **Step 2: Barrel export**

`src/lib/mock-state/index.ts`:
```ts
export * from './types';
export { initialState, CAMPAIGN_START, CAMPAIGN_END, SURVEY_TRACK_START, SURVEY_TRACK_END, TRADE_TRACK_END, REGISTRATION_CUTOFF } from './initial';
export { reducer } from './reducer';
export * from './selectors';
export { MockStateProvider, useMockState } from './provider';
```

- [ ] **Step 3: Wire provider into root layout**

Modify `src/app/layout.tsx`:
```tsx
import './globals.css';
import { MockStateProvider } from '@/lib/mock-state';

export const metadata = {
  title: 'Supercycl Mobile Launch Festival',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MockStateProvider>{children}</MockStateProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify**

```bash
pnpm test
pnpm build
```
Expected: tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/mock-state/provider.tsx src/lib/mock-state/index.ts src/app/layout.tsx
git commit -m "feat: MockStateProvider with useMockState hook + persistence side effect"
```

---

## Task 7: Content — English UI strings + Korean survey

**Files:**
- Create: `src/content/en.ts`, `src/content/survey-ko.ts`, `src/content/legal/terms.mdx`, `src/content/legal/privacy.mdx`

**Spec ref:** §4.3 of campaign spec for 13 questions.

- [ ] **Step 1: English UI strings**

`src/content/en.ts`:
```ts
export const en = {
  meta: {
    title: 'Supercycl Mobile Launch Festival',
    tagline: 'TRADE DIFFERENT · RIDE THE SUPERCYCL',
    period: 'Jun 8 – Jul 7, 2026 · 1 MONTH',
  },
  cta: {
    joinNow: 'Join now',
    tradeNow: 'Trade now',
    startSurvey: 'Start survey',
    registerUsdt: 'Register USDT info',
    registerIcx: 'Register ICX wallet',
    viewTerms: 'View terms',
    goToMain: 'Open Supercycl app',
  },
  rewards: {
    heading: 'Rewards',
    usdtLine: 'Trade $500: 20 USDT',
    icxLine: 'Complete survey: ICX reward',
    usdtCardTitle: '20 USDT — Trade $500',
    icxCardTitle: 'ICX — Complete survey',
  },
  steps: {
    heading: 'How to participate',
    step1: 'Sign up + connect exchange',
    step2: 'Trade $500 → 20 USDT',
    step3: 'Complete the 13-question survey → ICX',
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
    notRegistered: 'Registration required',
    pending: 'Pending payout',
    review: 'Under review (max 7 days)',
    completed: 'Paid',
    expired: 'Expired',
    capFull: '$500 reached — slot capacity full. Thank you.',
  },
  banner: {
    campaignRunning: (start: string, end: string) => `Supercycl Mobile Launch Festival is live (${start} – ${end})`,
    slots100: '100 slots left! Start trading now',
    slots50: '50 slots left! Don’t miss out',
    slots10: '10 slots left! Final call',
    d3: '3 days until the campaign ends',
  },
  modal: {
    survey: {
      title: 'Profile & Earn — 13 questions',
      submit: 'Submit',
      next: 'Next',
      previous: 'Back',
      completeTitle: 'Thanks for completing the survey!',
      completeBody: 'Your mini-report is below. Register your ICX wallet to receive the reward.',
      registerIcxCta: 'Register ICX wallet',
    },
    usdt: {
      title: 'How would you like to receive 20 USDT?',
      methodWallet: 'Receive to TRC20 wallet',
      methodExchange: 'Receive to exchange balance',
      trc20Label: 'TRC20 USDT wallet address',
      trc20Warning: 'Sending to a non-TRC20 network may result in loss of funds. Double-check the network.',
      networkCheck: 'I have confirmed the network',
      exchangeFixed: 'Exchange: OKX',
      okxUidLabel: 'OKX UID',
      okxEmailLabel: 'OKX registered email',
      termsCheck: 'I agree to the event terms and privacy policy',
      submit: 'Register',
    },
    icx: {
      title: 'Register your ICX wallet',
      addressLabel: 'ICON wallet address (hx…)',
      termsCheck: 'I agree to the event terms and privacy policy',
      submit: 'Register',
    },
    slotSecured: {
      title: (slot: number) => `🎉 Slot #${slot} / 500 secured!`,
      body: 'Register your USDT receiving info to claim 20 USDT.',
      cta: 'Register USDT info',
    },
    milestone: {
      title: 'Half way there!',
      body: 'Trade $250 more to lock in 20 USDT.',
    },
    nps: {
      title: 'One last question',
      body: 'How likely are you to recommend Supercycl to a friend?',
      registerReminder: 'Don’t forget to register your reward info before the cutoff.',
    },
    terms: { title: 'Event terms & privacy', close: 'Close' },
  },
  hub: {
    welcomeCard: 'Welcome! Connect your exchange or start the survey to participate.',
    stepDone: 'Done',
    stepInProgress: 'In progress',
    stepLocked: 'Locked',
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
```

- [ ] **Step 2: Korean survey questions (verbatim from spec §4.3)**

`src/content/survey-ko.ts`:
```ts
export type SurveyQuestion =
  | { id: number; area: string; question: string; type: 'multi'; options: string[] }
  | { id: number; area: string; question: string; type: 'single'; options: string[]; allowFree?: boolean }
  | { id: number; area: string; question: string; type: 'free'; required?: boolean }
  | { id: number; area: string; question: string; type: 'scale5' };

export const surveyKo: SurveyQuestion[] = [
  { id: 1, area: 'UX', type: 'multi', question: 'PWA 사용 시 가장 만족스러운 점',
    options: ['속도', '단순한 흐름', '디자인', '시그널', '기타'] },
  { id: 2, area: 'UX', type: 'single', allowFree: true, question: '가장 조작이 어려웠던 화면/기능',
    options: ['거래소 연결', '주문 실행', '시그널 화면', '포트폴리오', '없음', '기타(직접 입력)'] },
  { id: 3, area: 'UX', type: 'free', question: '추가되었으면 하는 기능 TOP 1 (선택)' },
  { id: 4, area: '가치제안', type: 'single', question: 'Supercycl을 쓴다면 가장 매력적인 기능',
    options: ['시그널', '차트', '수수료', '거래소 통합'] },
  { id: 5, area: '자동매매', type: 'scale5', question: 'AI 자동매매 출시 시 사용 의향 (1~5)' },
  { id: 6, area: '거래소', type: 'multi', question: '현재 가장 많이 쓰는 거래소 3곳',
    options: ['Bybit', 'OKX', 'Bitget', 'Gate', 'Binance', '기타'] },
  { id: 7, area: '신뢰', type: 'single', question: '애그리게이터 선택 시 가장 중요한 것',
    options: ['보안', '수수료', '시그널 품질', '지원 거래소', '레퍼럴/리워드'] },
  { id: 8, area: '2x 레버리지', type: 'single', question: '다른 거래소 평균 사용 레버리지',
    options: ['1x', '2x', '3x', '5x', '10x+', '거래 안 함'] },
  { id: 9, area: '2x 레버리지', type: 'scale5', question: '2x 제한이 Supercycl 사용에 영향을 미치나요 (1~5)' },
  { id: 10, area: '2x 레버리지', type: 'multi', question: '2x 제한 있어도 쓸 의향이 있다면 그 이유',
    options: ['리스크 관리에 적합', '시그널 품질', '수수료', '통합 편의', '리워드', '기타'] },
  { id: 11, area: '인지', type: 'single', question: 'Supercycl을 어떻게 알게 되었나요',
    options: ['지인 추천', '소셜미디어', '커뮤니티', '검색', '광고', '기타'] },
  { id: 12, area: '프로필', type: 'single', question: '월평균 크립토 거래 금액대 (익명 보장)',
    options: ['~ $1k', '$1k – $10k', '$10k – $50k', '$50k – $200k', '$200k+'] },
  { id: 13, area: '시그널 개인화', type: 'multi', question: '관심 자산 카테고리',
    options: ['BTC', 'ETH', 'Alt', 'Meme', 'Index'] },
];
```

- [ ] **Step 3: Legal placeholders**

`src/content/legal/terms.mdx`:
```mdx
# Event Terms (placeholder)

This is a placeholder. Replace with the legal team’s finalized event terms before launch.

## Eligibility
- YouthMeta member with completed OKX exchange link.

## Reward forfeiture
- Slot forfeiture conditions are governed by the operations team’s discretion under these terms.

## Disputes
- Contact event support via the in-app FAQ.
```

`src/content/legal/privacy.mdx`:
```mdx
# Event Privacy Policy (placeholder)

This is a placeholder. Replace with the legal team’s finalized privacy policy before launch.

## Data collected
- Registered TRC20 address or OKX UID/email for reward payout.
- ICON wallet address for ICX payout.

## Retention
- Retained for the duration of the campaign + 30 days for payout administration.
```

- [ ] **Step 4: Commit**

```bash
git add src/content
git commit -m "feat: English UI strings + Korean survey questions + legal placeholders"
```

---

## Task 8: Shared components — RewardStatusLabel + LiveSlotCounter

**Files:**
- Create: `src/components/shared/RewardStatusLabel.tsx`, `src/components/shared/LiveSlotCounter.tsx`
- Test: `tests/components/RewardStatusLabel.test.tsx`, `tests/components/LiveSlotCounter.test.tsx`

**Spec ref:** §7.3 status table, §6.2 tension states.

- [ ] **Step 1: Write failing tests**

`tests/components/RewardStatusLabel.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';

describe('RewardStatusLabel', () => {
  it('renders Locked for 미달성', () => {
    render(<RewardStatusLabel status="미달성" />);
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });
  it('renders amber chip for 수령 정보 미등록', () => {
    render(<RewardStatusLabel status="수령 정보 미등록" />);
    const chip = screen.getByText('Registration required');
    expect(chip).toBeInTheDocument();
    expect(chip.className).toMatch(/amber|yellow/);
  });
  it('renders green chip for 완료', () => {
    render(<RewardStatusLabel status="완료" />);
    const chip = screen.getByText('Paid');
    expect(chip.className).toMatch(/green/);
  });
  it('renders cap-full state for USDT-only 슬롯_마감_후_도달', () => {
    render(<RewardStatusLabel status="슬롯_마감_후_도달" />);
    expect(screen.getByText(/slot capacity full/i)).toBeInTheDocument();
  });
});
```

`tests/components/LiveSlotCounter.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';

describe('LiveSlotCounter', () => {
  it('shows X / 500 with mono-green when remaining > 100', () => {
    const { container } = render(<LiveSlotCounter remaining={423} />);
    expect(screen.getByText(/423/)).toBeInTheDocument();
    expect(screen.getByText('/ 500')).toBeInTheDocument();
    expect(container.querySelector('.event-tension-100, .event-tension-50, .event-tension-10')).toBeNull();
  });
  it('applies tension-100 class when remaining <= 100', () => {
    const { container } = render(<LiveSlotCounter remaining={100} />);
    expect(container.querySelector('.event-tension-100')).not.toBeNull();
  });
  it('applies tension-50 class when remaining <= 50', () => {
    const { container } = render(<LiveSlotCounter remaining={50} />);
    expect(container.querySelector('.event-tension-50')).not.toBeNull();
  });
  it('applies tension-10 class when remaining <= 10', () => {
    const { container } = render(<LiveSlotCounter remaining={5} />);
    expect(container.querySelector('.event-tension-10')).not.toBeNull();
  });
});
```

Run: `pnpm test` → both FAIL.

- [ ] **Step 2: Implement RewardStatusLabel**

`src/components/shared/RewardStatusLabel.tsx`:
```tsx
import { en } from '@/content/en';
import type { UsdtPayoutStatus, IcxPayoutStatus } from '@/lib/mock-state';

type Props = { status: UsdtPayoutStatus | IcxPayoutStatus };

const config: Record<string, { text: string; cls: string }> = {
  '미달성':              { text: en.status.locked,         cls: 'bg-surface text-muted' },
  '수령 정보 미등록':       { text: en.status.notRegistered,  cls: 'bg-amber/15 text-amber border border-amber/40' },
  '대기':                { text: en.status.pending,        cls: 'bg-blue/15 text-blue border border-blue/40' },
  '보류':                { text: en.status.review,         cls: 'bg-orange/15 text-orange border border-orange/40' },
  '완료':                { text: en.status.completed,      cls: 'bg-mono-green/15 text-mono-green border border-mono-green/40' },
  '만료':                { text: en.status.expired,        cls: 'bg-surface text-muted line-through' },
  '슬롯_마감_후_도달':       { text: en.status.capFull,        cls: 'bg-surface text-muted italic' },
};

export function RewardStatusLabel({ status }: Props) {
  const c = config[status];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${c.cls}`} data-status={status}>
      {c.text}
    </span>
  );
}
```

- [ ] **Step 3: Implement LiveSlotCounter**

`src/components/shared/LiveSlotCounter.tsx`:
```tsx
import { en } from '@/content/en';

type Props = { remaining: number };

function tensionClass(remaining: number): string {
  if (remaining <= 10) return 'event-tension-10';
  if (remaining <= 50) return 'event-tension-50';
  if (remaining <= 100) return 'event-tension-100';
  return '';
}

export function LiveSlotCounter({ remaining }: Props) {
  const tension = tensionClass(remaining);
  return (
    <div className="flex flex-col gap-1" aria-live="polite">
      <span className="text-sm text-muted">{en.slot.label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`event-countdown-numerals text-4xl font-bold ${tension}`}>{remaining}</span>
        <span className="text-lg text-muted">{en.slot.suffix}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```
Expected: both suites PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/RewardStatusLabel.tsx src/components/shared/LiveSlotCounter.tsx tests/components
git commit -m "feat: RewardStatusLabel + LiveSlotCounter with tension states"
```

---

## Task 9: Shared components — ProgressBar, CountdownTimer, Toast

**Files:**
- Create: `src/components/shared/ProgressBar.tsx`, `CountdownTimer.tsx`, `Toast.tsx`
- Test: `tests/components/ProgressBar.test.tsx`, `CountdownTimer.test.tsx`

- [ ] **Step 1: Write failing tests**

`tests/components/ProgressBar.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from '@/components/shared/ProgressBar';

describe('ProgressBar', () => {
  it('renders fill width matching percent', () => {
    const { container } = render(<ProgressBar value={250} max={500} />);
    const fill = container.querySelector('[data-fill]') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });
  it('clamps to [0, 100]%', () => {
    const { container: c1 } = render(<ProgressBar value={-50} max={500} />);
    expect((c1.querySelector('[data-fill]') as HTMLElement).style.width).toBe('0%');
    const { container: c2 } = render(<ProgressBar value={1000} max={500} />);
    expect((c2.querySelector('[data-fill]') as HTMLElement).style.width).toBe('100%');
  });
  it('attaches event-shimmer class', () => {
    const { container } = render(<ProgressBar value={250} max={500} />);
    expect(container.querySelector('.event-shimmer')).not.toBeNull();
  });
});
```

`tests/components/CountdownTimer.test.tsx`:
```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-04T00:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('renders D-3 when 3 days remain', () => {
    render(<CountdownTimer endDate="2026-07-07" />);
    expect(screen.getByText(/D-3/)).toBeInTheDocument();
  });
  it('renders D-0 on the last day', () => {
    vi.setSystemTime(new Date('2026-07-07T00:00:00Z'));
    render(<CountdownTimer endDate="2026-07-07" />);
    expect(screen.getByText(/D-0/)).toBeInTheDocument();
  });
});
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement ProgressBar**

`src/components/shared/ProgressBar.tsx`:
```tsx
type Props = { value: number; max: number; ariaLabel?: string };

export function ProgressBar({ value, max, ariaLabel }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-surface"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        data-fill
        className="event-shimmer h-full rounded-full bg-mono-green transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Implement CountdownTimer**

`src/components/shared/CountdownTimer.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';

type Props = { endDate: string };

function diff(now: Date, end: Date) {
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return { days: 0, h: 0, m: 0, s: 0, ended: true };
  return {
    days: Math.floor(ms / 86_400_000),
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
    ended: false,
  };
}

export function CountdownTimer({ endDate }: Props) {
  const end = new Date(endDate + 'T23:59:59Z');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, h, m, s, ended } = diff(now, end);
  if (ended) return <span className="event-countdown-numerals text-mono-green">D-0</span>;
  return (
    <span className="event-countdown-numerals">
      <span className="text-3xl font-bold text-mono-green">D-{days}</span>
      <span className="ml-3 hidden text-lg text-muted lg:inline">
        {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Implement Toast**

`src/components/shared/Toast.tsx`:
```tsx
'use client';

import { useEffect } from 'react';

type Props = { message: string; onClose: () => void };

export function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-surface px-4 py-3 text-sm shadow-lg ring-1 ring-mono-green/30"
    >
      {message}
    </div>
  );
}
```

- [ ] **Step 5: Run tests + commit**

```bash
pnpm test
git add src/components/shared/ProgressBar.tsx src/components/shared/CountdownTimer.tsx src/components/shared/Toast.tsx tests/components/ProgressBar.test.tsx tests/components/CountdownTimer.test.tsx
git commit -m "feat: ProgressBar, CountdownTimer, Toast shared components"
```

---

## Task 10: TopBanner with 5 variants

**Files:**
- Create: `src/components/banners/TopBanner.tsx`
- Test: `tests/components/TopBanner.test.tsx`

**Spec ref:** §9.1 triggers #1, #5, #8.

- [ ] **Step 1: Write failing tests**

`tests/components/TopBanner.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBanner } from '@/components/banners/TopBanner';

describe('TopBanner', () => {
  it('renders campaign-running variant', () => {
    render(<TopBanner variant="campaign-running" />);
    expect(screen.getByText(/Supercycl Mobile Launch Festival is live/)).toBeInTheDocument();
  });
  it('renders slots-100 variant', () => {
    render(<TopBanner variant="slots-100" />);
    expect(screen.getByText(/100 slots left/)).toBeInTheDocument();
  });
  it('renders slots-50 variant', () => {
    render(<TopBanner variant="slots-50" />);
    expect(screen.getByText(/50 slots left/)).toBeInTheDocument();
  });
  it('renders slots-10 variant with red emphasis', () => {
    const { container } = render(<TopBanner variant="slots-10" />);
    expect(screen.getByText(/10 slots left/)).toBeInTheDocument();
    expect(container.querySelector('.text-red, .bg-red\\/15')).not.toBeNull();
  });
  it('renders d-3 variant', () => {
    render(<TopBanner variant="d-3" />);
    expect(screen.getByText(/3 days until/)).toBeInTheDocument();
  });
  it('renders nothing when variant is null', () => {
    const { container } = render(<TopBanner variant={null} />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Implement**

`src/components/banners/TopBanner.tsx`:
```tsx
import { en } from '@/content/en';
import type { BannerType } from '@/lib/mock-state/selectors';
import { CAMPAIGN_START, CAMPAIGN_END } from '@/lib/mock-state';

type Props = { variant: BannerType };

const colorByVariant: Record<NonNullable<BannerType>, string> = {
  'campaign-running': 'bg-mono-green/10 text-mono-green border-mono-green/30',
  'slots-100':        'bg-amber/15 text-amber border-amber/40',
  'slots-50':         'bg-orange/15 text-orange border-orange/40',
  'slots-10':         'bg-red/15 text-red border-red/40',
  'd-3':              'bg-blue/15 text-blue border-blue/40',
};

function textFor(variant: NonNullable<BannerType>): string {
  switch (variant) {
    case 'campaign-running': return en.banner.campaignRunning(CAMPAIGN_START, CAMPAIGN_END);
    case 'slots-100':        return en.banner.slots100;
    case 'slots-50':         return en.banner.slots50;
    case 'slots-10':         return en.banner.slots10;
    case 'd-3':              return en.banner.d3;
  }
}

export function TopBanner({ variant }: Props) {
  if (!variant) return null;
  return (
    <div className={`border-b px-4 py-3 text-center text-sm ${colorByVariant[variant]}`} role="region" aria-live="polite">
      <div className="mx-auto max-w-6xl">{textFor(variant)}</div>
    </div>
  );
}
```

- [ ] **Step 3: Run tests + commit**

```bash
pnpm test
git add src/components/banners/TopBanner.tsx tests/components/TopBanner.test.tsx
git commit -m "feat: TopBanner with 5 priority-driven variants"
```

---

## Task 11: Landing components

**Files:**
- Create: `src/components/landing/LandingHero.tsx`, `RewardSummaryCard.tsx`, `ThreeStepGuide.tsx`, `JoinCta.tsx`, `Landing.tsx`

- [ ] **Step 1: LandingHero**

`src/components/landing/LandingHero.tsx`:
```tsx
import { en } from '@/content/en';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { CAMPAIGN_END } from '@/lib/mock-state';

export function LandingHero() {
  return (
    <section className="event-gradient px-6 py-12 lg:px-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-widest text-muted">{en.meta.period}</p>
          <h1 className="text-3xl font-bold leading-tight lg:text-5xl">{en.meta.title}</h1>
          <p className="text-lg text-muted lg:text-xl">{en.meta.tagline}</p>
        </div>
        <div className="hidden lg:block">
          <CountdownTimer endDate={CAMPAIGN_END} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: RewardSummaryCard**

`src/components/landing/RewardSummaryCard.tsx`:
```tsx
import { en } from '@/content/en';

export function RewardSummaryCard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
      <h2 className="mb-4 text-xl font-semibold">{en.rewards.heading}</h2>
      <ul className="grid gap-3 lg:grid-cols-2">
        <li className="rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
          <span className="text-mono-green">●</span> {en.rewards.usdtLine}
        </li>
        <li className="rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
          <span className="text-mono-green">●</span> {en.rewards.icxLine}
        </li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: ThreeStepGuide**

`src/components/landing/ThreeStepGuide.tsx`:
```tsx
import { en } from '@/content/en';

export function ThreeStepGuide() {
  const steps = [en.steps.step1, en.steps.step2, en.steps.step3];
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
      <h2 className="mb-4 text-xl font-semibold">{en.steps.heading}</h2>
      <ol className="grid gap-3 lg:grid-cols-3">
        {steps.map((label, i) => (
          <li key={i} className="rounded-xl bg-surface p-5 ring-1 ring-muted/20">
            <div className="event-countdown-numerals mb-2 text-2xl text-mono-green">{i + 1}</div>
            <p>{label}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: JoinCta**

`src/components/landing/JoinCta.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function JoinCta() {
  const { dispatch } = useMockState();
  return (
    <section className="px-6 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className="w-full rounded-xl bg-mono-green px-6 py-4 text-lg font-bold text-bg transition hover:brightness-110 lg:w-auto"
        >
          {en.cta.joinNow}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Landing root + LiveSlotCounter usage**

`src/components/landing/Landing.tsx`:
```tsx
'use client';

import { LandingHero } from './LandingHero';
import { RewardSummaryCard } from './RewardSummaryCard';
import { ThreeStepGuide } from './ThreeStepGuide';
import { JoinCta } from './JoinCta';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';
import { useMockState } from '@/lib/mock-state';

export function Landing() {
  const { state } = useMockState();
  return (
    <main>
      <LandingHero />
      <section className="mx-auto max-w-6xl px-6 py-6">
        <LiveSlotCounter remaining={state.slotsRemaining} />
      </section>
      <RewardSummaryCard />
      <ThreeStepGuide />
      <JoinCta />
    </main>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/landing
git commit -m "feat: Landing page composition with hero, rewards, steps, CTA"
```

---

## Task 12: Hub — Header, ProgressTracker, MyProgressMeter

**Files:**
- Create: `src/components/hub/HubHeader.tsx`, `ProgressTracker.tsx`, `MyProgressMeter.tsx`

- [ ] **Step 1: HubHeader with welcome card**

`src/components/hub/HubHeader.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function HubHeader() {
  const { state, dispatch } = useMockState();
  const showWelcome = !state.dismissedFlags.welcomeCard;

  return (
    <header className="px-6 py-6 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2">
        <p className="text-sm uppercase tracking-widest text-muted">{en.meta.period}</p>
        <h1 className="text-2xl font-bold lg:text-3xl">{en.meta.title}</h1>
        <a href="https://supercycl-mobile.vercel.app" className="text-sm text-mono-green hover:underline">
          {en.cta.goToMain} →
        </a>
        {showWelcome && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-surface p-4 ring-1 ring-mono-green/20">
            <p className="text-sm">{en.hub.welcomeCard}</p>
            <button
              type="button"
              aria-label="Dismiss welcome card"
              onClick={() => dispatch({ type: 'DISMISS', key: 'welcomeCard' })}
              className="text-muted hover:text-text"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: ProgressTracker**

`src/components/hub/ProgressTracker.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

type StepState = 'done' | 'inProgress' | 'locked';

function badge(s: StepState): { text: string; cls: string } {
  switch (s) {
    case 'done':       return { text: en.hub.stepDone, cls: 'text-mono-green' };
    case 'inProgress': return { text: en.hub.stepInProgress, cls: 'text-blue' };
    case 'locked':     return { text: en.hub.stepLocked, cls: 'text-muted' };
  }
}

export function ProgressTracker() {
  const { state } = useMockState();
  const step1: StepState = state.hasOkxLinked ? 'done' : 'inProgress';
  const step2: StepState =
    state.tradingVolume >= 500 ? 'done' :
    state.hasOkxLinked         ? 'inProgress' : 'locked';
  const step3: StepState =
    state.surveyCompleted          ? 'done' :
    state.tradingVolume >= 500     ? 'inProgress' : 'locked';

  const rows = [
    { num: 1, label: en.steps.step1, state: step1 },
    { num: 2, label: en.steps.step2, state: step2 },
    { num: 3, label: en.steps.step3, state: step3 },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">My progress</h2>
      <ol className="flex flex-col gap-2">
        {rows.map(r => {
          const b = badge(r.state);
          return (
            <li key={r.num} className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
              <span className="flex items-center gap-3">
                <span className="event-countdown-numerals text-mono-green">{r.num}</span>
                <span>{r.label}</span>
              </span>
              <span className={`text-sm ${b.cls}`}>{b.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

- [ ] **Step 3: MyProgressMeter**

`src/components/hub/MyProgressMeter.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useMockState } from '@/lib/mock-state';
import { daysUntilEnd } from '@/lib/mock-state';

export function MyProgressMeter() {
  const { state } = useMockState();
  const remaining = Math.max(0, 500 - state.tradingVolume);
  const days = daysUntilEnd(state);

  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-mono-green/20">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm text-muted">{en.progress.volume(state.tradingVolume)}</span>
          <span className="text-sm text-muted">{en.progress.daysLeft(days)}</span>
        </div>
        <ProgressBar value={state.tradingVolume} max={500} ariaLabel="trading volume" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-mono-green">{en.progress.remaining(remaining)}</span>
          <span className="text-muted">{en.progress.slotsLeft(state.slotsRemaining)}</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/hub/HubHeader.tsx src/components/hub/ProgressTracker.tsx src/components/hub/MyProgressMeter.tsx
git commit -m "feat: Hub header, progress tracker, progress meter"
```

---

## Task 13: Hub — Reward cards + CTA bar + Hub root

**Files:**
- Create: `src/components/hub/UsdtRewardCard.tsx`, `IcxRewardCard.tsx`, `HubCtaBar.tsx`, `Hub.tsx`

- [ ] **Step 1: UsdtRewardCard**

`src/components/hub/UsdtRewardCard.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, isQualifiedForUsdt } from '@/lib/mock-state';

export function UsdtRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const qualified = isQualifiedForUsdt(state);
  const needsRegistration = state.usdtPayoutStatus === '수령 정보 미등록';
  const reg = state.usdtRegistration;

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-muted/20">
      <header className="flex items-baseline justify-between">
        <h3 className="font-semibold">{en.rewards.usdtCardTitle}</h3>
        <RewardStatusLabel status={state.usdtPayoutStatus} />
      </header>
      {!qualified && state.usdtPayoutStatus === '미달성' && (
        <p className="text-sm text-muted">
          Trade ${Math.max(0, 500 - state.tradingVolume)} more to unlock.
        </p>
      )}
      {reg.status === 'wallet' && (
        <p className="text-xs text-muted">Wallet: {reg.trc20Address.slice(0, 4)}…{reg.trc20Address.slice(-4)}</p>
      )}
      {reg.status === 'exchange' && (
        <p className="text-xs text-muted">OKX UID: {reg.okxUid}</p>
      )}
      {state.usdtPayoutStatus === '완료' && state.usdtTxHash && (
        <p className="text-xs text-muted">TX: {state.usdtTxHash.slice(0, 10)}…</p>
      )}
      {needsRegistration && (
        <button
          type="button"
          onClick={onRegister}
          className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          {en.cta.registerUsdt}
        </button>
      )}
    </article>
  );
}
```

- [ ] **Step 2: IcxRewardCard**

`src/components/hub/IcxRewardCard.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { RewardStatusLabel } from '@/components/shared/RewardStatusLabel';
import { useMockState, effectiveIcxPayout } from '@/lib/mock-state';

export function IcxRewardCard({ onRegister }: { onRegister: () => void }) {
  const { state } = useMockState();
  const payout = effectiveIcxPayout(state);
  const needsRegistration = state.icxPayoutStatus === '수령 정보 미등록';

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-5 ring-1 ring-muted/20">
      <header className="flex items-baseline justify-between">
        <h3 className="font-semibold">{en.rewards.icxCardTitle}</h3>
        <RewardStatusLabel status={state.icxPayoutStatus} />
      </header>
      {payout.amount !== null && (
        <p className="text-sm">Reward: <span className="text-mono-green">{payout.amount} ICX</span></p>
      )}
      {payout.amount === null && state.surveyCompleted && !state.isTrader && (
        <p className="text-sm italic text-muted">{en.hub.icxNonTrader}</p>
      )}
      {state.icxAddress && <p className="text-xs text-muted">Wallet: {state.icxAddress.slice(0, 6)}…{state.icxAddress.slice(-4)}</p>}
      {state.icxPayoutStatus === '완료' && state.icxTxHash && (
        <p className="text-xs text-muted">TX: {state.icxTxHash.slice(0, 10)}…</p>
      )}
      {needsRegistration && (
        <button
          type="button"
          onClick={onRegister}
          className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
        >
          {en.cta.registerIcx}
        </button>
      )}
    </article>
  );
}
```

- [ ] **Step 3: HubCtaBar**

`src/components/hub/HubCtaBar.tsx`:
```tsx
'use client';

import { en } from '@/content/en';
import { useMockState, tradingTrackOpen, surveyTrackOpen } from '@/lib/mock-state';

export function HubCtaBar({ onStartSurvey }: { onStartSurvey: () => void }) {
  const { state } = useMockState();
  const showTrade = tradingTrackOpen(state) && state.tradingVolume < 500;
  const showSurvey = surveyTrackOpen(state) && !state.surveyCompleted;

  if (!showTrade && !showSurvey) return null;

  return (
    <section className="sticky bottom-0 bg-bg/95 px-6 py-4 backdrop-blur lg:static lg:bg-transparent lg:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row">
        {showTrade && (
          <a
            href="https://supercycl-mobile.vercel.app"
            className="flex-1 rounded-xl bg-mono-green px-6 py-4 text-center text-lg font-bold text-bg transition hover:brightness-110"
          >
            {en.cta.tradeNow} →
          </a>
        )}
        {showSurvey && (
          <button
            type="button"
            onClick={onStartSurvey}
            className="flex-1 rounded-xl border border-mono-green px-6 py-4 text-lg font-bold text-mono-green transition hover:bg-mono-green/10"
          >
            {en.cta.startSurvey}
          </button>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Hub root**

`src/components/hub/Hub.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { HubHeader } from './HubHeader';
import { ProgressTracker } from './ProgressTracker';
import { MyProgressMeter } from './MyProgressMeter';
import { UsdtRewardCard } from './UsdtRewardCard';
import { IcxRewardCard } from './IcxRewardCard';
import { HubCtaBar } from './HubCtaBar';
import { LiveSlotCounter } from '@/components/shared/LiveSlotCounter';
import { useMockState } from '@/lib/mock-state';
import { UsdtRegistrationModal } from '@/components/modals/UsdtRegistrationModal';
import { IcxRegistrationModal } from '@/components/modals/IcxRegistrationModal';
import { SurveyModal } from '@/components/modals/SurveyModal';

export function Hub() {
  const { state } = useMockState();
  const [open, setOpen] = useState<'usdt' | 'icx' | 'survey' | null>(null);

  return (
    <main className="pb-24 lg:pb-12">
      <HubHeader />
      <ProgressTracker />
      <section className="mx-auto max-w-6xl px-6">
        <LiveSlotCounter remaining={state.slotsRemaining} />
      </section>
      <MyProgressMeter />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-4 lg:grid-cols-2">
        <UsdtRewardCard onRegister={() => setOpen('usdt')} />
        <IcxRewardCard onRegister={() => setOpen('icx')} />
      </section>
      <HubCtaBar onStartSurvey={() => setOpen('survey')} />

      {open === 'usdt' && <UsdtRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'icx' && <IcxRegistrationModal onClose={() => setOpen(null)} />}
      {open === 'survey' && <SurveyModal onClose={() => setOpen(null)} />}
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/hub
git commit -m "feat: Hub composition with reward cards, CTA bar, and modal triggers"
```

---

## Task 14: Modal primitive + TermsViewerModal + ModalRoot priority logic

**Files:**
- Create: `src/components/modals/Modal.tsx`, `TermsViewerModal.tsx`, `src/lib/a11y/useFocusTrap.ts`, `useReducedMotion.ts`, `src/lib/modalPriority.ts`, `src/components/modals/ModalRoot.tsx`

**Spec ref:** §4.6 modal priority, §7 a11y.

- [ ] **Step 1: useFocusTrap hook**

`src/lib/a11y/useFocusTrap.ts`:
```ts
import { useEffect, useRef } from 'react';

export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () => Array.from(root.querySelectorAll<HTMLElement>(selector));

    focusables()[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [active]);

  return ref;
}
```

- [ ] **Step 2: useReducedMotion hook**

`src/lib/a11y/useReducedMotion.ts`:
```ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, []);
  return reduced;
}
```

- [ ] **Step 3: Modal primitive with focus trap + Esc**

`src/components/modals/Modal.tsx`:
```tsx
'use client';

import { useEffect, type ReactNode } from 'react';
import { useFocusTrap } from '@/lib/a11y/useFocusTrap';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg';
};

export function Modal({ title, onClose, children, size = 'md' }: Props) {
  const ref = useFocusTrap(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur lg:items-center"
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={e => e.stopPropagation()}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-6 ring-1 ring-mono-green/20 lg:rounded-2xl ${size === 'lg' ? 'lg:max-w-3xl' : 'lg:max-w-xl'}`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-muted hover:text-text">✕</button>
        </header>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: TermsViewerModal**

`src/components/modals/TermsViewerModal.tsx`:
```tsx
'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function TermsViewerModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.terms.title} onClose={onClose}>
      <div className="prose prose-invert max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
        <h3>Event Terms (placeholder)</h3>
        <p>Placeholder content. Replace with legal team output before launch.</p>
        <h3>Privacy Policy (placeholder)</h3>
        <p>Placeholder content. Replace with legal team output before launch.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 text-sm font-semibold text-bg">
          {en.modal.terms.close}
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: Modal priority logic**

`src/lib/modalPriority.ts`:
```ts
import type { MockState } from './mock-state';
import { isQualifiedForUsdt, surveyTrackOpen } from './mock-state';

export type ModalId = 'slotSecured' | 'halfwayMilestone' | 'nps' | null;

/**
 * Spec §9.2 priority:
 *   slot secured (eligibility crossed) > payment-complete toast (handled separately)
 *   > milestone (50%) > general (nps)
 */
export function pickAutoModal(state: MockState): ModalId {
  // NPS on/after campaign end
  if (state.simulatedDate >= '2026-07-07' && !state.dismissedFlags.npsModal) return 'nps';

  // SlotSecured: qualified + slot reached, not yet dismissed
  if (isQualifiedForUsdt(state) && state.userSlotNumber && !state.dismissedFlags.slotSecuredModal) {
    return 'slotSecured';
  }

  // Halfway milestone — 250 <= volume < 500
  if (state.tradingVolume >= 250 && state.tradingVolume < 500 && !state.dismissedFlags.halfwayMilestone) {
    return 'halfwayMilestone';
  }

  return null;
}

export function dismissKeyFor(id: NonNullable<ModalId>): keyof MockState['dismissedFlags'] {
  switch (id) {
    case 'slotSecured':      return 'slotSecuredModal';
    case 'halfwayMilestone': return 'halfwayMilestone';
    case 'nps':              return 'npsModal';
  }
}
```

- [ ] **Step 6: ModalRoot**

`src/components/modals/ModalRoot.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';
import { pickAutoModal, dismissKeyFor } from '@/lib/modalPriority';
import { SlotSecuredModal } from './SlotSecuredModal';
import { MilestoneCardModal } from './MilestoneCardModal';
import { NpsModal } from './NpsModal';

export function ModalRoot() {
  const { state, dispatch } = useMockState();
  const id = pickAutoModal(state);
  if (!id) return null;

  const close = () => dispatch({ type: 'DISMISS', key: dismissKeyFor(id) });

  switch (id) {
    case 'slotSecured':      return <SlotSecuredModal onClose={close} />;
    case 'halfwayMilestone': return <MilestoneCardModal onClose={close} />;
    case 'nps':              return <NpsModal onClose={close} />;
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/modals/Modal.tsx src/components/modals/TermsViewerModal.tsx src/components/modals/ModalRoot.tsx src/lib/modalPriority.ts src/lib/a11y
git commit -m "feat: Modal primitive with focus trap, TermsViewerModal, ModalRoot priority queue"
```

---

## Task 15: UsdtRegistrationModal + IcxRegistrationModal

**Files:**
- Create: `src/components/modals/UsdtRegistrationModal.tsx`, `IcxRegistrationModal.tsx`

**Spec ref:** §5.7 of campaign spec.

- [ ] **Step 1: UsdtRegistrationModal**

`src/components/modals/UsdtRegistrationModal.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateTrc20, validateOkxUid, validateEmail, validateTermsAgreement } from '@/lib/validators';

export function UsdtRegistrationModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useMockState();
  const [method, setMethod] = useState<'wallet' | 'exchange'>('wallet');
  const [trc20, setTrc20] = useState('');
  const [okxUid, setOkxUid] = useState('');
  const [email, setEmail] = useState('');
  const [networkOk, setNetworkOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  function submit() {
    const errs: Record<string, string> = {};
    const requireNetwork = method === 'wallet';
    const terms = validateTermsAgreement({ terms: termsOk, network: networkOk, requireNetwork });
    if (!terms.ok) errs.terms = terms.message;

    if (method === 'wallet') {
      const v = validateTrc20(trc20);
      if (!v.ok) errs.trc20 = v.message;
    } else {
      const u = validateOkxUid(okxUid);
      if (!u.ok) errs.okxUid = u.message;
      const e = validateEmail(email);
      if (!e.ok) errs.email = e.message;
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({
      type: 'SET_USDT_REGISTRATION',
      registration: method === 'wallet'
        ? { status: 'wallet', trc20Address: trc20 }
        : { status: 'exchange', okxUid, email },
    });
    dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '대기' });
    onClose();
  }

  return (
    <>
      <Modal title={en.modal.usdt.title} onClose={onClose} size="lg">
        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="sr-only">Receiving method</legend>
          <label className="flex items-center gap-3 rounded-lg bg-bg/40 p-3">
            <input type="radio" name="m" checked={method === 'wallet'} onChange={() => setMethod('wallet')} />
            {en.modal.usdt.methodWallet}
          </label>
          <label className="flex items-center gap-3 rounded-lg bg-bg/40 p-3">
            <input type="radio" name="m" checked={method === 'exchange'} onChange={() => setMethod('exchange')} />
            {en.modal.usdt.methodExchange}
          </label>
        </fieldset>

        {method === 'wallet' ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.trc20Label}</span>
              <input
                aria-invalid={!!errors.trc20}
                aria-describedby={errors.trc20 ? 'err-trc20' : undefined}
                value={trc20}
                onChange={e => setTrc20(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.trc20 && <span id="err-trc20" className="text-xs text-red">{errors.trc20}</span>}
            </label>
            <p className="rounded-md bg-amber/10 p-3 text-xs text-amber">{en.modal.usdt.trc20Warning}</p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={networkOk} onChange={e => setNetworkOk(e.target.checked)} />
              {en.modal.usdt.networkCheck}
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">{en.modal.usdt.exchangeFixed}</p>
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.okxUidLabel}</span>
              <input
                aria-invalid={!!errors.okxUid}
                aria-describedby={errors.okxUid ? 'err-okxUid' : undefined}
                value={okxUid}
                onChange={e => setOkxUid(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.okxUid && <span id="err-okxUid" className="text-xs text-red">{errors.okxUid}</span>}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm">{en.modal.usdt.okxEmailLabel}</span>
              <input
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
              />
              {errors.email && <span id="err-email" className="text-xs text-red">{errors.email}</span>}
            </label>
          </div>
        )}

        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} />
          <span>
            {en.modal.usdt.termsCheck}{' '}
            <button type="button" onClick={() => setShowTerms(true)} className="text-mono-green underline">
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red">{errors.terms}</p>}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={submit} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
            {en.modal.usdt.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
```

- [ ] **Step 2: IcxRegistrationModal**

`src/components/modals/IcxRegistrationModal.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { TermsViewerModal } from './TermsViewerModal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { validateIconAddress, validateTermsAgreement } from '@/lib/validators';

export function IcxRegistrationModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useMockState();
  const [addr, setAddr] = useState('');
  const [termsOk, setTermsOk] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  function submit() {
    const errs: Record<string, string> = {};
    const a = validateIconAddress(addr);
    if (!a.ok) errs.addr = a.message;
    const t = validateTermsAgreement({ terms: termsOk, network: false, requireNetwork: false });
    if (!t.ok) errs.terms = t.message;
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    dispatch({ type: 'SET_ICX_ADDRESS', address: addr });
    dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: '대기' });
    onClose();
  }

  return (
    <>
      <Modal title={en.modal.icx.title} onClose={onClose}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">{en.modal.icx.addressLabel}</span>
          <input
            aria-invalid={!!errors.addr}
            aria-describedby={errors.addr ? 'err-addr' : undefined}
            value={addr}
            onChange={e => setAddr(e.target.value)}
            className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
          />
          {errors.addr && <span id="err-addr" className="text-xs text-red">{errors.addr}</span>}
        </label>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" checked={termsOk} onChange={e => setTermsOk(e.target.checked)} />
          <span>
            {en.modal.icx.termsCheck}{' '}
            <button type="button" onClick={() => setShowTerms(true)} className="text-mono-green underline">
              {en.cta.viewTerms}
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red">{errors.terms}</p>}
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={submit} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
            {en.modal.icx.submit}
          </button>
        </div>
      </Modal>
      {showTerms && <TermsViewerModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/modals/UsdtRegistrationModal.tsx src/components/modals/IcxRegistrationModal.tsx
git commit -m "feat: USDT and ICX registration modals with validation + terms"
```

---

## Task 16: SurveyModal + SlotSecured + Milestone + NPS modals

**Files:**
- Create: `src/components/modals/SurveyModal.tsx`, `SlotSecuredModal.tsx`, `MilestoneCardModal.tsx`, `NpsModal.tsx`

- [ ] **Step 1: SurveyModal (13 KR questions, step form)**

`src/components/modals/SurveyModal.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { en } from '@/content/en';
import { surveyKo } from '@/content/survey-ko';
import { useMockState } from '@/lib/mock-state';

type Answer = string | string[] | number;

export function SurveyModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [done, setDone] = useState(false);

  const q = surveyKo[step];
  const last = step === surveyKo.length - 1;

  function setAnswer(v: Answer) {
    if (!q) return;
    setAnswers(a => ({ ...a, [q.id]: v }));
  }

  function next() {
    if (last) {
      dispatch({
        type: 'SET_SURVEY_COMPLETED',
        isTrader: state.tradingVolume > 0,
        at: state.simulatedDate,
      });
      dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: '수령 정보 미등록' });
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  }

  if (done) {
    return (
      <Modal title={en.modal.survey.completeTitle} onClose={onClose}>
        <p className="mb-4 text-sm">{en.modal.survey.completeBody}</p>
        <div className="rounded-lg bg-bg/40 p-4 text-sm">
          <p className="mb-2 font-semibold">Mini report</p>
          <ul className="list-inside list-disc text-muted">
            <li>Answers recorded: {Object.keys(answers).length} / {surveyKo.length}</li>
            <li>Trader profile: {state.tradingVolume > 0 ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-4 py-2 font-semibold text-bg">
            {en.modal.survey.registerIcxCta}
          </button>
        </div>
      </Modal>
    );
  }

  if (!q) return null;

  return (
    <Modal title={`${en.modal.survey.title} (${step + 1}/${surveyKo.length})`} onClose={onClose} size="lg">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted">{q.area}</p>
      <p className="mb-4 text-lg">{q.question}</p>

      {q.type === 'multi' && (
        <div className="flex flex-col gap-2">
          {q.options.map(opt => {
            const cur = (answers[q.id] as string[]) ?? [];
            return (
              <label key={opt} className="flex items-center gap-2 rounded-lg bg-bg/40 p-3">
                <input
                  type="checkbox"
                  checked={cur.includes(opt)}
                  onChange={e => setAnswer(e.target.checked ? [...cur, opt] : cur.filter(x => x !== opt))}
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {q.type === 'single' && (
        <div className="flex flex-col gap-2">
          {q.options.map(opt => (
            <label key={opt} className="flex items-center gap-2 rounded-lg bg-bg/40 p-3">
              <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === opt} onChange={() => setAnswer(opt)} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.type === 'free' && (
        <textarea
          value={(answers[q.id] as string) ?? ''}
          onChange={e => setAnswer(e.target.value)}
          className="w-full rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20"
          rows={4}
        />
      )}

      {q.type === 'scale5' && (
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setAnswer(n)}
              className={`flex-1 rounded-lg p-3 ${answers[q.id] === n ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg px-4 py-2 disabled:opacity-40"
        >
          {en.modal.survey.previous}
        </button>
        <button type="button" onClick={next} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          {last ? en.modal.survey.submit : en.modal.survey.next}
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: SlotSecuredModal**

`src/components/modals/SlotSecuredModal.tsx`:
```tsx
'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';

export function SlotSecuredModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useMockState();
  const slot = state.userSlotNumber ?? 0;
  return (
    <Modal title={en.modal.slotSecured.title(slot)} onClose={onClose}>
      <div className="event-burst mb-4 text-4xl">🎉</div>
      <p className="mb-6 text-sm">{en.modal.slotSecured.body}</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: '수령 정보 미등록' });
            onClose();
          }}
          className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg"
        >
          {en.modal.slotSecured.cta}
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: MilestoneCardModal**

`src/components/modals/MilestoneCardModal.tsx`:
```tsx
'use client';

import { Modal } from './Modal';
import { en } from '@/content/en';

export function MilestoneCardModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title={en.modal.milestone.title} onClose={onClose}>
      <p className="text-sm">{en.modal.milestone.body}</p>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          OK
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: NpsModal**

`src/components/modals/NpsModal.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { en } from '@/content/en';
import { useMockState } from '@/lib/mock-state';
import { isQualifiedForUsdt } from '@/lib/mock-state';

export function NpsModal({ onClose }: { onClose: () => void }) {
  const { state } = useMockState();
  const [score, setScore] = useState<number | null>(null);
  const needsUsdt = isQualifiedForUsdt(state) && state.usdtRegistration.status === 'none';
  const needsIcx = state.surveyCompleted && !state.icxAddress;

  return (
    <Modal title={en.modal.nps.title} onClose={onClose}>
      <p className="mb-4 text-sm">{en.modal.nps.body}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 11 }, (_, i) => i).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setScore(n)}
            className={`min-w-[2.5rem] rounded-lg p-3 text-sm ${score === n ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
          >
            {n}
          </button>
        ))}
      </div>
      {(needsUsdt || needsIcx) && (
        <p className="mb-4 rounded-md bg-amber/10 p-3 text-sm text-amber">{en.modal.nps.registerReminder}</p>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="rounded-lg bg-mono-green px-5 py-2 font-semibold text-bg">
          Submit
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/modals/SurveyModal.tsx src/components/modals/SlotSecuredModal.tsx src/components/modals/MilestoneCardModal.tsx src/components/modals/NpsModal.tsx
git commit -m "feat: SurveyModal (13Q), SlotSecured, Milestone, NPS modals"
```

---

## Task 17: DebugDrawer skeleton + Auth/Trading/Slots sections

**Files:**
- Create: `src/components/debug/DebugDrawer.tsx`, `AuthSection.tsx`, `TradingSection.tsx`, `SlotsSection.tsx`

- [ ] **Step 1: DebugDrawer shell**

`src/components/debug/DebugDrawer.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { AuthSection } from './AuthSection';
import { TradingSection } from './TradingSection';
import { SlotsSection } from './SlotsSection';
import { UsdtSection } from './UsdtSection';
import { SurveySection } from './SurveySection';
import { IcxSection } from './IcxSection';
import { TimeSection } from './TimeSection';
import { ViewportSection } from './ViewportSection';
import { FlagsSection } from './FlagsSection';
import { useMockState } from '@/lib/mock-state';
import { clearState } from '@/lib/mock-state/persistence';
import { initialState } from '@/lib/mock-state';

export function DebugDrawer() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useMockState();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setOpen(o => !o);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function exportState() {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
  }
  async function importState() {
    const raw = window.prompt('Paste exported state JSON');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      dispatch({ type: 'IMPORT_STATE', state: { ...initialState, ...parsed } });
    } catch {
      window.alert('Invalid JSON');
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open debug drawer"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 rounded-full bg-surface p-3 text-mono-green ring-1 ring-mono-green/30 shadow-lg"
      >
        🐞
      </button>
      {open && (
        <aside
          role="complementary"
          aria-label="Mock state toggles"
          className="fixed bottom-0 right-0 z-50 max-h-[50vh] w-full overflow-y-auto bg-surface p-5 shadow-2xl ring-1 ring-mono-green/20 lg:bottom-auto lg:right-0 lg:top-0 lg:h-screen lg:max-h-screen lg:w-[420px]"
        >
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Mock State Toggles</h2>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-muted hover:text-text">✕</button>
          </header>
          <div className="flex flex-col gap-6 text-sm">
            <AuthSection />
            <TradingSection />
            <SlotsSection />
            <UsdtSection />
            <SurveySection />
            <IcxSection />
            <TimeSection />
            <ViewportSection />
            <FlagsSection />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  clearState();
                  dispatch({ type: 'RESET_ALL' });
                }}
                className="rounded-md bg-red/15 px-3 py-2 text-red ring-1 ring-red/40"
              >
                Reset all
              </button>
              <button type="button" onClick={exportState} className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20">
                Export
              </button>
              <button type="button" onClick={importState} className="rounded-md bg-bg/40 px-3 py-2 ring-1 ring-muted/20">
                Import
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
```

- [ ] **Step 2: AuthSection**

`src/components/debug/AuthSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

export function AuthSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Auth</h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_in' })}
          className={`rounded-md px-3 py-1 ${state.authStatus === 'logged_in' ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
        >
          Logged in
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH', status: 'logged_out' })}
          className={`rounded-md px-3 py-1 ${state.authStatus === 'logged_out' ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
        >
          Logged out
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={state.hasKyc} onChange={() => dispatch({ type: 'TOGGLE_KYC' })} />
          KYC done
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={state.hasOkxLinked} onChange={() => dispatch({ type: 'TOGGLE_OKX' })} />
          OKX linked
        </label>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: TradingSection**

`src/components/debug/TradingSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

const PRESETS = [0, 250, 499, 500, 1500];

export function TradingSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Trading</h3>
      <p>Volume: ${state.tradingVolume}</p>
      <input
        type="range"
        min={0}
        max={2000}
        step={10}
        value={state.tradingVolume}
        onChange={e => dispatch({ type: 'SET_TRADING_VOLUME', value: Number(e.target.value) })}
        className="w-full"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => dispatch({ type: 'SET_TRADING_VOLUME', value: p })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            ${p}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: SlotsSection**

`src/components/debug/SlotsSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

const PRESETS = [500, 423, 100, 50, 10, 0];

export function SlotsSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Slots</h3>
      <p>Remaining: {state.slotsRemaining} / 500</p>
      <p>My slot #: {state.userSlotNumber ?? '—'}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => dispatch({ type: 'SET_SLOTS_REMAINING', value: p })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'CLAIM_SLOT', slotNumber: 500 - state.slotsRemaining, reachedAt: state.simulatedDate })}
          className="rounded-md bg-mono-green/15 px-2 py-1 text-xs text-mono-green"
        >
          Claim slot
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/debug/DebugDrawer.tsx src/components/debug/AuthSection.tsx src/components/debug/TradingSection.tsx src/components/debug/SlotsSection.tsx
git commit -m "feat: DebugDrawer shell with Auth/Trading/Slots sections"
```

---

## Task 18: Remaining debug sections — USDT/Survey/ICX/Time/Viewport/Flags

**Files:**
- Create: `src/components/debug/UsdtSection.tsx`, `SurveySection.tsx`, `IcxSection.tsx`, `TimeSection.tsx`, `ViewportSection.tsx`, `FlagsSection.tsx`

- [ ] **Step 1: UsdtSection**

`src/components/debug/UsdtSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';
import type { UsdtPayoutStatus } from '@/lib/mock-state';

const STATUSES: UsdtPayoutStatus[] = ['미달성', '수령 정보 미등록', '대기', '보류', '완료', '만료', '슬롯_마감_후_도달'];

export function UsdtSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">USDT</h3>
      <p className="mb-1 text-xs">Registration: {state.usdtRegistration.status}</p>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'none' } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">None</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'wallet', trc20Address: 'T' + 'a'.repeat(33) } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Wallet (sample)</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_USDT_REGISTRATION', registration: { status: 'exchange', okxUid: '12345678', email: 'test@okx.com' } })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Exchange (sample)</button>
      </div>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.usdtPayoutStatus}
          onChange={e => dispatch({ type: 'SET_USDT_PAYOUT_STATUS', status: e.target.value as UsdtPayoutStatus, txHash: e.target.value === '완료' ? '0xMOCKtxhash' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </section>
  );
}
```

- [ ] **Step 2: SurveySection**

`src/components/debug/SurveySection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

export function SurveySection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Survey</h3>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.surveyCompleted}
            onChange={() => dispatch({
              type: 'SET_SURVEY_COMPLETED',
              isTrader: state.isTrader,
              at: state.simulatedDate,
            })}
          />
          Completed
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.isTrader}
            onChange={() => dispatch({
              type: 'SET_SURVEY_COMPLETED',
              isTrader: !state.isTrader,
              at: state.simulatedDate,
            })}
          />
          Is trader
        </label>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: IcxSection**

`src/components/debug/IcxSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';
import type { IcxPayoutStatus } from '@/lib/mock-state';

const STATUSES: IcxPayoutStatus[] = ['미달성', '수령 정보 미등록', '대기', '보류', '완료', '만료'];

export function IcxSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">ICX</h3>
      <p className="mb-1 text-xs">Address: {state.icxAddress ?? '—'}</p>
      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'SET_ICX_ADDRESS', address: null })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Clear</button>
        <button type="button" onClick={() => dispatch({ type: 'SET_ICX_ADDRESS', address: 'hx' + 'a'.repeat(40) })} className="rounded-md bg-bg/40 px-2 py-1 text-xs">Sample</button>
      </div>
      <label className="flex items-center gap-2 text-xs">
        Status:
        <select
          value={state.icxPayoutStatus}
          onChange={e => dispatch({ type: 'SET_ICX_PAYOUT_STATUS', status: e.target.value as IcxPayoutStatus, txHash: e.target.value === '완료' ? '0xMOCKicxtx' : null })}
          className="rounded-md bg-bg/40 px-2 py-1"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </section>
  );
}
```

- [ ] **Step 4: TimeSection**

`src/components/debug/TimeSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

const JUMPS: { label: string; date: string }[] = [
  { label: 'D-day',         date: '2026-06-08' },
  { label: 'Mid',           date: '2026-06-25' },
  { label: 'End-trade',     date: '2026-06-28' },
  { label: 'Start-survey',  date: '2026-06-29' },
  { label: 'D-3',           date: '2026-07-04' },
  { label: 'End',           date: '2026-07-07' },
  { label: '30d-cutoff',    date: '2026-08-07' },
];

export function TimeSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Time</h3>
      <input
        type="date"
        value={state.simulatedDate}
        onChange={e => dispatch({ type: 'SET_SIMULATED_DATE', date: e.target.value })}
        className="rounded-md bg-bg/40 px-2 py-1"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {JUMPS.map(j => (
          <button
            key={j.label}
            type="button"
            onClick={() => dispatch({ type: 'SET_SIMULATED_DATE', date: j.date })}
            className="rounded-md bg-bg/40 px-2 py-1 text-xs"
          >
            {j.label}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: ViewportSection**

`src/components/debug/ViewportSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';
import type { DebugViewport } from '@/lib/mock-state';

const OPTS: DebugViewport[] = ['auto', 'mobile-390', 'tablet-768', 'desktop-1280'];

export function ViewportSection() {
  const { state, dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Viewport</h3>
      <div className="flex flex-wrap gap-2">
        {OPTS.map(o => (
          <button
            key={o}
            type="button"
            onClick={() => dispatch({ type: 'SET_VIEWPORT', viewport: o })}
            className={`rounded-md px-3 py-1 ${state.debugViewport === o ? 'bg-mono-green text-bg' : 'bg-bg/40'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: FlagsSection**

`src/components/debug/FlagsSection.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';

export function FlagsSection() {
  const { dispatch } = useMockState();
  return (
    <section>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Flags</h3>
      <button
        type="button"
        onClick={() => dispatch({ type: 'RESET_DISMISSED' })}
        className="rounded-md bg-bg/40 px-3 py-1 text-xs"
      >
        Reset all dismissed
      </button>
    </section>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/debug/UsdtSection.tsx src/components/debug/SurveySection.tsx src/components/debug/IcxSection.tsx src/components/debug/TimeSection.tsx src/components/debug/ViewportSection.tsx src/components/debug/FlagsSection.tsx
git commit -m "feat: remaining DebugDrawer sections (USDT/Survey/ICX/Time/Viewport/Flags)"
```

---

## Task 19: App wiring — Root layout, main page, legal meta pages, viewport frame

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/app/(legal)/terms/page.tsx`, `src/app/(legal)/privacy/page.tsx`, `src/components/ViewportFrame.tsx`, `src/components/shared/InconsistentStateWarning.tsx`

- [ ] **Step 1: ViewportFrame wrapper**

`src/components/ViewportFrame.tsx`:
```tsx
'use client';

import { type ReactNode } from 'react';
import { useMockState } from '@/lib/mock-state';

const WIDTHS: Record<string, number> = {
  'mobile-390': 390,
  'tablet-768': 768,
  'desktop-1280': 1280,
};

export function ViewportFrame({ children }: { children: ReactNode }) {
  const { state } = useMockState();
  if (state.debugViewport === 'auto') return <>{children}</>;
  const width = WIDTHS[state.debugViewport]!;
  return (
    <div className="flex min-h-screen justify-center bg-black/40 p-6">
      <div className="border border-mono-green/40 shadow-2xl" style={{ width, minHeight: '90vh', maxWidth: '100%' }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: InconsistentStateWarning**

`src/components/shared/InconsistentStateWarning.tsx`:
```tsx
'use client';

import { useMockState } from '@/lib/mock-state';
import { en } from '@/content/en';

function inconsistencies(s: ReturnType<typeof useMockState>['state']): string[] {
  const out: string[] = [];
  if (s.usdtPayoutStatus === '완료' && s.usdtRegistration.status === 'none') {
    out.push('USDT marked Paid but no registration recorded');
  }
  if (s.icxPayoutStatus === '완료' && !s.icxAddress) {
    out.push('ICX marked Paid but no address recorded');
  }
  if (s.userSlotNumber && s.tradingVolume < 500) {
    out.push('Slot claimed but trading volume < $500');
  }
  return out;
}

export function InconsistentStateWarning() {
  const { state } = useMockState();
  const list = inconsistencies(state);
  if (list.length === 0) return null;
  return (
    <div className="border-l-4 border-red bg-red/10 px-4 py-2 text-xs text-red">
      <p className="font-semibold">⚠️ {en.errors.inconsistentState}</p>
      <ul className="list-inside list-disc">
        {list.map(m => <li key={m}>{m}</li>)}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Update root layout to mount Drawer + Frame**

`src/app/layout.tsx`:
```tsx
import './globals.css';
import { MockStateProvider } from '@/lib/mock-state';
import { DebugDrawer } from '@/components/debug/DebugDrawer';
import { ViewportFrame } from '@/components/ViewportFrame';
import { InconsistentStateWarning } from '@/components/shared/InconsistentStateWarning';

export const metadata = {
  title: 'Supercycl Mobile Launch Festival',
  description: 'TRADE DIFFERENT · RIDE THE SUPERCYCL — 1 month launch campaign',
  openGraph: {
    title: 'Supercycl Mobile Launch Festival',
    description: 'Trade $500 → 20 USDT · Complete survey → ICX. Limited 1-month event.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MockStateProvider>
          <InconsistentStateWarning />
          <ViewportFrame>{children}</ViewportFrame>
          <DebugDrawer />
        </MockStateProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Main page — branches with TopBanner + ModalRoot**

`src/app/page.tsx`:
```tsx
'use client';

import { useMockState, bannerType } from '@/lib/mock-state';
import { TopBanner } from '@/components/banners/TopBanner';
import { Landing } from '@/components/landing/Landing';
import { Hub } from '@/components/hub/Hub';
import { ModalRoot } from '@/components/modals/ModalRoot';

export default function Page() {
  const { state } = useMockState();
  return (
    <>
      <TopBanner variant={bannerType(state)} />
      {state.authStatus === 'logged_out' ? <Landing /> : <Hub />}
      <ModalRoot />
    </>
  );
}
```

- [ ] **Step 5: Legal meta pages**

`src/app/(legal)/terms/page.tsx`:
```tsx
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-invert">
      <h1>Event Terms (placeholder)</h1>
      <p>This is a placeholder. Replace with the legal team's finalized event terms before launch.</p>
      <h2>Eligibility</h2>
      <p>YouthMeta member with completed OKX exchange link.</p>
      <h2>Reward forfeiture</h2>
      <p>Slot forfeiture conditions are governed by the operations team's discretion under these terms.</p>
      <h2>Disputes</h2>
      <p>Contact event support via the in-app FAQ.</p>
    </main>
  );
}
```

`src/app/(legal)/privacy/page.tsx`:
```tsx
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-invert">
      <h1>Event Privacy Policy (placeholder)</h1>
      <p>This is a placeholder. Replace with the legal team's finalized privacy policy before launch.</p>
      <h2>Data collected</h2>
      <ul>
        <li>Registered TRC20 address or OKX UID/email for reward payout.</li>
        <li>ICON wallet address for ICX payout.</li>
      </ul>
      <h2>Retention</h2>
      <p>Retained for the duration of the campaign + 30 days for payout administration.</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify + commit**

```bash
pnpm test
pnpm build
git add src/app src/components/ViewportFrame.tsx src/components/shared/InconsistentStateWarning.tsx
git commit -m "feat: wire app entry — layout, main branch, legal pages, viewport frame, inconsistency warning"
```

---

## Task 20: Accessibility audit & polish

**Files:**
- Modify: `src/components/modals/Modal.tsx` (already has focus trap + Esc — verify), `src/components/shared/*.tsx`, `src/lib/tokens/event-accents.css`

**Spec ref:** §7 accessibility.

- [ ] **Step 1: Manual a11y checklist (record results in commit message)**

Run `pnpm dev` and open `http://localhost:3000`. Verify each item:

1. **Keyboard-only navigation**
   - Tab through Landing → CTA reachable, ring-visible focus indicator
   - Click Join → Hub renders
   - Tab through Hub → each reward card and CTA reachable
   - Open USDT modal via keyboard, Tab cycles within modal, Esc closes, focus returns to invoking button
   - Repeat for ICX modal, Survey modal

2. **Reduced motion**
   - DevTools → Rendering → "prefers-reduced-motion: reduce" → reload
   - Confirm `event-shimmer`, `event-tension-10` pulse, `event-burst` are stilled

3. **Screen reader smoke (VoiceOver on macOS — `Cmd+F5`)**
   - Headings announce in correct order on Landing and Hub
   - LiveSlotCounter announces "Trading slots remaining 423 of 500"
   - TopBanner is announced as a live region when remaining drops to 100/50/10
   - Modal announces "dialog" with title

4. **Color contrast (DevTools → Lighthouse)**
   - Run Lighthouse accessibility audit on Landing and Hub
   - Target: ≥ 95 score. If status chips fail AA, bump their text color brightness in `RewardStatusLabel`.

- [ ] **Step 2: Fix issues found during audit**

If any contrast issues found, adjust the chip color/text combo in `src/components/shared/RewardStatusLabel.tsx`. Example fix if `text-amber` on `bg-amber/15` fails:
```tsx
'수령 정보 미등록': { text: en.status.notRegistered, cls: 'bg-amber/20 text-amber border border-amber/50' },
```

If focus indicators are weak, add to `globals.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-mono-green);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Commit**

```bash
git add -p   # review and stage only a11y fixes
git commit -m "fix(a11y): improve focus visibility and chip contrast based on audit"
```

If no changes needed, skip the commit and proceed.

---

## Task 21: QA checklist + final verification

**Files:**
- Create: `docs/qa-checklist.md`

- [ ] **Step 1: Write the checklist**

`docs/qa-checklist.md`:
```markdown
# QA Checklist — Supercycl Event Page Prototype

Run with `pnpm dev`. Use the DebugDrawer (⌘+\) to drive state.

## Landing (logged_out)
- [ ] Mobile (Viewport=390): single-column scroll, Join CTA full-width
- [ ] Desktop (Viewport=1280): hero left/right split, max-w applied, countdown visible
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
- [ ] USDT Registration=Wallet, Status=대기            → UsdtRewardCard chip "Pending"
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

## Toast (manual trigger)
- [ ] Trigger: set USDT status to 완료 then back; observe RewardStatusLabel update (toast variant requires extra wiring — currently label-only is sufficient for prototype)

## DebugDrawer
- [ ] ⌘+\ toggles drawer (mobile: bottom sheet · desktop: right drawer)
- [ ] Every section's toggles update the corresponding UI live
- [ ] Quick-jump dates work for all 7 presets
- [ ] Viewport buttons frame the page at the chosen width
- [ ] Export copies JSON to clipboard
- [ ] Import accepts pasted JSON
- [ ] Reset all restores initial state and clears localStorage
- [ ] Reset all dismissed re-enables modals
- [ ] InconsistentStateWarning appears when forcing impossible combos
      (e.g., USDT Status=완료 with Registration=none — guard should prevent this;
       force via Import or by setting status before registration)

## Accessibility
- [ ] Keyboard-only completion of Landing → Hub → USDT modal submit → Survey modal submit
- [ ] :focus-visible ring visible on all interactive elements
- [ ] prefers-reduced-motion silences shimmer, pulse, burst
- [ ] Lighthouse a11y score ≥ 95 on Landing and Hub
- [ ] Status chip contrast ≥ 4.5:1 for AA

## Persistence
- [ ] Change state, hard reload — state restored
- [ ] Delete localStorage key in DevTools, reload — back to initialState
- [ ] Open Import with garbage text — graceful "Invalid JSON" alert

## Legal pages
- [ ] /terms renders standalone with placeholder content
- [ ] /privacy renders standalone with placeholder content
- [ ] Both linked via TermsViewerModal "View terms" button from inside USDT/ICX modals

## Build
- [ ] `pnpm test` passes (validators + selectors + components)
- [ ] `pnpm build` produces .next/ without warnings
- [ ] `pnpm start` serves production build
```

- [ ] **Step 2: Run final verification**

```bash
pnpm test
pnpm build
pnpm start &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
kill %1
```

Expected: tests pass · build succeeds · production server returns `200`.

- [ ] **Step 3: Work through the QA checklist manually**

Open `pnpm dev`, drive each persona via DebugDrawer, tick boxes in `docs/qa-checklist.md`. Address any gaps before declaring complete.

- [ ] **Step 4: Final commit**

```bash
git add docs/qa-checklist.md
git commit -m "docs: QA checklist for event page prototype"
```

---

## Self-Review

**1. Spec coverage** (mapped against `2026-05-20-event-page-design.md`)

| Spec section | Implementing tasks |
|---|---|
| §1.1 Directory structure | Task 0 (bootstrap), Tasks 8–18 (each component file) |
| §1.2 Page entry flow | Task 19 (main page) |
| §2.1 MockState 10 dimensions | Task 3 (types) |
| §2.2 Time quick jump | Task 18 (TimeSection) |
| §2.3 Selectors | Task 5 |
| §2.4 Persistence | Task 4 (persistence.ts) |
| §2.5 DebugDrawer UI | Tasks 17–18 |
| §3 Responsive (mobile-first + lg:) | All component tasks (Tailwind classes inline) |
| §4.1 Landing | Task 11 |
| §4.2 Hub | Tasks 12–13 |
| §4.3 Modals (7) | Tasks 14–16 |
| §4.4 Shared components | Tasks 8–9 |
| §4.5 DebugDrawer | Tasks 17–18 |
| §4.6 ModalRoot priority | Task 14 (modalPriority.ts) |
| §4.7 Trigger ↔ component mapping | Verified in Task 21 checklist |
| §5.1 Data flow | Task 4 (reducer) + Task 6 (provider) |
| §5.2 Input validation | Task 2 |
| §5.3 Error matrix A/B/C | Task 15 (inline errors), Task 13 (qualified gating), Task 19 (InconsistentStateWarning) |
| §5.4 Dismiss policy | Task 4 (DISMISS action) + Task 14 (ModalRoot) + Task 18 (Reset flags) |
| §5.5 Transition guards | Task 4 (reducer guards) |
| §6 Design accents | Task 1 (event-accents.css) |
| §7 Accessibility | Task 14 (focus trap, Esc), Task 20 (audit) |
| §8.1 Unit tests | Tasks 2, 4, 5, 8, 9, 10 |
| §8.3 QA checklist | Task 21 |
| §8.4 CI build | Task 21 |

All sections accounted for.

**2. Placeholder scan**

- Legal MDX files and `/terms`, `/privacy` pages explicitly labeled "placeholder" — intentional per Open Issue F-2.
- IcxRewardCard `en.hub.icxNonTrader` carries "TBD (pending operations decision)" — intentional per Open Issue F-5; `effectiveIcxPayout` returns `{ amount: null }` for non-traders, surfaced as italic muted text.
- OKX UID regex carries `Open Issue F-1` comment for future refinement — single source of truth.
- No "TODO" / "implement later" / "Add appropriate X" patterns remain.

**3. Type consistency**

- `ValidationResult` is exported once from `trc20.ts` and reused by all other validators via type-only import.
- `UsdtPayoutStatus` / `IcxPayoutStatus` enums identical between `types.ts`, `RewardStatusLabel`, and `UsdtSection`/`IcxSection` debug controls.
- `BannerType` exported from `selectors.ts` and consumed by `TopBanner.tsx` — variants match 1:1.
- `Action` discriminated union covers every dispatch site (verified by `pnpm build` step).
- `useMockState()` return type identical at every call site.

No issues found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-20-event-page.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best when you want me to keep close oversight without burning the main context on file edits.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

**Which approach?**