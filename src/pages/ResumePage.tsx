import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { useFlow } from '../hooks/useFlow'
import { Button } from '../components/atoms/Button'

export function ResumePage() {
  const { state, nextStep, prevStep } = useFlow()
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
