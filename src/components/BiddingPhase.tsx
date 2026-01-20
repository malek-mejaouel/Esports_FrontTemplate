"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/lib/supabaseClient";
import { GameState, Player, Bid, Card as CardType, BidType } from "@/types/game";
import { getMinimumBid, getBidOptions, getAvailableBidSuits, getNextPlayerId } from "@/utils/gameLogic";

interface BiddingPhaseProps {
  gameState: GameState;
  localPlayerId: string;
  onBidMade: (updatedGameState: GameState) => void;
}

export const BiddingPhase: React.FC<BiddingPhaseProps> = ({ gameState, localPlayerId, onBidMade }) => {
  const { roomId, players, bids, currentTurnPlayerId, dealerPlayerId } = gameState;
  const [selectedBidValue, setSelectedBidValue] = useState<number | null>(null);
  const [selectedBidSuit, setSelectedBidSuit] = useState<CardType['suit'] | 'no-trump' | 'all-trump' | null>(null);

  const isMyTurn = currentTurnPlayerId === localPlayerId;
  const localPlayer = players.find(p => p.id === localPlayerId);
  const highestBid = bids.filter(b => !b.isPass).reduce((max, bid) => Math.max(max, bid.value), 0);
  const highestBidder = bids.find(b => b.value === highestBid && !b.isPass);

  const handleMakeBid = async (isPass: boolean) => {
    if (!isMyTurn) {
      showError("It's not your turn to bid!");
      return;
    }

    if (!isPass && (selectedBidValue === null || selectedBidSuit === null)) {
      showError("Please select a bid value and suit/type.");
      return;
    }

    const minBidValue = getMinimumBid(bids);
    if (!isPass && selectedBidValue! < minBidValue) {
      showError(`Your bid must be at least ${minBidValue}.`);
      return;
    }

    const newBid: Bid = {
      playerId: localPlayerId,
      value: isPass ? 0 : selectedBidValue!,
      suit: isPass || selectedBidSuit === 'no-trump' || selectedBidSuit === 'all-trump' ? null : (selectedBidSuit as CardType['suit']),
      type: isPass ? 'suit' : (selectedBidSuit === 'no-trump' ? 'no-trump' : (selectedBidSuit === 'all-trump' ? 'all-trump' : 'suit')),
      isPass: isPass,
    };

    const updatedBids = [...bids, newBid];
    let nextTurnPlayerId = getNextPlayerId(currentTurnPlayerId!, players);

    let updatedStatus = 'bidding';
    let newContract: Contract | null = null;
    let newTrumpSuit: CardType['suit'] | null = null;

    // Check for end of bidding (3 consecutive passes after an initial bid, or all pass)
    const activeBids = updatedBids.filter(b => !b.isPass);
    const lastThreeBids = updatedBids.slice(-3);
    const allPassed = updatedBids.length >= players.length && updatedBids.every(b => b.isPass);

    if (allPassed) {
      showError("All players passed. The round is cancelled or re-dealt in a real game. For now, returning to lobby.");
      // In a real game, this would trigger a re-deal or specific rules.
      // For simplicity, let's reset to lobby or end the game.
      const { error: updateError } = await supabase
        .from('games')
        .update({ status: 'lobby', bids: [], currentContract: null, trumpSuit: null, updatedAt: new Date().toISOString() })
        .eq('id', roomId);
      if (updateError) showError(`Failed to reset game: ${updateError.message}`);
      return;
    }

    if (activeBids.length > 0 && lastThreeBids.length === 3 && lastThreeBids.every(b => b.isPass)) {
      // Bidding ends, contract is set
      const finalHighestBid = activeBids.reduce((max, bid) => (bid.value > max.value ? bid : max), activeBids[0]);
      newContract = {
        playerId: finalHighestBid.playerId,
        value: finalHighestBid.value,
        suit: finalHighestBid.suit,
        type: finalHighestBid.type,
        isBelote: false, // Belote/Rebelote declared during play
      };
      newTrumpSuit = finalHighestBid.suit;
      if (finalHighestBid.type === 'all-trump') newTrumpSuit = 'clubs'; // Placeholder, actual all-trump logic is more complex
      if (finalHighestBid.type === 'no-trump') newTrumpSuit = null;

      updatedStatus = 'playing'; // Transition to playing phase

      // Deal remaining cards (3 cards to each player)
      const { updatedPlayers: playersAfterDeal, remainingDeck } = await dealRemainingCards(gameState.deck, players);

      const { error } = await supabase
        .from('games')
        .update({
          bids: updatedBids,
          currentContract: newContract,
          trumpSuit: newTrumpSuit,
          status: updatedStatus,
          currentTurnPlayerId: getNextPlayerId(dealerPlayerId!, players), // Player after dealer starts playing
          players: playersAfterDeal,
          deck: remainingDeck,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', roomId);

      if (error) {
        showError(`Failed to finalize bid and start game: ${error.message}`);
      } else {
        showSuccess(`Contract set! ${newContract.value} ${newContract.type === 'suit' ? newContract.suit : newContract.type} by ${players.find(p => p.id === newContract.playerId)?.name}`);
        onBidMade({ ...gameState, bids: updatedBids, currentContract: newContract, trumpSuit: newTrumpSuit, status: updatedStatus, players: playersAfterDeal, deck: remainingDeck });
      }
      return;
    }

    // Continue bidding
    const { error } = await supabase
      .from('games')
      .update({
        bids: updatedBids,
        currentTurnPlayerId: nextTurnPlayerId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', roomId);

    if (error) {
      showError(`Failed to make bid: ${error.message}`);
    } else {
      showSuccess(isPass ? "You passed." : `You bid ${selectedBidValue} ${selectedBidSuit}.`);
      onBidMade({ ...gameState, bids: updatedBids, currentTurnPlayerId: nextTurnPlayerId });
    }
  };

  const bidOptions = getBidOptions(bids);
  const availableSuits = getAvailableBidSuits(bids);

  return (
    <Card className="w-full max-w-xl rounded-xl shadow-lg border-none bg-white/95 backdrop-blur-sm p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-extrabold text-purple-800 mb-2">Bidding Phase</CardTitle>
        <CardDescription className="text-lg text-gray-700">
          {isMyTurn ? "It's your turn to bid!" : `${players.find(p => p.id === currentTurnPlayerId)?.name}'s turn to bid.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">Current Bids:</h3>
          {bids.length === 0 ? (
            <p className="text-gray-600">No bids yet. Minimum bid is {getMinimumBid([])}.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {bids.map((bid, index) => (
                <li key={index}>
                  {players.find(p => p.id === bid.playerId)?.name}:{" "}
                  {bid.isPass ? "Pass" : `${bid.value} ${bid.type === 'suit' ? bid.suit : bid.type}`}
                </li>
              ))}
            </ul>
          )}
          {highestBidder && (
            <p className="text-md font-medium text-indigo-700">
              Highest bid: {highestBidder.value} {highestBidder.type === 'suit' ? highestBidder.suit : highestBidder.type} by {players.find(p => p.id === highestBidder.playerId)?.name}
            </p>
          )}
        </div>

        {isMyTurn && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800">Make Your Bid:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select onValueChange={(value) => setSelectedBidValue(parseInt(value))} value={selectedBidValue?.toString() || ""}>
                <SelectTrigger className="w-full sm:w-1/2 bg-white border-purple-300 text-purple-700">
                  <SelectValue placeholder={`Bid (min ${getMinimumBid(bids)})`} />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-300">
                  {bidOptions.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()} disabled={option.value < getMinimumBid(bids)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSelectedBidSuit(value as CardType['suit'] | 'no-trump' | 'all-trump')} value={selectedBidSuit || ""}>
                <SelectTrigger className="w-full sm:w-1/2 bg-white border-purple-300 text-purple-700">
                  <SelectValue placeholder="Suit / Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-purple-300">
                  {availableSuits.map(suit => (
                    <SelectItem key={suit} value={suit}>
                      {suit.charAt(0).toUpperCase() + suit.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => handleMakeBid(false)}
                disabled={selectedBidValue === null || selectedBidSuit === null || selectedBidValue < getMinimumBid(bids)}
                className="flex-1 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Bid
              </Button>
              <Button
                onClick={() => handleMakeBid(true)}
                className="flex-1 py-3 text-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Pass
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};