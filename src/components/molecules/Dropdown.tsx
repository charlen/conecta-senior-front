import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export type DropdownOption = {
  value: string
  label: string
  /** Optional second line shown under the label */
  hint?: string
}

type DropdownProps = {
  id?: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** "lg" (default) for the 60+ screens; "md" for the denser recruiter screens */
  size?: 'lg' | 'md'
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  'aria-required'?: boolean
  'aria-label'?: string
}

/**
 * Themed dropdown following the WAI-ARIA "select-only combobox" pattern:
 * keyboard (arrows, Home/End, type-ahead, Enter/Space, Esc, Tab), screen reader
 * support and large touch targets for 60+ users. Works with <label htmlFor={id}>.
 */
/** Max list height in px (matches max-h-[22rem]) */
const LIST_MAX_HEIGHT = 352

export function Dropdown({
  id,
  value,
  options,
  onChange,
  placeholder = 'Escolha uma opção',
  disabled,
  size = 'lg',
  ...aria
}: DropdownProps) {
  const md = size === 'md'
  const autoId = useId()
  const buttonId = id ?? `dropdown-${autoId}`
  const listId = `${buttonId}-list`
  const optionId = (i: number) => `${buttonId}-opt-${i}`

  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const selectedIndex = options.findIndex(o => o.value === value)
  const [active, setActive] = useState(Math.max(selectedIndex, 0))
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typed = useRef({ text: '', at: 0 })

  const invalid = Boolean(aria['aria-invalid'])
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const openList = (index = Math.max(selectedIndex, 0)) => {
    if (disabled) return
    // Open upwards (like a native select) when there is not enough room below
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) {
      const below = window.innerHeight - rect.bottom
      setDropUp(below < LIST_MAX_HEIGHT && rect.top > below)
    }
    setActive(index)
    setOpen(true)
  }
  const choose = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    setOpen(false)
  }

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Keep the active option visible
  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const typeAhead = (char: string) => {
    const now = Date.now()
    typed.current = now - typed.current.at < 700 ? { text: typed.current.text + char, at: now } : { text: char, at: now }
    const search = typed.current.text.toLowerCase()
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const start = typed.current.text.length === 1 ? active + 1 : active
    for (let k = 0; k < options.length; k++) {
      const i = (start + k) % options.length
      if (norm(options[i].label).startsWith(norm(search))) return i
    }
    return -1
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        openList(e.key === 'Home' ? 0 : last)
      } else if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const i = typeAhead(e.key)
        if (i >= 0) openList(i)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive(a => Math.min(a + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive(a => Math.max(a - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'PageDown':
        e.preventDefault()
        setActive(a => Math.min(a + 10, last))
        break
      case 'PageUp':
        e.preventDefault()
        setActive(a => Math.max(a - 10, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        choose(active)
        break
      default:
        if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
          const i = typeAhead(e.key)
          if (i >= 0) setActive(i)
        }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={buttonId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-invalid={aria['aria-invalid'] || undefined}
        aria-describedby={aria['aria-describedby']}
        aria-required={aria['aria-required']}
        aria-label={aria['aria-label']}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-4 border-2 bg-white text-left shadow-sm ${md ? 'min-h-[44px] rounded-xl px-3 py-2 text-base' : 'min-h-[64px] rounded-2xl px-4 py-3 text-xl'} transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          invalid ? 'border-red-600 focus:border-red-600' : open ? 'border-primary' : 'border-slate-300 focus:border-primary'
        }`}
      >
        <span className={selected ? 'text-slate-900' : 'text-slate-500'}>{selected ? selected.label : placeholder}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`${md ? 'h-5 w-5' : 'h-7 w-7'} shrink-0 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          className={`absolute left-0 right-0 z-30 ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'} max-h-[22rem] overflow-y-auto ${md ? 'rounded-xl p-1' : 'rounded-2xl p-2'} border-2 border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]`}
        >
          {options.map((o, i) => {
            const isSelected = i === selectedIndex
            const isActive = i === active
            return (
              <li
                key={o.value || `empty-${i}`}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl ${md ? 'min-h-[44px] px-3 py-2 text-base' : 'min-h-[56px] px-4 py-3 text-xl'} ${
                  isActive ? 'bg-primary/10 text-slate-900' : 'text-slate-800'
                } ${isSelected ? 'font-semibold' : ''}`}
              >
                <span>
                  {o.label}
                  {o.hint && <span className={`block font-normal text-slate-600 ${md ? 'text-sm' : 'text-lg'}`}>{o.hint}</span>}
                </span>
                {isSelected && (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={`${md ? 'h-5 w-5' : 'h-7 w-7'} shrink-0 text-primary`}>
                    <path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
