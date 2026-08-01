import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTournamentsQuery } from '../api/tournaments'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { formatDate, formatPrice } from '../utils/format'
import type { Tournament } from '../types'

export function TournamentHistory() {
  const [page, setPage] = useState(1)
  const { data, isPending } = useTournamentsQuery({ status: 'COMPLETED', page })

  return (
    <div>
      <PageHeader
        title="Tournament history"
        description="Completed seasons — winners, prize pools and payout dates."
      />

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-line bg-panel px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted md:grid">
              <span>Tournament</span>
              <span>Winner</span>
              <span>Prize pool</span>
              <span>Ended</span>
            </div>
            <ul className="divide-y divide-line">
              {data.items.map((tournament: Tournament) => (
                <li key={tournament.id}>
                  <Link
                    to={`/tournaments/${tournament.id}`}
                    className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-panel md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-strong">{tournament.name}</p>
                      <p className="text-xs text-muted">{tournament.game}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tournament.winner ? (
                        <>
                          <Avatar src={tournament.winner.avatarUrl} name={tournament.winner.username} size="xs" />
                          <span className="text-sm text-body">{tournament.winner.username}</span>
                          <Icon name="trophy" className="h-4 w-4 text-amber-400" />
                        </>
                      ) : (
                        <span className="text-sm text-muted">No winner</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-strong">
                      {formatPrice(tournament.prizePool, tournament.currency)}
                    </div>
                    <div className="flex items-center justify-between md:justify-end">
                      <Badge tone="neutral">{formatDate(tournament.endsAt)}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={!data.hasMore}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-elevated disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          title="No tournaments finished yet"
          description="Completed brackets will appear here with winners and payout records."
        />
      )}
    </div>
  )
}
