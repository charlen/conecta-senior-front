import { LegalPageTemplate } from '../components/templates/LegalPageTemplate'
import { privacyPolicy } from '../content/legal'

export default function PrivacidadePage() {
  return <LegalPageTemplate document={privacyPolicy} />
}
