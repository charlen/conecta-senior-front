import { describe, it, expect } from 'vitest'
import {
  checkSkill,
  EMPTY_JOB_FORM,
  firstErrorField,
  formToJobInput,
  JOB_FIELD_ORDER,
  jobToForm,
  maskCNPJ,
  serverFieldErrors,
  validateCompany,
  validateJob,
  type JobFormValues
} from './jobValidation'

const valid: JobFormValues = {
  ...EMPTY_JOB_FORM,
  title: 'Recepcionista',
  modality: 'presencial',
  description: 'Atender pacientes na recepção e organizar a agenda da clínica.',
  salaryMin: '3.000,00',
  salaryMax: '4.000,00'
}

describe('validateJob', () => {
  it('aceita uma vaga válida', () => {
    expect(validateJob(valid)).toEqual({})
  })
  it('exige título, modalidade e descrição mínima', () => {
    const e = validateJob(EMPTY_JOB_FORM)
    expect(e.title).toBeDefined()
    expect(e.modality).toBeDefined()
    expect(e.description).toBeDefined()
    expect(firstErrorField(e, JOB_FIELD_ORDER)).toBe('title')
  })
  it('limites do título', () => {
    expect(validateJob({ ...valid, title: 'ab' }).title).toMatch(/3/)
    expect(validateJob({ ...valid, title: 'a'.repeat(121) }).title).toMatch(/120/)
  })
  it('conta quanto falta na descrição', () => {
    expect(validateJob({ ...valid, description: 'a'.repeat(20) }).description).toMatch(/faltam 10/)
  })
  it('mínimo maior que máximo vira erro em salary_max', () => {
    const e = validateJob({ ...valid, salaryMin: '5.000,00', salaryMax: '4.000,00' })
    expect(e.salary_max).toBeDefined()
    expect(e.salary_min).toBeUndefined()
  })
  it('a combinar ignora os valores', () => {
    expect(validateJob({ ...valid, salaryMin: '5.000,00', salaryMax: '4.000,00', salaryNegotiable: true })).toEqual({})
  })
  it('limite de habilidades', () => {
    const many = Array.from({ length: 21 }, (_, i) => `skill${i}`)
    expect(validateJob({ ...valid, skills: many }).skills).toBeDefined()
  })
})

describe('checkSkill', () => {
  it('normaliza e rejeita duplicadas', () => {
    expect(checkSkill('  Excel   avançado ', [])).toEqual({ value: 'Excel avançado' })
    expect(checkSkill('excel', ['Excel'])).toHaveProperty('error')
    expect(checkSkill('a'.repeat(41), [])).toHaveProperty('error')
    expect(checkSkill('   ', [])).toEqual({ error: '' })
  })
})

describe('conversões', () => {
  it('formulário → body da API', () => {
    expect(formToJobInput(valid)).toEqual({
      title: 'Recepcionista',
      description: valid.description,
      location: '',
      modality: 'presencial',
      job_type: '',
      skills: [],
      salary_min: 3000,
      salary_max: 4000,
      salary_negotiable: false,
      status: 'open'
    })
    const neg = formToJobInput({ ...valid, salaryNegotiable: true })
    expect(neg.salary_min).toBeNull()
    expect(neg.salary_max).toBeNull()
  })
  it('vaga legada → formulário', () => {
    const f = jobToForm({ title: 'X', modality: 'Remoto', job_type: 'CLT', salary_min: 2500, status: 'weird' as 'open' })
    expect(f.modality).toBe('remoto')
    expect(f.job_type).toBe('clt')
    expect(f.salaryMin).toBe('2.500,00')
    expect(f.status).toBe('open')
  })
  it('erros 422 só para campos conhecidos', () => {
    expect(serverFieldErrors([{ field: 'title', message: 'curto' }, { field: 'foo', message: 'x' }], JOB_FIELD_ORDER)).toEqual({ title: 'curto' })
  })
})

describe('empresa', () => {
  it('máscara de CNPJ', () => {
    expect(maskCNPJ('12345678000199')).toBe('12.345.678/0001-99')
    expect(maskCNPJ('1234')).toBe('12.34')
  })
  it('valida nome, CNPJ e site', () => {
    expect(validateCompany({ company_name: '', cnpj: '', website: '' }).company_name).toBeDefined()
    expect(validateCompany({ company_name: 'ACME', cnpj: '123', website: '' }).cnpj).toBeDefined()
    expect(validateCompany({ company_name: 'ACME', cnpj: '', website: 'acme' }).website).toBeDefined()
    expect(validateCompany({ company_name: 'ACME', cnpj: '12.345.678/0001-99', website: 'https://acme.com.br' })).toEqual({})
  })
})
