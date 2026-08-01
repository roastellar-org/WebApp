import { useState } from 'react'
import { Button, type ButtonProps } from './Button'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  value: string
  label?: string
}

export function CopyButton({ value, label = 'Copy', ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="ghost"
      size="sm"
      {...props}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? 'Copied' : label}
    </Button>
  )
}
