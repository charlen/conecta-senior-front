import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'

export default function RevisaoPage() {
  const { rascunho, salvarPerfil } = useRascunhoPerfil()

  const confirmar = async () => {
    await salvarPerfil()
    window.location.href = '/comecar/confirmado'
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-3xl mx-auto">
        <Heading>Revisão do perfil</Heading>
        <Text className="mt-2">Confira os dados antes de confirmar</Text>
        <div className="bg-white rounded-xl p-6 mt-4 space-y-4">
          <div>
            <Text className="font-medium">Dados básicos</Text>
            <p>Cidade: {rascunho.perfil.dadosBasicos.cidade}</p>
            <p>Estado: {rascunho.perfil.dadosBasicos.estado}</p>
            <p>Telefone: {rascunho.perfil.dadosBasicos.telefone}</p>
          </div>
          <div>
            <Text className="font-medium">Experiências</Text>
            {rascunho.perfil.experiencias.map((e,i)=>(
              <p key={i}>{e.cargo} @ {e.empresa}</p>
            ))}
          </div>
          <div>
            <Text className="font-medium">Formação</Text>
            {rascunho.perfil.formacao.map((f,i)=>(
              <p key={i}>{f.curso} - {f.instituicao}</p>
            ))}
          </div>
          <div>
            <Text className="font-medium">Habilidades</Text>
            <p>{rascunho.perfil.habilidades.join(', ')}</p>
          </div>
          <div>
            <Text className="font-medium">Preferências</Text>
            <p>Tipo: {rascunho.perfil.preferencias.tipoVaga}</p>
            <p>Local: {rascunho.perfil.preferencias.localidade}</p>
          </div>
          <div>
            <Text className="font-medium">Sobre</Text>
            <p>{rascunho.perfil.sobreMim}</p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => window.location.href = '/comecar/passo/6'}>Voltar</Button>
          <Button variant="primary" onClick={confirmar}>Confirmar</Button>
        </div>
      </div>
    </div>
  )
}
