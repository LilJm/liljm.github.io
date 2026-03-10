import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme(): ['light' | 'dark', (theme: 'light' | 'dark') => void] {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  return [theme, setTheme];
}
