import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { useFluxo } from '../hooks/useFluxo'
import { interviewQuestions } from '../mocks/data'
import { useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Textarea } from '../components/atoms/Textarea'

export function EntrevistaPage() {
  const { state, updateEntrevista, nextStep, prevStep } = useFluxo()
  const [index, setIndex] = useState(0)
  const question = interviewQuestions[index] ?? ''
  const answer = state.entrevista[index] ?? ''
  const total = interviewQuestions.length

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(i => i + 1)
    } else {
      nextStep()
    }
  }

  return (
    <PageTemplate>
      <StepTemplate step={3} total={8} title="Entrevista">
        <div>
          <p>{question}</p>
          <Textarea value={answer} onChange={e => updateEntrevista(index, e.target.value)} />
          <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
            <Button variant="secondary" onClick={prevStep}>Voltar</Button>
            <Button variant="primary" onClick={handleNext}>Próxima</Button>
          </div>
        </div>
      </StepTemplate>
    </PageTemplate>
  )
}
