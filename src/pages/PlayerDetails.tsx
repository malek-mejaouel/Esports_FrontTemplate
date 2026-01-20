"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPlayers, mockTeams } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Swords, Star, Users, ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const PlayerDetails = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const player = mockPlayers.find(p => p.id === playerId);
  const team = player ? mockTeams.find(t => t.id === player.teamId) : null;

  if (!player) {
    return (
      <div className="container mx-auto py-8 text-center space-y-4">
        <h1 className="text-4xl font-bold neon-text-red">Player Not Found</h1>
        <p className="text-lg text-gray-400">The player you are looking for does not exist.</p>
        <Link to="/players">
          <Button className="bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Players
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Link to="/players" className="flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors duration-200 mb-6">
        <ArrowLeft size={20} /> Back to Players
      </Button>
        </Link>

      <Card className="glassmorphism rounded-xl border border-border shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <img src={player.avatarUrl} alt={player.ign} className="w-40 h-40 rounded-full object-cover border-4 border-neon-blue mx-auto mb-6 shadow-lg" />
          <CardTitle className="text-5xl font-extrabold neon-text-red leading-tight">
            {player.ign}
          </CardTitle>
          <CardDescription className="text-xl text-gray-400 mt-2 flex items-center justify-center gap-2">
            <User size={20} className="text-gray-500" /> {player.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Swords size={24} className="text-neon-purple" />
              <span>Role: <span className="font-semibold">{player.role}</span></span>
            </div>
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Star size={24} className="text-yellow-400" />
              <span>Rank: <span className="font-semibold">{player.rank}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <span>KDA: <span className="font-semibold text-neon-blue">{player.kda}</span></span>
            </div>
            {team && (
              <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
                <Users size={24} className="text-neon-red" />
                <span>Team: <Link to={`/teams/${team.id}`} className="font-semibold text-neon-purple hover:underline">{team.name}</Link></span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MadeWithDyad />
    </div>
  );
};

export default PlayerDetails;