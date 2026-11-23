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

  if (isAuthenticated && path !== '/vagas' && path !== '/meu-perfil' && path !== '/minhas-vagas' && path !== '/vagas/nova' && !path.startsWith('/comecar') && !path.startsWith('/vagas/editar/') && !path.startsWith('/vagas/') ) {
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
  if (path === '/meu-perfil') {
    return <PerfilPage />
  }
  if (path === '/minhas-vagas') {
    return <MinhasVagasPage />
  }
  if (path === '/vagas/nova') {
    return <IncluirVagaPage />
  }
  if (path.startsWith('/vagas/editar/')) {
    return <div className="min-h-screen bg-slate-50 p-6"><div className="max-w-2xl mx-auto"><h1 className="text-2xl font-bold">Editar vaga</h1><p className="text-slate-600 mt-4">Em breve.</p></div></div>
  }
  if (path.startsWith('/vagas/') && path.split('/').length >= 3) {
    return <div className="min-h-screen bg-slate-50 p-6"><div className="max-w-2xl mx-auto"><h1 className="text-2xl font-bold">Candidatos</h1><p className="text-slate-600 mt-4">Em breve.</p></div></div>
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
