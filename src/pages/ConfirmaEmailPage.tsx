import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'

export default function ConfirmaEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow text-center">
        <Heading>Confira seu e-mail</Heading>
        <Text className="mt-4">Enviamos um link de confirmação para seu e-mail. Clique no link para ativar sua conta.</Text>
        <Button variant="secondary" className="mt-6 w-full">Reenviar e-mail</Button>
      </div>
    </div>
  )
}
