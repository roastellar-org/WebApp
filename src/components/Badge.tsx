import { type HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<BadgeTone, string> = {
  neutral: 'border-slate-700 bg-slate-800 text-slate-300',
  brand: 'border-brand-800 bg-brand-950 text-brand-300',
  success: 'border-emerald-800 bg-emerald-950 text-emerald-300',
  warning: 'border-amber-800 bg-amber-950 text-amber-300',
  danger: 'border-rose-800 bg-rose-950 text-rose-300',
  info: 'border-sky-800 bg-sky-950 text-sky-300',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
