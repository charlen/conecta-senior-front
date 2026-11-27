import { PageTemplate } from '../components/templates/PageTemplate'
import { ProfileReviewFlow } from '../components/organisms/ProfileReviewFlow'
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
  const pdfDraft = readJSON<Partial<CandidateProfile>>(PROFILE_DRAFT_KEY)

  const seed = (saved: CandidateProfile) => {
    if (pdfDraft) return profileApi.withDefaults(pdfDraft)
    if (wizardHasData(rascunho.perfil)) return mergeDraft(saved, fromWizardDraft(rascunho.perfil))
    return saved
  }

  const finish = () => {
    localStorage.removeItem(PROFILE_DRAFT_KEY)
    window.location.href = '/comecar/confirmado'
  }

  return (
    <PageTemplate>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Confira seu perfil</h1>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            {pdfDraft
              ? 'Estas informações vieram do seu currículo. Confira cada parte e toque em Alterar se algo estiver errado.'
              : 'Confira cada parte e toque em Alterar se algo estiver errado.'}
          </p>
        </header>

        {ai?.resume?.profile_summary && (
          <section className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-6 md:p-8 space-y-3" aria-labelledby="sec-ia">
            <h2 id="sec-ia" className="text-2xl font-bold text-slate-900">O que entendemos do seu currículo</h2>
            <p className="text-xl leading-relaxed text-slate-800">{ai.resume.profile_summary}</p>
          </section>
        )}

        <ProfileReviewFlow mode="onboarding" seed={seed} onFinish={finish} />
      </div>
    </PageTemplate>
  )
}
