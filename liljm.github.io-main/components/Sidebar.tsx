import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { HeartIcon } from './icons/HeartIcon';
import { LogOutIcon } from './icons/LogOutIcon';
import { DropletIcon } from './icons/DropletIcon';
import { HomeIcon } from './icons/HomeIcon'; // Import HomeIcon
import { User } from '../types';
import ThemeSwitcher from './ThemeSwitcher';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Início', icon: HomeIcon }, // Add Home to nav
  { id: 'planner', label: 'Planejador', icon: LeafIcon },
  { id: 'recipes', label: 'Receitas', icon: BookOpenIcon },
  { id: 'water', label: 'Controle de Água', icon: DropletIcon },
  { id: 'saved', label: 'Planos Salvos', icon: BookmarkIcon },
  { id: 'saved_recipes', label: 'Receitas Salvas', icon: HeartIcon },
  { id: 'profile', label: 'Perfil', icon: UserIcon },
];

interface SidebarProps {
  user: User;
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onNavigate, onLogout }) => {
  return (
    <div className="bg-surface dark:bg-gray-800 h-screen w-64 flex flex-col p-4 shadow-lg fixed">
      <div className="flex items-center mb-6 px-2">
        <HomeIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2 text-text dark:text-gray-50">NutriAI</h1>
      </div>
      <div className="px-3 mb-6">
        <p className="text-text-light dark:text-gray-400 text-sm">Bem-vindo(a),</p>
        <p className="font-semibold text-text dark:text-gray-50 truncate">{user.name}</p>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-4 py-3 my-1 rounded-lg text-left transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-primary text-black shadow-md'
                    : 'text-text-light dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <ThemeSwitcher />
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 my-1 rounded-lg text-left text-text-light dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <LogOutIcon className="h-5 w-5 mr-3" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;