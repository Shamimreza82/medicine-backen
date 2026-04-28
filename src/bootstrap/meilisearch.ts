import { envConfig } from '@/config/env.config'


export async function getMeiliClient() {
  const { Meilisearch } = await import('meilisearch')

  return new Meilisearch({
    host: envConfig.meilisearchUrl || 'http://127.0.0.1:7700',
    apiKey: envConfig.meilisearchApiKey || 'masterKey',
  })
}

export async function getLabTestIndex() {
  const client = await getMeiliClient()
  return client.index('lab-tests')
}