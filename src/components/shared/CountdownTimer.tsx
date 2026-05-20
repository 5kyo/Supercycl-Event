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
