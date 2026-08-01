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
        className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 py-1 pl-1 pr-3 text-sm transition-colors hover:border-slate-700"
      >
        <Avatar src={user.avatarUrl} name={user.username} size="sm" />
        <span className="hidden text-slate-200 md:inline">{user.username}</span>
        <span className="font-mono text-xs text-slate-500">{formatAddress(user.walletAddress)}</span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-slate-100">{user.username}</p>
            <p className="truncate font-mono text-xs text-slate-500">{user.walletAddress}</p>
          </div>
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
          >
            Settings
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              void logout()
            }}
            className="block w-full border-t border-slate-800 px-4 py-2 text-left text-sm text-rose-400 transition-colors hover:bg-slate-800"
          >
            Disconnect wallet
          </button>
        </div>
      )}
    </div>
  )
}
