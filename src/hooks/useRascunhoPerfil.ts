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
    const token = localStorage.getItem('token')
    if (!token) return
    // Buscar profile id
    const meRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!meRes.ok) return
    const me = await meRes.json()
    const profileId = me.id
    // Mapear rascunho para estrutura parsed/resume
    const parsed = {
      name: rascunho.perfil.dadosBasicos.nomeCompleto || '',
      email: '',
      location: `${rascunho.perfil.dadosBasicos.cidade}, ${rascunho.perfil.dadosBasicos.estado}`,
      skills: rascunho.perfil.habilidades,
      experience: rascunho.perfil.experiencias.map(e => ({
        company: e.empresa,
        role: e.cargo,
        period: e.inicio || ''
      })),
      education: rascunho.perfil.formacao.map(f => ({
        institution: f.instituicao,
        degree: f.curso,
        period: ''
      }))
    }
    const resume = {
      profile_summary: rascunho.perfil.sobreMim || '',
      core_competencies: rascunho.perfil.habilidades,
      ideal_roles: []
    }
    await fetch(`${import.meta.env.VITE_API_URL || ''}/profiles/${profileId}/resumes`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parsed, resume })
    })
    return Promise.resolve()
  }, [rascunho])

  return { rascunho, setRascunho, atualizarPerfil, setMetodo, setProgresso, salvarPerfil }
}
