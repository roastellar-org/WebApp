import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  useJoinTournamentMutation,
  useLeaveTournamentMutation,
  useTournamentQuery,
} from '../api/tournaments'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Countdown } from '../components/Countdown'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { cn } from '../lib/cn'
import {
  tournamentModeLabel,
  tournamentStatusLabel,
  tournamentStatusTone,
} from '../lib/tournaments'
import { formatPrice } from '../utils/format'
import type { Match } from '../types'

function MatchCard({ match }: { match: Match }) {
  const player = (id?: string | null) => {
    if (!id) return null
    return match.playerA?.id === id ? match.playerA : match.playerB
  }
  const winner = player(match.winnerId)

  return (
    <div className="space-y-2 rounded-lg border border-line bg-elevated p-3">
      {[match.playerA, match.playerB].map((entry, index) => {
        const isWinner = entry && winner?.id === entry.id
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 text-sm',
              isWinner ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-body',
            )}
          >
            <Avatar src={entry?.avatarUrl} name={entry?.username} size="xs" />
            <span className="truncate">{entry ? entry.username : 'TBD'}</span>
            {isWinner && <Icon name="check" className="ml-auto h-4 w-4" />}
          </div>
        )
      })}
    </div>
  )
}

export function TournamentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: tournament, isPending, isError } = useTournamentQuery(id)
  const join = useJoinTournamentMutation()
  const leave = useLeaveTournamentMutation()
  const { push } = useToast()
  const [busyId, setBusyId] = useState<string | null>(null)

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (isError || !tournament) {
    return (
      <EmptyState
        title="Tournament not found"
        description="It may have been cancelled or removed."
        action={
          <Button variant="secondary" onClick={() => navigate('/tournaments')}>
            Back to tournaments
          </Button>
        }
      />
    )
  }

  const isFinished = tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED'
  const canJoin = tournament.status === 'OPEN' && tournament.registeredPlayers < tournament.maxPlayers
  const rounds = Math.max(1, ...tournament.matches.map((match) => match.round))
  const matchesByRound = Array.from({ length: rounds }, (_, index) =>
    tournament.matches.filter((match) => match.round === index + 1),
  )

  const handleJoin = () => {
    setBusyId(tournament.id)
    join.mutate(tournament.id, {
      onSuccess: () => {
        push('success', 'You are registered. See you at the start. ')
      },
      onError: (error) => push('error', error instanceof Error ? error.message : 'Could not join.'),
      onSettled: () => setBusyId(null),
    })
  }

  const handleLeave = () => {
    setBusyId(tournament.id)
    leave.mutate(tournament.id, {
      onSuccess: () => push('info', 'You withdrew. Refund will land in your wallet.'),
      onError: (error) => push('error', error instanceof Error ? error.message : 'Could not withdraw.'),
      onSettled: () => setBusyId(null),
    })
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tournaments')}
        className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-strong"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        Tournaments
      </button>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-strong">{tournament.name}</h1>
              <Badge tone={tournamentStatusTone[tournament.status]}>
                {tournamentStatusLabel[tournament.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {tournament.game} · {tournamentModeLabel[tournament.mode]} · {tournament.registeredPlayers}/
              {tournament.maxPlayers} players
            </p>
          </div>
          {tournament.winner && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2">
              <Icon name="trophy" className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-xs text-amber-400">Winner</p>
                <p className="font-semibold text-amber-700 dark:text-amber-200">{tournament.winner.username}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Prize pool</p>
            <p className="text-xl font-semibold text-strong">
              {formatPrice(tournament.prizePool, tournament.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Entry fee</p>
            <p className="text-xl font-semibold text-strong">
              {formatPrice(tournament.entryFee, tournament.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">
              {tournament.status === 'IN_PROGRESS' ? 'Ends in' : 'Starts in'}
            </p>
            <Countdown target={tournament.status === 'IN_PROGRESS' ? tournament.endsAt : tournament.startsAt} />
          </div>
        </div>

        {!isFinished && (
          <div className="flex gap-3">
            {canJoin ? (
              <Button loading={busyId === tournament.id} onClick={handleJoin}>
                Join tournament
              </Button>
            ) : tournament.joined ? (
              <Button variant="danger" loading={busyId === tournament.id} onClick={handleLeave}>
                Withdraw
              </Button>
            ) : null}
            <Link to="/tournaments/history">
              <Button variant="secondary">Tournament history</Button>
            </Link>
          </div>
        )}
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-strong">Bracket</h2>
        {tournament.matches.length > 0 ? (
          <div className="grid gap-6 overflow-x-auto pb-2 md:grid-cols-4">
            {matchesByRound.map((matches, index) => (
              <div key={index} className="min-w-52 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Round {index + 1}
                </p>
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Bracket not published yet"
            description="Matches are generated by the backend once the tournament goes live."
          />
        )}
      </div>
    </div>
  )
}
