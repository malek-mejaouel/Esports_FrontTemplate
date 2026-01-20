"use client";

export type Card = {
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades';
  rank: '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
};

export type Player = {
  id: string;
  name: string;
  hand: Card[];
  score: number; // Score for the current round
  tricksWon: number; // Tricks won in the current round
};

export type BidType = 'no-trump' | 'all-trump' | 'suit';

export type Bid = {
  playerId: string;
  value: number; // e.g., 80, 90, 100
  suit: Card['suit'] | null; // null for no-trump/all-trump
  type: BidType;
  isPass: boolean;
};

export type Contract = {
  playerId: string; // Player who won the bid
  value: number;
  suit: Card['suit'] | null; // null for no-trump/all-trump
  type: BidType;
  isBelote: boolean; // If Belote/Rebelote was declared
};

export type GameState = {
  id: string;
  roomId: string;
  players: Player[];
  team1Players: string[]; // IDs of players in Team 1
  team2Players: string[]; // IDs of players in Team 2
  team1Score: number; // Total score for Team 1 across rounds
  team2Score: number; // Total score for Team 2 across rounds
  status: 'lobby' | 'bidding' | 'playing' | 'ended';
  currentTurnPlayerId: string | null;
  dealerPlayerId: string | null;
  trumpSuit: Card['suit'] | null;
  currentTrick: { playerId: string; card: Card }[];
  leadSuit: Card['suit'] | null; // The suit of the first card played in the current trick
  deck: Card[];
  bids: Bid[]; // All bids made in the current bidding phase
  currentContract: Contract | null; // The winning contract
  roundNumber: number;
  winnerPlayerId: string | null; // Winner of the entire game
  createdAt: string;
  updatedAt: string;
};