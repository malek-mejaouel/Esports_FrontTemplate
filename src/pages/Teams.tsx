"use client";

import React from 'react';
import TeamCard from '@/components/ui/TeamCard';
import { mockTeams } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Teams = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRegion, setFilterRegion] = React.useState('all');

  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          team.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || team.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const uniqueRegions = Array.from(new Set(mockTeams.map(t => t.region)));

  return (
    <div className="container mx-auto py-8 space-y-10">
      <h1 className="text-5xl font-extrabold neon-text-blue text-center mb-8">Teams</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 glassmorphism p-6 rounded-xl border border-border shadow-lg">
        <Input
          placeholder="Search teams..."
          className="flex-1 bg-card border-border text-gray-200 placeholder:text-gray-500 focus:border-neon-purple focus:ring-neon-purple rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={setFilterRegion} value={filterRegion}>
          <SelectTrigger className="w-full md:w-[180px] bg-card border-border text-gray-200 focus:ring-neon-purple rounded-lg">
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-gray-200">
            <SelectItem value="all">All Regions</SelectItem>
            {uniqueRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTeams.length === 0 ? (
        <p className="text-center text-xl text-gray-400">No teams found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <MadeWithDyad />
    </div>
  );
};

export default Teams;