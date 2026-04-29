import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'bms_theme_v4';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const body = document.body;
    body.classList.remove('dark', 'light');
    body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
