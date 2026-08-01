import { Icon } from '../Icon'
import { Input } from '../Field'

interface LeaderboardSearchProps {
  value: string
  onChange: (value: string) => void
}

export function LeaderboardSearch({ value, onChange }: LeaderboardSearchProps) {
  return (
    <div className="relative mb-6">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <Icon name="search" className="h-4 w-4" />
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search players by username…"
        aria-label="Search players"
        className="pl-9"
      />
    </div>
  )
}
