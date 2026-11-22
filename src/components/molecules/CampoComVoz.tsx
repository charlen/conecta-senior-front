import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

type CampoComVozProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onFalar?: () => void
}

export function CampoComVoz({ id, label, value, onChange, onFalar }: CampoComVozProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xl font-medium text-text-primary">{label}</label>
      <div className="flex gap-3">
        <Input id={id} value={value} onChange={e => onChange(e.target.value)} />
        <Button variant="secondary" onClick={onFalar} className="px-4 py-3 text-lg">
          <Icon name="🎤" size={20} />
          <span className="ml-2">Falar</span>
        </Button>
      </div>
    </div>
  )
}
