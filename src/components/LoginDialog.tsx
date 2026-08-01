import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { useAuth } from '../auth/AuthContext'
import { useToast } from './Toast'
import { formatAddress } from '../utils/format'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
}

type Step = 'idle' | 'connecting' | 'signing' | 'success'

export function LoginDialog({ open, onClose }: LoginDialogProps) {
  const { connectWallet, signIn, walletError } = useAuth()
  const { push } = useToast()
  const [step, setStep] = useState<Step>('idle')
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setStep('idle')
    setAddress(null)
    setError(null)
  }

  const handleConnect = async () => {
    setError(null)
    setStep('connecting')
    const account = await connectWallet()
    if (!account) {
      setStep('idle')
      return
    }
    setAddress(account)
    setStep('signing')
    const ok = await signIn(account)
    if (ok) {
      setStep('success')
      push('success', `Signed in as ${formatAddress(account)}. Welcome to the arena.`)
      window.setTimeout(onClose, 500)
    } else {
      setError('Sign-in failed. The signature could not be verified — please try again.')
      setStep('idle')
    }
  }

  const displayedError = error ?? walletError?.message

  return (
    <Modal open={open} onClose={onClose} title="Connect your wallet">
      <div className="space-y-5">
        <p className="text-sm text-slate-400">
          Sign in with your wallet to create your player identity. ArenaX will never move funds without your
          explicit signature.
        </p>

        {step === 'connecting' && (
          <p className="text-sm text-slate-300">Waiting for approval in your wallet&hellip;</p>
        )}
        {step === 'signing' && (
          <p className="text-sm text-slate-300">
            Signing message for <span className="font-mono text-brand-300">{formatAddress(address ?? '')}</span>
            &hellip;
          </p>
        )}
        {step === 'success' && <p className="text-sm text-emerald-300">Identity verified. Entering the arena&hellip;</p>}

        {displayedError && (
          <p className="rounded-lg border border-rose-800 bg-rose-950/50 px-3 py-2 text-sm text-rose-300" role="alert">
            {displayedError}
          </p>
        )}

        <Button className="w-full" size="lg" onClick={handleConnect} loading={step !== 'idle' && step !== 'success'}>
          {step === 'connecting'
            ? 'Waiting for wallet…'
            : step === 'signing'
              ? 'Waiting for signature…'
              : 'Connect with MetaMask'}
        </Button>
        <p className="text-center text-xs text-slate-600">
          Supports any injected EVM wallet (MetaMask, Coinbase Wallet, Rainbow).
        </p>
      </div>
    </Modal>
  )
}
