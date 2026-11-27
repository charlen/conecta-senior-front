import type { ReactNode } from 'react'

type ProfileFieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  /** Hide the "(obrigatório)/(opcional)" marker — for one-question screens where every field is required. */
  hideRequirement?: boolean
  /** "lg" (default) for the 60+ screens; "md" for the denser recruiter screens */
  size?: 'lg' | 'md'
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }) => ReactNode
}

/** Label + control + hint + error, with the accessibility wiring for screen readers. */
export function ProfileField({ id, label, required, hint, error, hideRequirement, size = 'lg', children }: ProfileFieldProps) {
  const md = size === 'md'
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={md ? 'space-y-1.5' : 'space-y-2'}>
      <label htmlFor={id} className={`block font-bold text-slate-800 ${md ? 'text-base' : 'text-xl'}`}>
        {label}
        {hideRequirement ? null : required ? (
          <span className={`ml-2 font-semibold text-red-700 ${md ? 'text-sm' : 'text-base'}`}>(obrigatório)</span>
        ) : (
          <span className={`ml-2 font-normal text-slate-600 ${md ? 'text-sm' : 'text-base'}`}>(opcional)</span>
        )}
      </label>
      {hint && <p id={`${id}-hint`} className={`text-slate-600 ${md ? 'text-sm' : 'text-lg'}`}>{hint}</p>}
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {error && (
        <p id={`${id}-error`} role="alert" className={`font-semibold text-red-700 ${md ? 'text-sm' : 'text-lg'}`}>
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass = (error?: string, size: 'lg' | 'md' = 'lg') =>
  `w-full bg-white border-2 shadow-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${size === 'md' ? 'min-h-[44px] px-3 py-2 text-base rounded-xl' : 'p-4 text-xl rounded-2xl'} focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all ${
    error ? 'border-red-600 focus:border-red-600' : 'border-slate-300 focus:border-primary'
  }`
