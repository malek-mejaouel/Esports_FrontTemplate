"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Settings, Users, Trophy, Swords, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Tournaments', path: '/admin/tournaments', icon: Trophy },
    { name: 'Matches', path: '/admin/matches', icon: Swords },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      "w-64 bg-card border-r border-border p-6 flex flex-col h-full shadow-lg",
      className
    )}>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold neon-text-red">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-gray-300 hover:bg-muted hover:text-neon-blue transition-colors duration-200 group"
          >
            <item.icon size={20} className="text-gray-400 group-hover:text-neon-blue transition-colors duration-200" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;