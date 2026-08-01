import { cn } from '../lib/cn'
import { hashString } from '../utils/format'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-24 w-24 text-3xl',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'avatar'}
        className={cn('shrink-0 rounded-full object-cover', sizes[size], className)}
      />
    )
  }
  const label = (name ?? '?').slice(0, 2).toUpperCase()
  const hue = hashString(name ?? 'anonymous')
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue % 360} 70% 45%), hsl(${(hue + 40) % 360} 70% 35%))`,
      }}
    >
      {label}
    </span>
  )
}
