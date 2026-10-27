import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { RegistrationForm } from '../components/organisms/RegistrationForm'
import { useFlow } from '../hooks/useFlow'
import { useState } from 'react'

export function RegistrationPage() {
  const { state, updateCadastro, nextStep } = useFlow()
  const [nome, setNome] = useState(state.nome)
  const [idade, setIdade] = useState(state.idade)

  const handleContinue = () => {
    updateCadastro(nome, idade)
    nextStep()
  }

  return (
    <PageTemplate>
      <StepTemplate step={2} total={8} title="Cadastro">
        <RegistrationForm nome={nome} idade={idade} onNomeChange={setNome} onIdadeChange={setIdade} onContinue={handleContinue} />
      </StepTemplate>
    </PageTemplate>
  )
}
