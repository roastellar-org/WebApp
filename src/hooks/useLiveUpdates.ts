import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../components/Toast'
import { connectSocket, disconnectSocket } from '../lib/socket'
import { formatPrice } from '../utils/format'

interface TournamentEndedPayload {
  tournamentId: string
  rank?: number
  winnerId?: string
}

interface RewardClaimedPayload {
  rewardId: string
  amount: number
  currency: string
}

interface MatchPayload {
  matchId: string
  tournamentId: string
}

export function useLiveUpdates() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const { push } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket()
      return
    }

    const socket = connectSocket()
    if (!socket) return

    const invalidateTournament = (tournamentId?: string) => {
      void queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      if (tournamentId) {
        void queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] })
      }
    }

    const onTournamentStarted = (payload: TournamentEndedPayload) => {
      invalidateTournament(payload.tournamentId)
      push('info', 'A tournament you joined has started. Good luck!')
    }

    const onTournamentEnded = (payload: TournamentEndedPayload) => {
      invalidateTournament(payload.tournamentId)
      void queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      void queryClient.invalidateQueries({ queryKey: ['rewards'] })
      push('success', 'Tournament ended — rewards are being distributed.')
    }

    const onMatchFound = (payload: MatchPayload) => {
      invalidateTournament(payload.tournamentId)
      push('info', 'Match found. Get ready!')
    }

    const onMatchResult = (payload: MatchPayload) => {
      invalidateTournament(payload.tournamentId)
    }

    const onRewardClaimed = (payload: RewardClaimedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ['rewards'] })
      void queryClient.invalidateQueries({ queryKey: ['inventory'] })
      push('success', `Reward claimed: ${formatPrice(payload.amount, payload.currency)}`)
    }

    const onNotification = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }

    socket.on('tournament:started', onTournamentStarted)
    socket.on('tournament:ended', onTournamentEnded)
    socket.on('match:found', onMatchFound)
    socket.on('match:won', onMatchResult)
    socket.on('match:lost', onMatchResult)
    socket.on('reward:claimed', onRewardClaimed)
    socket.on('notification:new', onNotification)

    return () => {
      socket.removeAllListeners()
    }
  }, [isAuthenticated, queryClient, push])
}
