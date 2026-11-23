import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  const base = 'appearance-none px-8 py-4 text-xl font-semibold rounded-2xl transition-all min-h-[56px] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#2563eb]/30 cursor-pointer'
  const variantClass =
    variant === 'primary'
      ? 'bg-[#2563eb] text-white hover:brightness-95 active:scale-[0.98] border-0'
      : variant === 'danger'
      ? 'bg-[#dc2626] text-white hover:brightness-95 active:scale-[0.98] border-0'
      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      {...props}
    />
  )
}
