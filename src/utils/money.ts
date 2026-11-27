/** BRL helpers for the salary inputs (amounts in reais, typed cents-first). */

const grouped = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** Max amount accepted by the mask: R$ 9.999.999,99 */
const MAX_CENTS = 999_999_999

/** Intl uses non-breaking spaces; normalize so outputs are stable in tests and the DOM. */
const plainSpaces = (s: string) => s.replace(/\u00a0|\u202f/g, ' ')

/**
 * Masks what the user typed, cents-first ("5" → "0,05", "500000" → "5.000,00").
 * Returns '' when there are no digits.
 */
export function maskBRL(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '')
  if (!digits) return ''
  const cents = Math.min(Number(digits), MAX_CENTS)
  return grouped.format(cents / 100)
}

/** Parses a masked value ("5.000,50") into reais (5000.5); null when empty. */
export function parseBRL(masked: string): number | null {
  const digits = masked.replace(/\D/g, '')
  if (!digits) return null
  return Number(digits) / 100
}

/** Formats reais for the masked input (5000 → "5.000,00"); '' for null. */
export function formatBRLInput(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return ''
  return grouped.format(value)
}

/** "R$ 5.000" — compact display without cents. */
export function formatCurrency(value: number): string {
  return plainSpaces(currency.format(value))
}

/** Salary as candidates read it, or null when there is nothing to show. */
export function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  negotiable = false
): string | null {
  if (negotiable) return 'Salário a combinar'
  if (min != null && max != null) return min === max ? formatCurrency(min) : `${formatCurrency(min)} a ${formatCurrency(max)}`
  if (min != null) return `A partir de ${formatCurrency(min)}`
  if (max != null) return `Até ${formatCurrency(max)}`
  return null
}
