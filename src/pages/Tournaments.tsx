import { useState } from 'react'
import { useJoinTournamentMutation, useLeaveTournamentMutation, useTournamentsQuery } from '../api/tournaments'
import { TournamentCard } from '../components/tournaments/TournamentCard'
import { Tabs } from '../components/Tabs'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { tournamentStatusLabel } from '../lib/tournaments'
import { Badge } from '../components/Badge'
import type { TournamentStatus } from '../types'

const tabs: Array<{ id: TournamentStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All' },
  { id: 'OPEN', label: 'Open' },
  { id: 'IN_PROGRESS', label: 'Live' },
  { id: 'COMPLETED', label: 'Completed' },
]

export function Tournaments() {
  const [activeTab, setActiveTab] = useState<TournamentStatus | 'ALL'>('ALL')
  const { data, isPending, isFetching } = useTournamentsQuery({ status: activeTab })
  const join = useJoinTournamentMutation()
  const leave = useLeaveTournamentMutation()
  const { push } = useToast()

  const isBusy = () => join.isPending || leave.isPending

  const handleJoin = (id: string) => {
    join.mutate(id, {
      onSuccess: () => push('success', 'You are in. Check the bracket before start.'),
      onError: (error) => push('error', error instanceof Error ? error.message : 'Could not join tournament.'),
    })
  }

  const handleLeave = (id: string) => {
    leave.mutate(id, {
      onSuccess: () => push('info', 'You withdrew from the tournament.'),
      onError: (error) => push('error', error instanceof Error ? error.message : 'Could not withdraw.'),
    })
  }

  return (
    <div>
      <PageHeader
        title="Tournaments"
        description="Season 7 brackets — open signups, live brackets and completed seasons."
        actions={
          <Badge tone="brand" className="hidden sm:inline-flex">
            Season 7
          </Badge>
        }
      />
      <Tabs
        items={tabs}
        active={activeTab}
        onChange={(id) => setActiveTab(id as TournamentStatus | 'ALL')}
        className="mb-6"
      />

      {isFetching && !isPending && (
        <p className="mb-3 flex items-center gap-2 text-xs text-slate-500" aria-live="polite">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
          Syncing brackets…
        </p>
      )}

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-xl border border-slate-800 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              busy={isBusy()}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tournaments here"
          description={activeTab === 'ALL' ? 'New brackets are announced each week.' : `No ${tournamentStatusLabel[activeTab]?.toLowerCase()} tournaments right now.`}
        />
      )}
    </div>
  )
}
