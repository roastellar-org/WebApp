import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: ThemeMode
  resolved: 'light' | 'dark'
  setTheme: (mode: ThemeMode) => void
}

const STORAGE_KEY = 'arenax.theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // storage unavailable
  }
  return 'system'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme)
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveTheme(getInitialTheme()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage unavailable
    }
  }, [theme])

  useEffect(() => {
    const apply = () => {
      const next = resolveTheme(theme)
      setResolved(next)
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
    apply()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (theme === 'system') apply()
    }
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), [])

  const value = useMemo(() => ({ theme, resolved, setTheme }), [theme, resolved, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
