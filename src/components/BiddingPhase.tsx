"use client";

import React, { useState, useEffect } from "react";
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
  const isBotTurn = currentTurnPlayerId?.startsWith('bot_');
  const localPlayer = players.find(p => p.id === localPlayerId);
  const highestBid = bids.filter(b => !b.isPass).reduce((max, bid) => Math.max(max, bid.value), 0);
  const highestBidder = bids.find(b => b.value === highestBid && !b.isPass);

  // Bot bidding logic
  useEffect(() => {
    if (isBotTurn && currentTurnPlayerId) {
      const botPlayer = players.find(p => p.id === currentTurnPlayerId);
      if (!botPlayer) return;

      const botMakeBid = async () => {
        const minBidValue = getMinimumBid(bids);
        const bidOptions = getBidOptions(bids);
        const availableSuits = getAvailableBidSuits(bids);

        // Simple bot strategy:
        // 1. If no bids yet, make a minimum bid (e.g., 80 or 90)
        // 2. If there's a bid, try to overbid by 10-20 points with a random suit, or pass.
        // 3. Sometimes pass to make it more realistic.

        const shouldPass = Math.random() < 0.3; // 30% chance to pass
        let bidValueToMake: number | null = null;
        let bidSuitToMake: CardType['suit'] | 'no-trump' | 'all-trump' | null = null;

        if (shouldPass || minBidValue > 160) { // If min bid is too high, bot passes
          // Pass
        } else {
          // Try to bid
          const possibleBids = bidOptions.filter(opt => opt.value >= minBidValue && opt.value <= 160);
          if (possibleBids.length > 0) {
            bidValueToMake = possibleBids[Math.floor(Math.random() * possibleBids.length)].value;
            bidSuitToMake = availableSuits[Math.floor(Math.random() * availableSuits.length)];
          } else {
            // If no standard bids possible, try Capot or pass
            if (Math.random() < 0.5) { // 50% chance to bid Capot if nothing else
              bidValueToMake = 250;
              bidSuitToMake = availableSuits[Math.floor(Math.random() * availableSuits.length)];
            } else {
              // Pass
            }
          }
        }

        await handleMakeBid(bidValueToMake === null, bidValueToMake, bidSuitToMake);
      };

      const timer = setTimeout(botMakeBid, 1500); // Bot takes 1.5 seconds to make a decision
      return () => clearTimeout(timer);
    }
  }, [isBotTurn, currentTurnPlayerId, bids, players]); // Depend on bids to re-evaluate bot turn

  const handleMakeBid = async (isPass: boolean, value: number | null = selectedBidValue, suit: CardType['suit'] | 'no-trump' | 'all-trump' | null = selectedBidSuit) => {
    if (!currentTurnPlayerId) return; // Should not happen if it's a turn

    if (!isPass && (value === null || suit === null)) {
      showError("Please select a bid value and suit/type.");
      return;
    }

    const minBidValue = getMinimumBid(bids);
    if (!isPass && value! < minBidValue) {
      showError(`Your bid must be at least ${minBidValue}.`);
      return;
    }

    const newBid: Bid = {
      playerId: currentTurnPlayerId, // Use currentTurnPlayerId for the bid
      value: isPass ? 0 : value!,
      suit: isPass || suit === 'no-trump' || suit === 'all-trump' ? null : (suit as CardType['suit']),
      type: isPass ? 'suit' : (suit === 'no-trump' ? 'no-trump' : (suit === 'all-trump' ? 'all-trump' : 'suit')),
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
      const { error: updateError } = await supabase
        .from('games')
        .update({ status: 'lobby', bids: [], currentContract: null, trumpSuit: null, updatedAt: new Date().toISOString() })
        .eq('id', roomId);
      if (updateError) showError(`Failed to reset game: ${updateError.message}`);
      return;
    }

    if (activeBids.length > 0 && lastThreeBids.length === 3 && lastThreeBids.every(b => b.isPass)) {
      const finalHighestBid = activeBids.reduce((max, bid) => (bid.value > max.value ? bid : max), activeBids[0]);
      newContract = {
        playerId: finalHighestBid.playerId,
        value: finalHighestBid.value,
        suit: finalHighestBid.suit,
        type: finalHighestBid.type,
        isBelote: false,
      };
      newTrumpSuit = finalHighestBid.suit;
      if (finalHighestBid.type === 'all-trump') newTrumpSuit = 'clubs';
      if (finalHighestBid.type === 'no-trump') newTrumpSuit = null;

      updatedStatus = 'playing';

      const { updatedPlayers: playersAfterDeal, remainingDeck } = await dealRemainingCards(gameState.deck, players);

      const { error } = await supabase
        .from('games')
        .update({
          bids: updatedBids,
          currentContract: newContract,
          trumpSuit: newTrumpSuit,
          status: updatedStatus,
          currentTurnPlayerId: getNextPlayerId(dealerPlayerId!, players),
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
      showSuccess(isPass ? `${players.find(p => p.id === currentTurnPlayerId)?.name} passed.` : `${players.find(p => p.id === currentTurnPlayerId)?.name} bid ${value} ${suit}.`);
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