import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { formatDuration } from '../utils/format'

interface CountdownProps {
  target: string | number | Date
  className?: string
  onExpire?: () => void
}

export function Countdown({ target, className, onExpire }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => new Date(target).getTime() - Date.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = new Date(target).getTime() - Date.now()
      setRemaining(next)
      if (next <= 0) {
        window.clearInterval(id)
        onExpire?.()
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [target, onExpire])

  return <span className={cn('font-mono tabular-nums', className)}>{formatDuration(remaining)}</span>
}
