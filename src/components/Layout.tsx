"use client";

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1">
        {isAdminRoute && <Sidebar />}
        <main className={`flex-1 p-6 ${isAdminRoute ? 'md:ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;