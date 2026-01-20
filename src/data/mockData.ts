import { Card } from "@/components/ui/card";

export interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  status: 'live' | 'upcoming' | 'completed';
  prizePool: string;
  imageUrl: string;
  teams: Team[];
  matches: Match[];
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  region: string;
  players: Player[];
  rank: number;
  wins: number;
  losses: number;
}

export interface Player {
  id: string;
  name: string;
  ign: string; // In-game name
  avatarUrl: string;
  teamId: string;
  role: string;
  kda: string;
  rank: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  team1: Team;
  team2: Team;
  score1: number | null;
  score2: number | null;
  status: 'live' | 'upcoming' | 'completed';
  streamUrl?: string;
  date: string;
  time: string;
  game: string;
}

export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Cybernetic Titans',
    logoUrl: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=CT',
    region: 'NA',
    players: [],
    rank: 1,
    wins: 15,
    losses: 2,
  },
  {
    id: 'team2',
    name: 'Quantum Knights',
    logoUrl: 'https://via.placeholder.com/150/00BFFF/FFFFFF?text=QK',
    region: 'EU',
    players: [],
    rank: 2,
    wins: 12,
    losses: 5,
  },
  {
    id: 'team3',
    name: 'Neon Dragons',
    logoUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=ND',
    region: 'ASIA',
    players: [],
    rank: 3,
    wins: 10,
    losses: 7,
  },
  {
    id: 'team4',
    name: 'Void Sentinels',
    logoUrl: 'https://via.placeholder.com/150/800080/FFFFFF?text=VS',
    region: 'NA',
    players: [],
    rank: 4,
    wins: 9,
    losses: 8,
  },
];

export const mockPlayers: Player[] = [
  {
    id: 'player1',
    name: 'Alex "Shadow" Chen',
    ign: 'Shadow',
    avatarUrl: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=SC',
    teamId: 'team1',
    role: 'Carry',
    kda: '4.5',
    rank: 1,
  },
  {
    id: 'player2',
    name: 'Ben "Vortex" Lee',
    ign: 'Vortex',
    avatarUrl: 'https://via.placeholder.com/150/00BFFF/FFFFFF?text=VL',
    teamId: 'team2',
    role: 'Mid',
    kda: '3.8',
    rank: 2,
  },
  {
    id: 'player3',
    name: 'Chloe "Spectra" Kim',
    ign: 'Spectra',
    avatarUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=CK',
    teamId: 'team3',
    role: 'Support',
    kda: '2.1',
    rank: 3,
  },
  {
    id: 'player4',
    name: 'David "Ghost" Miller',
    ign: 'Ghost',
    avatarUrl: 'https://via.placeholder.com/150/800080/FFFFFF?text=DM',
    teamId: 'team4',
    role: 'Jungle',
    kda: '3.2',
    rank: 4,
  },
];

// Assign players to teams
mockTeams[0].players = [mockPlayers[0]];
mockTeams[1].players = [mockPlayers[1]];
mockTeams[2].players = [mockPlayers[2]];
mockTeams[3].players = [mockPlayers[3]];


export const mockMatches: Match[] = [
  {
    id: 'match1',
    tournamentId: 'tourn1',
    team1: mockTeams[0],
    team2: mockTeams[1],
    score1: null,
    score2: null,
    status: 'live',
    streamUrl: 'https://www.twitch.tv/riotgames',
    date: '2024-10-27',
    time: '18:00 PST',
    game: 'Valorant',
  },
  {
    id: 'match2',
    tournamentId: 'tourn1',
    team1: mockTeams[2],
    team2: mockTeams[3],
    score1: null,
    score2: null,
    status: 'upcoming',
    date: '2024-10-28',
    time: '14:00 PST',
    game: 'League of Legends',
  },
  {
    id: 'match3',
    tournamentId: 'tourn2',
    team1: mockTeams[0],
    team2: mockTeams[2],
    score1: 2,
    score2: 1,
    status: 'completed',
    date: '2024-10-26',
    time: '16:00 PST',
    game: 'CS2',
  },
];

export const mockTournaments: Tournament[] = [
  {
    id: 'tourn1',
    name: 'Galactic Gauntlet 2024',
    game: 'Valorant',
    date: 'Oct 27 - Nov 3',
    status: 'live',
    prizePool: '$500,000',
    imageUrl: 'https://via.placeholder.com/600x300/8A2BE2/FFFFFF?text=Galactic+Gauntlet',
    teams: mockTeams.slice(0, 2),
    matches: mockMatches.slice(0, 2),
  },
  {
    id: 'tourn2',
    name: 'Cyber Clash Series',
    game: 'League of Legends',
    date: 'Nov 10 - Nov 17',
    status: 'upcoming',
    prizePool: '$1,000,000',
    imageUrl: 'https://via.placeholder.com/600x300/00BFFF/FFFFFF?text=Cyber+Clash',
    teams: mockTeams.slice(2, 4),
    matches: [mockMatches[2]],
  },
  {
    id: 'tourn3',
    name: 'Apex Legends Global Series',
    game: 'Apex Legends',
    date: 'Sep 1 - Sep 15',
    status: 'completed',
    prizePool: '$250,000',
    imageUrl: 'https://via.placeholder.com/600x300/FF4500/FFFFFF?text=Apex+Series',
    teams: mockTeams,
    matches: [],
  },
];

export const mockLeaderboard = [
  { rank: 1, team: 'Cybernetic Titans', wins: 15, losses: 2, points: 450 },
  { rank: 2, team: 'Quantum Knights', wins: 12, losses: 5, points: 380 },
  { rank: 3, team: 'Neon Dragons', wins: 10, losses: 7, points: 320 },
  { rank: 4, team: 'Void Sentinels', wins: 9, losses: 8, points: 290 },
  { rank: 5, team: 'Starfall Warriors', wins: 8, losses: 9, points: 260 },
  { rank: 6, team: 'Crimson Vipers', wins: 7, losses: 10, points: 230 },
  { rank: 7, team: 'Shadow Syndicate', wins: 6, losses: 11, points: 200 },
  { rank: 8, team: 'Omega Outlaws', wins: 5, losses: 12, points: 170 },
];