import { en } from '@/content/en';
import type { UsdtPayoutStatus, IcxPayoutStatus } from '@/lib/mock-state';

/** UI-only states that don't live in the backend payout enums. `open` flips on
 * for ICX while the survey window is live and the user hasn't finished — at
 * that point "Locked" is misleading because a Start survey CTA sits right
 * below the chip. */
export type UiOnlyStatus = 'open';

type Props = { status: UsdtPayoutStatus | IcxPayoutStatus | UiOnlyStatus };

/* Chip class names intentionally retain the legacy palette tokens (amber, blue,
 * orange, mono-green) so existing tests and contrast expectations are unchanged.
 * Alpha syntax (`/15`, `/40`) now works correctly thanks to the channel-format
 * color tokens in tailwind.config.ts. */
const config: Record<string, { text: string; cls: string }> = {
  '미달성':              { text: en.status.locked,         cls: 'bg-surface-2 text-text-tertiary border border-border-subtle' },
  'open':                { text: en.status.open,           cls: 'bg-transparent text-mono-green border border-mono-green/60' },
  '수령 정보 미등록':       { text: en.status.notRegistered,  cls: 'bg-amber/15 text-amber border border-amber/40' },
  '대기':                { text: en.status.pending,        cls: 'bg-blue/15 text-blue border border-blue/40' },
  '보류':                { text: en.status.review,         cls: 'bg-orange/15 text-orange border border-orange/40' },
  '완료':                { text: en.status.completed,      cls: 'bg-mono-green/15 text-mono-green border border-mono-green/40' },
  '만료':                { text: en.status.expired,        cls: 'bg-surface-2 text-text-tertiary border border-border-subtle line-through' },
  '슬롯_마감_후_도달':       { text: en.status.capFull,        cls: 'bg-surface-2 text-text-tertiary border border-border-subtle italic' },
};

export function RewardStatusLabel({ status }: Props) {
  const c = config[status];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center gap-xs rounded-full px-3 py-1 text-label-sm whitespace-nowrap ${c.cls}`}
      data-status={status}
    >
      {c.text}
    </span>
  );
}
