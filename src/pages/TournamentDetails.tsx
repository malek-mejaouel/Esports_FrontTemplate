"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTournaments } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TeamCard from '@/components/ui/TeamCard';
import MatchCard from '@/components/ui/MatchCard';
import { Calendar, Gamepad2, DollarSign, ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const TournamentDetails = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const tournament = mockTournaments.find(t => t.id === tournamentId);

  if (!tournament) {
    return (
      <div className="container mx-auto py-8 text-center space-y-4">
        <h1 className="text-4xl font-bold neon-text-red">Tournament Not Found</h1>
        <p className="text-lg text-gray-400">The tournament you are looking for does not exist.</p>
        <Link to="/tournaments">
          <Button className="bg-neon-blue hover:bg-neon-purple text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Tournaments
          </Button>
        </Link>
      </div>
    );
  }

  const statusColor = {
    live: 'bg-neon-red text-white',
    upcoming: 'bg-neon-blue text-white',
    completed: 'bg-gray-600 text-white',
  };

  return (
    <div className="container mx-auto py-8 space-y-10">
      <Link to="/tournaments" className="flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors duration-200 mb-6">
        <ArrowLeft size={20} /> Back to Tournaments
      </Link>

      <Card className="glassmorphism rounded-xl border border-border shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <img src={tournament.imageUrl} alt={tournament.name} className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" />
          <Badge className={statusColor[tournament.status] + " mx-auto mb-4 text-lg px-4 py-1 rounded-full"}>
            {tournament.status.toUpperCase()}
          </Badge>
          <CardTitle className="text-5xl font-extrabold neon-text-purple leading-tight">
            {tournament.name}
          </CardTitle>
          <CardDescription className="text-xl text-gray-400 mt-2 flex items-center justify-center gap-2">
            <Gamepad2 size={20} className="text-gray-500" /> {tournament.game}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg text-gray-300">
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <Calendar size={24} className="text-neon-blue" />
              <span>Dates: <span className="font-semibold">{tournament.date}</span></span>
            </div>
            <div className="flex items-center gap-3 glassmorphism p-4 rounded-lg border border-border">
              <DollarSign size={24} className="text-green-500" />
              <span>Prize Pool: <span className="font-semibold text-neon-red">{tournament.prizePool}</span></span>
            </div>
          </div>

          {tournament.teams.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold neon-text-blue">Participating Teams</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournament.teams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </section>
          )}

          {tournament.matches.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-3xl font-bold neon-text-red">Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournament.matches.map(match => (
                  <MatchCard key={match.id} match={match} />
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

export default TournamentDetails;