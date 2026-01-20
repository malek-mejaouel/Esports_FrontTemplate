"use client";

import React from "react";
import { Routes, Route } from "react-router-dom";

const AdminOverview = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-purple text-neon-glow">Admin Dashboard Overview</h2>
    <p className="text-lg text-dark-foreground/80">
      Welcome to the admin panel. Use the sidebar to navigate through different sections.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-purple/20 shadow-lg">
        <h3 className="text-2xl font-semibold text-dark-foreground">Total Users</h3>
        <p className="text-4xl font-bold text-neon-blue">1,234</p>
      </div>
      <div className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-purple/20 shadow-lg">
        <h3 className="text-2xl font-semibold text-dark-foreground">Active Tournaments</h3>
        <p className="text-4xl font-bold text-neon-red">12</p>
      </div>
      <div className="glassmorphism p-6 rounded-xl space-y-3 border border-dark-border shadow-neon-purple/20 shadow-lg">
        <h3 className="text-2xl font-semibold text-dark-foreground">Upcoming Matches</h3>
        <p className="text-4xl font-bold text-neon-blue">45</p>
      </div>
    </div>
  </div>
);

const AdminTournaments = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-blue text-neon-glow">Manage Tournaments</h2>
    <p className="text-lg text-dark-foreground/80">
      Here you can create, edit, and delete tournaments.
    </p>
  </div>
);

const AdminTeams = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-red text-neon-glow">Manage Teams</h2>
    <p className="text-lg text-dark-foreground/80">
      Manage team profiles, rosters, and statistics.
    </p>
  </div>
);

const AdminPlayers = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-purple text-neon-glow">Manage Players</h2>
    <p className="text-lg text-dark-foreground/80">
      View and edit player information, stats, and bans.
    </p>
  </div>
);

const AdminAnalytics = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-blue text-neon-glow">Analytics & Reports</h2>
    <p className="text-lg text-dark-foreground/80">
      Access detailed analytics and generate reports.
    </p>
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-neon-red text-neon-glow">Admin Settings</h2>
    <p className="text-lg text-dark-foreground/80">
      Configure global application settings.
    </p>
  </div>
);

const AdminDashboardPage = () => {
  return (
    <Routes>
      <Route index element={<AdminOverview />} />
      <Route path="tournaments" element={<AdminTournaments />} />
      <Route path="teams" element={<AdminTeams />} />
      <Route path="players" element={<AdminPlayers />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminDashboardPage;