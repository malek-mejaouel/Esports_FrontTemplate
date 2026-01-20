"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess, showError } from "@/utils/toast";
import { GameLobby } from "@/components/GameLobby";
import { GameArea } from "@/components/GameArea";
import { BiddingPhase } from "@/components/BiddingPhase"; // Import BiddingPhase
import { supabase } from "@/lib/supabaseClient";
import { GameState, Player, Card as CardType } from "@/types/game";
import { createDeck, shuffleDeck, dealCards, getNextPlayerId } from "@/utils/gameLogic"; // Import game logic utilities

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
      const storedPlayerId = localStorage.getItem('belote_local_player_id');
      if (storedPlayerId) {
        setLocalPlayerId(storedPlayerId);
      } else {
        const newPlayerId = `player_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('belote_local_player_id', newPlayerId);
        setLocalPlayerId(newPlayerId);
      }
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
    if (!gameState || gameState.players.length !== 4) {
      showError("Need exactly 4 players to start the game.");
      return;
    }

    // Assign teams (Player 1 & 3 are Team 1, Player 2 & 4 are Team 2)
    const team1Players = [gameState.players[0].id, gameState.players[2].id];
    const team2Players = [gameState.players[1].id, gameState.players[3].id];

    const initialDeck = shuffleDeck(createDeck());
    const { updatedPlayers, remainingDeck } = dealCards(initialDeck, gameState.players);

    const dealerPlayerId = gameState.players[0].id; // First player is dealer for simplicity
    const firstTurnPlayerId = getNextPlayerId(dealerPlayerId, gameState.players); // Player after dealer starts bidding

    const { error } = await supabase
      .from('games')
      .update({
        status: 'bidding',
        players: updatedPlayers,
        deck: remainingDeck,
        dealerPlayerId: dealerPlayerId,
        currentTurnPlayerId: firstTurnPlayerId,
        team1Players: team1Players,
        team2Players: team2Players,
        team1Score: 0,
        team2Score: 0,
        roundNumber: 1,
        bids: [],
        currentContract: null,
        trumpSuit: null,
        currentTrick: [],
        leadSuit: null,
        winnerPlayerId: null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', roomId);

    if (error) {
      showError(`Failed to start game: ${error.message}`);
    } else {
      showSuccess("Game started! Bidding phase begins.");
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
    localStorage.removeItem('belote_local_player_id'); // Clear local player ID
    showSuccess("Left the room.");
    navigate("/home");
  };

  if (!roomId || !localPlayerId || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
        <Card className="w-full max-w-md rounded-xl shadow-2xl border-none bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-blue-800 mb-2">Loading Room...</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-lg text-gray-700">
            Please wait while we set up your game.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <Card className="w-full max-w-2xl rounded-xl shadow-2xl border-none bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-blue-800 mb-2">Room: {roomId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameState.status === 'lobby' && (
            <GameLobby
              roomId={roomId}
              players={gameState.players}
              setPlayers={(newPlayers) => setGameState(prev => prev ? { ...prev, players: newPlayers } : null)}
              onGameStart={handleGameStart}
            />
          )}
          {gameState.status === 'bidding' && (
            <BiddingPhase
              gameState={gameState}
              localPlayerId={localPlayerId}
              onBidMade={(updatedGameState) => setGameState(updatedGameState)}
            />
          )}
          {(gameState.status === 'playing' || gameState.status === 'ended') && (
            <GameArea gameState={gameState} localPlayerId={localPlayerId} />
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