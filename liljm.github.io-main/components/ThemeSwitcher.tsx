import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center px-4 py-3 my-1 rounded-lg text-left text-text-light dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-3" /> : <SunIcon className="h-5 w-5 mr-3" />}
      <span className="font-medium">
        {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
