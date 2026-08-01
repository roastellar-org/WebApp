import { useState } from 'react'
import { useRewardsQuery } from '../api/rewards'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Icon, type IconName } from '../components/Icon'
import { NftPreviewModal } from '../components/rewards/NftPreviewModal'
import { RetryRewardButton } from '../components/rewards/RetryRewardButton'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { normalizeRewardStatus, rewardStatusLabel, rewardStatusTone, rewardTypeLabel } from '../lib/rewards'
import { formatDate, formatRelativeTime } from '../utils/format'
import type { Reward } from '../types'

const typeIcons: Record<string, IconName> = {
  POINTS: 'bolt',
  TOKEN: 'wallet',
  NFT: 'box',
}

function RewardRow({ reward, onPreview }: { reward: Reward; onPreview: (reward: Reward) => void }) {
  const status = normalizeRewardStatus(reward.status)
  return (
    <li className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-panel">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-elevated text-body">
        <Icon name={typeIcons[reward.type] ?? 'bolt'} className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-strong">{reward.source}</p>
          <Badge tone={rewardStatusTone[status]}>{rewardStatusLabel[status]}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {rewardTypeLabel[reward.type]} · {formatRelativeTime(reward.createdAt)}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-strong">
          {reward.amount.toLocaleString()} {reward.currency ?? ''}
        </p>
        <p className="text-xs text-muted">{reward.completedAt ? formatDate(reward.completedAt) : '\u00a0'}</p>
      </div>

      <div className="flex items-center gap-2">
        {status === 'FAILED' && <RetryRewardButton rewardId={reward.id} />}
        {reward.type === 'NFT' && (
          <Button variant="secondary" size="sm" onClick={() => onPreview(reward)}>
            View NFT
          </Button>
        )}
      </div>
    </li>
  )
}

export function Rewards() {
  const [page, setPage] = useState(1)
  const [previewTarget, setPreviewTarget] = useState<Reward | null>(null)
  const { data, isPending } = useRewardsQuery(page)
  const { push } = useToast()

  return (
    <div>
      <PageHeader
        title="Rewards"
        description="Payouts from tournaments and marketplace sales land here automatically."
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
            <ul className="divide-y divide-line">
              {data.items.map((reward) => (
                <RewardRow key={reward.id} reward={reward} onPreview={setPreviewTarget} />
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
          title="No rewards yet"
          description="Win tournaments or sell assets to see payouts here."
          action={
            <Button
              variant="secondary"
              onClick={() => push('info', 'Rewards refresh automatically after each payout.')}
            >
              How rewards work
            </Button>
          }
        />
      )}

      <NftPreviewModal
        reward={previewTarget}
        open={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
      />
    </div>
  )
}
