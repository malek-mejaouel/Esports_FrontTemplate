"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTeams, mockPlayers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/ui/PlayerCard';
import { Users, Trophy, ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const team = mockTeams.find(t => t.id === teamId);
  const teamPlayers = mockPlayers.filter(p => p.teamId === teamId);

  if (!team) {
    return (
      <div className="container mx-auto py-8 text-center space-y-4">
        <h1 className="text-4xl font-bold neon-text-red">Team Not Found</h1>
        <p className="text-lg text-gray-400">The team you are looking for does not exist.</p>
        <Link to="/teams">
          <Button className="bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Link to="/teams" className="flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors duration-200 mb-6">
        <ArrowLeft size={20} /> Back to Teams
      </Link>

      <Card className="glassmorphism rounded-xl border border-border shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <img src={team.logoUrl} alt={team.name} className="w-40 h-40 rounded-full object-cover border-4 border-neon-purple mx-auto mb-6 shadow-lg" />
          <CardTitle className="text-5xl font-extrabold neon-text-blue leading-tight">
            {team.name}
          </CardTitle>
          <CardDescription className="text-xl text-gray-400 mt-2 flex items-center justify-center gap-2">
            <Users size={20} className="text-gray-500" /> {team.region}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Trophy size={24} className="text-neon-red" />
              <span>Rank: <span className="font-semibold">{team.rank}</span></span>
            </div>
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Users size={24} className="text-neon-blue" />
              <span>Players: <span className="font-semibold">{teamPlayers.length}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <span>Wins: <span className="font-semibold text-neon-blue">{team.wins}</span></span>
            </div>
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <span>Losses: <span className="font-semibold text-neon-red">{team.losses}</span></span>
            </div>
          </div>

          {teamPlayers.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold neon-text-purple">Roster</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      <MadeWithDyad />
    </div>
  );
};

export default TeamDetails;