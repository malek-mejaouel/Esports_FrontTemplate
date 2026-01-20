"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockLeaderboard } from '@/data/mockData';
import { Trophy } from 'lucide-react';

const LeaderboardTable = () => {
  return (
    <div className="glassmorphism rounded-xl overflow-hidden border border-border shadow-lg">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="border-b border-border">
            <TableHead className="w-[80px] text-neon-purple font-bold text-lg">Rank</TableHead>
            <TableHead className="text-neon-purple font-bold text-lg">Team</TableHead>
            <TableHead className="text-neon-blue font-bold text-lg">Wins</TableHead>
            <TableHead className="text-neon-red font-bold text-lg">Losses</TableHead>
            <TableHead className="text-right text-neon-purple font-bold text-lg">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLeaderboard.map((item) => (
            <TableRow key={item.rank} className="hover:bg-muted/20 transition-colors duration-200 border-b border-border/50">
              <TableCell className="font-medium text-lg flex items-center gap-2">
                {item.rank === 1 && <Trophy size={20} className="text-yellow-400" />}
                {item.rank === 2 && <Trophy size={20} className="text-gray-400" />}
                {item.rank === 3 && <Trophy size={20} className="text-orange-400" />}
                <span className={item.rank <= 3 ? 'neon-text-purple' : 'text-gray-200'}>{item.rank}</span>
              </TableCell>
              <TableCell className="text-gray-100 text-lg">{item.team}</TableCell>
              <TableCell className="text-neon-blue text-lg">{item.wins}</TableCell>
              <TableCell className="text-neon-red text-lg">{item.losses}</TableCell>
              <TableCell className="text-right text-neon-purple text-lg font-semibold">{item.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;