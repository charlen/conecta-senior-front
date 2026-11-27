import { useCallback, useEffect, useState } from 'react'
import type { CandidateProfile, FieldError } from '../types/candidate'
import { profileApi, ProfileValidationError } from '../services/profileApi'

type Status = 'loading' | 'ready' | 'saving' | 'saved' | 'error'

/**
 * Loads the saved canonical profile, optionally seeds it with a draft
 * (PDF parse, wizard, voice) and saves it back with field-level errors.
 */
export function useCandidateProfile(seed?: (saved: CandidateProfile) => CandidateProfile) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [errors, setErrors] = useState<FieldError[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    profileApi
      .getMine()
      .then(res => {
        if (!active) return
        setProfile(seed ? seed(res.profile) : res.profile)
        setStatus('ready')
      })
      .catch((err: Error) => {
        if (!active) return
        setMessage(err.message)
        setStatus('error')
      })
    return () => {
      active = false
    }
    // seed is intentionally read only on first load (no deps)
  }, [])

  const save = useCallback(async (): Promise<boolean> => {
    if (!profile) return false
    setStatus('saving')
    setMessage(null)
    try {
      const res = await profileApi.saveMine(profile)
      setProfile(res.profile)
      setErrors([])
      setStatus('saved')
      return true
    } catch (err) {
      if (err instanceof ProfileValidationError) {
        setErrors(err.fields)
        setMessage(
          err.fields.length === 1
            ? 'Falta 1 informação para salvar. Ela está marcada em vermelho.'
            : `Faltam ${err.fields.length} informações para salvar. Elas estão marcadas em vermelho.`
        )
        setTimeout(() => {
          const first = err.fields[0]?.field.replace(/^experiences\.(\d+)\.role$/, 'exp-$1-role').replace('preferences.', '')
          document.getElementById(first ?? '')?.focus()
        }, 0)
      } else {
        setMessage((err as Error).message)
      }
      setStatus('ready')
      return false
    }
  }, [profile])

  return { profile, setProfile, errors, status, message, save }
}
