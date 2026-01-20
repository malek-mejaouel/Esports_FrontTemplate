"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { GameLobby } from "@/components/GameLobby"; // Import GameLobby

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>([]); // Placeholder for players
  const [gameStarted, setGameStarted] = useState(false); // Placeholder for game state

  useEffect(() => {
    if (!roomId) {
      showError("Invalid room ID.");
      navigate("/home");
      return;
    }
    showSuccess(`Joined room: ${roomId}`);
    // In a real app, you'd connect to a backend here to join the room
    // and fetch initial game state/players.
    // For now, let's simulate adding a player.
    setPlayers(["Player 1"]); // Simulate one player joining
  }, [roomId, navigate]);

  // Simulate game start when 4 players join
  useEffect(() => {
    if (players.length === 4 && !gameStarted) {
      setGameStarted(true);
      showSuccess("Game starting!");
    }
  }, [players, gameStarted]);

  const handleLeaveRoom = () => {
    showSuccess("Left the room.");
    navigate("/home");
  };

  if (!roomId) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-2xl border-none bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-blue-800 mb-2">Room: {roomId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!gameStarted ? (
            <GameLobby roomId={roomId} players={players} setPlayers={setPlayers} />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Game in Progress!</h2>
              <p className="text-lg text-gray-700">This is where the Belote game will be played.</p>
              {/* Placeholder for game UI */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-gray-600">Game state will be synchronized here.</p>
                <p className="text-gray-600">Players: {players.join(", ")}</p>
              </div>
            </div>
          )}
          <Button
            onClick={handleLeaveRoom}
            className="w-full py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Leave Room
          </Button>
        </CardContent>
      </Card>
      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default GameRoom;