import type { Ref } from 'react'
import { ProfileField, inputClass } from './ProfileField'

type CodeFieldProps = {
  value: string
  onChange: (digits: string) => void
  error?: string
  inputRef?: Ref<HTMLInputElement>
  id?: string
  length?: number
}

/**
 * Single large input for the e-mail code. Keeps only digits, so pasting
 * "123 456" or "Seu código é: 123456" works; the OS can autofill via one-time-code.
 */
export function CodeField({ value, onChange, error, inputRef, id = 'code', length = 6 }: CodeFieldProps) {
  return (
    <ProfileField id={id} label={`Código de ${length} números`} hint="Está no e-mail que enviamos." error={error} required hideRequirement>
      {a => (
        <input
          {...a}
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          enterKeyHint="done"
          spellCheck={false}
          className={`${inputClass(error)} max-w-sm py-5 text-center font-mono text-4xl font-bold tracking-[0.5em] pl-[calc(1rem+0.5em)] text-slate-900`}
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        />
      )}
    </ProfileField>
  )
}
