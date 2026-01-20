"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Team } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Users, Trophy } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <Card className="glassmorphism rounded-xl overflow-hidden hover:shadow-neon-blue transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="p-4 pb-2 flex flex-col items-center text-center">
        <img src={team.logoUrl} alt={team.name} className="w-24 h-24 rounded-full object-cover border-2 border-neon-purple mb-3" />
        <CardTitle className="text-2xl font-bold neon-text-blue">{team.name}</CardTitle>
        <CardDescription className="text-gray-400 text-sm">{team.region}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-center">
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="flex items-center gap-1">
            <Trophy size={16} className="text-neon-red" />
            <span>Rank: {team.rank}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} className="text-neon-purple" />
            <span>{team.players.length} Players</span>
          </div>
        </div>
        <p className="text-gray-300 text-sm">Wins: {team.wins} / Losses: {team.losses}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/teams/${team.id}`} className="w-full">
          <Button className="w-full bg-neon-purple hover:bg-neon-blue text-white font-semibold rounded-lg transition-all duration-300">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;