import { useFlow } from '../hooks/useFlow'
import { Button } from '../components/atoms/Button'

export function WelcomePage() {
  const { nextStep } = useFlow()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased font-sans">
      {/* Hero image uses hero.jpg */}
      
      {/* Lado Esquerdo - Painel Hero com Imagem e Texto Totalmente Integrados */}
      <div className="w-full md:w-5/12 min-h-[60vh] md:min-h-screen relative flex flex-col justify-end p-8 md:p-12 lg:p-16 text-white overflow-hidden bg-slate-900">
        
        {/* A Imagem de Fundo Ocupando Todo o Painel */}
        <img 
          src="/assets/hero.jpg" 
          alt="Atendente sênior sorridente em uma lanchonete elegante" 
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        />
        
        {/* Filtro Cinematográfico e Camada de Degradê Duplo para Legibilidade */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-slate-950/10 mix-blend-multiply opacity-95 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/50 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Conteúdo flutuando sobre a imagem */}
        <div className="relative z-10 space-y-6 md:space-y-8">
          <div>
            <span className="text-sm md:text-base font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-block mb-4 border border-white/20">
              Plataforma Inclusiva
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none drop-shadow-md">
              Conecta Sênior
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-100 font-medium max-w-sm leading-relaxed drop-shadow">
            Valorizando a bagagem, o talento e a história de quem tem muito a contribuir.
          </p>

          <div className="text-base md:text-lg text-slate-300 border-t border-white/20 pt-4 w-full">
            Feito com carinho para a generation 60+
          </div>
        </div>
      </div>

      {/* Lado Direito - Área de Ação Principal */}
      <div className="w-full md:w-7/12 flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white relative">
        
        {/* Botões topo direito - Desktop */}
        <div className="hidden md:flex absolute top-8 right-8 gap-3">
          <Button variant="secondary" onClick={() => window.location.href = '/entrar'} className="text-lg py-3 px-6 rounded-xl">
            Entrar
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/cadastro'} className="text-lg py-3 px-6 rounded-xl">
            Cadastrar
          </Button>
        </div>

        {/* Botões topo - Mobile */}
        <div className="md:hidden flex gap-3 mb-6">
          <Button variant="secondary" onClick={() => window.location.href = '/entrar'} className="flex-1 text-lg py-3 px-6 rounded-xl">
            Entrar
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/cadastro'} className="flex-1 text-lg py-3 px-6 rounded-xl">
            Cadastrar
          </Button>
        </div>

        {/* Div invisível para ajudar no alinhamento vertical flex-col no desktop */}
        <div className="hidden md:block" />

        {/* Bloco de Conteúdo Centralizado */}
        <div className="max-w-2xl w-full space-y-8 md:space-y-10 my-auto">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Sua experiência <br />
              <span className="text-[#2563eb] font-extrabold">não expirou.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
              Criamos o seu perfil de destaque resgatando as suas maiores competências para conectar você a oportunidades reais que mais combinam com a sua experiência. Dê continuidade a uma jornada profissional que tem muito a acrescentar!
            </p>
          </div>

          {/* Botão de Chamada para Ação */}
          <div className="pt-2">
            <Button 
              variant="primary" 
              onClick={nextStep} 
              className="w-full text-xl md:text-2xl py-4 md:py-5 shadow-lg shadow-blue-100 rounded-2xl font-bold transition-all"
            >
              Começar minha jornada
            </Button>
          </div>
        </div>



      </div>

    </div>
  )
}
