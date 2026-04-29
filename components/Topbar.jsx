import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Topbar = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border sticky top-0 z-10 flex items-center justify-between px-8 transition-colors duration-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Welcome back, {user?.name.split(' ')[0]} 👋</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Let's check your placement probability today.</p>
      </div>
      
      <div className="flex items-center space-x-6">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
          {isDark ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors relative">
          <Bell className="text-gray-600 dark:text-gray-300" size={20} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-dark-border">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
