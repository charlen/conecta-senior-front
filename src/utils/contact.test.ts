import { describe, it, expect } from 'vitest'
import { mailtoHref, telHref, whatsappHref } from './contact'

describe('contact links', () => {
  it('monta tel: com +55 para DDD + número', () => {
    expect(telHref('(19) 99999-1111')).toBe('tel:+5519999991111')
    expect(telHref('+55 19 3333-4444')).toBe('tel:+551933334444')
    expect(telHref('123')).toBeNull()
  })

  it('monta wa.me com código do país', () => {
    expect(whatsappHref('(81) 98888-2222')).toBe('https://wa.me/5581988882222')
    expect(whatsappHref('55 81 98888-2222', 'Olá')).toBe('https://wa.me/5581988882222?text=Ol%C3%A1')
    expect(whatsappHref('')).toBeNull()
  })

  it('monta mailto: só com e-mail válido', () => {
    expect(mailtoHref('maria@ex.com', 'Vaga')).toBe('mailto:maria@ex.com?subject=Vaga')
    expect(mailtoHref('')).toBeNull()
  })
})
