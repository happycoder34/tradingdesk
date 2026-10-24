export type ProviderConfig = {
  id: string
  name: string
  apiKey: string
  endpoint: string
  enabled: boolean
}

export type SavedReport = {
  id: string
  ticker: string
  date: string
  rating: string
  decision: string
  analysts: string[]
  mode: 'concurrent' | 'sequential'
  timestamp: string
}

export type MarketPoint = {
  name: string
  price: number
  sentiment: number
  portfolio: number
}
