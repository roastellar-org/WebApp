import { type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
  className?: string
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <Card className={cn('space-y-1', className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-100">{value}</p>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </Card>
  )
}
