import { useState, type ReactNode } from 'react'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { useAuth } from '../../contexts/AuthContext'

type NavItem = { href: string; label: string; short: string }

const NAV: NavItem[] = [
  { href: '/minhas-vagas', label: 'Minhas vagas', short: 'Minhas vagas' },
  { href: '/vagas/nova', label: 'Nova vaga', short: 'Nova vaga' },
  { href: '/minha-empresa', label: 'Dados da empresa', short: 'Empresa' }
]

type RecruiterPageTemplateProps = {
  children: ReactNode
  /** Highlights the current item in the top bar */
  current?: string
  /** Intercepts in-app navigation (e.g. unsaved-changes guard) */
  onNavigate?: (href: string) => void
  /** Max content width; forms with preview use the wider one */
  width?: 'default' | 'wide'
}

/** Compact shell for the company/recruiter screens: top bar + content. */
export function RecruiterPageTemplate({ children, current, onNavigate, width = 'default' }: RecruiterPageTemplateProps) {
  const { setToken, userName } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const go = (href: string) => (onNavigate ? onNavigate(href) : (window.location.href = href))
  const max = width === 'wide' ? 'max-w-7xl' : 'max-w-6xl'

  const link = (item: NavItem, compact = false) => {
    const active = current === item.href
    return (
      <a
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        onClick={e => {
          e.preventDefault()
          go(item.href)
        }}
        className={`whitespace-nowrap rounded-lg font-semibold text-center ${compact ? 'px-2 py-2 text-sm' : 'px-3 py-2 text-base'} focus:outline-none focus:ring-4 focus:ring-primary/30 ${
          active ? 'bg-primary/10 text-primary-dark' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        {compact ? item.short : item.label}
      </a>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className={`${max} mx-auto flex items-center gap-4 px-4 md:px-6 h-16`}>
          <a
            href="/minhas-vagas"
            onClick={e => {
              e.preventDefault()
              go('/minhas-vagas')
            }}
            className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/30"
          >
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Conecta Sênior</span>
            <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">Empresas</span>
          </a>
          <nav aria-label="Navegação da empresa" className="hidden md:flex items-center gap-1 ml-4">
            {NAV.map(item => link(item))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {userName && <span className="hidden lg:inline text-sm text-slate-600 truncate max-w-[16rem]">{userName}</span>}
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="min-h-[40px] rounded-lg border border-slate-300 px-3 text-base font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
        <nav aria-label="Navegação da empresa" className="md:hidden grid grid-cols-3 gap-1 border-t border-slate-100 px-2 py-1.5">
          {NAV.map(item => link(item, true))}
        </nav>
      </header>
      <main id="conteudo" className={`${max} mx-auto px-4 md:px-6 py-6 md:py-8`}>
        {children}
      </main>
      <ConfirmModal
        open={logoutOpen}
        title="Sair da conta?"
        message="Você precisará entrar novamente para gerenciar suas vagas."
        confirmLabel="Sair"
        onConfirm={() => {
          setLogoutOpen(false)
          setToken(null)
          window.location.href = '/'
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  )
}
