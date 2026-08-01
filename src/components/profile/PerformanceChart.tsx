import type { WeeklyActivity } from '../../types'
import { Card } from '../Card'
import { cn } from '../../lib/cn'

interface PerformanceChartProps {
  data: WeeklyActivity[]
}

function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short' })
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const max = Math.max(1, ...data.map((day) => day.matches))

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">Weekly activity</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-brand-600" /> Matches
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Wins
          </span>
        </div>
      </div>

      <div className="flex h-40 items-end gap-3">
        {data.map((day) => {
          const matchesHeight = (day.matches / max) * 100
          const winsHeight = (day.wins / max) * 100
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="relative w-full max-w-10 rounded-t-md bg-slate-800"
                style={{ height: `${Math.max(4, matchesHeight)}%` }}
                title={`${day.matches} matches`}
              >
                <div
                  className={cn('absolute bottom-0 w-full rounded-t-md bg-emerald-500')}
                  style={{ height: `${Math.max(4, winsHeight)}%` }}
                  title={`${day.wins} wins`}
                />
              </div>
              <span className="text-[10px] uppercase text-slate-600">{dayLabel(day.date)}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
