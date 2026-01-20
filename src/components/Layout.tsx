"use client";

import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { MadeWithDyad } from "./made-with-dyad";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-dark text-dark-foreground">
      <Navbar />
      <div className="flex flex-1">
        {isAdminRoute && <Sidebar />}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;