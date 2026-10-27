import { createContext, ReactNode, useState } from 'react'

export type FluxoState = {
  nome: string
  idade: string
  entrevista: string[]
  preferencias: string[]
  curriculo: string
  tipo: string
  area: string
}

export type FluxoContextType = {
  state: FluxoState
  updateCadastro: (nome: string, idade: string) => void
  updateEntrevista: (index: number, answer: string) => void
  updatePreferencias: (prefs: string[]) => void
  updateTipo: (tipo: string) => void
  updateArea: (area: string) => void
  nextStep: () => void
  prevStep: () => void
  step: number
}

const FluxoContext = createContext<FluxoContextType | undefined>(undefined)

const initialState: FluxoState = {
  nome: '',
  idade: '',
  entrevista: [],
  preferencias: [],
  curriculo: '',
  tipo: '',
  area: ''
}

export function FluxoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FluxoState>(initialState)
  const [step, setStep] = useState(0)

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

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => Math.max(0, s - 1))

  return (
    <FluxoContext.Provider value={{ state, updateCadastro, updateEntrevista, updatePreferencias, updateTipo, updateArea, nextStep, prevStep, step }}>
      {children}
    </FluxoContext.Provider>
  )
}

export { FluxoContext }

