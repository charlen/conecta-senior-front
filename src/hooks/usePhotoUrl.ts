import { useEffect, useState } from 'react'
import { profileApi } from '../services/profileApi'

/** Loads an authenticated profile photo as an object URL; reloads when `version` changes. */
export function usePhotoUrl(profileId: string | null, version: number) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!profileId || !version) {
      setUrl(null)
      return
    }
    let active = true
    let created: string | null = null
    profileApi.photoUrl(profileId).then(u => {
      created = u
      if (active) setUrl(u)
      else if (u) URL.revokeObjectURL(u)
    })
    return () => {
      active = false
      if (created) URL.revokeObjectURL(created)
    }
  }, [profileId, version])
  return url
}
