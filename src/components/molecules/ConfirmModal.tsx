import { Button } from '../atoms/Button'
import { Heading } from '../atoms/Heading'

type Props = {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <Heading className="text-2xl">{title}</Heading>
        <p className="mt-3 text-slate-700">{message}</p>
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <Button variant="primary" className="w-full md:flex-1" onClick={onConfirm}>Confirmar</Button>
          <Button variant="secondary" className="w-full md:flex-1" onClick={onCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  )
}
