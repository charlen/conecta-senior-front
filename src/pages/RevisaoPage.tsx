import { PageTemplate } from '../components/templates/PageTemplate'
import { ProfileEditor } from '../components/organisms/ProfileEditor'
import { Alerta } from '../components/molecules/Alerta'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { useCandidateProfile } from '../hooks/useCandidateProfile'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'
import { PROFILE_DRAFT_KEY, fromWizardDraft, mergeDraft, wizardHasData } from '../utils/profileMapping'
import { profileApi } from '../services/profileApi'
import type { CandidateProfile } from '../types/candidate'
import type { ResumeResponse } from '../types/resume'

const RESUME_AI_KEY = 'cs_resume_ai'

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export default function RevisaoPage() {
  const { rascunho } = useRascunhoPerfil()
  const ai = readJSON<ResumeResponse>(RESUME_AI_KEY)

  const { profile, setProfile, errors, status, message, save } = useCandidateProfile(saved => {
    const pdfDraft = readJSON<Partial<CandidateProfile>>(PROFILE_DRAFT_KEY)
    if (pdfDraft) return profileApi.withDefaults(pdfDraft)
    if (wizardHasData(rascunho.perfil)) return mergeDraft(saved, fromWizardDraft(rascunho.perfil))
    return saved
  })

  const confirmar = async () => {
    if (await save()) {
      localStorage.removeItem(PROFILE_DRAFT_KEY)
      window.location.href = '/comecar/confirmado'
    }
  }

  return (
    <PageTemplate>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Confira seu perfil</h1>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            Veja se está tudo certo. Você pode corrigir qualquer informação antes de salvar.
          </p>
        </header>

        {status === 'loading' && (
          <div className="flex items-center gap-4 text-xl" role="status"><Spinner /> Carregando seus dados...</div>
        )}

        {message && <Alerta tipo="erro">{message}</Alerta>}

        {ai?.resume?.profile_summary && (
          <section className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-6 md:p-8 space-y-3" aria-labelledby="sec-ia">
            <h2 id="sec-ia" className="text-2xl font-bold text-slate-900">O que entendemos do seu currículo</h2>
            <p className="text-xl leading-relaxed text-slate-800">{ai.resume.profile_summary}</p>
            {ai.resume.value_proposition && <p className="text-xl leading-relaxed text-slate-700">{ai.resume.value_proposition}</p>}
          </section>
        )}

        {profile && <ProfileEditor value={profile} onChange={setProfile} errors={errors} />}

        <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
          <Button variant="secondary" onClick={() => window.history.back()}>Voltar</Button>
          <Button variant="primary" onClick={confirmar} disabled={!profile || status === 'saving'}>
            {status === 'saving' ? 'Salvando...' : 'Salvar meu perfil'}
          </Button>
        </div>
      </div>
    </PageTemplate>
  )
}
