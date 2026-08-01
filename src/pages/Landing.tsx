import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { LoginDialog } from '../components/LoginDialog'

const games = [
  { name: 'Apex Arenas', genre: 'Battle Royale', gradient: 'from-rose-500 to-orange-500' },
  { name: 'Neon Strike', genre: 'Tactical Shooter', gradient: 'from-sky-500 to-indigo-600' },
  { name: 'Pixel Royale', genre: 'Retro Platformer', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Sword & Shield', genre: 'MOBA', gradient: 'from-violet-500 to-fuchsia-600' },
]

const features = [
  {
    title: 'On-chain rewards',
    description: 'Every victory pays out in tokens and NFTs, verifiable on-chain the moment a match settles.',
  },
  {
    title: 'Fair matchmaking',
    description: 'Skill-based brackets with verified results reported by the ArenaX backend, no manual claims.',
  },
  {
    title: 'Transparent marketplace',
    description: 'Trade tournament skins and collectibles with instant settlement and a public order book.',
  },
]

const steps = [
  { step: '01', title: 'Connect your wallet', description: 'Sign a message to create your player identity. No email, no passwords.' },
  { step: '02', title: 'Enter a tournament', description: 'Join open brackets, grind the ladder, and climb the weekly leaderboard.' },
  { step: '03', title: 'Earn and trade', description: 'Rewards land in your inventory automatically. Sell, hold, or play with them.' },
]

export function Landing() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-black text-white">
              A
            </span>
            ArenaX
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex" aria-label="Main">
            <Link to="/marketplace" className="transition-colors hover:text-slate-200">
              Marketplace
            </Link>
            <Link to="/tournaments" className="transition-colors hover:text-slate-200">
              Tournaments
            </Link>
            <Link to="/leaderboard" className="transition-colors hover:text-slate-200">
              Leaderboard
            </Link>
          </nav>
          <Button size="sm" onClick={() => setLoginOpen(true)}>
            Connect wallet
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:py-32">
            <Badge tone="brand" className="mb-6">
              Season 7 is live
            </Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-slate-50 sm:text-6xl">
              Own your skill. <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">Earn on-chain.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              ArenaX is the web3 esports platform where your matchmaking rank is worth more than a number.
              Compete, collect, and trade in a marketplace backed by real rewards.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => setLoginOpen(true)}>
                Enter the Arena
              </Button>
              <Link to="/tournaments">
                <Button size="lg" variant="secondary">
                  Browse tournaments
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800/60 bg-slate-900/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center sm:px-6 md:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-slate-50">48k</p>
              <p className="mt-1 text-sm text-slate-500">players on-chain</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">1.2k</p>
              <p className="mt-1 text-sm text-slate-500">tournaments hosted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">$2.4M</p>
              <p className="mt-1 text-sm text-slate-500">prizes paid out</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">12</p>
              <p className="mt-1 text-sm text-slate-500">supported games</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-50">Pick your game</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
            From battle royale to MOBA, every title runs the same verified tournament engine.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => (
              <Link
                key={game.name}
                to="/tournaments"
                className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-brand-700"
              >
                <div
                  className={`mb-4 h-28 rounded-lg bg-gradient-to-br ${game.gradient} opacity-80 transition-opacity group-hover:opacity-100`}
                />
                <p className="font-semibold text-slate-100">{game.name}</p>
                <p className="mt-0.5 text-sm text-slate-500">{game.genre}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-3xl font-bold text-slate-50">Built for competitive players</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <h3 className="text-lg font-semibold text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-50">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <span className="text-3xl font-black text-brand-500/60">{item.step}</span>
                <h3 className="mt-3 font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} ArenaX. Play to own.</p>
          <div className="flex gap-6">
            <a href="https://github.com/roastellar-org" target="_blank" rel="noreferrer" className="transition-colors hover:text-slate-300">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Docs
            </a>
            <a href="#" className="transition-colors hover:text-slate-300">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
