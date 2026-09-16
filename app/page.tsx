'use client'

import React, { useState, useCallback } from 'react'
import { AuthProvider, LoginForm, RegisterForm, ProtectedRoute } from 'lyzr-architect/client'
import { callAIAgent, uploadFiles } from '@/lib/aiAgent'
import Sidebar from './sections/Sidebar'
import type { ScreenId } from './sections/Sidebar'
import RiskOverview from './sections/RiskOverview'
import AccountDrilldown from './sections/AccountDrilldown'
import SimulationPanel from './sections/SimulationPanel'
import ExecutiveSummary from './sections/ExecutiveSummary'
import AlertsTimeline from './sections/AlertsTimeline'
import FeedbackLearning from './sections/FeedbackLearning'

const ORCHESTRATOR_ID = '69ec559edcdea9592ddcd911'
const FEEDBACK_ID = '69ec55af25ead3c1187be94f'

const THEME_VARS = {
  '--background': '30 8% 6%',
  '--foreground': '30 8% 90%',
  '--card': '30 6% 10%',
  '--card-foreground': '30 8% 85%',
  '--primary': '40 50% 55%',
  '--primary-foreground': '30 8% 6%',
  '--secondary': '30 6% 14%',
  '--secondary-foreground': '30 8% 75%',
  '--muted': '30 4% 16%',
  '--muted-foreground': '30 8% 55%',
  '--accent': '40 50% 55%',
  '--accent-foreground': '30 8% 6%',
  '--destructive': '0 72% 51%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '30 4% 18%',
  '--input': '30 4% 18%',
  '--ring': '40 50% 55%',
  '--radius': '0rem',
} as React.CSSProperties

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function safeParseResult(result: any): any {
  if (!result) return null
  if (typeof result === 'string') {
    try { return JSON.parse(result) } catch { return null }
  }
  return result
}

const AUTH_THEME = {
  '--background': '30 8% 6%',
  '--foreground': '30 8% 90%',
  '--card': '30 6% 10%',
  '--card-foreground': '30 8% 85%',
  '--primary': '40 50% 55%',
  '--primary-foreground': '30 8% 6%',
  '--secondary': '30 6% 14%',
  '--secondary-foreground': '30 8% 75%',
  '--muted': '30 4% 16%',
  '--muted-foreground': '30 8% 55%',
  '--accent': '40 50% 55%',
  '--accent-foreground': '30 8% 6%',
  '--destructive': '0 72% 51%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '30 4% 18%',
  '--input': '30 4% 18%',
  '--ring': '40 50% 55%',
  '--radius': '0rem',
} as React.CSSProperties

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  return (
    <div style={AUTH_THEME} className="min-h-screen bg-background flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-10 border border-border bg-card rounded-none shadow-sm">
        <h1 className="text-2xl font-serif tracking-wider font-light text-foreground text-center mb-1">Omnisight</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Enterprise Intelligence Platform</p>
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}

interface OrchestratorData {
  dashboard_metrics?: any
  at_risk_accounts?: any[]
  pre_risk_alerts?: any[]
  financial_forecast?: any
  action_plans?: any[]
  simulation_comparison?: any
  executive_summary?: any
}

interface FeedbackData {
  overall_success_rate?: number
  total_interventions_analyzed?: number
  average_risk_reduction?: number
  confidence_trend?: string
  confidence_improvement?: number
  intervention_analysis?: any[]
  adjusted_impact_scores?: any[]
  recommendations?: string[]
}

