"use client";

import { Card, Player, Bid, Contract, BidType } from "@/types/game";

// --- Deck and Card Management ---

export const createDeck = (): Card[] => {
  const suits: Card['suit'][] = ['clubs', 'diamonds', 'hearts', 'spades'];
  const ranks: Card['rank'][] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const dealCards = (deck: Card[], players: Player[]): { updatedPlayers: Player[]; remainingDeck: Card[] } => {
  let currentDeck = [...deck];
  const updatedPlayers = players.map(p => ({ ...p, hand: [] }));

  // Belote initial deal: 3 cards, then 2 cards (or 2 then 3)
  // For simplicity, let's do 5 cards first, then 3 cards for bidding, then 2 cards for playing
  // For now, let's deal 5 cards to each player for the initial hand.
  // The remaining 3 cards will be dealt after bidding.
  const cardsPerPlayerInitial = 5;
  for (let i = 0; i < cardsPerPlayerInitial; i++) {
    for (let j = 0; j < updatedPlayers.length; j++) {
      if (currentDeck.length > 0) {
        updatedPlayers[j].hand.push(currentDeck.shift()!);
      }
    }
  }
  return { updatedPlayers, remainingDeck: currentDeck };
};

export const dealRemainingCards = (deck: Card[], players: Player[]): { updatedPlayers: Player[]; remainingDeck: Card[] } => {
  let currentDeck = [...deck];
  const updatedPlayers = players.map(p => ({ ...p, hand: [...p.hand] })); // Copy existing hand

  // Deal 3 more cards to each player
  const cardsPerPlayerRemaining = 3;
  for (let i = 0; i < cardsPerPlayerRemaining; i++) {
    for (let j = 0; j < updatedPlayers.length; j++) {
      if (currentDeck.length > 0) {
        updatedPlayers[j].hand.push(currentDeck.shift()!);
      }
    }
  }
  return { updatedPlayers, remainingDeck: currentDeck };
};

// --- Card Value and Trick Logic ---

export const getCardValue = (card: Card, trumpSuit: Card['suit'] | null, contractType: BidType): number => {
  const isTrump = card.suit === trumpSuit && contractType !== 'no-trump';

  const rankValues: { [key: string]: { trump: number; noTrump: number } } = {
    '7': { trump: 0, noTrump: 0 },
    '8': { trump: 0, noTrump: 0 },
    '9': { trump: 14, noTrump: 0 }, // 9 is high in trump
    '10': { trump: 10, noTrump: 10 },
    'J': { trump: 20, noTrump: 2 }, // Jack is highest in trump
    'Q': { trump: 3, noTrump: 3 },
    'K': { trump: 4, noTrump: 4 },
    'A': { trump: 11, noTrump: 11 },
  };

  if (isTrump) {
    return rankValues[card.rank].trump;
  } else {
    return rankValues[card.rank].noTrump;
  }
};

export const getTrickWinner = (
  trick: { playerId: string; card: Card }[],
  trumpSuit: Card['suit'] | null,
  leadSuit: Card['suit'] | null,
  contractType: BidType
): string => {
  if (trick.length === 0) return '';

  let winningPlay = trick[0];
  let winningCardValue = getCardValue(winningPlay.card, trumpSuit, contractType);

  for (let i = 1; i < trick.length; i++) {
    const currentPlay = trick[i];
    const currentCardValue = getCardValue(currentPlay.card, trumpSuit, contractType);

    const isCurrentCardTrump = currentPlay.card.suit === trumpSuit && contractType !== 'no-trump';
    const isWinningCardTrump = winningPlay.card.suit === trumpSuit && contractType !== 'no-trump';

    // Rule 1: Trump beats non-trump
    if (isCurrentCardTrump && !isWinningCardTrump) {
      winningPlay = currentPlay;
      winningCardValue = currentCardValue;
      continue;
    }
    // Rule 2: Higher trump beats lower trump
    if (isCurrentCardTrump && isWinningCardTrump && currentCardValue > winningCardValue) {
      winningPlay = currentPlay;
      winningCardValue = currentCardValue;
      continue;
    }
    // Rule 3: If no trump, higher card of lead suit wins
    if (!isCurrentCardTrump && !isWinningCardTrump && currentPlay.card.suit === leadSuit && currentCardValue > winningCardValue) {
      winningPlay = currentPlay;
      winningCardValue = currentCardValue;
      continue;
    }
  }
  return winningPlay.playerId;
};

export const canPlayCard = (
  playerHand: Card[],
  cardToPlay: Card,
  currentTrick: { playerId: string; card: Card }[],
  trumpSuit: Card['suit'] | null,
  contractType: BidType
): boolean => {
  // If no cards have been played in the trick, any card can be played.
  if (currentTrick.length === 0) {
    return true;
  }

  const leadSuit = currentTrick[0].card.suit;
  const hasLeadSuit = playerHand.some(card => card.suit === leadSuit);
  const hasTrump = playerHand.some(card => card.suit === trumpSuit && contractType !== 'no-trump');

  // If the player has the lead suit, they must play it.
  if (hasLeadSuit) {
    if (cardToPlay.suit === leadSuit) {
      // If playing lead suit, check if they are forced to overtrump if current winner is trump
      const currentWinningPlay = getTrickWinner(currentTrick, trumpSuit, leadSuit, contractType);
      const currentWinningCard = currentTrick.find(p => p.playerId === currentWinningPlay)?.card;

      if (currentWinningCard && currentWinningCard.suit === trumpSuit && contractType !== 'no-trump') {
        // If current winner played trump, and player has lead suit but no trump, they can play lead suit
        if (!playerHand.some(c => c.suit === trumpSuit && contractType !== 'no-trump')) {
          return true;
        }
        // If player has trump, they must overtrump if possible
        const trumpsInHand = playerHand.filter(c => c.suit === trumpSuit && contractType !== 'no-trump');
        const canOvertrump = trumpsInHand.some(c => getCardValue(c, trumpSuit, contractType) > getCardValue(currentWinningCard, trumpSuit, contractType));

        if (cardToPlay.suit === trumpSuit && getCardValue(cardToPlay, trumpSuit, contractType) > getCardValue(currentWinningCard, trumpSuit, contractType)) {
          return true; // Playing a higher trump
        } else if (cardToPlay.suit === trumpSuit && !canOvertrump) {
          return true; // Playing a lower trump because no higher trump is available
        } else if (cardToPlay.suit !== trumpSuit && !canOvertrump && !trumpsInHand.length) {
          return true; // Playing non-trump, no trump in hand, and cannot overtrump
        } else if (cardToPlay.suit !== trumpSuit && !canOvertrump && trumpsInHand.length > 0) {
          return false; // Has trump but cannot overtrump, must play a trump (even if lower)
        } else if (cardToPlay.suit !== leadSuit && hasLeadSuit) {
          return false; // Has lead suit, must play lead suit
        }
      }
      return cardToPlay.suit === leadSuit;
    } else {
      return false; // Must play lead suit if available
    }
  }

  // If player does not have the lead suit
  if (!hasLeadSuit) {
    // If player has trump, they must play trump if current winner is not trump
    const currentWinningPlay = getTrickWinner(currentTrick, trumpSuit, leadSuit, contractType);
    const currentWinningCard = currentTrick.find(p => p.id === currentWinningPlay)?.card;

    if (currentWinningCard && currentWinningCard.suit !== trumpSuit && hasTrump && contractType !== 'no-trump') {
      return cardToPlay.suit === trumpSuit; // Must play trump
    }

    // If player has trump and current winner is trump, they must overtrump if possible
    if (currentWinningCard && currentWinningCard.suit === trumpSuit && hasTrump && contractType !== 'no-trump') {
      const trumpsInHand = playerHand.filter(c => c.suit === trumpSuit && contractType !== 'no-trump');
      const canOvertrump = trumpsInHand.some(c => getCardValue(c, trumpSuit, contractType) > getCardValue(currentWinningCard, trumpSuit, contractType));

      if (canOvertrump) {
        return cardToPlay.suit === trumpSuit && getCardValue(cardToPlay, trumpSuit, contractType) > getCardValue(currentWinningCard, trumpSuit, contractType);
      } else {
        return cardToPlay.suit === trumpSuit; // Must play trump, even if lower
      }
    }
    // If player has no lead suit and no trump (or no trump contract), any card can be played.
    return true;
  }

  return false; // Should not reach here
};


// --- Scoring Logic ---

export const calculateTrickPoints = (trick: { playerId: string; card: Card }[], trumpSuit: Card['suit'] | null, contractType: BidType): number => {
  let points = 0;
  for (const play of trick) {
    points += getCardValue(play.card, trumpSuit, contractType);
  }
  return points;
};

export const calculateRoundScores = (
  players: Player[],
  team1Players: string[],
  team2Players: string[],
  contract: Contract,
  trumpSuit: Card['suit'] | null
): { team1Score: number; team2Score: number } => {
  let team1RoundPoints = 0;
  let team2RoundPoints = 0;

  // Sum up points from tricks won by each player
  for (const player of players) {
    const trickPoints = player.tricksWon; // Assuming tricksWon now stores points from tricks
    if (team1Players.includes(player.id)) {
      team1RoundPoints += trickPoints;
    } else if (team2Players.includes(player.id)) {
      team2RoundPoints += trickPoints;
    }
  }

  // Add Dix de Der (10 points for the last trick)
  // This needs to be handled during trick resolution, not here.
  // For now, let's assume trickPoints already include Dix de Der.

  // Belote/Rebelote bonus (20 points)
  // This needs to be handled during card play, not here.
  // For now, let's assume it's added to the player's score directly.

  // Contract fulfillment and penalties
  const contractingTeamPlayers = team1Players.includes(contract.playerId) ? team1Players : team2Players;
  const contractingTeamScore = team1Players.includes(contract.playerId) ? team1RoundPoints : team2RoundPoints;
  const defendingTeamScore = team1Players.includes(contract.playerId) ? team2RoundPoints : team1RoundPoints;

  const contractValue = contract.value;
  const totalPointsInRound = team1RoundPoints + team2RoundPoints; // Should be 162 for a full game + bonuses

  if (contractingTeamScore >= contractValue) {
    // Contract made
    if (contractingTeamPlayers === team1Players) {
      return { team1Score: contractingTeamScore + contractValue, team2Score: defendingTeamScore };
    } else {
      return { team1Score: defendingTeamScore, team2Score: contractingTeamScore + contractValue };
    }
  } else {
    // Contract failed (Capot or not enough points)
    // All points go to the defending team, plus the contract value
    if (contractingTeamPlayers === team1Players) {
      return { team1Score: 0, team2Score: totalPointsInRound + contractValue };
    } else {
      return { team1Score: totalPointsInRound + contractValue, team2Score: 0 };
    }
  }
};

// --- Helper for finding next player ---
export const getNextPlayerId = (currentPlayerId: string, players: Player[]): string => {
  const currentIndex = players.findIndex(p => p.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
};

// --- Bidding Logic ---
export const getMinimumBid = (currentBids: Bid[]): number => {
  if (currentBids.length === 0 || currentBids.every(bid => bid.isPass)) {
    return 80; // Starting bid
  }
  const highestBid = currentBids.reduce((max, bid) => (bid.isPass ? max : Math.max(max, bid.value)), 0);
  return highestBid + 10; // Next bid must be at least 10 points higher
};

export const getAvailableBidSuits = (currentBids: Bid[]): (Card['suit'] | 'no-trump' | 'all-trump')[] => {
  const availableSuits: (Card['suit'] | 'no-trump' | 'all-trump')[] = ['clubs', 'diamonds', 'hearts', 'spades', 'no-trump', 'all-trump'];
  // In a real game, you can't bid the same suit/type if a higher bid of that type exists.
  // For simplicity, we'll allow all for now, but a higher bid must be made.
  return availableSuits;
};

export const getBidOptions = (currentBids: Bid[]): { value: number; label: string }[] => {
  const minBid = getMinimumBid(currentBids);
  const options = [];
  for (let i = minBid; i <= 160; i += 10) { // Bids typically go up to 160, then Capot (250)
    options.push({ value: i, label: `${i}` });
  }
  options.push({ value: 250, label: "Capot" }); // Capot is 250 points
  return options;
};

export const getContractingTeam = (contract: Contract, team1Players: string[], team2Players: string[]): string[] => {
  return team1Players.includes(contract.playerId) ? team1Players : team2Players;
};

export const getDefendingTeam = (contract: Contract, team1Players: string[], team2Players: string[]): string[] => {
  return team1Players.includes(contract.playerId) ? team2Players : team1Players;
};