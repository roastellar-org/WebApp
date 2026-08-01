import { useState } from 'react'
import { useListingsQuery, type ListingFilters } from '../api/marketplace'
import { ListingCard } from '../components/marketplace/ListingCard'
import { ListingFilters as FiltersBar } from '../components/marketplace/ListingFilters'
import { PurchaseModal } from '../components/marketplace/PurchaseModal'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { Skeleton } from '../components/Skeleton'
import type { AssetListing } from '../types'

const defaultFilters: ListingFilters = { category: 'ALL', rarity: 'ALL', sort: 'newest', search: '', page: 1 }

export function Marketplace() {
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters)
  const [purchaseTarget, setPurchaseTarget] = useState<AssetListing | null>(null)
  const { data, isPending, isFetching } = useListingsQuery(filters)

  return (
    <div>
      <PageHeader title="Marketplace" description="Community-listed skins, boosts, charms and crates." />
      <FiltersBar filters={filters} onChange={setFilters} />

      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-slate-800">
              <Skeleton className="h-36 rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onPurchase={setPurchaseTarget} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              disabled={filters.page === 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page ?? 1) - 1) }))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {data.page} of {Math.max(1, Math.ceil(data.total / data.pageSize))}
            </span>
            <Button
              variant="secondary"
              disabled={!data.hasMore}
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
            >
              Next
            </Button>
          </div>
          {isFetching && <p className="mt-4 text-center text-xs text-slate-600">Updating listings…</p>}
        </>
      ) : (
        <EmptyState
          title="No listings match your filters"
          description="Try clearing the filters or check back later — new listings appear as players complete tournaments."
          action={<Button variant="secondary" onClick={() => setFilters(defaultFilters)}>Clear filters</Button>}
        />
      )}

      <PurchaseModal
        listing={purchaseTarget}
        open={purchaseTarget !== null}
        onClose={() => setPurchaseTarget(null)}
      />
    </div>
  )
}
