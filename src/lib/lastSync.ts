import { useEffect, useState } from 'react';

// Mock "last synced" anchor for the trading-volume surfaces. The backend
// snapshot is on a ~5 min cadence (spec §5.3 / §7.5), so we seed the anchor
// at 3 minutes-in-the-past on module init so the UI doesn't read as "just
// now / live" — it should always look slightly stale to set expectations.
// Persists for the lifetime of the page session; both MyProgressMeter and
// CampaignHero read the same constant so the two surfaces never disagree.
const LAST_SYNC_MS = Date.now() - 3 * 60 * 1000;

export function getLastSyncMs(): number {
  return LAST_SYNC_MS;
}

/** Re-render hook that ticks every `intervalMs` so relative-time labels
 *  ("3 min ago", "4 min ago", ...) advance without manual refresh. */
export function useNow(intervalMs: number = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function formatRelativeTime(thenMs: number, nowMs: number): string {
  const diffSec = Math.max(0, Math.floor((nowMs - thenMs) / 1000));
  if (diffSec < 30) return 'just now';
  if (diffSec < 60) return 'less than a minute ago';
  const min = Math.floor(diffSec / 60);
  if (min < 60) return min === 1 ? '1 min ago' : `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr === 1 ? '1 hr ago' : `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  return day === 1 ? '1 day ago' : `${day} days ago`;
}
