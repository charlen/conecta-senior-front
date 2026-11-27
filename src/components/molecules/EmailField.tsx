import type { Ref } from 'react'
import { ProfileField, inputClass } from './ProfileField'

type EmailFieldProps = {
  value: string
  onChange: (value: string) => void
  error?: string
  inputRef?: Ref<HTMLInputElement>
  hint?: string
}

export function EmailField({ value, onChange, error, inputRef, hint = 'Exemplo: maria.silva@gmail.com' }: EmailFieldProps) {
  return (
    <ProfileField id="email" label="E-mail" hint={hint} error={error} required hideRequirement>
      {a => (
        <input
          {...a}
          ref={inputRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={inputClass(error)}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </ProfileField>
  )
}
