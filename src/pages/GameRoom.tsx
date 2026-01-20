"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { GameLobby } from "@/components/GameLobby";
import { GameArea } from "@/components/GameArea"; // Import GameArea
import { supabase } from "@/lib/supabaseClient";
import { GameState, Player, Card as CardType } from "@/types/game"; // Renamed Card to CardType to avoid conflict

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      showError("Invalid room ID.");
      navigate("/home");
      return;
    }

    // Generate a unique ID for the local player if not already set
    if (!localPlayerId) {
      const newPlayerId = `player_${Math.random().toString(36).substring(2, 9)}`;
      setLocalPlayerId(newPlayerId);
    }

    const fetchGameState = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('roomId', roomId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found"
        showError(`Failed to load game state: ${error.message}`);
        navigate("/home");
        return;
      }

      if (data) {
        setGameState(data as GameState);
        showSuccess(`Joined room: ${roomId}`);
      } else {
        // If no game exists, GameLobby will create it
        showSuccess(`Creating new room: ${roomId}`);
      }
    };

    fetchGameState();

    // Set up real-time listener for game state changes
    const channel = supabase
      .channel(`game_room_${roomId}_full_state`)
      .on<GameState>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `roomId=eq.${roomId}` },
        (payload) => {
          setGameState(payload.new as GameState);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, navigate, localPlayerId]);

  const handleGameStart = async () => {
    if (!gameState || gameState.players.length !== 4) return;

    // Simulate initial game setup: deal cards, set dealer, first turn
    const initialDeck: CardType[] = []; // Placeholder for a full deck
    // Populate initialDeck with 32 Belote cards (7, 8, 9, 10, J, Q, K, A of each suit)
    const suits: CardType['suit'][] = ['clubs', 'diamonds', 'hearts', 'spades'];
    const ranks: CardType['rank'][] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (const suit of suits) {
      for (const rank of ranks) {
        initialDeck.push({ suit, rank });
      }
    }

    // Shuffle deck (simple shuffle for now)
    for (let i = initialDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialDeck[i], initialDeck[j]] = [initialDeck[j], initialDeck[i]];
    }

    const updatedPlayers = gameState.players.map(player => ({ ...player, hand: [] }));
    let currentDeck = [...initialDeck];

    // Deal 5 cards to each player
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < updatedPlayers.length; j++) {
        if (currentDeck.length > 0) {
          updatedPlayers[j].hand.push(currentDeck.pop()!);
        }
      }
    }

    const dealerPlayerId = updatedPlayers[0].id; // First player is dealer for simplicity
    const firstTurnPlayerId = updatedPlayers[1].id; // Player after dealer starts

    const { error } = await supabase
      .from('games')
      .update({
        status: 'bidding', // Or 'playing' if skipping bidding for now
        players: updatedPlayers,
        deck: currentDeck,
        dealerPlayerId: dealerPlayerId,
        currentTurnPlayerId: firstTurnPlayerId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', roomId);

    if (error) {
      showError(`Failed to start game: ${error.message}`);
    } else {
      showSuccess("Game started!");
    }
  };

  const handleLeaveRoom = async () => {
    if (gameState && localPlayerId) {
      const updatedPlayers = gameState.players.filter(p => p.id !== localPlayerId);
      const { error } = await supabase
        .from('games')
        .update({ players: updatedPlayers, updatedAt: new Date().toISOString() })
        .eq('id', roomId);

      if (error) {
        showError(`Failed to leave room: ${error.message}`);
      }
    }
    showSuccess("Left the room.");
    navigate("/home");
  };

  if (!roomId || !localPlayerId) {
    return null; // Should be redirected or waiting for localPlayerId
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-2xl border-none bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-blue-800 mb-2">Room: {roomId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameState && gameState.status === 'lobby' ? (
            <GameLobby
              roomId={roomId}
              players={gameState.players}
              setPlayers={(newPlayers) => setGameState(prev => prev ? { ...prev, players: newPlayers } : null)}
              onGameStart={handleGameStart}
            />
          ) : gameState && (gameState.status === 'bidding' || gameState.status === 'playing' || gameState.status === 'ended') ? (
            <GameArea gameState={gameState} localPlayerId={localPlayerId} />
          ) : (
            <div className="text-center text-lg text-gray-700">Loading game state...</div>
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