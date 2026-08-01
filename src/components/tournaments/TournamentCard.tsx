import { Link } from 'react-router-dom'
import type { Tournament } from '../../types'
import { cn } from '../../lib/cn'
import { tournamentStatusLabel, tournamentStatusTone } from '../../lib/tournaments'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Countdown } from '../Countdown'
import { formatPrice } from '../../utils/format'

interface TournamentCardProps {
  tournament: Tournament
  onJoin: (id: string) => void
  onLeave: (id: string) => void
  busy?: boolean
}

export function TournamentCard({ tournament, onJoin, onLeave, busy }: TournamentCardProps) {
  const isOpen = tournament.status === 'OPEN'
  const isLive = tournament.status === 'IN_PROGRESS'
  const isFinished = tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED'
  const canJoin = isOpen && tournament.registeredPlayers < tournament.maxPlayers
  const spotsLeft = tournament.maxPlayers - tournament.registeredPlayers

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-brand-700">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to={`/tournaments/${tournament.id}`}
            className="block truncate font-semibold text-slate-100 hover:text-brand-300"
          >
            {tournament.name}
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">{tournament.game}</p>
        </div>
        <Badge tone={tournamentStatusTone[tournament.status]}>{tournamentStatusLabel[tournament.status]}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Prize pool</p>
          <p className="font-semibold text-slate-100">{formatPrice(tournament.prizePool, tournament.currency)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Entry fee</p>
          <p className="font-semibold text-slate-100">{formatPrice(tournament.entryFee, tournament.currency)}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {tournament.registeredPlayers}/{tournament.maxPlayers} players
          </span>
          {isOpen && <span className="text-emerald-400">{spotsLeft} spots left</span>}
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className={cn('h-full rounded-full', isOpen ? 'bg-brand-600' : 'bg-slate-600')}
            style={{ width: `${Math.min(100, (tournament.registeredPlayers / tournament.maxPlayers) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isLive ? (
          <span className="text-xs text-slate-500">Ends in</span>
        ) : isFinished ? (
          <span className="text-xs text-slate-500">
            {tournament.winner ? `Winner: ${tournament.winner.username}` : 'Finished'}
          </span>
        ) : (
          <span className="text-xs text-slate-500">Starts in</span>
        )}
        {isLive ? (
          <Countdown target={tournament.endsAt} />
        ) : isFinished ? (
          <span className="text-xs text-slate-500">{new Date(tournament.endsAt).toLocaleDateString()}</span>
        ) : (
          <Countdown target={tournament.startsAt} />
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {canJoin ? (
          <Button className="flex-1" size="sm" loading={busy} onClick={() => onJoin(tournament.id)}>
            Join tournament
          </Button>
        ) : tournament.joined && !isFinished ? (
          <Button className="flex-1" size="sm" variant="danger" loading={busy} onClick={() => onLeave(tournament.id)}>
            Withdraw
          </Button>
        ) : (
          <Link to={`/tournaments/${tournament.id}`} className="flex-1">
            <Button className="w-full" size="sm" variant="secondary">
              View details
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
