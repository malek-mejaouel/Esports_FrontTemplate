"use client";

import React from 'react';
import PlayerCard from '@/components/ui/PlayerCard';
import { mockPlayers, mockTeams } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Players = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterTeam, setFilterTeam] = React.useState('all');
  const [filterRole, setFilterRole] = React.useState('all');

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.ign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'all' || player.teamId === filterTeam;
    const matchesRole = filterRole === 'all' || player.role === filterRole;
    return matchesSearch && matchesTeam && matchesRole;
  });

  const uniqueRoles = Array.from(new Set(mockPlayers.map(p => p.role)));

  return (
    <div className="container mx-auto py-8 space-y-10">
      <h1 className="text-5xl font-extrabold neon-text-red text-center mb-8">Players</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 glassmorphism p-6 rounded-xl border border-border shadow-lg">
        <Input
          placeholder="Search players by IGN or name..."
          className="flex-1 bg-card border-border text-gray-200 placeholder:text-gray-500 focus:border-neon-blue focus:ring-neon-blue rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={setFilterTeam} value={filterTeam}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border text-gray-200 focus:ring-neon-blue rounded-lg">
            <SelectValue placeholder="Filter by Team" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-gray-200">
            <SelectItem value="all">All Teams</SelectItem>
            {mockTeams.map(team => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterRole} value={filterRole}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border text-gray-200 focus:ring-neon-blue rounded-lg">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-gray-200">
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPlayers.length === 0 ? (
        <p className="text-center text-xl text-gray-400">No players found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Players;