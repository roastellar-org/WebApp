import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon, type IconName } from '../Icon'
import { WalletMenu } from '../WalletMenu'
import { useLiveUpdates } from '../../hooks/useLiveUpdates'

const navItems: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/marketplace', label: 'Marketplace', icon: 'market' },
  { to: '/tournaments', label: 'Tournaments', icon: 'trophy' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'chart' },
  { to: '/inventory', label: 'Inventory', icon: 'box' },
  { to: '/rewards', label: 'Rewards', icon: 'gift' },
  { to: '/profile', label: 'Profile', icon: 'user' },
  { to: '/settings', label: 'Settings', icon: 'gear' },
]

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  useLiveUpdates()

  const navigation = (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setDrawerOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-950 text-brand-300'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200',
            )
          }
        >
          <Icon name={item.icon} className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-800/70 bg-slate-900/40 px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2 text-lg font-bold text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-black text-white">
            A
          </span>
          ArenaX
        </Link>
        {navigation}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-950 p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-slate-100">ArenaX</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"
              >
                <Icon name="close" />
              </button>
            </div>
            {navigation}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
              >
                <Icon name="menu" />
              </button>
              <Link to="/" className="text-lg font-bold text-slate-100 lg:hidden">
                ArenaX
              </Link>
            </div>
            <WalletMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
