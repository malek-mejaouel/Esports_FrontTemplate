"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tournament } from '@/data/mockData';
import { Link } from 'react-router-dom';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const statusColor = {
    live: 'bg-neon-red text-white',
    upcoming: 'bg-neon-blue text-white',
    completed: 'bg-gray-600 text-white',
  };

  return (
    <Card className="glassmorphism rounded-xl overflow-hidden hover:shadow-neon-purple transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <img src={tournament.imageUrl} alt={tournament.name} className="w-full h-48 object-cover" />
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-2xl font-bold neon-text-purple">{tournament.name}</CardTitle>
        <CardDescription className="text-gray-400 text-sm">{tournament.game} • {tournament.date}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between">
          <Badge className={statusColor[tournament.status]}>{tournament.status.toUpperCase()}</Badge>
          <span className="text-lg font-semibold text-neon-blue">{tournament.prizePool}</span>
        </div>
        <p className="text-gray-300 text-sm">
          {tournament.teams.length} Teams • {tournament.matches.length} Matches
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/tournaments/${tournament.id}`} className="w-full">
          <Button className="w-full bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;