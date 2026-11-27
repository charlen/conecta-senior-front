import { HTMLAttributes } from 'react'

export function Spinner({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`inline-block w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin ${className}`}
      {...props}
    />
  )
}
