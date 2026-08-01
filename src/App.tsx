import { Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { Marketplace } from './pages/Marketplace'
import { AssetDetails } from './pages/AssetDetails'
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
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
