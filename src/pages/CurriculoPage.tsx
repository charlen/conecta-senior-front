import { useState } from 'react'
import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { Alerta } from '../components/molecules/Alerta'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
      // Simulação: backend precisa de profileID. Usaremos placeholder.
      const form = new FormData()
      form.append('file', file)
      // Em produção, profileID viria do contexto
      const res = await fetch(`${API_URL}/profiles/temp/resumes`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Falha ao processar currículo')
      // Preencher rascunho seria feito com dados retornados
      setProgresso('revisao')
      window.location.href = '/comecar/revisao'
    } catch (err: any) {
      setError(err.message || 'Erro ao ler currículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-2xl mx-auto">
        <Heading>Enviar currículo em PDF</Heading>
        <Text className="mt-2">Arraste o arquivo aqui ou clique para selecionar</Text>
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
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => window.location.href = '/comecar/metodo'}>Voltar</Button>
          <Button variant="primary" onClick={upload} disabled={!file || loading}>
            {loading ? <><Spinner className="mr-2" /> Lendo seu currículo...</> : 'Enviar'}
          </Button>
        </div>
        {loading && <Text className="mt-4">Lendo seu currículo...</Text>}
      </div>
    </div>
  )
}
