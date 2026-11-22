import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { useAuth } from '../hooks/useAuth'

export default function ConfirmadoPage() {
  const { isAuthenticated } = useAuth()
  const handleContinue = () => {
    if (isAuthenticated) {
      window.location.href = '/'
    } else {
      window.location.href = '/vagas'
    }
  }
  return (
    <div className="min-h-screen bg-surface p-6 flex items-center justify-center">
      <div className="max-w-md text-center bg-white rounded-xl p-8">
        <Heading>Perfil confirmado!</Heading>
        <Text className="mt-4">Seu perfil foi criado com sucesso. Agora você pode explorar vagas compatíveis.</Text>
        <Button className="mt-6" variant="primary" onClick={handleContinue}>Continuar</Button>
      </div>
    </div>
  )
}
