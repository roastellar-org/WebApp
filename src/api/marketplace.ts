import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  AssetListing,
  InventoryItem,
  Page,
  PurchaseResult,
  Rarity,
  AssetCategory,
} from '../types'

export interface ListingFilters {
  category?: AssetCategory | 'ALL'
  rarity?: Rarity | 'ALL'
  sort?: 'newest' | 'price_asc' | 'price_desc'
  search?: string
  page?: number
}

function buildQueryString(filters: ListingFilters): string {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'ALL') params.set('category', filters.category)
  if (filters.rarity && filters.rarity !== 'ALL') params.set('rarity', filters.rarity)
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
  if (filters.search) params.set('search', filters.search)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const marketplaceApi = {
  listings: (filters: ListingFilters = {}) =>
    api.get<Page<AssetListing>>(`/api/marketplace/listings${buildQueryString(filters)}`),

  listing: (id: string) => api.get<AssetListing>(`/api/marketplace/listings/${id}`),

  purchase: (listingId: string, idempotencyKey: string) =>
    api.post<PurchaseResult>(`/api/marketplace/listings/${listingId}/purchase`, { idempotencyKey }),

  inventory: () => api.get<InventoryItem[]>('/api/marketplace/inventory'),

  createListing: (assetId: string, price: number) =>
    api.post<AssetListing>('/api/marketplace/listings', { assetId, price }),
}

export function useListingsQuery(filters: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => marketplaceApi.listings(filters),
    placeholderData: keepPreviousData,
  })
}

export function useListingQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => marketplaceApi.listing(id as string),
    enabled: Boolean(id),
  })
}

export function usePurchaseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ listingId, idempotencyKey }: { listingId: string; idempotencyKey: string }) =>
      marketplaceApi.purchase(listingId, idempotencyKey),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
      void queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useInventoryQuery() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: marketplaceApi.inventory,
  })
}

export function useCreateListingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ assetId, price }: { assetId: string; price: number }) =>
      marketplaceApi.createListing(assetId, price),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inventory'] })
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
