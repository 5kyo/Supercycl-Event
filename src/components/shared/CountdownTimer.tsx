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
  // `null` on server + first client render so SSR markup matches; switched to
  // a real Date in a mount effect, after which the interval keeps it fresh.
  // Avoids the SSR-vs-client clock-skew hydration mismatch for HH:MM:SS.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = daysBetween(state.simulatedDate, endDate);
  const time = now ? hms(now, endDate) : null;

  if (time?.ended && days === 0) {
    return <span className="event-countdown-numerals text-accent text-display-md">D-0</span>;
  }
  return (
    <div className="flex items-baseline gap-md">
      <span
        className="event-countdown-numerals text-3xl font-bold lg:text-display-lg"
        style={{
          backgroundImage: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        D-{days}
      </span>
      {time && (
        <span className="event-countdown-numerals hidden text-body-lg text-text-tertiary lg:inline">
          {String(time.h).padStart(2, '0')}:{String(time.m).padStart(2, '0')}:{String(time.s).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}
