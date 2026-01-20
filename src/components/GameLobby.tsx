"use client";

import React, { useEffect } from "react";
import { CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { showSuccess } from "@/utils/toast";

interface GameLobbyProps {
  roomId: string;
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ roomId, players, setPlayers }) => {
  const maxPlayers = 4;
  const progressValue = (players.length / maxPlayers) * 100;

  useEffect(() => {
    // Simulate other players joining over time
    const interval = setInterval(() => {
      if (players.length < maxPlayers) {
        const newPlayer = `Player ${players.length + 1}`;
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers, newPlayer];
          if (updatedPlayers.length === maxPlayers) {
            showSuccess("All players joined! Game will start soon.");
          }
          return updatedPlayers;
        });
      } else {
        clearInterval(interval);
      }
    }, 3000); // Simulate a player joining every 3 seconds

    return () => clearInterval(interval);
  }, [players, setPlayers]);

  return (
    <div className="text-center space-y-4">
      <CardDescription className="text-xl text-gray-700 font-medium">
        Waiting for players to join...
      </CardDescription>
      <p className="text-lg text-gray-600">Room ID: <span className="font-bold text-blue-700">{roomId}</span></p>
      <div className="space-y-2">
        <Progress value={progressValue} className="w-full h-3 rounded-full bg-gray-200" indicatorClassName="bg-blue-500" />
        <p className="text-sm text-gray-600">{players.length} / {maxPlayers} players ready</p>
      </div>
      <div className="text-left p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Players in Lobby:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {players.map((player, index) => (
            <li key={index} className="py-1">{player}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};