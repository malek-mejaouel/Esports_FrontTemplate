"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Play, Calendar, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const statusColor = {
    live: 'bg-neon-red text-white animate-pulse',
    upcoming: 'bg-neon-blue text-white',
    completed: 'bg-gray-600 text-white',
  };

  return (
    <Card className="glassmorphism rounded-xl overflow-hidden hover:shadow-neon-blue transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge className={statusColor[match.status]}>{match.status.toUpperCase()}</Badge>
          <span className="text-sm text-gray-400">{match.game}</span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-100 flex items-center justify-between">
          <span className="neon-text-purple">{match.team1.name}</span>
          <span className="text-gray-500 text-lg mx-2">vs</span>
          <span className="neon-text-blue">{match.team2.name}</span>
        </CardTitle>
        {match.status === 'completed' && (
          <CardDescription className="text-lg font-semibold text-center mt-2">
            <span className="text-neon-red">{match.score1}</span> - <span className="text-neon-blue">{match.score2}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>{match.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span>{match.time}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/matches/${match.id}`} className="w-full">
          <Button className="w-full bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
            {match.status === 'live' && <Play size={18} />}
            {match.status === 'live' ? 'Watch Live' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MatchCard;