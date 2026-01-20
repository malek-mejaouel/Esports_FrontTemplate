"use client";

import React from "react";

const TournamentsPage = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-neon-blue mb-8 text-neon-glow">Tournaments</h1>
      <p className="text-lg text-dark-foreground/80">
        This page will display a list of tournaments with cards and a bracket layout.
      </p>
      {/* Placeholder for tournament cards and bracket */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-blue/20 shadow-lg">
            <h3 className="text-2xl font-semibold text-neon-purple">Tournament {i}</h3>
            <p className="text-dark-foreground/70">Game: League of Legends</p>
            <p className="text-dark-foreground/70">Prize Pool: $100,000</p>
            <p className="text-dark-foreground/70">Status: Upcoming</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;