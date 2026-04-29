import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, Lightbulb, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Resume Analyzer', path: '/resume', icon: <FileText size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { name: 'Recommendations', path: '/recommendations', icon: <Lightbulb size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col fixed left-0 top-0 transition-colors duration-200 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-500">AI Placement<br/>Predictor</h1>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-bg/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
