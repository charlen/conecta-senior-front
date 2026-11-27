export type LegalSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export type LegalDocument = {
  title: string
  summary: string
  updatedAt: string
  sections: LegalSection[]
}
