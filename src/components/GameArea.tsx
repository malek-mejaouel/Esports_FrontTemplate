"use client";

import React, { useEffect, useState } from "react";
import { GameState, Player, Card, Contract } from "@/types/game";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabaseClient";
import { getCardValue, getTrickWinner, canPlayCard, calculateTrickPoints, getNextPlayerId, calculateRoundScores } from "@/utils/gameLogic";

interface GameAreaProps {
  gameState: GameState;
  localPlayerId: string;
}

export const GameArea: React.FC<GameAreaProps> = ({ gameState, localPlayerId }) => {
  const {
    id: gameId,
    players,
    currentTurnPlayerId,
    currentTrick,
    trumpSuit,
    status,
    winnerPlayerId,
    currentContract,
    leadSuit,
    roundNumber,
    team1Players,
    team2Players,
    team1Score,
    team2Score,
  } = gameState;

  const localPlayer = players.find(p => p.id === localPlayerId);
  const isMyTurn = currentTurnPlayerId === localPlayerId;
  const [trickPoints, setTrickPoints] = useState(0);

  useEffect(() => {
    if (currentTrick.length > 0 && currentContract) {
      setTrickPoints(calculateTrickPoints(currentTrick, trumpSuit, currentContract.type));
    } else {
      setTrickPoints(0);
    }
  }, [currentTrick, trumpSuit, currentContract]);

  // Effect to handle trick completion
  useEffect(() => {
    if (currentTrick.length === players.length && currentContract) {
      const trickWinnerId = getTrickWinner(currentTrick, trumpSuit, leadSuit, currentContract.type);
      const pointsForTrick = calculateTrickPoints(currentTrick, trumpSuit, currentContract.type);

      const handleTrickEnd = async () => {
        const updatedPlayers = players.map(p =>
          p.id === trickWinnerId
            ? { ...p, tricksWon: p.tricksWon + 1, score: p.score + pointsForTrick + (currentTrick.length === players.length ? 10 : 0) } // Add 10 for Dix de Der
            : p
        );

        const nextDealerId = getNextPlayerId(gameState.dealerPlayerId!, players); // Dealer rotates
        const nextTurnPlayerId = trickWinnerId; // Trick winner leads next trick

        const { error } = await supabase
          .from('games')
          .update({
            players: updatedPlayers,
            currentTrick: [],
            leadSuit: null,
            currentTurnPlayerId: nextTurnPlayerId,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', gameId);

        if (error) {
          showError(`Failed to resolve trick: ${error.message}`);
        } else {
          showSuccess(`${players.find(p => p.id === trickWinnerId)?.name} won the trick!`);
        }
      };

      // Small delay to show the trick before clearing
      const timer = setTimeout(handleTrickEnd, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTrick, players, trumpSuit, leadSuit, currentContract, gameId, gameState.dealerPlayerId]);

  // Effect to handle round completion
  useEffect(() => {
    if (players.every(p => p.hand.length === 0) && currentContract && status === 'playing') {
      const handleRoundEnd = async () => {
        const { team1Score: newTeam1RoundScore, team2Score: newTeam2RoundScore } = calculateRoundScores(
          players,
          team1Players,
          team2Players,
          currentContract,
          trumpSuit
        );

        const updatedTeam1TotalScore = team1Score + newTeam1RoundScore;
        const updatedTeam2TotalScore = team2Score + newTeam2RoundScore;

        const nextDealerId = getNextPlayerId(gameState.dealerPlayerId!, players);

        const { error } = await supabase
          .from('games')
          .update({
            team1Score: updatedTeam1TotalScore,
            team2Score: updatedTeam2TotalScore,
            roundNumber: roundNumber + 1,
            status: updatedTeam1TotalScore >= 1000 || updatedTeam2TotalScore >= 1000 ? 'ended' : 'lobby', // Game ends at 1000 points
            currentContract: null,
            trumpSuit: null,
            currentTrick: [],
            leadSuit: null,
            currentTurnPlayerId: null,
            dealerPlayerId: nextDealerId,
            players: players.map(p => ({ ...p, hand: [], score: 0, tricksWon: 0 })), // Reset player state for new round
            updatedAt: new Date().toISOString(),
          })
          .eq('id', gameId);

        if (error) {
          showError(`Failed to end round: ${error.message}`);
        } else {
          showSuccess(`Round ${roundNumber} ended! Team 1: ${newTeam1RoundScore}, Team 2: ${newTeam2RoundScore}`);
          if (updatedTeam1TotalScore >= 1000 || updatedTeam2TotalScore >= 1000) {
            showSuccess("Game Over!");
          } else {
            showSuccess("Starting new round in lobby.");
          }
        }
      };
      const timer = setTimeout(handleRoundEnd, 3000); // Delay to show final trick
      return () => clearTimeout(timer);
    }
  }, [players, currentContract, status, gameId, roundNumber, team1Players, team2Players, team1Score, team2Score, trumpSuit, gameState.dealerPlayerId]);


  const handlePlayCard = async (card: Card) => {
    if (!isMyTurn) {
      showError("It's not your turn!");
      return;
    }
    if (!currentContract) {
      showError("No contract set yet!");
      return;
    }

    // Validate card play
    if (!canPlayCard(localPlayer!.hand, card, currentTrick, trumpSuit, currentContract.type)) {
      showError("You cannot play that card according to Belote rules!");
      return;
    }

    const updatedTrick = [...currentTrick, { playerId: localPlayerId, card }];
    const updatedPlayerHand = localPlayer?.hand.filter(c => c.rank !== card.rank || c.suit !== card.suit) || [];

    const nextTurnPlayerId = getNextPlayerId(currentTurnPlayerId!, players);
    const newLeadSuit = currentTrick.length === 0 ? card.suit : leadSuit;

    // Update game state in Supabase
    const { error } = await supabase
      .from('games')
      .update({
        currentTrick: updatedTrick,
        players: players.map(p => p.id === localPlayerId ? { ...p, hand: updatedPlayerHand } : p),
        currentTurnPlayerId: nextTurnPlayerId,
        leadSuit: newLeadSuit,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', gameId);

    if (error) {
      showError(`Failed to play card: ${error.message}`);
    } else {
      showSuccess(`You played ${card.rank} of ${card.suit}`);
    }
  };

  const renderPlayerHand = (player: Player) => (
    <div key={player.id} className="p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
      <h4 className="font-semibold text-gray-800">{player.name} {player.id === localPlayerId && "(You)"}</h4>
      <p className="text-sm text-gray-600">Tricks Won: {player.tricksWon}</p>
      <p className="text-sm text-gray-600">Round Score: {player.score}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {player.hand.map((card, index) => (
          <Button
            key={`${card.rank}-${card.suit}-${index}`}
            onClick={() => handlePlayCard(card)}
            disabled={!isMyTurn || player.id !== localPlayerId || !currentContract}
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
        {team1Score > team2Score ? (
          <p className="text-2xl text-gray-800">Team 1 Wins with {team1Score} points!</p>
        ) : team2Score > team1Score ? (
          <p className="text-2xl text-gray-800">Team 2 Wins with {team2Score} points!</p>
        ) : (
          <p className="text-2xl text-gray-800">It's a Tie!</p>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Final Scores:</h3>
          <p className="text-lg text-gray-700">Team 1: {team1Score} points</p>
          <p className="text-lg text-gray-700">Team 2: {team2Score} points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Round {roundNumber} in Progress!</h2>
        {currentContract && (
          <p className="text-lg text-gray-700">
            Contract: <span className="font-semibold">{currentContract.value} {currentContract.type === 'suit' ? currentContract.suit : currentContract.type}</span> by {players.find(p => p.id === currentContract.playerId)?.name}
          </p>
        )}
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
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Trick ({trickPoints} points):</h3>
        {currentTrick.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {currentTrick.map((play, index) => (
              <div key={index} className="text-center p-2 border rounded-md bg-white shadow-sm">
                <p className="text-sm font-medium">{players.find(p => p.id === play.playerId)?.name}</p>
                <p className="text-md font-bold">{play.card.rank} {play.card.suit.charAt(0).toUpperCase()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No cards played yet this trick.</p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Total Scores:</h3>
        <p className="text-lg text-blue-700">Team 1: <span className="font-bold">{team1Score}</span></p>
        <p className="text-lg text-blue-700">Team 2: <span className="font-bold">{team2Score}</span></p>
      </div>
    </div>
  );
};