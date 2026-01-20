"use client";

export type Card = {
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades';
  rank: '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
};

export type Player = {
  id: string;
  name: string;
  hand: Card[];
  score: number;
  tricksWon: number;
};

export type GameState = {
  id: string;
  roomId: string;
  players: Player[];
  status: 'lobby' | 'bidding' | 'playing' | 'ended';
  currentTurnPlayerId: string | null;
  dealerPlayerId: string | null;
  trumpSuit: Card['suit'] | null;
  currentTrick: { playerId: string; card: Card }[];
  deck: Card[];
  roundScores: { [playerId: string]: number };
  totalScores: { [playerId: string]: number };
  winnerPlayerId: string | null;
  createdAt: string;
  updatedAt: string;
};