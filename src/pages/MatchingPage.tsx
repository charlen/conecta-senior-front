import { PageTemplate } from '../components/templates/PageTemplate'
import { StepTemplate } from '../components/templates/StepTemplate'
import { useFluxo } from '../hooks/useFluxo'
import { useEffect, useState } from 'react'

export function MatchingPage() {
  const { nextStep } = useFluxo()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      setTimeout(() => nextStep(), 500)
    }, 1200)
    return () => clearTimeout(t)
  }, [nextStep])

  return (
    <PageTemplate>
      <StepTemplate step={5} total={6} title="Vagas para você">
        <div>
          {loading ? <p>Procurando as melhores vagas…</p> : <p>Encontradas!</p>}
        </div>
      </StepTemplate>
    </PageTemplate>
  )
}
