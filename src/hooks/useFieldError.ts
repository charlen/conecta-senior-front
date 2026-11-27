import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * One error at a time, attached to a field (or 'general'). When a field gets an
 * error, focus moves to it so the person (and screen readers) land on what to fix.
 */
export function useFieldError<F extends string>() {
  const [error, setError] = useState<{ field: F | 'general'; message: string } | null>(null)
  const refs = useRef<Partial<Record<F, HTMLInputElement | null>>>({})

  useEffect(() => {
    if (error && error.field !== 'general') refs.current[error.field as F]?.focus()
  }, [error])

  const fail = useCallback((field: F | 'general', message: string) => setError({ field, message }), [])
  const clear = useCallback(() => setError(null), [])
  const errorFor = (field: F | 'general') => (error?.field === field ? error.message : undefined)
  const refFor = (field: F) => (el: HTMLInputElement | null) => {
    refs.current[field] = el
  }

  return { errorFor, fail, clear, refFor }
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
