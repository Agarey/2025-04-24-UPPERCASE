import React, { createContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';
export interface ThemeCtxValue {
  theme: Theme;
  toggle: () => void;
}

export const ThemeCtx = createContext<ThemeCtxValue>({
  theme: 'light',
  toggle: () => {},
});

const LS_KEY = 'theme';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(LS_KEY) as Theme | null;
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (t: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t;
  }
  localStorage.setItem(LS_KEY, t);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => applyTheme(theme), [theme]);

  const value = useMemo<ThemeCtxValue>(
    () => ({ theme, toggle: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')) }),
    [theme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};
