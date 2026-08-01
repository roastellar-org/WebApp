import { useNftStatusQuery } from '../../api/rewards'
import { normalizeMintStatus } from '../../lib/rewards'
import type { Reward } from '../../types'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { CopyButton } from '../CopyButton'
import { Modal } from '../Modal'
import { Skeleton } from '../Skeleton'
import { formatAddress } from '../../utils/format'

interface NftPreviewModalProps {
  reward: Reward | null
  open: boolean
  onClose: () => void
}

const mintStepTone = {
  QUEUED: 'warning',
  MINTING: 'brand',
  MINTED: 'success',
  FAILED: 'danger',
} as const

export function NftPreviewModal({ reward, open, onClose }: NftPreviewModalProps) {
  const { data: nft, isPending } = useNftStatusQuery(open && reward ? reward.id : null)

  return (
    <Modal open={open} onClose={onClose} title="NFT preview">
      {!reward ? null : (
        <div className="space-y-5">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-48" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : nft ? (
            <>
              {nft.imageUrl ? (
                <img src={nft.imageUrl} alt={reward.source} className="w-full rounded-xl border border-slate-800" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900">
                  <span className="text-5xl font-black text-slate-700">NFT</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-100">{reward.source}</p>
                <Badge tone={mintStepTone[normalizeMintStatus(nft.mintStatus)]}>
                  {normalizeMintStatus(nft.mintStatus)}
                </Badge>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs text-slate-400">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">
                    Contract: {formatAddress(nft.contractAddress, 8)}
                  </span>
                  <CopyButton value={nft.contractAddress} label="Copy" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Token ID: #{nft.tokenId}</span>
                  <CopyButton value={nft.tokenId} label="Copy" />
                </div>
              </div>

              {nft.metadataUri && (
                <a
                  href={nft.metadataUri}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-sm text-brand-400 hover:text-brand-300"
                >
                  View metadata
                </a>
              )}

              <Button className="w-full" variant="secondary" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-400">NFT details are not available yet.</p>
          )}
        </div>
      )}
    </Modal>
  )
}
