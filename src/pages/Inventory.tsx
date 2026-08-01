import { useState } from 'react'
import { useInventoryQuery } from '../api/marketplace'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { ListAssetModal } from '../components/inventory/ListAssetModal'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { cn } from '../lib/cn'
import { categoryLabels, rarityBadge, rarityGradient } from '../lib/assets'
import { formatDate, formatPrice } from '../utils/format'
import type { InventoryItem } from '../types'

export function Inventory() {
  const { data: items, isPending } = useInventoryQuery()
  const [listTarget, setListTarget] = useState<InventoryItem | null>(null)

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Every asset you own — won, bought or minted."
      />

      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-slate-800">
              <Skeleton className="h-36 rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const isListed = Boolean(item.listingId && item.listingId !== 'cancelled')
            return (
              <div key={item.asset.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
                {item.asset.imageUrl ? (
                  <img src={item.asset.imageUrl} alt={item.asset.name} className="h-36 w-full object-cover" />
                ) : (
                  <div
                    className={cn(
                      'flex h-36 items-center justify-center bg-gradient-to-br text-4xl font-black text-white/25',
                      rarityGradient[item.asset.rarity],
                    )}
                  >
                    {item.asset.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-100">{item.asset.name}</p>
                      <p className="text-xs text-slate-500">{categoryLabels[item.asset.category]}</p>
                    </div>
                    <Badge className={rarityBadge[item.asset.rarity]}>{item.asset.rarity}</Badge>
                  </div>

                  <p className="text-xs text-slate-500">Acquired {formatDate(item.acquiredAt)}</p>

                  {isListed ? (
                    <Badge tone="brand" className="self-start">
                      Listed · {formatPrice(item.price ?? 0, 'USDT')}
                    </Badge>
                  ) : (
                    <Button size="sm" variant="secondary" className="mt-auto" onClick={() => setListTarget(item)}>
                      List for sale
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Your inventory is empty"
          description="Win tournaments or buy from the marketplace to collect your first assets."
          action={
            <Button onClick={() => (window.location.href = '/marketplace')}>Browse marketplace</Button>
          }
        />
      )}

      <ListAssetModal
        item={listTarget}
        open={listTarget !== null}
        onClose={() => setListTarget(null)}
      />
    </div>
  )
}
