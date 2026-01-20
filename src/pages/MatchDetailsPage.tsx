"use client";

import React from "react";
import { useParams } from "react-router-dom";

const MatchDetailsPage = () => {
  const { matchId } = useParams();
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-neon-blue mb-8 text-neon-glow">Match Details: {matchId}</h1>
      <p className="text-lg text-dark-foreground/80">
        This page will display detailed information about a specific match, including scores, highlights, and team rosters.
      </p>
      {/* Placeholder for match details */}
      <div className="mt-8 glassmorphism p-6 rounded-xl space-y-4 border border-dark-border shadow-neon-blue/20 shadow-lg">
        <h2 className="text-3xl font-semibold text-dark-foreground">Team A vs Team B</h2>
        <p className="text-dark-foreground/70">Tournament: Grand Finals</p>
        <p className="text-dark-foreground/70">Game: CS2</p>
        <p className="text-dark-foreground/70">Score: 2 - 1</p>
        <p className="text-dark-foreground/70">Status: Completed</p>
      </div>
    </div>
  );
};

export default MatchDetailsPage;