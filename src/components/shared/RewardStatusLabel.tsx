import { en } from '@/content/en';
import type { UsdtPayoutStatus, IcxPayoutStatus } from '@/lib/mock-state';

/** UI-only states that don't live in the backend payout enums. `open` flips on
 * for ICX while the survey window is live and the user hasn't finished — at
 * that point "Locked" is misleading because a Start survey CTA sits right
 * below the chip. */
export type UiOnlyStatus = 'open';

type Props = {
  status: UsdtPayoutStatus | IcxPayoutStatus | UiOnlyStatus;
  /** Optional context appended after a `·` separator (e.g. "Opens Jun 29"
   * on a Locked chip before the survey window opens). */
  suffix?: string;
};

/* Chip class names intentionally retain the legacy palette tokens (amber,
 * mono-green) so existing tests and contrast expectations are unchanged. */
const config: Record<string, { text: string; cls: string }> = {
  'NOT_REACHED':     { text: en.status.locked,         cls: 'bg-surface-2 text-text-tertiary border border-border-subtle' },
  'open':            { text: en.status.open,           cls: 'bg-transparent text-mono-green border border-mono-green/60' },
  'AWAITING_PAYOUT': { text: en.status.awaitingPayout, cls: 'bg-amber/15 text-amber border border-amber/40' },
  'PAID':            { text: en.status.completed,      cls: 'bg-mono-green/15 text-mono-green border border-mono-green/40' },
};

export function RewardStatusLabel({ status, suffix }: Props) {
  const c = config[status];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center gap-xs rounded-full px-3 py-1 text-label-sm whitespace-nowrap ${c.cls}`}
      data-status={status}
    >
      {c.text}
      {suffix && <span className="opacity-70"> · {suffix}</span>}
    </span>
  );
}
