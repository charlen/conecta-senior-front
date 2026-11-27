/** Contact link helpers for candidate cards (Brazilian phone numbers). */

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

/** tel: link, prefixed with +55 when the number has only DDD + number. */
export function telHref(phone: string): string | null {
  const digits = phoneDigits(phone)
  if (digits.length < 8) return null
  return digits.length === 10 || digits.length === 11 ? `tel:+55${digits}` : `tel:+${digits}`
}

/** wa.me link (WhatsApp needs country code + DDD + number). */
export function whatsappHref(phone: string, message?: string): string | null {
  const digits = phoneDigits(phone)
  let full: string
  if (digits.length === 10 || digits.length === 11) full = `55${digits}`
  else if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) full = digits
  else return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${full}${text}`
}

export function mailtoHref(email: string, subject?: string): string | null {
  if (!email || !email.includes('@')) return null
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
}
