import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { ButtonRow } from '../molecules/ButtonRow'

type RegistrationFormProps = {
  nome: string
  idade: string
  onNomeChange: (v: string) => void
  onIdadeChange: (v: string) => void
  onContinue: () => void
}

export function RegistrationForm({ nome, idade, onNomeChange, onIdadeChange, onContinue }: RegistrationFormProps) {
  return (
    <>
      <FormField label="Seu nome" id="n" value={nome} onChange={onNomeChange} />
      <FormField label="Sua idade" id="i" value={idade} onChange={onIdadeChange} />
      <ButtonRow>
        <Button variant="primary" onClick={onContinue}>Continuar</Button>
      </ButtonRow>
    </>
  )
}
