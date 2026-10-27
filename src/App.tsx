import { FlowProvider } from './contexts/FlowContext'
import { WelcomePage } from './pages/WelcomePage'
import { EmailPage } from './pages/EmailPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { InterviewPage } from './pages/InterviewPage'
import { ResumePage } from './pages/ResumePage'
import { PreferencesPage } from './pages/PreferencesPage'
import { MatchingPage } from './pages/MatchingPage'
import { JobsPage } from './pages/JobsPage'
import { DashboardPage } from './pages/DashboardPage'
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

export function App() {
  return (
    <FlowProvider>
      <FlowRouter />
    </FlowProvider>
  )
}
