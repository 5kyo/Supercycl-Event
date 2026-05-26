import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia; components that read prefers-reduced-motion
// (NumberRoller, useReducedMotion) crash without this. Default to "no preference".
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
