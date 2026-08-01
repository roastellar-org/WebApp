import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { PageLoader } from './components/PageLoader'

const Marketplace = lazy(() => import('./pages/Marketplace').then((module) => ({ default: module.Marketplace })))
const AssetDetails = lazy(() =>
  import('./pages/AssetDetails').then((module) => ({ default: module.AssetDetails })),
)
const Tournaments = lazy(() =>
  import('./pages/Tournaments').then((module) => ({ default: module.Tournaments })),
)
const TournamentDetails = lazy(() =>
  import('./pages/TournamentDetails').then((module) => ({ default: module.TournamentDetails })),
)
const TournamentHistory = lazy(() =>
  import('./pages/TournamentHistory').then((module) => ({ default: module.TournamentHistory })),
)
const Leaderboard = lazy(() => import('./pages/Leaderboard').then((module) => ({ default: module.Leaderboard })))
const Rewards = lazy(() => import('./pages/Rewards').then((module) => ({ default: module.Rewards })))
const Inventory = lazy(() => import('./pages/Inventory').then((module) => ({ default: module.Inventory })))
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })))
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/marketplace"
            element={
              <Suspense fallback={<PageLoader />}>
                <Marketplace />
              </Suspense>
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <AssetDetails />
              </Suspense>
            }
          />
          <Route
            path="/tournaments"
            element={
              <Suspense fallback={<PageLoader />}>
                <Tournaments />
              </Suspense>
            }
          />
          <Route
            path="/tournaments/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <TournamentDetails />
              </Suspense>
            }
          />
          <Route
            path="/tournaments/history"
            element={
              <Suspense fallback={<PageLoader />}>
                <TournamentHistory />
              </Suspense>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <Leaderboard />
              </Suspense>
            }
          />
          <Route
            path="/rewards"
            element={
              <Suspense fallback={<PageLoader />}>
                <Rewards />
              </Suspense>
            }
          />
          <Route
            path="/inventory"
            element={
              <Suspense fallback={<PageLoader />}>
                <Inventory />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
