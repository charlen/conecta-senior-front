import { useContext } from 'react'
import { FluxoContext } from '../contexts/FluxoContext'

export function useFluxo() {
  const ctx = useContext(FluxoContext)
  if (!ctx) throw new Error('useFluxo must be used within FluxoProvider')
  return ctx
}
