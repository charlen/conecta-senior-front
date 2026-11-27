type LegalLinksProps = {
  className?: string
}

export function LegalLinks({ className = '' }: LegalLinksProps) {
  const linkClass =
    'underline underline-offset-4 hover:text-slate-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary rounded inline-flex items-center min-h-[48px] px-2'

  return (
    <nav aria-label="Informações legais" className={`flex flex-wrap items-center gap-x-2 text-lg text-slate-600 ${className}`}>
      <a href="/privacidade" className={linkClass}>Política de Privacidade</a>
      <span aria-hidden="true">·</span>
      <a href="/termos" className={linkClass}>Termos de Uso</a>
    </nav>
  )
}
