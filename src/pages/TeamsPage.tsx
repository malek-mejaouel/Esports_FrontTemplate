"use client";

import React from "react";

const TeamsPage = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-neon-red mb-8 text-neon-glow">Teams</h1>
      <p className="text-lg text-dark-foreground/80">
        This page will feature profiles for various esports teams.
      </p>
      {/* Placeholder for team cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-red/20 shadow-lg">
            <h3 className="text-2xl font-semibold text-dark-foreground">Team Name {i}</h3>
            <p className="text-dark-foreground/70">Game: CS2</p>
            <p className="text-dark-foreground/70">Region: EU</p>
            <p className="text-dark-foreground/70">Rank: #{i}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;