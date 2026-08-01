import { Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { Marketplace } from './pages/Marketplace'
import { AssetDetails } from './pages/AssetDetails'
import { Tournaments } from './pages/Tournaments'
import { TournamentDetails } from './pages/TournamentDetails'
import { TournamentHistory } from './pages/TournamentHistory'
import { Leaderboard } from './pages/Leaderboard'
import { Rewards } from './pages/Rewards'
import { Inventory } from './pages/Inventory'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<AssetDetails />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path="/tournaments/history" element={<TournamentHistory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
