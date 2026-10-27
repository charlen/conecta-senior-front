import { FluxoProvider } from './contexts/FluxoContext'
import { WelcomePage } from './pages/WelcomePage'
import { CadastroPage } from './pages/CadastroPage'
import { EntrevistaPage } from './pages/EntrevistaPage'
import { CurriculoPage } from './pages/CurriculoPage'
import { PreferenciasPage } from './pages/PreferenciasPage'
import { MatchingPage } from './pages/MatchingPage'
import { VagasPage } from './pages/VagasPage'
import { PainelPage } from './pages/PainelPage'
import { useFluxo } from './hooks/useFluxo'

function FlowRouter() {
  const { step } = useFluxo()
  const steps = [
    WelcomePage,
    CadastroPage,
    EntrevistaPage,
    CurriculoPage,
    PreferenciasPage,
    MatchingPage,
    VagasPage,
    PainelPage
  ]
  const Current = steps[step] ?? PainelPage
  return <Current />
}

export function App() {
  return (
    <FluxoProvider>
      <FlowRouter />
    </FluxoProvider>
  )
}
