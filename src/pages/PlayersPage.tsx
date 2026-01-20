"use client";

import React from "react";

const PlayersPage = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-neon-purple mb-8 text-neon-glow">Players</h1>
      <p className="text-lg text-dark-foreground/80">
        This page will showcase individual player profiles, stats, and rankings.
      </p>
      {/* Placeholder for player cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-purple/20 shadow-lg">
            <h3 className="text-xl font-semibold text-dark-foreground">Player Nickname {i}</h3>
            <p className="text-dark-foreground/70">Team: Team X</p>
            <p className="text-dark-foreground/70">Game: Valorant</p>
            <p className="text-dark-foreground/70">Rank: Radiant</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;