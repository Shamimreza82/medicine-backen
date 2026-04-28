export interface LabTestSearchQuery {
  q?: string
  category?: string
  specimen?: string
  limit?: number
  page?: number
}

export interface LabTestDocument {
  name: string
  slug: string
  shortName?: string | null
  category: string
  description?: string | null
  specimen?: string | null
  preparation?: string | null
  normalRange?: string | null
  unit?: string | null
  isActive: boolean | string
  metadata?: Record<string, unknown> | string | null
}