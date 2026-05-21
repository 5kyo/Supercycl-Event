'use client';

import { useEffect, useState } from 'react';

/**
 * True when the page is loaded inside the ViewportFrame iframe simulator
 * (URL carries `?embed=1`). SSR returns false; the post-hydration value
 * flips on the client.
 */
export function useIsEmbedded(): boolean {
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmbedded(params.get('embed') === '1');
  }, []);
  return embedded;
}
