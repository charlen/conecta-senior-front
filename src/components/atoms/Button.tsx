import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
  /** "lg" (default) for the 60+ screens; "md" for the denser recruiter screens */
  size?: 'lg' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'lg', className = '', ...props },
  ref
) {
  const sizeClass = size === 'md' ? 'px-5 py-2.5 text-base rounded-xl min-h-[44px]' : 'px-8 py-4 text-xl rounded-2xl min-h-[56px]'
  const base = `appearance-none ${sizeClass} font-semibold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-[#2563eb]/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100`
  const variantClass =
    variant === 'primary'
      ? 'bg-[#2563eb] text-white hover:brightness-95 active:scale-[0.98] border-0'
      : variant === 'danger'
      ? 'bg-[#dc2626] text-white hover:brightness-95 active:scale-[0.98] border-0'
      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
  return <button ref={ref} className={`${base} ${variantClass} ${className}`} {...props} />
})
