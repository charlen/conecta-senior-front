import { useEffect, useState, useCallback } from 'react'
import { RascunhoPerfil, Perfil, MetodoPreenchimento } from '../types/perfil'

const STORAGE_KEY = 'cs_rascunho_perfil'

const defaultPerfil: Perfil = {
  dadosBasicos: { nomeCompleto: '', cidade: '', estado: '', telefone: '' },
  experiencias: [],
  formacao: [],
  habilidades: [],
  preferencias: {},
}

export function useRascunhoPerfil() {
  const [rascunho, setRascunho] = useState<RascunhoPerfil>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as RascunhoPerfil
    } catch {
      // ignore parse errors
    }
    return { perfil: defaultPerfil, progresso: 'metodo' }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rascunho))
  }, [rascunho])

  const atualizarPerfil = useCallback((patch: Partial<Perfil>) => {
    setRascunho(prev => ({
      ...prev,
      perfil: { ...prev.perfil, ...patch },
    }))
  }, [])

  const setMetodo = useCallback((metodo: MetodoPreenchimento) => {
    setRascunho(prev => ({ ...prev, metodo, progresso: 'metodo_escolhido' }))
  }, [])

  const setProgresso = useCallback((progresso: string) => {
    setRascunho(prev => ({ ...prev, progresso }))
  }, [])

  const salvarPerfil = useCallback(async () => {
    // Simula salvamento; em produção enviaria para API
    // Mantém rascunho em localStorage
    return Promise.resolve()
  }, [])

  return { rascunho, setRascunho, atualizarPerfil, setMetodo, setProgresso, salvarPerfil }
}
