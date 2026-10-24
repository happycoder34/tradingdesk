import type { MarketPoint, SavedReport } from '../types'

export const mockMarketData: MarketPoint[] = [
  { name: 'Jan', price: 118, sentiment: 24, portfolio: 15400 },
  { name: 'Feb', price: 122, sentiment: 38, portfolio: 15750 },
  { name: 'Mar', price: 128, sentiment: 44, portfolio: 16120 },
  { name: 'Apr', price: 134, sentiment: 52, portfolio: 16510 },
  { name: 'May', price: 138, sentiment: 58, portfolio: 17150 },
  { name: 'Jun', price: 144, sentiment: 62, portfolio: 17780 },
  { name: 'Jul', price: 148, sentiment: 66, portfolio: 18240 },
  { name: 'Aug', price: 151, sentiment: 69, portfolio: 18680 },
  { name: 'Sep', price: 159, sentiment: 72, portfolio: 19040 },
  { name: 'Oct', price: 165, sentiment: 78, portfolio: 19860 },
]

export const mockHistory: SavedReport[] = [
  {
    id: 'rpt-1001',
    ticker: 'NVDA',
    date: '2026-10-21',
    rating: 'Buy',
    decision: 'Accumulate on pullbacks with a tight stop below the 20d moving average.',
    analysts: ['market', 'news', 'fundamentals'],
    mode: 'concurrent',
    timestamp: '2026-10-21T09:42:00Z',
  },
  {
    id: 'rpt-1002',
    ticker: 'AAPL',
    date: '2026-10-18',
    rating: 'Hold',
    decision: 'Wait for stronger confirmation on earnings and China shipment momentum.',
    analysts: ['market', 'social'],
    mode: 'sequential',
    timestamp: '2026-10-18T16:15:00Z',
  },
  {
    id: 'rpt-1003',
    ticker: 'MSFT',
    date: '2026-10-15',
    rating: 'Overweight',
    decision: 'Maintain a modest overweight with diversified exposure to AI demand.',
    analysts: ['market', 'news', 'fundamentals', 'social'],
    mode: 'concurrent',
    timestamp: '2026-10-15T08:05:00Z',
  },
]

export const defaultProviderConfig = [
  { id: 'openai', name: 'OpenAI', apiKey: '', endpoint: 'https://api.openai.com/v1', enabled: true },
  { id: 'google', name: 'Google', apiKey: '', endpoint: 'https://generativelanguage.googleapis.com', enabled: false },
  { id: 'anthropic', name: 'Anthropic', apiKey: '', endpoint: 'https://api.anthropic.com', enabled: false },
  { id: 'ollama', name: 'Ollama', apiKey: '', endpoint: 'http://localhost:11434/v1', enabled: false },
]
