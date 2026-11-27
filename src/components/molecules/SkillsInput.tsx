import { useState, type KeyboardEvent } from 'react'
import { checkSkill, JOB_LIMITS } from '../../utils/jobValidation'
import { inputClass } from './ProfileField'

type SkillsInputProps = {
  id: string
  value: string[]
  onChange: (skills: string[]) => void
  /** Error coming from the form (e.g. 422 on `skills`) */
  error?: string
  'aria-describedby'?: string
}

/** Chip input: Enter or comma adds, × (or Backspace on an empty field) removes. */
export function SkillsInput({ id, value, onChange, error, ...aria }: SkillsInputProps) {
  const [draft, setDraft] = useState('')
  const [localError, setLocalError] = useState('')
  const shownError = localError || error
  const full = value.length >= JOB_LIMITS.skillsMax

  const add = (raw: string) => {
    const parts = raw.split(',')
    let next = value
    let problem = ''
    for (const part of parts) {
      const result = checkSkill(part, next)
      if ('value' in result) next = [...next, result.value]
      else if (result.error) problem = result.error
    }
    if (next !== value) onChange(next)
    setLocalError(problem)
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (draft.trim()) add(draft)
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const remove = (skill: string) => {
    onChange(value.filter(s => s !== skill))
    setLocalError('')
    document.getElementById(id)?.focus()
  }

  const describedBy = [aria['aria-describedby'], localError ? `${id}-local-error` : '', `${id}-count`].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Habilidades adicionadas">
          {value.map(skill => (
            <li key={skill} className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 pl-3 pr-1 text-sm font-medium text-blue-900">
              <span className="break-all py-1">{skill}</span>
              <button
                type="button"
                onClick={() => remove(skill)}
                aria-label={`Remover ${skill}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-blue-900 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          maxLength={JOB_LIMITS.skillMax * 3}
          disabled={full}
          onChange={e => {
            setDraft(e.target.value)
            if (localError) setLocalError('')
          }}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={full ? 'Limite de habilidades atingido' : 'Ex.: Atendimento ao cliente, Excel'}
          aria-invalid={Boolean(shownError) || undefined}
          aria-describedby={describedBy}
          className={inputClass(shownError, 'md')}
        />
        <button
          type="button"
          onClick={() => draft.trim() && add(draft)}
          disabled={!draft.trim()}
          className="min-h-[44px] shrink-0 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Adicionar
        </button>
      </div>
      <p id={`${id}-count`} className="text-sm text-slate-600">
        {value.length} de {JOB_LIMITS.skillsMax} · Enter ou vírgula para adicionar
      </p>
      {localError && (
        <p id={`${id}-local-error`} role="alert" className="text-sm font-semibold text-red-700">
          {localError}
        </p>
      )}
    </div>
  )
}
