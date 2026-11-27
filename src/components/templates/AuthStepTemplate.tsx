import { ReactNode, useEffect, useRef } from 'react'

type AuthStepTemplateProps = {
  /** Question-style title, e.g. "Qual é o seu e-mail?". Focused on every screen change. */
  title: string
  description?: ReactNode
  step?: { current: number; total: number }
  onBack: () => void
  backLabel?: string
  children: ReactNode
  footer?: ReactNode
}

/** One-thing-per-screen layout for sign up / sign in: back link, "Passo X de Y", big question, single card. */
export function AuthStepTemplate({ title, description, step, onBack, backLabel = 'Voltar', children, footer }: AuthStepTemplateProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [title])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 md:py-12">
        <header className="mb-4 flex items-center justify-between gap-4">
          <a href="/" className="inline-flex min-h-[48px] items-center rounded-xl text-2xl font-extrabold tracking-tight text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30">
            Conecta Sênior
          </a>
        </header>

        <nav aria-label="Navegação da etapa" className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={onBack}
            className="-ml-3 inline-flex min-h-[56px] cursor-pointer items-center gap-2 rounded-2xl px-3 text-xl font-semibold text-primary underline underline-offset-4 hover:text-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            <span aria-hidden="true" className="text-2xl no-underline">←</span>
            {backLabel}
          </button>
          {step && (
            <p className="text-lg font-semibold text-slate-700">
              Passo {step.current} de {step.total}
            </p>
          )}
        </nav>

        <main className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.08)] sm:p-10 md:p-12">
          {step && (
            <div aria-hidden="true" className="mb-8 flex gap-2">
              {Array.from({ length: step.total }, (_, i) => (
                <span key={i} className={`h-2 flex-1 rounded-full ${i < step.current ? 'bg-primary' : 'bg-slate-200'}`} />
              ))}
            </div>
          )}
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold leading-tight text-slate-900 focus:outline-none md:text-4xl">
            {title}
          </h1>
          {description && <div className="mt-4 text-xl leading-relaxed text-slate-700">{description}</div>}
          <div className="mt-8">{children}</div>
        </main>

        {footer && <div className="mt-6 text-center text-xl text-slate-700">{footer}</div>}
      </div>
    </div>
  )
}
