import { LegalPageTemplate } from '../components/templates/LegalPageTemplate'
import { termsOfUse } from '../content/legal'

export default function TermosPage() {
  return <LegalPageTemplate document={termsOfUse} />
}
