import { useState, type FormEvent } from 'react'
import { Button } from '../atoms/Button'
import { ProfileField, inputClass } from '../molecules/ProfileField'
import { companyJobsApi, CompanyApiError } from '../../services/companyJobsApi'
import type { Company, CompanyInput } from '../../types/companyJob'
import {
  cnpjDigits,
  COMPANY_FIELD_ORDER,
  firstErrorField,
  maskCNPJ,
  serverFieldErrors,
  validateCompany,
  type CompanyErrors
} from '../../utils/jobValidation'

type CompanyFormProps = {
  initial?: Company | null
  onSaved: (company: Company) => void
  submitLabel?: string
  /** Extra action next to the save button (e.g. "Voltar") */
  secondaryAction?: { label: string; onClick: () => void }
}

const fieldId = (f: keyof CompanyInput) => `company-${f}`

/** Company name, CNPJ and website, saved with `PUT /companies/me`. */
export function CompanyForm({ initial, onSaved, submitLabel = 'Salvar dados da empresa', secondaryAction }: CompanyFormProps) {
  const [values, setValues] = useState<CompanyInput>({
    company_name: initial?.company_name ?? '',
    cnpj: maskCNPJ(initial?.cnpj ?? ''),
    website: initial?.website ?? ''
  })
  const [errors, setErrors] = useState<CompanyErrors>({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (field: keyof CompanyInput, value: string) => {
    setValues(v => ({ ...v, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  const focusFirst = (errs: CompanyErrors) => {
    const first = firstErrorField(errs, COMPANY_FIELD_ORDER)
    if (first) document.getElementById(fieldId(first))?.focus()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    const errs = validateCompany(values)
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirst(errs)
    setSaving(true)
    try {
      const saved = await companyJobsApi.saveCompany({
        company_name: values.company_name.trim(),
        cnpj: cnpjDigits(values.cnpj),
        website: values.website.trim()
      })
      onSaved(saved)
    } catch (err) {
      if (err instanceof CompanyApiError && err.status === 422 && err.fields.length) {
        const server = serverFieldErrors(err.fields, COMPANY_FIELD_ORDER)
        setErrors(server)
        focusFirst(server)
      }
      setFormError(err instanceof Error ? err.message : 'Não conseguimos salvar os dados da empresa.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <ProfileField id={fieldId('company_name')} label="Nome da empresa" required size="md" error={errors.company_name}
        hint="Como os candidatos vão ver sua empresa nas vagas.">
        {a => (
          <input {...a} type="text" autoComplete="organization" maxLength={120} value={values.company_name}
            onChange={e => set('company_name', e.target.value)} className={inputClass(errors.company_name, 'md')} />
        )}
      </ProfileField>
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField id={fieldId('cnpj')} label="CNPJ" size="md" error={errors.cnpj}>
          {a => (
            <input {...a} type="text" inputMode="numeric" placeholder="00.000.000/0000-00" value={values.cnpj}
              onChange={e => set('cnpj', maskCNPJ(e.target.value))} className={inputClass(errors.cnpj, 'md')} />
          )}
        </ProfileField>
        <ProfileField id={fieldId('website')} label="Site" size="md" error={errors.website}>
          {a => (
            <input {...a} type="url" inputMode="url" autoComplete="url" placeholder="www.suaempresa.com.br" value={values.website}
              onChange={e => set('website', e.target.value)} className={inputClass(errors.website, 'md')} />
          )}
        </ProfileField>
      </div>
      {formError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{formError}</p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {secondaryAction && (
          <Button type="button" size="md" variant="secondary" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
        )}
        <Button type="submit" size="md" variant="primary" disabled={saving} aria-busy={saving}>
          {saving ? 'Salvando…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
