import { useRetryRewardMutation } from '../../api/rewards'
import { Button } from '../Button'
import { useToast } from '../Toast'

interface RetryRewardButtonProps {
  rewardId: string
}

export function RetryRewardButton({ rewardId }: RetryRewardButtonProps) {
  const retry = useRetryRewardMutation()
  const { push } = useToast()

  const handleRetry = () => {
    retry.mutate(rewardId, {
      onSuccess: () => push('success', 'Reward re-queued for processing.'),
      onError: (error) => push('error', error instanceof Error ? error.message : 'Retry failed.'),
    })
  }

  return (
    <Button size="sm" variant="secondary" loading={retry.isPending} onClick={handleRetry}>
      Retry
    </Button>
  )
}
