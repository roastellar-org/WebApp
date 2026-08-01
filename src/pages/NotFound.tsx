import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app px-4 text-center text-body">
      <p className="text-7xl font-black text-body">404</p>
      <h1 className="text-2xl font-bold">Out of bounds</h1>
      <p className="max-w-sm text-sm text-muted">
        The page you are looking for was knocked out of the tournament. Head back to the lobby.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
