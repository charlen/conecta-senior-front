import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'

export default function ConfirmadoPage() {
  return (
    <div className="min-h-screen bg-surface p-6 flex items-center justify-center">
      <div className="max-w-md text-center bg-white rounded-xl p-8">
        <Heading>Perfil confirmado!</Heading>
        <Text className="mt-4">Seu perfil foi criado com sucesso. Agora você pode explorar vagas compatíveis.</Text>
        <Button className="mt-6" variant="primary" onClick={() => window.location.href = '/vagas'}>Ver vagas</Button>
      </div>
    </div>
  )
}
