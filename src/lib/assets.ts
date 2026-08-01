import type { AssetCategory, Rarity } from '../types'

export const rarityOrder: Rarity[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY']

export const rarityLabels: Record<Rarity, string> = {
  COMMON: 'Common',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
}

export const rarityGradient: Record<Rarity, string> = {
  COMMON: 'from-slate-600 to-slate-700',
  RARE: 'from-sky-600 to-blue-700',
  EPIC: 'from-violet-600 to-purple-700',
  LEGENDARY: 'from-amber-500 to-orange-600',
}

export const rarityBadge: Record<Rarity, string> = {
  COMMON: 'border-slate-700 bg-slate-800 text-slate-300',
  RARE: 'border-sky-800 bg-sky-950 text-sky-300',
  EPIC: 'border-violet-800 bg-violet-950 text-violet-300',
  LEGENDARY: 'border-amber-800 bg-amber-950 text-amber-300',
}

export const categoryLabels: Record<AssetCategory, string> = {
  SKIN: 'Skin',
  BOOST: 'Boost',
  CHARM: 'Charm',
  CRATE: 'Crate',
}
