import type { ReactNode } from 'react'

type ProfileFieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  /** Hide the "(obrigatório)/(opcional)" marker — for one-question screens where every field is required. */
  hideRequirement?: boolean
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }) => ReactNode
}

/** Label + control + hint + error, with the accessibility wiring for screen readers. */
export function ProfileField({ id, label, required, hint, error, hideRequirement, children }: ProfileFieldProps) {
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold text-slate-800 text-xl">
        {label}
        {hideRequirement ? null : required ? (
          <span className="ml-2 text-base font-semibold text-red-700">(obrigatório)</span>
        ) : (
          <span className="ml-2 text-base font-normal text-slate-500">(opcional)</span>
        )}
      </label>
      {hint && <p id={`${id}-hint`} className="text-lg text-slate-600">{hint}</p>}
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-lg font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass = (error?: string) =>
  `w-full p-4 text-xl bg-white border-2 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all ${
    error ? 'border-red-600 focus:border-red-600' : 'border-slate-300 focus:border-primary'
  }`
