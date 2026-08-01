import { useRef, useState } from 'react'
import { useUpdateProfileMutation } from '../../api/users'
import type { User } from '../../types'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { useToast } from '../Toast'

const MAX_AVATAR_BYTES = 1_024 * 1_024

interface AvatarUploadProps {
  user: User
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const update = useUpdateProfileMutation()
  const { push } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File | undefined) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported.')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image must be smaller than 1 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!preview) return
    update.mutate(
      { avatarUrl: preview },
      {
        onSuccess: () => {
          push('success', 'Avatar updated.')
          setPreview(null)
        },
        onError: (err) => {
          push('error', err instanceof Error ? err.message : 'Could not update avatar.')
        },
      },
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar src={preview ?? user.avatarUrl} name={user.username} size="xl" />
        {preview && (
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-brand-500" aria-hidden="true" />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="Upload avatar"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {error && <p className="text-xs text-rose-400" role="alert">{error}</p>}
      {preview ? (
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} loading={update.isPending}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
          Change avatar
        </Button>
      )}
    </div>
  )
}
