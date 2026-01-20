"use client";

import React from 'react';
import LeaderboardTable from '@/components/ui/LeaderboardTable';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Leaderboard = () => {
  return (
    <div className="container mx-auto py-8 space-y-10">
      <h1 className="text-5xl font-extrabold neon-text-purple text-center mb-8">Global Leaderboard</h1>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold neon-text-blue">Top Teams Ranking</h2>
        <LeaderboardTable />
      </section>

      {/* Future sections for player leaderboards, etc. */}

      <MadeWithDyad />
    </div>
  );
};

export default Leaderboard;