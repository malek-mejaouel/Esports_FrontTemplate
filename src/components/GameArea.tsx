"use client";

import React from "react";
import { GameState, Player, Card } from "@/types/game";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabaseClient";

interface GameAreaProps {
  gameState: GameState;
  localPlayerId: string;
}

export const GameArea: React.FC<GameAreaProps> = ({ gameState, localPlayerId }) => {
  const { players, currentTurnPlayerId, currentTrick, trumpSuit, status, winnerPlayerId } = gameState;

  const localPlayer = players.find(p => p.id === localPlayerId);
  const isMyTurn = currentTurnPlayerId === localPlayerId;

  const handlePlayCard = async (card: Card) => {
    if (!isMyTurn) {
      showError("It's not your turn!");
      return;
    }

    // Simulate playing a card
    const updatedTrick = [...currentTrick, { playerId: localPlayerId, card }];
    const updatedPlayerHand = localPlayer?.hand.filter(c => c.rank !== card.rank || c.suit !== card.suit) || [];

    // Determine next player's turn (simple round-robin for now)
    const currentPlayerIndex = players.findIndex(p => p.id === localPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextTurnPlayerId = players[nextPlayerIndex].id;

    // Update game state in Supabase
    const { error } = await supabase
      .from('games')
      .update({
        currentTrick: updatedTrick,
        players: players.map(p => p.id === localPlayerId ? { ...p, hand: updatedPlayerHand } : p),
        currentTurnPlayerId: nextTurnPlayerId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', gameState.id);

    if (error) {
      showError(`Failed to play card: ${error.message}`);
    } else {
      showSuccess(`You played ${card.rank} of ${card.suit}`);
    }
  };

  const renderPlayerHand = (player: Player) => (
    <div key={player.id} className="p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-gray-800">{player.name} {player.id === localPlayerId && "(You)"}</h4>
      <p className="text-sm text-gray-600">Score: {player.score}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {player.hand.map((card, index) => (
          <Button
            key={index}
            onClick={() => handlePlayCard(card)}
            disabled={!isMyTurn || player.id !== localPlayerId}
            className="px-3 py-1 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {card.rank} {card.suit.charAt(0).toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );

  if (status === 'ended') {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-green-700">Game Over!</h2>
        {winnerPlayerId && (
          <p className="text-2xl text-gray-800">Winner: <span className="font-extrabold">{players.find(p => p.id === winnerPlayerId)?.name}</span></p>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Final Scores:</h3>
          <ul className="list-none p-0">
            {players.map(player => (
              <li key={player.id} className="text-lg text-gray-700">{player.name}: {player.totalScores[player.id] || 0} points</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Game in Progress!</h2>
        <p className="text-lg text-gray-700">Trump: {trumpSuit ? trumpSuit.toUpperCase() : "Not set"}</p>
        {currentTurnPlayerId && (
          <p className="text-xl font-semibold text-indigo-600 mt-2">
            {currentTurnPlayerId === localPlayerId ? "Your turn!" : `${players.find(p => p.id === currentTurnPlayerId)?.name}'s turn`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {players.map(renderPlayerHand)}
      </div>

      <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Trick:</h3>
        {currentTrick.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {currentTrick.map((play, index) => (
              <div key={index} className="text-center p-2 border rounded-md bg-white shadow-sm">
                <p className="text-sm font-medium">{players.find(p => p.id === play.playerId)?.name}</p>
                <p className="text-md">{play.card.rank} {play.card.suit.charAt(0).toUpperCase()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No cards played yet this trick.</p>
        )}
      </div>

      {/* Placeholder for bidding, scoring, and other game controls */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
        <p className="text-yellow-800 font-medium">
          Detailed Belote game logic (bidding, full card rules, trick evaluation, scoring, Belote/Rebelote bonuses, game end conditions) would be implemented here and in helper functions that update the game state via Supabase.
        </p>
      </div>
    </div>
  );
};