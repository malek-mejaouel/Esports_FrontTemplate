"use client";

import React, { useEffect, useState } from "react";
import { CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabaseClient";
import { GameState, Player } from "@/types/game";
import { Button } from "@/components/ui/button"; // Import Button component

interface GameLobbyProps {
  roomId: string;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onGameStart: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ roomId, players, setPlayers, onGameStart }) => {
  const maxPlayers = 4;
  const progressValue = (players.length / maxPlayers) * 100;
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);

  useEffect(() => {
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
  }, [localPlayerId]);

  useEffect(() => {
    if (!localPlayerId) return;

    const joinRoom = async () => {
      // Fetch current game state
      const { data: game, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('roomId', roomId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        showError(`Failed to fetch room: ${fetchError.message}`);
        return;
      }

      let currentPlayers: Player[] = [];
      if (game) {
        currentPlayers = game.players || [];
      }

      // Check if player is already in the room
      if (!currentPlayers.some(p => p.id === localPlayerId)) {
        const newPlayer: Player = {
          id: localPlayerId,
          name: `Player ${currentPlayers.filter(p => !p.id.startsWith('bot_')).length + 1}`, // Simple naming for now
          hand: [],
          score: 0,
          tricksWon: 0,
        };
        currentPlayers = [...currentPlayers, newPlayer];
      }

      if (game) {
        // Update existing game
        const { error: updateError } = await supabase
          .from('games')
          .update({ players: currentPlayers, updatedAt: new Date().toISOString() })
          .eq('roomId', roomId);

        if (updateError) {
          showError(`Failed to update room: ${updateError.message}`);
        }
      } else {
        // Create new game
        const initialGameState: GameState = {
          id: roomId, // Using roomId as primary key for simplicity
          roomId: roomId,
          players: currentPlayers,
          status: 'lobby',
          currentTurnPlayerId: null,
          dealerPlayerId: null,
          trumpSuit: null,
          currentTrick: [],
          leadSuit: null,
          deck: [],
          bids: [],
          currentContract: null,
          roundNumber: 0, // Will be 1 when game starts
          team1Players: [],
          team2Players: [],
          team1Score: 0,
          team2Score: 0,
          winnerPlayerId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const { error: insertError } = await supabase
          .from('games')
          .insert([initialGameState]);

        if (insertError) {
          showError(`Failed to create room: ${insertError.message}`);
        }
      }
    };

    joinRoom();

    // Set up real-time listener for game state changes
    const channel = supabase
      .channel(`game_room_${roomId}`)
      .on<GameState>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games', filter: `roomId=eq.${roomId}` },
        (payload) => {
          const updatedGame = payload.new as GameState;
          setPlayers(updatedGame.players);
          if (updatedGame.status === 'playing' && updatedGame.players.length === maxPlayers) {
            showSuccess("All players joined! Game starting!");
            onGameStart();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, localPlayerId, setPlayers, onGameStart]);

  const handleAddBot = async () => {
    if (players.length >= maxPlayers) {
      showError("Room is already full!");
      return;
    }

    const botId = `bot_${Math.random().toString(36).substring(2, 9)}`;
    const newBot: Player = {
      id: botId,
      name: `Bot ${players.filter(p => p.id.startsWith('bot_')).length + 1}`,
      hand: [],
      score: 0,
      tricksWon: 0,
    };

    const updatedPlayers = [...players, newBot];

    const { error } = await supabase
      .from('games')
      .update({ players: updatedPlayers, updatedAt: new Date().toISOString() })
      .eq('roomId', roomId);

    if (error) {
      showError(`Failed to add bot: ${error.message}`);
    } else {
      showSuccess(`Bot ${newBot.name} joined the room.`);
    }
  };

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
            <li key={player.id} className="py-1">
              {player.name} {player.id === localPlayerId && "(You)"} {player.id.startsWith('bot_') && "(Bot)"}
            </li>
          ))}
        </ul>
      </div>
      {players.length < maxPlayers && (
        <Button
          onClick={handleAddBot}
          className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Add Bot ({maxPlayers - players.length} slots left)
        </Button>
      )}
    </div>
  );
};