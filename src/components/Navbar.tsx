"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Tournaments", path: "/tournaments" },
  { name: "Teams", path: "/teams" },
  { name: "Players", path: "/players" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Admin", path: "/admin" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-dark-card glassmorphism p-4 rounded-b-lg shadow-lg border-b border-dark-border">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-neon-blue text-neon-glow">
          ESPORTS HUB
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-lg font-medium transition-colors hover:text-neon-blue",
                location.pathname === link.path ? "text-neon-blue text-neon-glow" : "text-dark-foreground/70"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-neon-blue" /> : <Menu className="h-6 w-6 text-neon-blue" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-xl font-medium transition-colors hover:text-neon-blue",
                location.pathname === link.path ? "text-neon-blue text-neon-glow" : "text-dark-foreground/70"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;