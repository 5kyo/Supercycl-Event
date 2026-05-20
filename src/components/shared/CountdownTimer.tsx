'use client';

import { useEffect, useState } from 'react';
import { useMockState } from '@/lib/mock-state';

type Props = { endDate: string };

function daysBetween(simulatedDateStr: string, endDateStr: string): number {
  const sim = new Date(simulatedDateStr + 'T00:00:00Z').getTime();
  const end = new Date(endDateStr + 'T23:59:59Z').getTime();
  return Math.max(0, Math.floor((end - sim) / 86_400_000));
}

function hms(now: Date, endDateStr: string) {
  const end = new Date(endDateStr + 'T23:59:59Z').getTime();
  const ms = end - now.getTime();
  if (ms <= 0) return { h: 0, m: 0, s: 0, ended: true };
  return {
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
    ended: false,
  };
}

export function CountdownTimer({ endDate }: Props) {
  const { state } = useMockState();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = daysBetween(state.simulatedDate, endDate);
  const { h, m, s, ended } = hms(now, endDate);

  if (ended && days === 0) {
    return <span className="event-countdown-numerals text-mono-green">D-0</span>;
  }
  return (
    <span className="event-countdown-numerals">
      <span className="text-3xl font-bold text-mono-green">D-{days}</span>
      <span className="ml-3 hidden text-lg text-muted lg:inline">
        {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </span>
  );
}
