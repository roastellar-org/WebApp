import { useState } from 'react'
import { useMeQuery, useUpdateProfileMutation } from '../api/users'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CopyButton } from '../components/CopyButton'
import { Field, Input } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { useToast } from '../components/Toast'
import { useTheme, type ThemeMode } from '../lib/theme'

const NOTIFICATION_KEY = 'arenax.notifications'

const notificationDefaults = {
  matches: true,
  tournaments: true,
  offers: true,
  payouts: true,
}

const notificationLabels: Record<string, string> = {
  matches: 'Match results',
  tournaments: 'Tournament announcements',
  offers: 'Marketplace offers',
  payouts: 'Reward payouts',
}

const themeOptions: Array<{ id: ThemeMode; label: string }> = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
]

export function Settings() {
  const { user, logout } = useAuth()
  const { data: profile } = useMeQuery()
  const update = useUpdateProfileMutation()
  const { theme, setTheme } = useTheme()
  const { push } = useToast()

  const me = profile ?? user
  const [username, setUsername] = useState(me?.username ?? '')
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_KEY)
      return stored ? { ...notificationDefaults, ...JSON.parse(stored) } : { ...notificationDefaults }
    } catch {
      return { ...notificationDefaults }
    }
  })

  const handleSaveProfile = () => {
    if (!username.trim()) {
      push('error', 'Username cannot be empty.')
      return
    }
    update.mutate(
      { username: username.trim() },
      {
        onSuccess: () => push('success', 'Profile saved.'),
        onError: (error) => push('error', error instanceof Error ? error.message : 'Save failed.'),
      },
    )
  }

  const toggleNotification = (key: string) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, notifications and appearance." />

      <Card className="space-y-5">
        <h2 className="font-semibold text-strong">Profile</h2>
        <Field label="Username" hint="Shown on leaderboards and tournament brackets." htmlFor="settings-username">
          <Input
            id="settings-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={24}
          />
        </Field>
        <Field label="Wallet address" htmlFor="settings-wallet">
          <div className="flex items-center gap-2">
            <Input id="settings-wallet" value={me?.walletAddress ?? ''} readOnly className="font-mono" />
            <CopyButton value={me?.walletAddress ?? ''} label="Copy" />
          </div>
        </Field>
        <Button onClick={handleSaveProfile} loading={update.isPending}>
          Save changes
        </Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-strong">Notifications</h2>
        {Object.entries(notificationLabels).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm text-body">{label}</span>
            <input
              type="checkbox"
              checked={Boolean(notifications[key])}
              onChange={() => toggleNotification(key)}
              className="h-4 w-4 accent-brand-600"
            />
          </label>
        ))}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-strong">Appearance</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Theme">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              role="radio"
              aria-checked={theme === option.id}
              onClick={() => setTheme(option.id)}
              className={
                theme === option.id
                  ? 'rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white'
                  : 'rounded-lg bg-elevated px-4 py-2 text-sm text-body hover:bg-elevated'
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-strong">Session</h2>
        <p className="text-sm text-muted">
          Signed in with <span className="font-mono">{me?.walletAddress}</span>
        </p>
        <Button variant="danger" onClick={() => void logout()}>
          Disconnect wallet
        </Button>
      </Card>
    </div>
  )
}
