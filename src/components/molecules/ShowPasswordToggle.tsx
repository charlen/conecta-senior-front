type ShowPasswordToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function ShowPasswordToggle({ checked, onChange, label = 'Mostrar a senha' }: ShowPasswordToggleProps) {
  return (
    <label className="flex min-h-[56px] cursor-pointer items-center gap-4 text-xl text-slate-800">
      <input type="checkbox" className="h-7 w-7 cursor-pointer accent-primary" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  )
}
