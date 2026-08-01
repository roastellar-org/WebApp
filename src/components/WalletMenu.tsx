import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { LoginDialog } from './LoginDialog'
import { formatAddress } from '../utils/format'

export function WalletMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button size="sm" onClick={() => setLoginOpen(true)}>
          Connect wallet
        </Button>
        <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setMenuOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="flex items-center gap-2 rounded-full border border-line bg-panel py-1 pl-1 pr-3 text-sm transition-colors hover:border-line"
      >
        <Avatar src={user.avatarUrl} name={user.username} size="sm" />
        <span className="hidden text-body md:inline">{user.username}</span>
        <span className="font-mono text-xs text-muted">{formatAddress(user.walletAddress)}</span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-panel shadow-xl"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-strong">{user.username}</p>
            <p className="truncate font-mono text-xs text-muted">{user.walletAddress}</p>
          </div>
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-sm text-body transition-colors hover:bg-elevated"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-sm text-body transition-colors hover:bg-elevated"
          >
            Settings
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              void logout()
            }}
            className="block w-full border-t border-line px-4 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-elevated"
          >
            Disconnect wallet
          </button>
        </div>
      )}
    </div>
  )
}
