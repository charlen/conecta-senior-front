import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { useFluxo } from '../hooks/useFluxo'
import { Button } from '../components/atoms/Button'

export function CurriculoPage() {
  const { state, nextStep, prevStep } = useFluxo()
  return (
    <PageTemplate>
      <StepTemplate step={4} total={8} title="Currículo">
        <div>
          <p>Currículo gerado para {state.nome}</p>
          <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
            <Button variant="secondary" onClick={prevStep}>Voltar</Button>
            <Button variant="primary" onClick={nextStep}>Próximo</Button>
          </div>
        </div>
      </StepTemplate>
    </PageTemplate>
  )
}
