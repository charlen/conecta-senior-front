import { Button } from '../atoms/Button'

type WelcomeSectionProps = {
  onStart: () => void
}

export function WelcomeSection({ onStart }: WelcomeSectionProps) {
  return (
    <div className="flex flex-col gap-8 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">Conecta Sênior</h1>
        <h2 className="text-3xl font-bold text-slate-800">Sua experiência não expirou.</h2>
        <p className="text-slate-700 text-2xl leading-relaxed">
          Montamos o seu currículo com ajuda de inteligência artificial e mostramos vagas para você. Vamos começar?
        </p>
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
        <p className="text-amber-900 text-xl leading-relaxed font-semibold">
          Versão de demonstração (MVP). As vagas são exemplos fictícios.
        </p>
      </div>

      <div className="flex justify-center">
        <Button variant="primary" onClick={onStart}>Começar</Button>
      </div>
    </div>
  )
}
