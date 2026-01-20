"use client";

import React from 'react';
import TournamentCard from '@/components/ui/TournamentCard';
import { mockTournaments } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Tournaments = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterGame, setFilterGame] = React.useState('all');

  const filteredTournaments = mockTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    const matchesGame = filterGame === 'all' || tournament.game === filterGame;
    return matchesSearch && matchesStatus && matchesGame;
  });

  const uniqueGames = Array.from(new Set(mockTournaments.map(t => t.game)));

  return (
    <div className="container mx-auto py-8 space-y-10">
      <h1 className="text-5xl font-extrabold neon-text-purple text-center mb-8">Tournaments</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 glassmorphism p-6 rounded-xl border border-border shadow-lg">
        <Input
          placeholder="Search tournaments..."
          className="flex-1 bg-card border-border text-gray-200 placeholder:text-gray-500 focus:border-neon-blue focus:ring-neon-blue rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={setFilterStatus} value={filterStatus}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border text-gray-200 focus:ring-neon-blue rounded-lg">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-gray-200">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterGame} value={filterGame}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border text-gray-200 focus:ring-neon-blue rounded-lg">
            <SelectValue placeholder="Filter by Game" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-gray-200">
            <SelectItem value="all">All Games</SelectItem>
            {uniqueGames.map(game => (
              <SelectItem key={game} value={game}>{game}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTournaments.length === 0 ? (
        <p className="text-center text-xl text-gray-400">No tournaments found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Tournaments;