export const scrollTopSmooth = () =>
  typeof window !== 'undefined' &&
  window.scrollTo({ top: 0, behavior: 'smooth' });
