import { useEffect, useState } from 'react'
import { useCreateListingMutation } from '../../api/marketplace'
import type { InventoryItem } from '../../types'
import { cn } from '../../lib/cn'
import { rarityGradient } from '../../lib/assets'
import { Button } from '../Button'
import { Field, Input } from '../Field'
import { Modal } from '../Modal'
import { useToast } from '../Toast'
import { formatPrice } from '../../utils/format'

interface ListAssetModalProps {
  item: InventoryItem | null
  open: boolean
  onClose: () => void
}

export function ListAssetModal({ item, open, onClose }: ListAssetModalProps) {
  const createListing = useCreateListingMutation()
  const { push } = useToast()
  const [price, setPrice] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setPrice('')
      setTouched(false)
    }
  }, [open, item?.asset.id])

  if (!item) return null
  const { asset } = item

  const numericPrice = Number(price)
  const priceError = touched && (!Number.isFinite(numericPrice) || numericPrice <= 0)

  const handleSubmit = () => {
    setTouched(true)
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return
    createListing.mutate(
      { assetId: asset.id, price: numericPrice },
      {
        onSuccess: () => {
          push('success', `${asset.name} is now listed on the marketplace.`)
          onClose()
        },
        onError: (error) => {
          push('error', error instanceof Error ? error.message : 'Could not list the asset.')
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="List for sale">
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-line bg-elevated p-4">
          {asset.imageUrl ? (
            <img src={asset.imageUrl} alt={asset.name} className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-black text-white/25',
                rarityGradient[asset.rarity],
              )}
            >
              {asset.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-strong">{asset.name}</p>
            <p className="text-xs text-muted">
              {asset.category} · {asset.rarity}
            </p>
          </div>
        </div>

        <Field
          label="Price (USDT)"
          hint="A 2% platform fee applies on sale."
          error={priceError ? 'Enter a price greater than zero.' : undefined}
          htmlFor="list-price"
        >
          <Input
            id="list-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            placeholder="0.00"
            onChange={(event) => setPrice(event.target.value)}
          />
        </Field>

        {priceError === false && price && (
          <p className="text-sm text-muted">
            You will receive {formatPrice(numericPrice * 0.98, 'USDT')} after the sale.
          </p>
        )}

        {createListing.isError && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300" role="alert">
            {createListing.error instanceof Error ? createListing.error.message : 'Listing failed.'}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={createListing.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={createListing.isPending}>
            List asset
          </Button>
        </div>
      </div>
    </Modal>
  )
}
