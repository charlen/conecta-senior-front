import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { CompanyForm } from '../components/organisms/CompanyForm'
import { PasswordChangeForm } from '../components/organisms/PasswordChangeForm'
import { RecruiterPageTemplate } from '../components/templates/RecruiterPageTemplate'
import { useAuth } from '../contexts/AuthContext'
import { companyJobsApi } from '../services/companyJobsApi'
import type { Company } from '../types/companyJob'

function Notice({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
      <span>{text}</span>
      <button type="button" onClick={onClose} aria-label="Fechar aviso"
        className="-my-1 h-8 w-8 shrink-0 rounded-lg text-lg leading-none hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer">×</button>
    </div>
  )
}

/** Company account: company data (`/companies/me`) and password. No candidate fields. */
export default function MinhaEmpresaPage() {
  const { userEmail } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [companyNotice, setCompanyNotice] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordKey, setPasswordKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setCompany(await companyJobsApi.getCompany())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não conseguimos carregar os dados da empresa.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <RecruiterPageTemplate current="/minha-empresa">
      <div className="mx-auto max-w-3xl">
        <a href="/minhas-vagas" className="text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-4 focus:ring-primary/30 rounded">
          ← Minhas vagas
        </a>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Dados da empresa</h1>
        <p className="mt-1 text-base text-slate-600">Informações exibidas nas suas vagas e acesso à conta.</p>

        <div className="mt-6 space-y-6">
          <section aria-labelledby="sec-company" className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm" data-testid="company-section">
            <h2 id="sec-company" className="text-lg font-bold text-slate-900">Empresa</h2>
            <p className="mt-1 mb-5 text-sm text-slate-600">
              {company || loading ? 'O nome aparece para os candidatos em cada vaga.' : 'Sua empresa ainda não tem cadastro. Preencha para começar a publicar vagas.'}
            </p>
            {companyNotice && <Notice text={companyNotice} onClose={() => setCompanyNotice('')} />}
            {loading && <div className="flex items-center gap-3 py-8 justify-center text-base text-slate-700"><Spinner /> Carregando…</div>}
            {!loading && error && (
              <div role="alert" className="space-y-3">
                <p className="text-base font-semibold text-red-800">{error}</p>
                <Button size="md" variant="secondary" onClick={() => void load()}>Tentar novamente</Button>
              </div>
            )}
            {!loading && !error && (
              <CompanyForm
                key={company?.id ?? 'new'}
                initial={company}
                submitLabel={company ? 'Salvar alterações' : 'Cadastrar empresa'}
                onSaved={c => {
                  setCompany(c)
                  setCompanyNotice('Dados da empresa salvos.')
                }}
              />
            )}
          </section>

          <section aria-labelledby="sec-account" className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm" data-testid="password-section">
            <h2 id="sec-account" className="text-lg font-bold text-slate-900">Acesso à conta</h2>
            <p className="mt-1 mb-5 text-sm text-slate-600">
              E-mail de acesso: <strong className="text-slate-900">{userEmail || '—'}</strong>
            </p>
            {passwordNotice && <Notice text={passwordNotice} onClose={() => setPasswordNotice('')} />}
            <h3 className="mb-4 text-base font-bold text-slate-900">Trocar senha</h3>
            <PasswordChangeForm
              key={passwordKey}
              size="md"
              hideCancel
              email={userEmail ?? ''}
              onCancel={() => setPasswordKey(k => k + 1)}
              onDone={() => {
                setPasswordKey(k => k + 1)
                setPasswordNotice('Senha trocada. Use a nova senha no próximo acesso.')
              }}
            />
          </section>
        </div>
      </div>
    </RecruiterPageTemplate>
  )
}
