'use client'

import React, { useRef } from 'react'
import { Shield, DollarSign, Users, Activity, AlertTriangle, Upload, Zap, Database, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface OrchestratorData {
  dashboard_metrics?: any
  at_risk_accounts?: any[]
  pre_risk_alerts?: any[]
  financial_forecast?: any
  action_plans?: any[]
  simulation_comparison?: any
  executive_summary?: any
}

interface RiskOverviewProps {
  data: OrchestratorData | null
  loading: boolean
  loadingMessage: string
  onGenerateIntelligence: (assetIds?: string[]) => void
  onUploadFiles: (files: File[]) => Promise<string[]>
  onSelectAccount: (account: any) => void
  sampleMode: boolean
  onToggleSample: (v: boolean) => void
  error: string | null
}

const SAMPLE_DATA: OrchestratorData = {
  dashboard_metrics: {
    overall_risk_score: 72,
    overall_risk_confidence: 87,
    revenue_at_risk: 2450000,
    revenue_confidence: 82,
    churn_probability: 34,
    churn_confidence: 79,
    workforce_stability: 68,
    workforce_confidence: 75,
    pre_risk_signal_count: 14,
    data_sources: ['CRM', 'HRIS', 'Finance', 'Support Tickets', 'NPS Surveys'],
  },
  at_risk_accounts: [
    { account_name: 'Meridian Corp', risk_score: 85, confidence_pct: 91, data_sources: ['CRM', 'Finance'], trend_direction: 'worsening', rate_of_change: 12, churn_risk: 'High', workforce_risk: 'Medium', revenue_impact: 850000 },
    { account_name: 'Atlas Industries', risk_score: 72, confidence_pct: 84, data_sources: ['HRIS', 'Support'], trend_direction: 'stable', rate_of_change: 2, churn_risk: 'Medium', workforce_risk: 'High', revenue_impact: 620000 },
    { account_name: 'Pinnacle Systems', risk_score: 68, confidence_pct: 77, data_sources: ['CRM', 'NPS'], trend_direction: 'improving', rate_of_change: -5, churn_risk: 'Medium', workforce_risk: 'Low', revenue_impact: 340000 },
  ],
  pre_risk_alerts: [
    { account_name: 'Meridian Corp', signal_type: 'Support Volume Spike', severity: 'high', confidence_pct: 89, data_sources: ['Support Tickets'], message: 'Support ticket volume increased 340% in the last 14 days', trend_direction: 'worsening', rate_of_change: 340 },
    { account_name: 'Atlas Industries', signal_type: 'Key Personnel Departure', severity: 'medium', confidence_pct: 76, data_sources: ['HRIS'], message: 'VP of Operations submitted resignation notice', trend_direction: 'worsening', rate_of_change: 0 },
  ],
  financial_forecast: {
    best_case_revenue: 12800000, expected_revenue: 10200000, worst_case_revenue: 7600000, confidence_pct: 81,
    projections: [
      { period: 'Q2 2026', revenue: 10200000, confidence: 81 },
      { period: 'Q3 2026', revenue: 10800000, confidence: 74 },
      { period: 'Q4 2026', revenue: 11400000, confidence: 68 },
    ],
  },
}

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

function TrendIcon({ direction }: { direction?: string }) {
  if (direction === 'worsening') return <TrendingDown className="w-3.5 h-3.5 text-destructive" />
  if (direction === 'improving') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
  return <Activity className="w-3.5 h-3.5 text-muted-foreground" />
}

function SeverityBadge({ severity }: { severity?: string }) {
  const s = (severity ?? '').toLowerCase()
  if (s === 'high' || s === 'critical') return <Badge variant="destructive" className="text-xs rounded-none">{severity}</Badge>
  if (s === 'medium') return <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30 text-xs rounded-none">{severity}</Badge>
  return <Badge variant="secondary" className="text-xs rounded-none">{severity ?? 'low'}</Badge>
}

export default function RiskOverview({ data, loading, loadingMessage, onGenerateIntelligence, onUploadFiles, onSelectAccount, sampleMode, onToggleSample, error }: RiskOverviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayData = sampleMode ? SAMPLE_DATA : data
  const metrics = displayData?.dashboard_metrics
  const accounts = Array.isArray(displayData?.at_risk_accounts) ? displayData.at_risk_accounts : []
  const alerts = Array.isArray(displayData?.pre_risk_alerts) ? displayData.pre_risk_alerts : []
  const forecast = displayData?.financial_forecast
  const dataSources = Array.isArray(metrics?.data_sources) ? metrics.data_sources : []

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fileArr = Array.from(files)
    const assetIds = await onUploadFiles(fileArr)
    if (assetIds.length > 0) {
      onGenerateIntelligence(assetIds)
    }
  }

  const metricTiles = [
    { label: 'Overall Risk', value: metrics?.overall_risk_score ?? '--', confidence: metrics?.overall_risk_confidence, icon: <Shield className="w-5 h-5" />, unit: '%' },
    { label: 'Revenue at Risk', value: metrics?.revenue_at_risk ? formatCurrency(metrics.revenue_at_risk) : '--', confidence: metrics?.revenue_confidence, icon: <DollarSign className="w-5 h-5" />, unit: '' },
    { label: 'Churn Probability', value: metrics?.churn_probability ?? '--', confidence: metrics?.churn_confidence, icon: <AlertTriangle className="w-5 h-5" />, unit: '%' },
    { label: 'Workforce Stability', value: metrics?.workforce_stability ?? '--', confidence: metrics?.workforce_confidence, icon: <Users className="w-5 h-5" />, unit: '%' },
    { label: 'Pre-Risk Signals', value: metrics?.pre_risk_signal_count ?? '--', confidence: null, icon: <Activity className="w-5 h-5" />, unit: '' },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif tracking-wider font-light text-foreground">Risk Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">Unified intelligence dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={onToggleSample} />
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground">Sample Data</Label>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} accept=".csv,.xlsx,.json,.pdf" />
            <Button variant="outline" size="sm" className="gap-2 border-border rounded-none" onClick={() => fileInputRef.current?.click()} disabled={loading}>
              <Upload className="w-4 h-4" /> Upload Data
            </Button>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none" onClick={() => onGenerateIntelligence()} disabled={loading}>
              <Zap className="w-4 h-4" /> Generate Intelligence
            </Button>
          </div>
        </div>

        {error && <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-sm rounded-none">{error}</div>}

        {loading && (
          <Card className="border-primary/20 bg-primary/5 rounded-none">
            <CardContent className="py-6 flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-sm text-foreground">{loadingMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a few minutes...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {dataSources.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Database className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Sources:</span>
            {dataSources.map((src: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs border-primary/30 text-primary rounded-none">{src}</Badge>
            ))}
          </div>
        )}

        {!displayData && !loading ? (
          <Card className="border-border rounded-none">
            <CardContent className="py-16 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-serif tracking-wider font-light text-foreground mb-2">No Intelligence Data</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Upload your data sources or click Generate Intelligence to activate the Orchestrator Agent and analyze your enterprise risk landscape.</p>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none" onClick={() => onGenerateIntelligence()}>
                <Zap className="w-4 h-4" /> Generate Intelligence
              </Button>
            </CardContent>
          </Card>
        ) : loading && !displayData ? (
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-none" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {metricTiles.map((m, i) => (
                <Card key={i} className="border-border rounded-none shadow-sm bg-card">
                  <CardContent className="pt-4 pb-4 px-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">{m.icon}</span>
                      {m.confidence != null && <Badge variant="outline" className="text-xs border-primary/30 text-primary rounded-none">Confidence: {m.confidence}%</Badge>}
                    </div>
                    <p className="text-2xl font-medium text-foreground">{m.value}{m.unit && typeof m.value === 'number' ? m.unit : ''}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {forecast && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Best Case', value: forecast.best_case_revenue, color: 'text-emerald-500' },
                  { label: 'Expected', value: forecast.expected_revenue, color: 'text-foreground' },
                  { label: 'Worst Case', value: forecast.worst_case_revenue, color: 'text-destructive' },
                ].map((f, i) => (
                  <Card key={i} className="border-border rounded-none shadow-sm bg-card">
                    <CardContent className="py-4 px-4">
                      <p className="text-xs text-muted-foreground mb-1">{f.label} Revenue</p>
                      <p className={`text-xl font-medium ${f.color}`}>{f.value ? formatCurrency(f.value) : '--'}</p>
                      {forecast.confidence_pct && <Badge variant="outline" className="text-xs mt-2 border-primary/30 text-primary rounded-none">{forecast.confidence_pct}% confidence</Badge>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-border rounded-none shadow-sm bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">At-Risk Accounts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {accounts.length === 0 ? (
                      <p className="p-6 text-sm text-muted-foreground text-center">No at-risk accounts detected</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Account</TableHead>
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Risk</TableHead>
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Conf.</TableHead>
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Trend</TableHead>
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Revenue Impact</TableHead>
                            <TableHead className="text-xs font-medium uppercase text-muted-foreground">Sources</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {accounts.map((acc, i) => (
                            <TableRow key={i} className="border-border cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => onSelectAccount(acc)}>
                              <TableCell className="font-medium text-sm text-card-foreground">{acc?.account_name ?? '--'}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-card-foreground">{acc?.risk_score ?? '--'}</span>
                                  <Progress value={acc?.risk_score ?? 0} className="w-16 h-1.5" />
                                </div>
                              </TableCell>
                              <TableCell><Badge variant="outline" className="text-xs border-primary/30 text-primary rounded-none">{acc?.confidence_pct ?? '--'}%</Badge></TableCell>
                              <TableCell><div className="flex items-center gap-1"><TrendIcon direction={acc?.trend_direction} /><span className="text-xs text-muted-foreground">{acc?.rate_of_change ?? 0}%</span></div></TableCell>
                              <TableCell className="text-sm text-card-foreground">{acc?.revenue_impact ? formatCurrency(acc.revenue_impact) : '--'}</TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {Array.isArray(acc?.data_sources) && acc.data_sources.map((s: string, j: number) => (
                                    <Badge key={j} variant="secondary" className="text-xs rounded-none">{s}</Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-border rounded-none shadow-sm bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Pre-Risk Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {alerts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No pre-risk alerts</p>
                    ) : (
                      alerts.map((alert, i) => (
                        <div key={i} className="p-3 border border-border rounded-none bg-secondary/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-card-foreground">{alert?.account_name ?? '--'}</span>
                            <SeverityBadge severity={alert?.severity} />
                          </div>
                          <p className="text-xs text-muted-foreground">{alert?.message ?? ''}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-border rounded-none">{alert?.signal_type ?? '--'}</Badge>
                            <div className="flex items-center gap-2">
                              <TrendIcon direction={alert?.trend_direction} />
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary rounded-none">{alert?.confidence_pct ?? '--'}%</Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}
