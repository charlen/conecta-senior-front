import type { ReactNode } from 'react'
import { Button } from '../atoms/Button'

type SummaryCardProps = {
  id: string
  title: string
  /** Shown as a red badge when a required item in this card is missing */
  missing?: boolean
  optional?: boolean
  onEdit?: () => void
  editLabel?: string
  children: ReactNode
}

/** Read-only summary block with a single "Alterar" action (GOV.UK "check answers" pattern). */
export function SummaryCard({ id, title, missing, optional, onEdit, editLabel = 'Alterar', children }: SummaryCardProps) {
  return (
    <section
      aria-labelledby={id}
      className={`rounded-3xl border-2 bg-white p-6 md:p-8 space-y-5 ${missing ? 'border-red-300' : 'border-slate-200'}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 id={id} className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
          {missing && (
            <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1 text-lg font-semibold text-red-800">
              <span aria-hidden="true">●</span> Falta preencher
            </p>
          )}
          {optional && !missing && <p className="text-lg text-slate-500">Opcional</p>}
        </div>
        {onEdit && (
          <Button type="button" variant="secondary" onClick={onEdit} aria-label={`${editLabel}: ${title}`}>
            {editLabel}
          </Button>
        )}
      </div>
      <div className="text-xl text-slate-800">{children}</div>
    </section>
  )
}

/** Label/value pair used inside summary cards. */
export function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1 py-2 md:grid-cols-[220px_1fr] md:gap-6 border-b border-slate-100 last:border-0">
      <dt className="font-semibold text-slate-600">{label}</dt>
      <dd className={value ? 'text-slate-900' : 'text-slate-400 italic'}>{value || 'Não informado'}</dd>
    </div>
  )
}
