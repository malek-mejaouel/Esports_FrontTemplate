CREATE TABLE public.games (
    id TEXT PRIMARY KEY,
    "roomId" TEXT NOT NULL UNIQUE,
    players JSONB DEFAULT '[]'::jsonb NOT NULL,
    status TEXT DEFAULT 'lobby'::text NOT NULL,
    "currentTurnPlayerId" TEXT,
    "dealerPlayerId" TEXT,
    "trumpSuit" TEXT,
    "currentTrick" JSONB DEFAULT '[]'::jsonb NOT NULL,
    deck JSONB DEFAULT '[]'::jsonb NOT NULL,
    "roundScores" JSONB DEFAULT '{}'::jsonb NOT NULL,
    "totalScores" JSONB DEFAULT '{}'::jsonb NOT NULL,
    "winnerPlayerId" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to games table" ON public.games
  FOR ALL USING (true) WITH CHECK (true);