import { describe, it, expect } from 'vitest'
import { formatBRLInput, formatSalaryRange, maskBRL, parseBRL } from './money'

describe('maskBRL', () => {
  it('digita centavos primeiro', () => {
    expect(maskBRL('5')).toBe('0,05')
    expect(maskBRL('500000')).toBe('5.000,00')
    expect(maskBRL('R$ 1.234,56')).toBe('1.234,56')
  })
  it('ignora zeros à esquerda e texto vazio', () => {
    expect(maskBRL('000')).toBe('')
    expect(maskBRL('abc')).toBe('')
    expect(maskBRL('0012')).toBe('0,12')
  })
  it('limita ao máximo aceito', () => {
    expect(maskBRL('99999999999999')).toBe('9.999.999,99')
  })
})

describe('parseBRL / formatBRLInput', () => {
  it('converte máscara em reais', () => {
    expect(parseBRL('5.000,50')).toBe(5000.5)
    expect(parseBRL('')).toBeNull()
  })
  it('formata número para o campo', () => {
    expect(formatBRLInput(5000)).toBe('5.000,00')
    expect(formatBRLInput(null)).toBe('')
  })
  it('ida e volta preserva o valor', () => {
    expect(parseBRL(formatBRLInput(3250.75))).toBe(3250.75)
  })
})

describe('formatSalaryRange', () => {
  it('monta a faixa como o candidato lê', () => {
    expect(formatSalaryRange(3000, 4500)).toBe('R$ 3.000 a R$ 4.500')
    expect(formatSalaryRange(3000, null)).toBe('A partir de R$ 3.000')
    expect(formatSalaryRange(null, 4500)).toBe('Até R$ 4.500')
    expect(formatSalaryRange(3000, 3000)).toBe('R$ 3.000')
    expect(formatSalaryRange(null, null)).toBeNull()
  })
  it('a combinar tem prioridade', () => {
    expect(formatSalaryRange(3000, 4000, true)).toBe('Salário a combinar')
  })
})
