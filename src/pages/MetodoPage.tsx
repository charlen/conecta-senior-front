import { CartaoOpcao } from '../components/molecules/CartaoOpcao'
import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'

export default function MetodoPage() {
  const { rascunho, setMetodo, setProgresso } = useRascunhoPerfil()
  const metodo = rascunho.metodo

  const escolher = (m: 'pdf' | 'manual' | 'voz') => {
    setMetodo(m)
    setProgresso('metodo_escolhido')
    // Navegação simples via hash
    if (m === 'pdf') window.location.href = '/comecar/curriculo'
    if (m === 'manual') window.location.href = '/comecar/passo/1'
    if (m === 'voz') window.location.href = '/comecar/voz'
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto">
        <Heading>Como você prefere preencher?</Heading>
        <Text className="mt-2">Escolha a forma mais confortável para nós</Text>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <CartaoOpcao
            titulo="Enviar currículo em PDF"
            descricao="Faça upload do seu currículo e nós extraímos as informações"
            selecionado={metodo === 'pdf'}
            onClick={() => escolher('pdf')}
          />
          <CartaoOpcao
            titulo="Preencher digitando"
            descricao="Responda as perguntas passo a passo"
            selecionado={metodo === 'manual'}
            onClick={() => escolher('manual')}
          />
          <CartaoOpcao
            titulo="Responder falando"
            descricao="Fale suas respostas e nós transcrevemos"
            selecionado={metodo === 'voz'}
            onClick={() => escolher('voz')}
          />
        </div>
        <div className="mt-8">
          <Button variant="primary" onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </div>
    </div>
  )
}
