import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { useState, useRef } from 'react'

export default function VozPage() {
  const [transcricao, setTranscricao] = useState('')
  const [resposta, setResposta] = useState('')
  const [gravando, setGravando] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const iniciar = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks: Blob[] = []
    recorder.ondataavailable = e => chunks.push(e.data)
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const buf = await blob.arrayBuffer()
      // STT
      const sttRes = await fetch('/api/stt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audio: Array.from(new Uint8Array(buf)) }) })
      const sttJson = await sttRes.json()
      setTranscricao(sttJson.text || '')
      // Talker
      const talkRes = await fetch('/api/talk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: sttJson.text }) })
      const talkJson = await talkRes.json()
      setResposta(talkJson.response || '')
    }
    recorder.start()
    mediaRecorderRef.current = recorder
    setGravando(true)
    setTimeout(() => {
      recorder.stop()
      setGravando(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-2xl mx-auto">
        <Heading>Preencher por voz</Heading>
        <Text className="mt-2">Fale sobre sua experiência e formação</Text>
        <Button className="mt-6" onClick={iniciar} variant={gravando ? 'secondary' : 'primary'}>{gravando ? 'Gravando...' : 'Iniciar gravação'}</Button>
        {transcricao && <div className="mt-6 bg-white p-4 rounded"><Text className="font-medium">Transcrição:</Text><p>{transcricao}</p></div>}
        {resposta && <div className="mt-6 bg-white p-4 rounded"><Text className="font-medium">Resposta:</Text><p>{resposta}</p></div>}
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => window.location.href = '/comecar/metodo'}>Voltar</Button>
          <Button variant="primary" onClick={() => window.location.href = '/comecar/passo/1'}>Continuar</Button>
        </div>
      </div>
    </div>
  )
}
