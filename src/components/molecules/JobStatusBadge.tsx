import { statusLabel } from '../../utils/jobLabels'

const TONES: Record<string, { box: string; dot: string }> = {
  open: { box: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  freeze: { box: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-500' },
  close: { box: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500' }
}

/** Compact status pill for the recruiter screens (Aberta / Congelada / Fechada). */
export function JobStatusBadge({ status }: { status: string }) {
  const tone = TONES[status] ?? TONES.close
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-sm font-semibold ${tone.box}`}>
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${tone.dot}`} />
      {statusLabel(status) || 'Sem status'}
    </span>
  )
}
