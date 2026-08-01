import { useMeQuery } from '../api/users'
import { AvatarUpload } from '../components/profile/AvatarUpload'
import { Card } from '../components/Card'
import { CopyButton } from '../components/CopyButton'
import { PageHeader } from '../components/PageHeader'
import { PerformanceChart } from '../components/profile/PerformanceChart'
import { Skeleton } from '../components/Skeleton'
import { StatCard } from '../components/StatCard'
import { formatDate } from '../utils/format'
import { useAuth } from '../auth/AuthContext'

export function Profile() {
  const { user: sessionUser } = useAuth()
  const { data: user, isPending } = useMeQuery()
  const profile = user ?? sessionUser

  if (isPending && !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  if (!profile) return null

  const stats = profile.stats

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your identity, stats and season performance." />

      <Card className="flex flex-wrap items-center gap-6">
        <AvatarUpload user={profile} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold text-slate-50">{profile.username}</h2>
          <div className="mt-1 flex items-center gap-2 font-mono text-sm text-slate-500">
            <span className="truncate">{profile.walletAddress}</span>
            <CopyButton value={profile.walletAddress} label="Copy address" />
          </div>
          <p className="mt-2 text-xs text-slate-500">Member since {formatDate(profile.createdAt)}</p>
        </div>
        <div className="rounded-xl border border-brand-800/50 bg-brand-950/40 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-brand-300">{stats?.points ?? 0}</p>
          <p className="text-xs uppercase tracking-wide text-brand-400/70">Season points</p>
        </div>
      </Card>

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Win rate" value={`${stats.winRate}%`} />
            <StatCard label="Wins" value={stats.wins} />
            <StatCard label="Losses" value={stats.losses} />
            <StatCard label="Matches" value={stats.matchesPlayed} />
            <StatCard label="Earnings" value={`$${stats.totalEarnings.toLocaleString()}`} />
            <StatCard label="Best rank" value={stats.bestRank ? `#${stats.bestRank}` : '—'} />
          </div>

          <PerformanceChart data={stats.weeklyActivity} />
        </>
      )}
    </div>
  )
}
