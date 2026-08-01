import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { AssetListing } from '../../types'
import { cn } from '../../lib/cn'
import { rarityBadge, rarityGradient } from '../../lib/assets'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { marketplaceApi } from '../../api/marketplace'
import { formatPrice } from '../../utils/format'

interface ListingCardProps {
  listing: AssetListing
  onPurchase: (listing: AssetListing) => void
}

export function ListingCard({ listing, onPurchase }: ListingCardProps) {
  const queryClient = useQueryClient()
  const { asset } = listing
  const isSold = listing.status === 'SOLD'

  const prefetchDetails = () => {
    void queryClient.prefetchQuery({
      queryKey: ['listing', listing.id],
      queryFn: () => marketplaceApi.listing(listing.id),
      staleTime: 60_000,
    })
  }

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors',
        isSold ? 'opacity-60' : 'hover:border-brand-700',
      )}
    >
      <Link to={`/marketplace/${listing.id}`} className="group block" onMouseEnter={prefetchDetails}>
        {asset.imageUrl ? (
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="h-36 w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={cn(
              'flex h-36 items-center justify-center bg-gradient-to-br text-4xl font-black text-white/25',
              rarityGradient[asset.rarity],
            )}
          >
            {asset.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/marketplace/${listing.id}`}
              className="truncate font-semibold text-strong hover:text-brand-700 dark:hover:text-brand-300"
            >
              {asset.name}
            </Link>
            <p className="text-xs text-muted">{asset.category}</p>
          </div>
          <Badge className={rarityBadge[asset.rarity]}>{asset.rarity}</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Avatar src={listing.seller.avatarUrl} name={listing.seller.username} size="xs" />
          <span className="truncate">{listing.seller.username}</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-semibold text-strong">
            {formatPrice(listing.price, listing.currency)}
          </span>
          <Button
            size="sm"
            disabled={isSold}
            onClick={() => onPurchase(listing)}
            aria-label={`Buy ${asset.name} for ${formatPrice(listing.price, listing.currency)}`}
          >
            {isSold ? 'Sold' : 'Buy'}
          </Button>
        </div>
      </div>
    </div>
  )
}
