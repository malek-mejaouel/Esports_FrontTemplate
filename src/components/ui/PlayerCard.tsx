"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { User, Swords, Star } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <Card className="glassmorphism rounded-xl overflow-hidden hover:shadow-neon-red transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardHeader className="p-4 pb-2 flex flex-col items-center text-center">
        <img src={player.avatarUrl} alt={player.ign} className="w-24 h-24 rounded-full object-cover border-2 border-neon-blue mb-3" />
        <CardTitle className="text-2xl font-bold neon-text-red">{player.ign}</CardTitle>
        <CardDescription className="text-gray-400 text-sm">{player.name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2 text-center">
        <div className="flex items-center justify-center gap-4 text-gray-300">
          <div className="flex items-center gap-1">
            <User size={16} className="text-neon-purple" />
            <span>{player.role}</span>
          </div>
          <div className="flex items-center gap-1">
            <Swords size={16} className="text-neon-blue" />
            <span>KDA: {player.kda}</span>
          </div>
        </div>
        <p className="text-gray-300 text-sm flex items-center justify-center gap-1">
          <Star size={16} className="text-yellow-400" /> Rank: {player.rank}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/players/${player.id}`} className="w-full">
          <Button className="w-full bg-neon-red hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;