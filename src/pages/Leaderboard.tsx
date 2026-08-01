import { useState } from 'react'
import { useLeaderboardQuery, useMyRankQuery } from '../api/leaderboard'
import type { LeaderboardEntry, LeaderboardPeriod } from '../types'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { LeaderboardSearch } from '../components/leaderboard/LeaderboardSearch'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { Tabs } from '../components/Tabs'
import { cn } from '../lib/cn'
import { formatCompactNumber } from '../utils/format'

const periodTabs = [
  { id: 'weekly' as const, label: 'Weekly' },
  { id: 'daily' as const, label: 'Daily' },
]

const podiumStyles = ['bg-amber-400/10 text-amber-600 dark:text-amber-300', 'bg-slate-400/10 text-body', 'bg-orange-600/10 text-orange-600 dark:text-orange-300']

export function Leaderboard() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly')
  const [query, setQuery] = useState('')
  const { data: entries, isPending, isFetching } = useLeaderboardQuery(period)
  const { data: myRank } = useMyRankQuery()

  const filtered =
    query.trim().length === 0
      ? (entries ?? [])
      : (entries ?? []).filter((entry) =>
          entry.username.toLowerCase().includes(query.trim().toLowerCase()),
        )

  const topThree = (entries ?? []).slice(0, 3)
  const rest = filtered.slice(3)

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="Rankings reset weekly — climb before the payout snapshot."
        actions={
          <Tabs items={periodTabs} active={period} onChange={(id) => setPeriod(id as LeaderboardPeriod)} />
        }
      />

      {myRank && (
        <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 border-brand-800/50">
          <div>
            <p className="text-sm text-muted">Your rank</p>
            <p className="text-xl font-bold text-brand-700 dark:text-brand-300">
              {myRank.rank === null ? 'Unranked' : `#${myRank.rank}`}
            </p>
          </div>
          <p className="text-sm text-muted">
            {formatCompactNumber(myRank.points)} points this {period}
          </p>
        </Card>
      )}

      <LeaderboardSearch value={query} onChange={setQuery} />

      {isFetching && !isPending && (
        <p className="mb-3 flex items-center gap-2 text-xs text-muted" aria-live="polite">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
          Refreshing rankings…
        </p>
      )}

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[topThree[1], topThree[0], topThree[2]].map((entry, position) =>
              entry ? (
                <Card
                  key={entry.playerId}
                  className={cn(
                    'flex flex-col items-center gap-1 text-center',
                    podiumStyles[position === 1 ? 0 : position === 0 ? 1 : 2],
                  )}
                >
                  <span className="text-2xl font-black">#{entry.rank}</span>
                  <Avatar src={entry.avatarUrl} name={entry.username} size="lg" />
                  <p className="max-w-full truncate text-sm font-semibold text-strong">{entry.username}</p>
                  <p className="text-lg font-bold">{formatCompactNumber(entry.points)} pts</p>
                </Card>
              ) : null,
            )}
          </div>

          {query.trim() ? (
            <div className="space-y-3">
              {rest.map((entry) => (
                <LeaderboardRow key={entry.playerId} entry={entry} highlight={false} />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="hidden grid-cols-[4rem_1fr_6rem_6rem_6rem] gap-4 border-b border-line bg-panel px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted md:grid">
                <span>Rank</span>
                <span>Player</span>
                <span>Wins</span>
                <span>Matches</span>
                <span className="text-right">Points</span>
              </div>
              <ul className="divide-y divide-line">
                {rest.map((entry) => (
                  <LeaderboardRow key={entry.playerId} entry={entry} highlight={false} />
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No rankings yet"
          description="Play a match in any tournament to earn your first points."
        />
      )}
    </div>
  )
}

function LeaderboardRow({ entry, highlight }: { entry: LeaderboardEntry; highlight: boolean }) {
  return (
    <li
      className={cn(
        'grid grid-cols-[3rem_1fr_5rem] items-center gap-4 px-5 py-3 md:grid-cols-[4rem_1fr_6rem_6rem_6rem]',
        highlight ? 'bg-brand-50/70 dark:bg-brand-950/40' : 'bg-app',
      )}
    >
      <span className="text-sm font-bold text-muted">#{entry.rank}</span>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar src={entry.avatarUrl} name={entry.username} size="sm" />
        <span className="truncate text-sm font-medium text-strong">{entry.username}</span>
        {highlight && (
          <Badge tone="brand" className="hidden sm:inline-flex">
            You
          </Badge>
        )}
      </div>
      <span className="hidden text-sm text-muted md:block">{entry.wins}</span>
      <span className="hidden text-sm text-muted md:block">{entry.matchesPlayed}</span>
      <span className="text-right text-sm font-semibold text-brand-700 dark:text-brand-300">
        {formatCompactNumber(entry.points)}
      </span>
    </li>
  )
}
