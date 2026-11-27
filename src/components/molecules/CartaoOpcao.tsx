import { ButtonHTMLAttributes } from 'react'

type CartaoOpcaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selecionado?: boolean
  titulo: string
  descricao?: string
}

export function CartaoOpcao({ selecionado, titulo, descricao, className = '', ...props }: CartaoOpcaoProps) {
  return (
    <button
      type="button"
      className={`w-full text-left p-6 rounded-xl border-2 min-h-[120px] transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 ${
        selecionado ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'
      } ${className}`}
      {...props}
    >
      <div className="text-xl font-semibold text-text-primary">{titulo}</div>
      {descricao && <div className="mt-2 text-lg text-text-secondary">{descricao}</div>}
    </button>
  )
}
