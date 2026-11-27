import { describe, it, expect } from 'vitest'
import { applicantsLabel, formatJobDate, jobTypeLabel, modalityLabel, statusLabel, toJobType, toModality } from './jobLabels'

describe('rótulos de enums', () => {
  it('modalidade: enum e texto legado', () => {
    expect(modalityLabel('hibrido')).toBe('Híbrido')
    expect(modalityLabel('Híbrido')).toBe('Híbrido')
    expect(modalityLabel('Remoto')).toBe('Remoto')
    expect(modalityLabel('PRESENCIAL')).toBe('Presencial')
    expect(modalityLabel('Meio período')).toBe('Meio período')
    expect(modalityLabel('')).toBe('')
    expect(toModality('Remoto')).toBe('remoto')
    expect(toModality('qualquer')).toBeNull()
  })
  it('tipo de contratação', () => {
    expect(jobTypeLabel('clt')).toBe('CLT')
    expect(jobTypeLabel('temporario')).toBe('Temporário')
    expect(jobTypeLabel('Voluntário')).toBe('Voluntário')
    expect(jobTypeLabel('')).toBe('')
    expect(toJobType('PJ')).toBe('pj')
    expect(toJobType('estágio')).toBe('')
  })
  it('status', () => {
    expect(statusLabel('open')).toBe('Aberta')
    expect(statusLabel('freeze')).toBe('Congelada')
    expect(statusLabel('close')).toBe('Fechada')
    expect(statusLabel('toString')).toBe('toString')
  })
})

describe('formatação', () => {
  it('data curta em pt-BR', () => {
    expect(formatJobDate('2026-11-20T15:00:00Z')).toBe('20 nov. 2026')
    expect(formatJobDate('invalida')).toBe('')
    expect(formatJobDate('')).toBe('')
  })
  it('candidaturas no singular/plural', () => {
    expect(applicantsLabel(0)).toBe('Nenhuma candidatura')
    expect(applicantsLabel(1)).toBe('1 candidatura')
    expect(applicantsLabel(4)).toBe('4 candidaturas')
  })
})
