import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TournamentsPage from "./pages/TournamentsPage";
import TeamsPage from "./pages/TeamsPage";
import PlayersPage from "./pages/PlayersPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index"; // Keep Index for initial redirect

const App = () => (
  <BrowserRouter>
    <Sonner /> {/* Keeping sonner for general notifications */}
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} /> {/* Initial redirect */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} /> {/* Admin routes */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;