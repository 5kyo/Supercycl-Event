'use client';

import { useMockState } from '@/lib/mock-state';
import { en } from '@/content/en';
import type { MockState } from '@/lib/mock-state';

function inconsistencies(s: MockState): string[] {
  const out: string[] = [];
  if (s.usdtPayoutStatus === 'PAID' && s.usdtRegistration.status === 'none') {
    out.push('USDT marked Paid but no registration recorded');
  }
  if (s.icxPayoutStatus === 'PAID' && !s.icxAddress) {
    out.push('ICX marked Paid but no address recorded');
  }
  return out;
}

export function InconsistentStateWarning() {
  const { state } = useMockState();
  const list = inconsistencies(state);
  if (list.length === 0) return null;
  return (
    <div
      className="border-l-4 border-red bg-red/10 px-md py-sm text-body-sm text-red"
      role="alert"
    >
      <p className="font-semibold">⚠️ {en.errors.inconsistentState}</p>
      <ul className="list-inside list-disc">
        {list.map(m => <li key={m}>{m}</li>)}
      </ul>
    </div>
  );
}
