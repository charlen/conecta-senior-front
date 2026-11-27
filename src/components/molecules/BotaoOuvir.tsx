import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

type BotaoOuvirProps = {
  ativo?: boolean
  onClick?: () => void
}

export function BotaoOuvir({ ativo, onClick }: BotaoOuvirProps) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className="px-4 py-3 text-lg"
      aria-pressed={ativo}
    >
      <Icon name="🔊" size={20} />
      <span className="ml-2">Ouvir pergunta</span>
    </Button>
  )
}