const LOADING_MESSAGES = [
  'Analyzing data sources...',
  'Detecting pre-risk signals...',
  'Scoring confidence levels...',
  'Simulating action scenarios...',
  'Generating intelligence report...',
]

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('risk-overview')
  const [orchData, setOrchData] = useState<OrchestratorData | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [orchLoading, setOrchLoading] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [orchError, setOrchError] = useState<string | null>(null)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [sampleMode, setSampleMode] = useState(false)

  const cycleLoadingMessages = useCallback(() => {
    let idx = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[idx])
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleGenerateIntelligence = useCallback(async (assetIds?: string[]) => {
    setOrchLoading(true)
    setOrchError(null)
    const cleanup = cycleLoadingMessages()
    try {
      const message = 'Analyze all data sources and generate comprehensive enterprise risk intelligence including risk scores with confidence metadata, pre-risk alerts, financial forecasts, action plans with auto-execution simulations, and executive summary.'
      const options = assetIds && assetIds.length > 0 ? { assets: assetIds } : undefined
      const result = await callAIAgent(message, ORCHESTRATOR_ID, options)
      if (result.success) {
        const parsed = safeParseResult(result?.response?.result)
        if (parsed) {
          setOrchData(parsed)
          persistOrchestratorData(parsed)
        } else {
          setOrchError('Failed to parse orchestrator response')
        }
      } else {
        setOrchError(result?.error ?? 'Intelligence generation failed')
      }
    } catch (err: any) {
      setOrchError(err?.message ?? 'Unexpected error')
    } finally {
      cleanup()
      setOrchLoading(false)
      setLoadingMessage('')
    }
  }, [cycleLoadingMessages])

  const handleGenerateSummary = useCallback(async () => {
    setOrchLoading(true)
    setOrchError(null)
    const cleanup = cycleLoadingMessages()
    try {
      const message = 'Generate a boardroom-ready executive summary with top 5 insights, top 3 risks with severity and trajectory, and top 3 recommended actions ranked by impact.'
      const result = await callAIAgent(message, ORCHESTRATOR_ID)
      if (result.success) {
        const parsed = safeParseResult(result?.response?.result)
        if (parsed) {
          setOrchData(prev => ({ ...prev, ...parsed }))
          if (parsed.executive_summary) {
            persistExecutiveSummary(parsed.executive_summary)
          }
        }
      } else {
        setOrchError(result?.error ?? 'Summary generation failed')
      }
    } catch (err: any) {
      setOrchError(err?.message ?? 'Unexpected error')
    } finally {
      cleanup()
      setOrchLoading(false)
      setLoadingMessage('')
    }
  }, [cycleLoadingMessages])

  const handleAnalyzeOutcomes = useCallback(async () => {
    setFeedbackLoading(true)
    setFeedbackError(null)
    try {
      const message = 'Analyze all historical intervention outcomes. Evaluate success rates, recalibrate action impact scores and confidence levels, and generate a comprehensive feedback report with recommendations.'
      const result = await callAIAgent(message, FEEDBACK_ID)
      if (result.success) {
        const parsed = safeParseResult(result?.response?.result)
        if (parsed) {
          setFeedbackData(parsed)
          persistFeedbackReport(parsed)
        } else {
          setFeedbackError('Failed to parse feedback response')
        }
      } else {
        setFeedbackError(result?.error ?? 'Outcome analysis failed')
      }
    } catch (err: any) {
      setFeedbackError(err?.message ?? 'Unexpected error')
    } finally {
      setFeedbackLoading(false)
    }
  }, [])

  const handleUploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      const result = await uploadFiles(files)
      if (result.success) {
        return result.asset_ids ?? []
      }
      setOrchError(result?.error ?? 'Upload failed')
      return []
    } catch (err: any) {
      setOrchError(err?.message ?? 'Upload error')
      return []
    }
  }, [])

  const handleSelectAccount = useCallback((account: any) => {
    setSelectedAccount(account)
    setActiveScreen('account-drilldown')
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.reload()
    } catch {}
  }, [])

  return (
    <div style={THEME_VARS} className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} onLogout={handleLogout} />
      <main className="flex-1 h-screen overflow-hidden">
        {activeScreen === 'risk-overview' && (
          <RiskOverview data={orchData} loading={orchLoading} loadingMessage={loadingMessage} onGenerateIntelligence={handleGenerateIntelligence} onUploadFiles={handleUploadFiles} onSelectAccount={handleSelectAccount} sampleMode={sampleMode} onToggleSample={setSampleMode} error={orchError} />
        )}
        {activeScreen === 'account-drilldown' && (
          <AccountDrilldown account={selectedAccount} actionPlans={Array.isArray(orchData?.action_plans) ? orchData.action_plans : []} simulationComparison={orchData?.simulation_comparison ?? null} onBack={() => setActiveScreen('risk-overview')} />
        )}
        {activeScreen === 'simulation' && (
          <SimulationPanel simulationComparison={orchData?.simulation_comparison ?? null} sampleMode={sampleMode} />
        )}
        {activeScreen === 'executive-summary' && (
          <ExecutiveSummary executiveSummary={orchData?.executive_summary ?? null} loading={orchLoading} onGenerateSummary={handleGenerateSummary} sampleMode={sampleMode} />
        )}
        {activeScreen === 'alerts' && (
          <AlertsTimeline preRiskAlerts={Array.isArray(orchData?.pre_risk_alerts) ? orchData.pre_risk_alerts : []} actionPlans={Array.isArray(orchData?.action_plans) ? orchData.action_plans : []} sampleMode={sampleMode} />
        )}
        {activeScreen === 'feedback' && (
          <FeedbackLearning feedbackData={feedbackData} loading={feedbackLoading} onAnalyzeOutcomes={handleAnalyzeOutcomes} sampleMode={sampleMode} error={feedbackError} />
        )}
      </main>
    </div>
  )
}

