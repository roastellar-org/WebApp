import { useEffect, useState } from 'react'
import { usePurchaseMutation } from '../../api/marketplace'
import type { AssetListing } from '../../types'
import { cn } from '../../lib/cn'
import { rarityGradient } from '../../lib/assets'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { useToast } from '../Toast'
import { formatAddress, formatPrice } from '../../utils/format'

interface PurchaseModalProps {
  listing: AssetListing | null
  open: boolean
  onClose: () => void
}

export function PurchaseModal({ listing, open, onClose }: PurchaseModalProps) {
  const purchase = usePurchaseMutation()
  const { push } = useToast()
  const [idempotencyKey, setIdempotencyKey] = useState('')

  useEffect(() => {
    if (open) setIdempotencyKey(crypto.randomUUID())
  }, [open, listing?.id])

  if (!listing) return null
  const { asset, seller, price, currency } = listing

  const handlePurchase = () => {
    purchase.mutate(
      { listingId: listing.id, idempotencyKey },
      {
        onSuccess: (result) => {
          push('success', `${asset.name} is yours — transaction ${formatAddress(result.transactionId, 6)}`)
          onClose()
        },
        onError: (error) => {
          push('error', error instanceof Error ? error.message : 'Purchase failed. Please try again.')
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm purchase">
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          {asset.imageUrl ? (
            <img src={asset.imageUrl} alt={asset.name} className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br text-lg font-black text-white/25',
                rarityGradient[asset.rarity],
              )}
            >
              {asset.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-100">{asset.name}</p>
            <p className="text-xs text-slate-500">
              {asset.category} · {asset.rarity}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <Avatar src={seller.avatarUrl} name={seller.username} size="xs" />
              {seller.username}
            </div>
          </div>
          <p className="text-lg font-bold text-slate-50">{formatPrice(price, currency)}</p>
        </div>

        <p className="text-sm text-slate-400">
          Funds are escrowed by the marketplace contract and released to the seller when the asset transfers.
          Each purchase carries a unique idempotency key, so retrying after a network error never double-charges.
        </p>

        {purchase.isError && (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-3 py-2 text-sm text-rose-300" role="alert">
            {purchase.error instanceof Error ? purchase.error.message : 'Purchase failed. Please try again.'}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={purchase.isPending}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} loading={purchase.isPending}>
            Confirm purchase
          </Button>
        </div>
      </div>
    </Modal>
  )
}
