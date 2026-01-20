"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TournamentCard from '@/components/ui/TournamentCard';
import TeamCard from '@/components/ui/TeamCard';
import MatchCard from '@/components/ui/MatchCard';
import { mockTournaments, mockTeams, mockMatches } from '@/data/mockData';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const featuredTournaments = mockTournaments.filter(t => t.status === 'live' || t.status === 'upcoming').slice(0, 3);
  const topTeams = mockTeams.slice(0, 4);
  const liveMatches = mockMatches.filter(m => m.status === 'live').slice(0, 2);

  return (
    <div className="container mx-auto py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-8 text-center">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38148e7fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Esports Arena"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight neon-text-purple drop-shadow-lg">
            Your Hub for <span className="neon-text-blue">Esports Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Track live matches, discover top tournaments, and follow your favorite teams and players.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/tournaments">
              <Button className="bg-neon-blue hover:bg-neon-purple text-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Explore Tournaments <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/matches">
              <Button variant="outline" className="border-2 border-neon-red text-neon-red hover:bg-neon-red hover:text-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                Watch Live
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-4xl font-bold neon-text-red text-center">Live Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/matches">
              <Button variant="ghost" className="text-neon-blue hover:text-neon-purple text-lg flex items-center gap-2">
                View All Matches <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Tournaments Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold neon-text-purple text-center">Featured Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
        <div className="text-center">
          <Link to="/tournaments">
            <Button variant="ghost" className="text-neon-blue hover:text-neon-purple text-lg flex items-center gap-2">
              View All Tournaments <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Top Teams Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold neon-text-blue text-center">Top Teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
        <div className="text-center">
          <Link to="/teams">
            <Button variant="ghost" className="text-neon-blue hover:text-neon-purple text-lg flex items-center gap-2">
              View All Teams <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Home;