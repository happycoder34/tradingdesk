import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  Cpu,
  FolderOpen,
  History,
  KeyRound,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { defaultProviderConfig, mockHistory, mockMarketData } from './data/mockData'
import type { ProviderConfig, SavedReport } from './types'

const STORAGE_KEYS = {
  providers: 'tradingagents.providers',
  history: 'tradingagents.history',
}

const initialReport: SavedReport = {
  id: 'generated',
  ticker: 'NVDA',
  date: '2026-10-24',
  rating: 'Overweight',
  decision: 'Bias remains constructive while keeping risk tightly controlled around near-term volatility.',
  analysts: ['market', 'news', 'fundamentals'],
  mode: 'concurrent',
  timestamp: new Date().toISOString(),
}

function App() {
  const [providers, setProviders] = useState<ProviderConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.providers)
    return saved ? JSON.parse(saved) : defaultProviderConfig
  })
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.history)
    return saved ? JSON.parse(saved) : mockHistory
  })
  const [selectedTicker, setSelectedTicker] = useState('NVDA')
  const [selectedAnalysts, setSelectedAnalysts] = useState(['market', 'news', 'fundamentals'])
  const [selectedMode, setSelectedMode] = useState<'concurrent' | 'sequential'>('concurrent')
  const [activePanel, setActivePanel] = useState('overview')
  const [currentRun, setCurrentRun] = useState<SavedReport>(initialReport)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.providers, JSON.stringify(providers))
  }, [providers])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(savedReports))
  }, [savedReports])

  const updateProvider = (id: string, field: keyof ProviderConfig, value: string | boolean) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === id ? { ...provider, [field]: value } : provider,
      ),
    )
  }

  const saveCurrentReport = () => {
    const next = {
      ...currentRun,
      id: crypto.randomUUID(),
      ticker: selectedTicker,
      date: new Date().toISOString().slice(0, 10),
      analysts: selectedAnalysts,
      mode: selectedMode,
      timestamp: new Date().toISOString(),
    }
    setSavedReports((items) => [next, ...items].slice(0, 8))
    setCurrentRun(next)
  }

  const portfolioStats = useMemo(
    () => [
      { label: 'Portfolio Value', value: '$198.6K', delta: '+8.2%', accent: '#22c55e' },
      { label: 'Win Rate', value: '64.3%', delta: '+4.7%', accent: '#38bdf8' },
      { label: 'Sharpe Ratio', value: '1.82', delta: '+0.19', accent: '#f59e0b' },
      { label: 'Exposure', value: '42.1%', delta: '+2.8%', accent: '#a78bfa' },
    ],
    [],
  )

  const pieData = [
    { name: 'Equity', value: 42 },
    { name: 'Macro', value: 26 },
    { name: 'Credit', value: 18 },
    { name: 'Cash', value: 14 },
  ]

  const sentimentScores = [
    { name: 'Bullish', value: 78 },
    { name: 'Neutral', value: 18 },
    { name: 'Bearish', value: 12 },
  ]

  const navItems = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'history', label: 'History', icon: History },
    { key: 'providers', label: 'Providers', icon: KeyRound },
    { key: 'reports', label: 'Reports', icon: FolderOpen },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">TA</div>
          <div>
            <div className="eyebrow">Portfolio OS</div>
            <h1>TradingAgents</h1>
          </div>
        </div>

        <nav className="nav">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={activePanel === key ? 'nav-item active' : 'nav-item'}
              onClick={() => setActivePanel(key)}
              type="button"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="sidebar-card-top">
            <ShieldCheck size={18} />
            <span>System health</span>
          </div>
          <strong>Nominal</strong>
          <small>All provider checks passing</small>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <div className="eyebrow">Portfolio dashboard</div>
            <h2>Global market intelligence</h2>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" type="button">
              <Bell size={15} />
              Alerts
            </button>
            <button className="primary-button" type="button" onClick={saveCurrentReport}>
              <RefreshCw size={15} />
              Save report
            </button>
          </div>
        </header>

        <section className="metrics-row">
          {portfolioStats.map((item) => (
            <div key={item.label} className="metric-card">
              <div className="metric-header">
                <span>{item.label}</span>
                <span className="metric-dot" style={{ background: item.accent }} />
              </div>
              <div className="metric-value">{item.value}</div>
              <div className="metric-delta" style={{ color: item.accent }}>{item.delta}</div>
            </div>
          ))}
        </section>

        {activePanel === 'overview' && (
          <>
            <section className="charts-grid">
              <div className="panel large-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Trend</span>
                    <h3>Portfolio performance</h3>
                  </div>
                  <button type="button" className="badge-button">
                    <TrendingUp size={14} />
                    Growth
                  </button>
                </div>
                <div className="chart-wrap chart-large">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockMarketData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.08} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24405f" />
                      <XAxis dataKey="name" stroke="#9fb6ca" />
                      <YAxis stroke="#9fb6ca" />
                      <Tooltip />
                      <Area type="monotone" dataKey="portfolio" stroke="#38bdf8" fill="url(#colorPrice)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Allocation</span>
                    <h3>Risk mix</h3>
                  </div>
                </div>
                <div className="chart-wrap small-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={38} outerRadius={65} paddingAngle={5} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="lower-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Signal</span>
                    <h3>Sentiment</h3>
                  </div>
                </div>
                <div className="chart-wrap chart-medium">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentScores}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24405f" />
                      <XAxis dataKey="name" stroke="#9fb6ca" />
                      <YAxis stroke="#9fb6ca" />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">Decision</span>
                    <h3>Live run</h3>
                  </div>
                </div>
                <div className="run-form">
                  <label>
                    Ticker
                    <input value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value.toUpperCase())} />
                  </label>
                  <label>
                    Analysts
                    <select
                      multiple
                      value={selectedAnalysts}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, (option) => option.value)
                        setSelectedAnalysts(values)
                      }}
                    >
                      <option value="market">Market</option>
                      <option value="news">News</option>
                      <option value="social">Social</option>
                      <option value="fundamentals">Fundamentals</option>
                    </select>
                  </label>
                  <label>
                    Execution mode
                    <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value as 'concurrent' | 'sequential')}>
                      <option value="concurrent">Concurrent</option>
                      <option value="sequential">Sequential</option>
                    </select>
                  </label>
                  <button className="primary-button fit" type="button" onClick={saveCurrentReport}>
                    <CheckCircle2 size={16} />
                    Save decision snapshot
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activePanel === 'history' && (
          <section className="panel history-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Archive</span>
                <h3>Saved report history</h3>
              </div>
            </div>
            <div className="history-list">
              {savedReports.map((report) => (
                <div className="history-item" key={report.id}>
                  <div className="history-main">
                    <div className="ticker-pill">{report.ticker}</div>
                    <div>
                      <strong>{report.rating}</strong>
                      <p>{report.decision}</p>
                    </div>
                  </div>
                  <div className="history-meta">
                    <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                    <span>{report.mode}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePanel === 'providers' && (
          <section className="panel provider-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Settings</span>
                <h3>Provider and API keys</h3>
              </div>
            </div>
            <div className="provider-list">
              {providers.map((provider) => (
                <div className="provider-item" key={provider.id}>
                  <div className="provider-topline">
                    <div className="toggle-row">
                      <input
                        type="checkbox"
                        checked={provider.enabled}
                        onChange={(e) => updateProvider(provider.id, 'enabled', e.target.checked)}
                      />
                      <span>{provider.name}</span>
                    </div>
                    <Settings size={15} />
                  </div>
                  <label>
                    API key
                    <input
                      type="password"
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(provider.id, 'apiKey', e.target.value)}
                      placeholder="sk-..."
                    />
                  </label>
                  <label>
                    Endpoint
                    <input
                      value={provider.endpoint}
                      onChange={(e) => updateProvider(provider.id, 'endpoint', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>
        )}

        {activePanel === 'reports' && (
          <section className="panel report-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Snapshot</span>
                <h3>Current report</h3>
              </div>
            </div>
            <div className="report-card">
              <div className="report-headline">
                <div>
                  <span className="eyebrow">Ticker</span>
                  <h4>{currentRun.ticker}</h4>
                </div>
                <div className="rating-badge">{currentRun.rating}</div>
              </div>
              <p>{currentRun.decision}</p>
              <div className="report-metadata">
                <span>{currentRun.date}</span>
                <span>{currentRun.mode}</span>
                <span>{currentRun.analysts.join(', ')}</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
