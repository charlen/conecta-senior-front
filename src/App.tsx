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
import PerfilPage from './pages/PerfilPage'
import MinhasVagasPage from './pages/MinhasVagasPage'
import IncluirVagaPage from './pages/IncluirVagaPage'
import EditarVagaPage from './pages/EditarVagaPage'
import CandidatosVagaPage from './pages/CandidatosVagaPage'
import PrivacidadePage from './pages/PrivacidadePage'
import TermosPage from './pages/TermosPage'
import MinhaEmpresaPage from './pages/MinhaEmpresaPage'
import { useFlow } from './hooks/useFlow'
import { redirectFor } from './utils/roles'

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
  const { isAuthenticated, role } = useAuth()

  // Legal pages are public for everyone, logged in or not
  if (path === '/privacidade') {
    return <PrivacidadePage />
  }
  if (path === '/termos') {
    return <TermosPage />
  }

  // Logged-in users stay in their role's area (company ≠ candidate)
  const redirect = isAuthenticated ? redirectFor(path, role) : null
  if (redirect) {
    window.location.replace(redirect)
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
  if (path === '/meu-perfil') {
    return <PerfilPage />
  }
  if (path === '/minhas-vagas') {
    return <MinhasVagasPage />
  }
  if (path === '/minha-empresa') {
    return <MinhaEmpresaPage />
  }
  if (path === '/vagas/nova') {
    return <IncluirVagaPage />
  }
  if (path.startsWith('/vagas/editar/')) {
    return <EditarVagaPage />
  }
  if (/^\/vagas\/[^/]+\/candidatos\/?$/.test(path)) {
    return <CandidatosVagaPage />
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
