import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200">
      <p className="text-7xl font-black text-slate-800">404</p>
      <h1 className="text-2xl font-bold">Out of bounds</h1>
      <p className="max-w-sm text-sm text-slate-500">
        The page you are looking for was knocked out of the tournament. Head back to the lobby.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
