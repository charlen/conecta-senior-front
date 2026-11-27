import type { JobModality, JobStatus, JobType } from '../types/companyJob'
import type { DropdownOption } from '../components/molecules/Dropdown'

const MODALITY_LABELS: Record<JobModality, string> = {
  presencial: 'Presencial',
  remoto: 'Remoto',
  hibrido: 'Híbrido'
}

const JOB_TYPE_LABELS: Record<Exclude<JobType, ''>, string> = {
  clt: 'CLT',
  pj: 'PJ',
  temporario: 'Temporário',
  voluntario: 'Voluntário'
}

const STATUS_LABELS: Record<JobStatus, string> = {
  open: 'Aberta',
  freeze: 'Congelada',
  close: 'Fechada'
}

/** Lowercase without accents, so "Híbrido", "HIBRIDO" and "hibrido" all match. */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Maps enum values and legacy free text ("Remoto", "Híbrido") to the enum, or null. */
export function toModality(value: string | null | undefined): JobModality | null {
  if (!value) return null
  const n = normalize(value)
  return n in MODALITY_LABELS ? (n as JobModality) : null
}

/** Maps enum values and legacy text ("CLT", "Temporário") to the enum; '' when unknown. */
export function toJobType(value: string | null | undefined): JobType {
  if (!value) return ''
  const n = normalize(value)
  return n in JOB_TYPE_LABELS ? (n as JobType) : ''
}

/** Friendly label for a modality; unknown legacy text is shown as it came. */
export function modalityLabel(value: string | null | undefined): string {
  if (!value) return ''
  const m = toModality(value)
  return m ? MODALITY_LABELS[m] : value.trim()
}

export function jobTypeLabel(value: string | null | undefined): string {
  if (!value) return ''
  const t = toJobType(value)
  return t ? JOB_TYPE_LABELS[t as Exclude<JobType, ''>] : value.trim()
}

export function statusLabel(value: string | null | undefined): string {
  if (!value) return ''
  return isJobStatus(value) ? STATUS_LABELS[value] : value
}

export function isJobStatus(value: string): value is JobStatus {
  return Object.prototype.hasOwnProperty.call(STATUS_LABELS, value)
}

export const MODALITY_OPTIONS: DropdownOption[] = [
  { value: 'presencial', label: 'Presencial', hint: 'No local de trabalho' },
  { value: 'remoto', label: 'Remoto', hint: 'De casa, sem deslocamento' },
  { value: 'hibrido', label: 'Híbrido', hint: 'Parte presencial, parte remoto' }
]

export const JOB_TYPE_OPTIONS: DropdownOption[] = [
  { value: '', label: 'Não informar' },
  { value: 'clt', label: 'CLT', hint: 'Carteira assinada' },
  { value: 'pj', label: 'PJ', hint: 'Prestação de serviço com CNPJ' },
  { value: 'temporario', label: 'Temporário', hint: 'Contrato por tempo determinado' },
  { value: 'voluntario', label: 'Voluntário', hint: 'Sem remuneração' }
]

export const STATUS_OPTIONS: DropdownOption[] = [
  { value: 'open', label: 'Aberta', hint: 'Visível para candidatos e recebendo candidaturas' },
  { value: 'freeze', label: 'Congelada', hint: 'Pausada: sai da busca, candidaturas mantidas' },
  { value: 'close', label: 'Fechada', hint: 'Encerrada: não recebe mais candidaturas' }
]

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' })

/** "27 de nov. de 2026" → compact "27 nov. 2026"; '' for invalid dates. */
export function formatJobDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return shortDate.format(d).replace(/ de /g, ' ')
}

/** "Nenhuma candidatura" / "1 candidatura" / "3 candidaturas" */
export function applicantsLabel(n: number): string {
  if (!n) return 'Nenhuma candidatura'
  return n === 1 ? '1 candidatura' : `${n} candidaturas`
}
