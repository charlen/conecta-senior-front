import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { useFlow } from '../hooks/useFlow'
import { Button } from '../components/atoms/Button'
import { Container } from '../components/atoms/Container'

const tipos = ["Meio período","Temporário","Remoto","Presencial"]
const areas = ["Atendimento","Administrativo","Vendas","Educação"]

export function PreferencesPage() {
  const { state, updateTipo, updateArea, nextStep, prevStep } = useFlow()

  return (
    <PageTemplate>
      <StepTemplate step={4} total={6} title="O que você procura?">
        <Container>
          <strong>Tipo de trabalho</strong>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'8px'}}>
            {tipos.map(t => (
              <Button key={t} variant={state.tipo===t?'primary':'secondary'} onClick={()=>updateTipo(state.tipo===t?'':t)}>{t}</Button>
            ))}
          </div>
        </Container>
        <Container>
          <strong>Área de interesse</strong>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginTop:'8px'}}>
            {areas.map(a => (
              <Button key={a} variant={state.area===a?'primary':'secondary'} onClick={()=>updateArea(state.area===a?'':a)}>{a}</Button>
            ))}
          </div>
        </Container>
        <Container>
          <Button variant="secondary" onClick={prevStep}>Voltar</Button>
          <Button variant="primary" onClick={nextStep}>Ver vagas para mim</Button>
        </Container>
      </StepTemplate>
    </PageTemplate>
  )
}
