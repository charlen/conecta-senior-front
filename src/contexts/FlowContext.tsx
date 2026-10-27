import { createContext, ReactNode, useState } from 'react'

export type FlowState = {
  email: string
  nome: string
  idade: string
  entrevista: string[]
  preferencias: string[]
  curriculo: string
  tipo: string
  area: string
  candidaturas: number[]
}

export type FlowContextType = {
  state: FlowState
  updateEmail: (email: string) => void
  updateCadastro: (nome: string, idade: string) => void
  updateEntrevista: (index: number, answer: string) => void
  updatePreferencias: (prefs: string[]) => void
  updateTipo: (tipo: string) => void
  updateArea: (area: string) => void
  toggleCandidatura: (id: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  step: number
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

const initialState: FlowState = {
  email: '',
  nome: '',
  idade: '',
  entrevista: [],
  preferencias: [],
  curriculo: '',
  tipo: '',
  area: '',
  candidaturas: []
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState)
  const [step, setStep] = useState(0)

  const updateEmail = (email: string) => {
    setState(s => ({ ...s, email }))
  }

  const updateCadastro = (nome: string, idade: string) => {
    setState(s => ({ ...s, nome, idade }))
  }

  const updateEntrevista = (index: number, answer: string) => {
    setState(s => {
      const copy = [...s.entrevista]
      copy[index] = answer
      return { ...s, entrevista: copy }
    })
  }

  const updatePreferencias = (prefs: string[]) => {
    setState(s => ({ ...s, preferencias: prefs }))
  }

  const updateTipo = (tipo: string) => {
    setState(s => ({ ...s, tipo }))
  }

  const updateArea = (area: string) => {
    setState(s => ({ ...s, area }))
  }

  const toggleCandidatura = (id: number) => {
    setState(s => {
      const exists = s.candidaturas.includes(id)
      const candidaturas = exists ? s.candidaturas.filter(c => c !== id) : [...s.candidaturas, id]
      return { ...s, candidaturas }
    })
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => Math.max(0, s - 1))
  const goToStep = (step: number) => setStep(step)

  return (
    <FlowContext.Provider value={{ state, updateEmail, updateCadastro, updateEntrevista, updatePreferencias, updateTipo, updateArea, toggleCandidatura, nextStep, prevStep, goToStep, step }}>
      {children}
    </FlowContext.Provider>
  )
}

export { FlowContext }

