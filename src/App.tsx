import { FlowProvider } from './contexts/FlowContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { WelcomePage } from './pages/WelcomePage'
import { EmailPage } from './pages/EmailPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { InterviewPage } from './pages/InterviewPage'
import { ResumePage } from './pages/ResumePage'
import { PreferencesPage } from './pages/PreferencesPage'
import { MatchingPage } from './pages/MatchingPage'
import { JobsPage } from './pages/JobsPage'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ConfirmPage } from './pages/ConfirmPage'
import DevComponentes from './pages/DevComponentes'
import CadastroPage from './pages/CadastroPage'
import ConfirmaEmailPage from './pages/ConfirmaEmailPage'
import EntrarPage from './pages/EntrarPage'
import VerificarPage from './pages/VerificarPage'
import MetodoPage from './pages/MetodoPage'
import WizardPage from './pages/WizardPage'
import CurriculoPage from './pages/CurriculoPage'
import VozPage from './pages/VozPage'
import RevisaoPage from './pages/RevisaoPage'
import ConfirmadoPage from './pages/ConfirmadoPage'
import { useFlow } from './hooks/useFlow'

function FlowRouter() {
  const { step } = useFlow()
  const steps = [
    WelcomePage,
    EmailPage,
    RegistrationPage,
    InterviewPage,
    ResumePage,
    PreferencesPage,
    MatchingPage,
    JobsPage,
    DashboardPage
  ]
  const Current = steps[step] ?? DashboardPage
  return <Current />
}

function AppRoutes() {
  const path = window.location.pathname
  const { isAuthenticated } = useAuth()

  if (isAuthenticated && path !== '/vagas' && !path.startsWith('/comecar')) {
    window.location.href = '/vagas'
    return null
  }

  if (path.startsWith('/dev/componentes')) {
    return <DevComponentes />
  }
  if (path.startsWith('/verificar')) {
    return <VerificarPage />
  }
  if (path === '/cadastro') {
    return <CadastroPage />
  }
  if (path === '/confira-seu-email') {
    return <ConfirmaEmailPage />
  }
  if (path === '/entrar') {
    return <EntrarPage />
  }
  if (path === '/comecar/metodo') {
    return <MetodoPage />
  }
  if (path === '/comecar/voz') {
    return <VozPage />
  }
  if (path === '/comecar/curriculo') {
    return <CurriculoPage />
  }
  if (path === '/comecar/revisao') {
    return <RevisaoPage />
  }
  if (path === '/comecar/confirmado') {
    return <ConfirmadoPage />
  }
  if (path === '/vagas') {
    return <HomePage />
  }
  if (path.startsWith('/comecar/passo/')) {
    return <WizardPage />
  }
  if (path.startsWith('/confirm')) {
    return <ConfirmPage />
  }
  return (
    <FlowProvider>
      <FlowRouter />
    </FlowProvider>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