async function persistOrchestratorData(data: any) {
  try {
    if (Array.isArray(data?.at_risk_accounts)) {
      for (const acc of data.at_risk_accounts) {
        await fetch('/api/risk-scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ account_name: acc?.account_name, risk_score: acc?.risk_score, confidence_pct: acc?.confidence_pct, churn_risk: acc?.churn_risk, workforce_risk: acc?.workforce_risk, revenue_impact: acc?.revenue_impact, trend_direction: acc?.trend_direction, rate_of_change: acc?.rate_of_change, data_sources_used: acc?.data_sources }) })
      }
    }
    if (Array.isArray(data?.pre_risk_alerts)) {
      for (const alert of data.pre_risk_alerts) {
        await fetch('/api/pre-risk-alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ account_name: alert?.account_name, signal_type: alert?.signal_type, severity: alert?.severity, confidence_pct: alert?.confidence_pct, data_sources_used: alert?.data_sources, message: alert?.message, trend_direction: alert?.trend_direction, rate_of_change: alert?.rate_of_change }) })
      }
    }
    if (data?.simulation_comparison) {
      await fetch('/api/simulation-runs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario_type: 'full_analysis', no_action_outcome: data.simulation_comparison.no_action, recommended_outcome: data.simulation_comparison.recommended, auto_execution_outcome: data.simulation_comparison.auto_execution }) })
    }
    if (Array.isArray(data?.action_plans)) {
      for (const action of data.action_plans) {
        await fetch('/api/action-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ account_name: action?.account_name, action_type: action?.action_type, description: action?.action_name, impact_score: action?.impact_score, confidence_pct: action?.confidence_pct, simulated_execution_outcome: action?.auto_execution, status: action?.auto_execution?.execution_status ?? 'pending' }) })
      }
    }
  } catch {}
}

async function persistExecutiveSummary(summary: any) {
  try {
    await fetch('/api/executive-summaries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ top_insights: summary?.top_insights ?? [], top_risks: summary?.top_risks ?? [], top_actions: summary?.top_actions ?? [] }) })
  } catch {}
}

async function persistFeedbackReport(data: any) {
  try {
    await fetch('/api/feedback-reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success_rate: data?.overall_success_rate, adjusted_scores: data?.adjusted_impact_scores ?? [], confidence_trend: data?.confidence_trend, recommendations: data?.recommendations ?? [] }) })
  } catch {}
}

export default function Page() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute unauthenticatedFallback={<AuthScreen />}>
          <AppContent />
        </ProtectedRoute>
      </AuthProvider>
    </ErrorBoundary>
  )
}
