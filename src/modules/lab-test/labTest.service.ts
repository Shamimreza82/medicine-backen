import { getMeiliClient } from '@/bootstrap/meilisearch'

import type { LabTestSearchQuery } from './labTest.types'



export const LabTestService = {
  async searchLabTests(query: LabTestSearchQuery) {
    const q = query.q ?? ''
    const limit = query.limit ?? 10
    const page = query.page ?? 1
    const offset = (page - 1) * limit

    const meiliClient = await getMeiliClient()

    console.log(meiliClient)

    const index = meiliClient.index('lab-tests')

    const filters: string[] = []

    if (query.category) {
      filters.push(`category = "${query.category}"`)
    }

    if (query.specimen) {
      filters.push(`specimen = "${query.specimen}"`)
    }

    const result = await index.search(q, {
      limit,
      offset,
      filter: filters.length > 0 ? filters : undefined,
    })

    return {
      meta: {
        page,
        limit,
        total: result.estimatedTotalHits ?? 0,
        totalPages: Math.ceil((result.estimatedTotalHits ?? 0) / limit),
      },
      data: result.hits,
    }
  },
} 