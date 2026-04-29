import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob-shape bg-primary-400 w-96 h-96 top-0 left-0 animation-delay-2000"></div>
      <div className="blob-shape bg-purple-400 w-96 h-96 top-1/4 right-0 animation-delay-4000"></div>
      <div className="blob-shape bg-primary-300 w-96 h-96 bottom-0 left-1/3"></div>

      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative z-10">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
