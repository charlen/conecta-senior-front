import { ReactNode } from 'react'

type StepTemplateProps = {
  step: number
  total: number
  title: string
  children: ReactNode
}

export function StepTemplate({ step, total, title, children }: StepTemplateProps) {
  const progress = (step / total) * 100
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-slate-600 text-xl leading-relaxed">Passo {step} de {total}</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mt-3">{title}</h1>
        <div className="w-full bg-slate-200 h-3 rounded-full mt-6">
          <div className="h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: '#2563eb' }} />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {children}
      </div>
    </div>
  )
}
