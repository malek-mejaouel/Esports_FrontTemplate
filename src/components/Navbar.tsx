"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Trophy, Users, Swords, BarChart, HomeIcon, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const isMobile = useIsMobile();
  const navLinks = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Players', path: '/players', icon: User },
    { name: 'Matches', path: '/matches', icon: Swords },
    { name: 'Leaderboard', path: '/leaderboard', icon: BarChart },
    { name: 'Admin', path: '/admin', icon: User },
  ];

  const renderNavLinks = () => (
    <nav className="hidden md:flex items-center space-x-6">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="text-lg font-medium text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center gap-2"
        >
          <link.icon size={18} />
          {link.name}
        </Link>
      ))}
    </nav>
  );

  const renderMobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-neon-blue">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-card border-r border-border shadow-lg">
        <div className="flex flex-col p-4 space-y-4">
          <h2 className="text-2xl font-bold neon-text-purple mb-4">Esports Hub</h2>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-xl font-medium text-gray-300 hover:text-neon-blue transition-colors duration-300 flex items-center gap-3 py-2"
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/home" className="flex items-center gap-2">
          <img src="/public/placeholder.svg" alt="Esports Logo" className="h-8 w-8" />
          <span className="text-2xl font-extrabold neon-text-purple">Esports Hub</span>
        </Link>
        {isMobile ? renderMobileMenu() : renderNavLinks()}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-neon-blue">Login</Button>
          <Button className="bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-full px-5 py-2 transition-all duration-300">Sign Up</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;