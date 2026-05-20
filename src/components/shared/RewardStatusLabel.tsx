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
