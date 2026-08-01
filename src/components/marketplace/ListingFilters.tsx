import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { Input, Select } from '../Field'
import { Button } from '../Button'
import { rarityLabels, rarityOrder, categoryLabels } from '../../lib/assets'
import type { AssetCategory, Rarity } from '../../types'
import type { ListingFilters } from '../../api/marketplace'

interface ListingFiltersProps {
  filters: ListingFilters
  onChange: (filters: ListingFilters) => void
}

const emptyFilters: ListingFilters = { category: 'ALL', rarity: 'ALL', sort: 'newest', search: '', page: 1 }

export function ListingFilters({ filters, onChange }: ListingFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? '')

  useEffect(() => {
    setSearch(filters.search ?? '')
  }, [filters.search])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (search !== (filters.search ?? '')) {
        onChange({ ...filters, search, page: 1 })
      }
    }, 400)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const hasActiveFilters =
    filters.category !== 'ALL' || filters.rarity !== 'ALL' || filters.sort !== 'newest' || Boolean(filters.search)

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <Icon name="search" className="h-4 w-4" />
        </span>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search assets…"
          aria-label="Search assets"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value as AssetCategory | 'ALL', page: 1 })}
          aria-label="Filter by category"
        >
          <option value="ALL">All categories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.rarity}
          onChange={(event) => onChange({ ...filters, rarity: event.target.value as Rarity | 'ALL', page: 1 })}
          aria-label="Filter by rarity"
        >
          <option value="ALL">All rarities</option>
          {rarityOrder.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarityLabels[rarity]}
            </option>
          ))}
        </Select>

        <Select
          value={filters.sort}
          onChange={(event) =>
            onChange({ ...filters, sort: event.target.value as ListingFilters['sort'], page: 1 })
          }
          aria-label="Sort listings"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
