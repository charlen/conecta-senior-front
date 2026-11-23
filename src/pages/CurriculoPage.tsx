import { useState } from 'react'
import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { Alerta } from '../components/molecules/Alerta'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'
import type { ResumeResponse } from '../types/resume'

const API_URL = import.meta.env.VITE_API_URL || 'https://senior-api.zoryuz.com'

export default function CurriculoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setProgresso } = useRascunhoPerfil()

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Apenas arquivos PDF são aceitos')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande, máximo 10MB')
      return
    }
    setError(null)
    setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const upload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Não autenticado')
      const meRes = await fetch(`${API_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!meRes.ok) throw new Error('Falha ao buscar perfil')
      const me = await meRes.json()
      const profileId = me.id
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_URL}/profiles/${profileId}/resumes`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      })
      if (!res.ok) throw new Error('Falha ao processar currículo')
      const data: ResumeResponse = await res.json()
      // Preencher rascunho com dados extraídos via localStorage
      const rascunhoRaw = localStorage.getItem('cs_rascunho_perfil')
      const rascunho = rascunhoRaw ? JSON.parse(rascunhoRaw) : { perfil: { dadosBasicos: {}, experiencias: [], formacao: [], habilidades: [] } }
      if (data.parsed) {
        rascunho.perfil.dadosBasicos.nomeCompleto = data.parsed.name || ''
        rascunho.perfil.habilidades = data.parsed.skills || []
        rascunho.perfil.experiencias = (data.parsed.experience || []).map(e => ({
          empresa: e.company || '',
          cargo: e.role || '',
          inicio: e.period || ''
        }))
        rascunho.perfil.formacao = (data.parsed.education || []).map(e => ({
          instituicao: e.institution || '',
          curso: e.degree || ''
        }))
        rascunho.perfil.sobreMim = data.resume.profile_summary || ''
      }
      localStorage.setItem('cs_rascunho_perfil', JSON.stringify(rascunho))
      setProgresso('revisao')
      window.location.href = '/comecar/revisao'
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao ler currículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Heading className="text-2xl">Conecta Sênior</Heading>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-0 md:px-6 py-0 md:py-10">
        <div className="bg-white rounded-none md:rounded-3xl p-6 md:p-8 shadow-none md:shadow-sm border-0 md:border border-slate-200">
          <Heading className="text-3xl">Enviar currículo em PDF</Heading>
          <Text className="mt-2 text-lg text-slate-600">Arraste o arquivo aqui ou clique para selecionar</Text>
        {error && <Alerta tipo="erro" className="mt-4">{error}</Alerta>}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center mt-6 bg-white"
        >
          {file ? <p className="text-lg">{file.name}</p> : <p className="text-lg text-text-secondary">Solte o arquivo aqui</p>}
          <input type="file" accept="application/pdf" className="hidden" id="fileInput" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <Button variant="secondary" className="mt-4" onClick={() => document.getElementById('fileInput')?.click()}>Escolher arquivo</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <Button variant="secondary" className="w-full md:w-auto" onClick={() => window.location.href = '/comecar/metodo'}>Voltar</Button>
          <Button variant="primary" className="w-full md:w-auto" onClick={upload} disabled={!file || loading}>
            {loading ? <><Spinner className="mr-2" /> Lendo seu currículo...</> : 'Enviar'}
          </Button>
        </div>
        {loading && <Text className="mt-4">Lendo seu currículo...</Text>}
        </div>
      </main>
    </div>
  )
}
