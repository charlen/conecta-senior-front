import { useCallback, useEffect, useState } from 'react'

/** Seconds left until zero; `start(n)` (re)starts the countdown. */
export function useCountdown(initial = 0) {
  const [seconds, setSeconds] = useState(initial)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const start = useCallback((n: number) => setSeconds(n), [])
  return { seconds, start }
}

export const formatClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
