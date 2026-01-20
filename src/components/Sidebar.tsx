"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Trophy, Users, User, BarChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Tournaments", path: "/admin/tournaments", icon: Trophy },
  { name: "Teams", path: "/admin/teams", icon: Users },
  { name: "Players", path: "/admin/players", icon: User },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-dark-card glassmorphism p-6 rounded-r-lg shadow-lg border-r border-dark-border h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neon-purple text-neon-glow">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200",
              location.pathname === link.path
                ? "bg-neon-purple/20 text-neon-purple shadow-neon-purple/30 shadow-md"
                : "text-dark-foreground/70 hover:bg-dark-border hover:text-neon-purple"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;