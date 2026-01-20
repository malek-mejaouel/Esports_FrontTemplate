"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChartComponent from '@/components/ui/ChartComponent';
import { Users, Trophy, Swords, Settings } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto py-8 space-y-10">
      <h1 className="text-5xl font-extrabold neon-text-red text-center mb-8">Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="glassmorphism rounded-xl border border-border shadow-lg hover:shadow-neon-blue transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold neon-text-blue">Total Users</CardTitle>
            <Users className="h-6 w-6 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-100">1,234</div>
            <p className="text-xs text-gray-500">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism rounded-xl border border-border shadow-lg hover:shadow-neon-purple transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold neon-text-purple">Active Tournaments</CardTitle>
            <Trophy className="h-6 w-6 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-100">12</div>
            <p className="text-xs text-gray-500">+5 this week</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism rounded-xl border border-border shadow-lg hover:shadow-neon-red transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold neon-text-red">Live Matches</CardTitle>
            <Swords className="h-6 w-6 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-100">5</div>
            <p className="text-xs text-gray-500">Currently streaming</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism rounded-xl border border-border shadow-lg hover:shadow-neon-blue transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold neon-text-blue">System Health</CardTitle>
            <Settings className="h-6 w-6 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">Operational</div>
            <p className="text-xs text-gray-500">All services running</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartComponent />
        <Card className="glassmorphism rounded-xl border border-border shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold neon-text-purple">Recent Activity Log</CardTitle>
            <CardDescription className="text-gray-400">Latest actions by administrators and system events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Users size={20} className="text-neon-blue" />
              <span>Admin 'JohnDoe' created new tournament 'Cyber Clash'.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Swords size={20} className="text-neon-red" />
              <span>System updated match 'match1' status to 'live'.</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Settings size={20} className="text-neon-purple" />
              <span>Server maintenance completed successfully.</span>
            </div>
            <Button variant="ghost" className="text-neon-blue hover:text-neon-purple">View Full Log</Button>
          </CardContent>
        </Card>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default AdminDashboard;