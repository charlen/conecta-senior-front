import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { CadastroForm } from '../components/organisms/CadastroForm'
import { useFluxo } from '../hooks/useFluxo'
import { useState } from 'react'

export function CadastroPage() {
  const { state, updateCadastro, nextStep } = useFluxo()
  const [nome, setNome] = useState(state.nome)
  const [idade, setIdade] = useState(state.idade)

  const handleContinue = () => {
    updateCadastro(nome, idade)
    nextStep()
  }

  return (
    <PageTemplate>
      <StepTemplate step={2} total={8} title="Cadastro">
        <CadastroForm nome={nome} idade={idade} onNomeChange={setNome} onIdadeChange={setIdade} onContinue={handleContinue} />
      </StepTemplate>
    </PageTemplate>
  )
}
