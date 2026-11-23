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
    if (m === 'pdf') window.location.href = '/comecar/curriculo'
    if (m === 'manual') window.location.href = '/comecar/passo/1'
    if (m === 'voz') window.location.href = '/comecar/voz'
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
          <Heading className="text-3xl">Como você prefere preencher?</Heading>
          <Text className="mt-2 text-lg text-slate-600">Escolha a forma mais confortável para você</Text>
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
          <div className="mt-6 md:mt-8 px-0 md:px-0">
            <Button variant="secondary" className="w-full md:w-auto" onClick={() => window.location.href = '/meu-perfil'}>Voltar</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
