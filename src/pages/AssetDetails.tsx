import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useListingQuery } from '../api/marketplace'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { PurchaseModal } from '../components/marketplace/PurchaseModal'
import { Skeleton } from '../components/Skeleton'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { cn } from '../lib/cn'
import { categoryLabels, rarityBadge, rarityGradient } from '../lib/assets'
import { formatPrice, formatRelativeTime } from '../utils/format'

export function AssetDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listing, isPending, isError } = useListingQuery(id)
  const [purchaseOpen, setPurchaseOpen] = useState(false)

  if (isPending) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <EmptyState
        title="Listing not found"
        description="This listing may have been sold or removed."
        action={
          <Button variant="secondary" onClick={() => navigate('/marketplace')}>
            Back to marketplace
          </Button>
        }
      />
    )
  }

  const { asset, seller, price, currency, status } = listing

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300"
        >
          <Icon name="arrow-left" className="h-4 w-4" />
          Marketplace
        </button>
        {asset.imageUrl ? (
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="aspect-square w-full rounded-2xl border border-slate-800 object-cover"
          />
        ) : (
          <div
            className={cn(
              'flex aspect-square w-full items-center justify-center rounded-2xl border border-slate-800 bg-gradient-to-br text-7xl font-black text-white/20',
              rarityGradient[asset.rarity],
            )}
          >
            {asset.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex gap-2">
          <Badge className={rarityBadge[asset.rarity]}>{asset.rarity}</Badge>
          <Badge>{categoryLabels[asset.category]}</Badge>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">{asset.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {asset.description ?? 'Listed by a fellow competitor on the ArenaX marketplace.'}
          </p>
        </div>

        {asset.stats && (
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(asset.stats).map(([key, value]) => (
              <Card key={key} className="text-center">
                <p className="text-2xl font-semibold text-slate-100">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{key}</p>
              </Card>
            ))}
          </div>
        )}

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={seller.avatarUrl} name={seller.username} size="lg" />
            <div>
              <p className="font-medium text-slate-100">{seller.username}</p>
              <p className="text-xs text-slate-500">Listed {formatRelativeTime(listing.listedAt)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-50">{formatPrice(price, currency)}</p>
            <Button
              size="sm"
              className="mt-2"
              disabled={status !== 'ACTIVE'}
              onClick={() => setPurchaseOpen(true)}
            >
              {status === 'ACTIVE' ? 'Buy now' : 'Sold'}
            </Button>
          </div>
        </Card>
      </div>

      <PurchaseModal listing={listing} open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  )
}
