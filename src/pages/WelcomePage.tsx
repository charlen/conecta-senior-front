import { useFluxo } from '../hooks/useFluxo'
import { Button } from '../components/atoms/Button'

export function WelcomePage() {
  const { nextStep } = useFluxo()
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Lado Esquerdo */}
      <div className="w-full md:w-5/12 bg-[#2563eb] p-10 md:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-blue-700 rounded-full opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-lg font-bold uppercase tracking-wider bg-blue-700/50 px-4 py-2 rounded-full inline-block mb-8 border border-blue-400/30">
            Plataforma Exclusiva
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Conecta Sênior
          </h1>
          <p className="text-2xl text-blue-100 font-medium max-w-sm leading-relaxed">
            Valorizando a bagagem, o talento e a história de quem tem muito a contribuir.
          </p>
        </div>
        <div className="mt-12 md:mt-0 relative z-10 text-xl text-blue-200 border-t border-blue-500/40 pt-6">
          Feito com carinho para a geração 60+
        </div>
      </div>

      {/* Lado Direito */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-10 md:p-16 bg-white">
        <div className="max-w-2xl w-full space-y-10">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Sua experiência <br />
              <span className="text-[#2563eb] font-extrabold">não expirou.</span>
            </h2>
            <p className="text-2xl text-slate-700 leading-relaxed">
              Montamos o seu currículo de forma simples com a ajuda de inteligência artificial e encontramos as vagas ideais para o seu perfil. Vamos começar?
            </p>
          </div>

          <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-200">
            <p className="text-amber-900 text-xl leading-relaxed font-semibold">
              Versão de demonstração (MVP). As vagas são exemplos fictícios.
            </p>
          </div>

          <div className="pt-2">
            <Button variant="primary" onClick={nextStep} className="w-full text-2xl py-5">
              Começar minha jornada
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
