"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center rounded-xl overflow-hidden glassmorphism p-6">
        <img
          src="/public/placeholder.svg" // Placeholder image for a futuristic esports background
          alt="Esports Arena"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-neon-blue leading-tight text-neon-glow animate-neon-glow">
            DOMINATE THE ARENA
          </h1>
          <p className="text-xl md:text-2xl text-dark-foreground/80 max-w-3xl mx-auto">
            Your ultimate hub for esports tournaments, teams, players, and live matches.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button asChild className="px-8 py-3 text-lg bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg shadow-lg shadow-neon-purple/50 transition-all duration-300 transform hover:scale-105">
              <Link to="/tournaments">Explore Tournaments</Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-3 text-lg border-neon-blue text-neon-blue hover:bg-neon-blue/20 rounded-lg shadow-lg shadow-neon-blue/30 transition-all duration-300 transform hover:scale-105">
              <Link to="/matches/live">Watch Live Matches</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tournaments Section */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-neon-blue text-center text-neon-glow">Featured Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Tournament Cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="glassmorphism p-6 rounded-xl space-y-4 border border-dark-border shadow-neon-blue/20 shadow-lg">
              <h3 className="text-2xl font-semibold text-neon-purple">Tournament Name {i}</h3>
              <p className="text-dark-foreground/70">Game: Valorant</p>
              <p className="text-dark-foreground/70">Date: Oct 26, 2024</p>
              <Button asChild className="w-full bg-neon-blue hover:bg-neon-blue/80">
                <Link to={`/tournaments/${i}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Top Teams Section */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-neon-red text-center text-neon-glow">Top Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder Team Cards */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glassmorphism p-6 rounded-xl space-y-4 border border-dark-border shadow-neon-red/20 shadow-lg">
              <h3 className="text-xl font-semibold text-dark-foreground">Team Alpha {i}</h3>
              <p className="text-dark-foreground/70">Region: NA</p>
              <Button asChild variant="outline" className="w-full border-neon-red text-neon-red hover:bg-neon-red/20">
                <Link to={`/teams/${i}`}>View Profile</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-neon-purple text-center text-neon-glow">Live Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder Live Match Cards */}
          {[1, 2].map((i) => (
            <div key={i} className="glassmorphism p-6 rounded-xl space-y-4 border border-dark-border shadow-neon-purple/20 shadow-lg">
              <h3 className="text-2xl font-semibold text-dark-foreground">Team A vs Team B</h3>
              <p className="text-dark-foreground/70">Game: CS2 - Live Now!</p>
              <Button asChild className="w-full bg-neon-blue hover:bg-neon-blue/80">
                <Link to={`/matches/${i}`}>Watch Live</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;