"use client";

import React from "react";

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-neon-red mb-8 text-neon-glow">Leaderboard</h1>
      <p className="text-lg text-dark-foreground/80">
        This page will display player and team rankings in a tabular format.
      </p>
      {/* Placeholder for leaderboard table */}
      <div className="mt-8 glassmorphism p-6 rounded-xl space-y-4 border border-dark-border shadow-neon-red/20 shadow-lg">
        <h2 className="text-3xl font-semibold text-dark-foreground">Top Players</h2>
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-neon-blue border-b border-dark-border">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Player</th>
              <th className="py-2 px-4">Team</th>
              <th className="py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-dark-border/50 last:border-b-0 hover:bg-dark-border/20 transition-colors">
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">Player {i + 1}</td>
                <td className="py-2 px-4">Team {i + 1}</td>
                <td className="py-2 px-4">{1000 - i * 50}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;