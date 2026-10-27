import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'

export function DashboardPage() {
  return (
    <PageTemplate>
      <StepTemplate step={8} total={8} title="Painel">
        <div>
          <p>Painel final</p>
        </div>
      </StepTemplate>
    </PageTemplate>
  )
}
