import { cn } from '../lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('inline-flex gap-1 rounded-lg bg-panel p-1', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={active === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active === item.id ? 'bg-brand-600 text-white' : 'text-muted hover:text-strong',
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="ml-1.5 rounded-full bg-elevated px-1.5 py-0.5 text-xs">{item.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
