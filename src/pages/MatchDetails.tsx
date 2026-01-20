"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMatches } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gamepad2, Play, ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const MatchDetails = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const match = mockMatches.find(m => m.id === matchId);

  if (!match) {
    return (
      <div className="container mx-auto py-8 text-center space-y-4">
        <h1 className="text-4xl font-bold neon-text-red">Match Not Found</h1>
        <p className="text-lg text-gray-400">The match you are looking for does not exist.</p>
        <Link to="/matches">
          <Button className="bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Matches
          </Button>
        </Link>
      </div>
    );
  }

  const statusColor = {
    live: 'bg-neon-red text-white animate-pulse',
    upcoming: 'bg-neon-blue text-white',
    completed: 'bg-gray-600 text-white',
  };

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Link to="/matches" className="flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors duration-200 mb-6">
        <ArrowLeft size={20} /> Back to Matches
      </Link>

      <Card className="glassmorphism rounded-xl border border-border shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <Badge className={statusColor[match.status] + " mx-auto mb-4 text-lg px-4 py-1 rounded-full"}>
            {match.status.toUpperCase()}
          </Badge>
          <CardTitle className="text-5xl font-extrabold neon-text-purple leading-tight">
            {match.team1.name} <span className="text-gray-500">vs</span> {match.team2.name}
          </CardTitle>
          <CardDescription className="text-xl text-gray-400 mt-2 flex items-center justify-center gap-2">
            <Gamepad2 size={20} className="text-gray-500" /> {match.game}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center text-center space-y-3">
              <img src={match.team1.logoUrl} alt={match.team1.name} className="w-32 h-32 rounded-full object-cover border-4 border-neon-blue shadow-lg" />
              <h3 className="text-3xl font-bold neon-text-blue">{match.team1.name}</h3>
              <p className="text-lg text-gray-400">{match.team1.region}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <img src={match.team2.logoUrl} alt={match.team2.name} className="w-32 h-32 rounded-full object-cover border-4 border-neon-red shadow-lg" />
              <h3 className="text-3xl font-bold neon-text-red">{match.team2.name}</h3>
              <p className="text-lg text-gray-400">{match.team2.region}</p>
            </div>
          </div>

          {match.status === 'completed' && (
            <div className="text-center mt-8">
              <h2 className="text-6xl font-extrabold neon-text-purple">
                {match.score1} - {match.score2}
              </h2>
              <p className="text-xl text-gray-300 mt-2">Final Score</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300 mt-8">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Calendar size={24} className="text-neon-blue" />
              <span>Date: <span className="font-semibold">{match.date}</span></span>
            </div>
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Clock size={24} className="text-neon-red" />
              <span>Time: <span className="font-semibold">{match.time}</span></span>
            </div>
          </div>

          {match.status === 'live' && match.streamUrl && (
            <div className="text-center mt-10">
              <a href={match.streamUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-neon-red hover:bg-neon-purple text-white text-xl px-10 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                  <Play size={24} /> Watch Live Stream
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <MadeWithDyad />
    </div>
  );
};

export default MatchDetails;