import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Type,
  Keyboard,
  MessageSquare,
  TextQuote,
  Tags,
  LogOut,
  ArrowLeft,
  Moon,
  Sun
} from 'lucide-react';
import { adminApi } from './api';
import { useTheme } from '../hooks/useTheme';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
  }`;

export function AdminLayout() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await adminApi.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex">
      <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img src="/logos/bodyig.svg" alt="" className="w-8 h-8" width={32} height={32} />
            <div>
              <div className="font-semibold text-sm">Monlam CMS</div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">Font & Keyboard Suite</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/fonts" className={linkClass}>
            <Type className="w-4 h-4" />
            Fonts
          </NavLink>
          <NavLink to="/admin/presets" className={linkClass}>
            <TextQuote className="w-4 h-4" />
            Presets
          </NavLink>
          <NavLink to="/admin/script-styles" className={linkClass}>
            <Tags className="w-4 h-4" />
            Script styles
          </NavLink>
          <NavLink to="/admin/keyboards" className={linkClass}>
            <Keyboard className="w-4 h-4" />
            Keyboards
          </NavLink>
          <NavLink to="/admin/feedback" className={linkClass}>
            <MessageSquare className="w-4 h-4" />
            Feedback
          </NavLink>
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-slate-800 space-y-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Public site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
