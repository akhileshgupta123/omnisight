'use client'

import React, { useState } from 'react'
import { Bell, AlertTriangle, Clock, CheckCircle, Database, TrendingDown, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface AlertsTimelineProps {
  preRiskAlerts: any[]
  actionPlans: any[]
  sampleMode: boolean
}

const SAMPLE_PRE_RISK = [
  { account_name: 'Meridian Corp', signal_type: 'Support Volume Spike', severity: 'high', confidence_pct: 89, data_sources: ['Support Tickets'], message: 'Support ticket volume increased 340% in the last 14 days', trend_direction: 'worsening', rate_of_change: 340 },
  { account_name: 'Atlas Industries', signal_type: 'Key Personnel Departure', severity: 'medium', confidence_pct: 76, data_sources: ['HRIS'], message: 'VP of Operations submitted resignation notice', trend_direction: 'worsening', rate_of_change: 0 },
  { account_name: 'Pinnacle Systems', signal_type: 'NPS Score Decline', severity: 'medium', confidence_pct: 82, data_sources: ['NPS Surveys'], message: 'NPS score dropped from 72 to 41 over past quarter', trend_direction: 'worsening', rate_of_change: -43 },
]

const SAMPLE_HIGH_RISK = [
  { account_name: 'Meridian Corp', signal_type: 'Churn Imminent', severity: 'critical', confidence_pct: 91, data_sources: ['CRM', 'Finance', 'Support'], message: 'Multiple converging risk signals indicate high probability of contract non-renewal', trend_direction: 'worsening', rate_of_change: 15 },
]

function SeverityColor(severity?: string): string {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical') return 'border-destructive/30 bg-destructive/5 border-l-4 border-l-destructive'
  if (s === 'high') return 'border-destructive/20 bg-destructive/5 border-l-4 border-l-destructive'
  if (s === 'medium') return 'border-amber-500/20 bg-amber-500/5 border-l-4 border-l-amber-400'
  return 'border-border bg-card border-l-4 border-l-primary'
}

function TrendIcon({ direction }: { direction?: string }) {
  if (direction === 'worsening') return <TrendingDown className="w-3.5 h-3.5 text-destructive" />
  if (direction === 'improving') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
  return <Activity className="w-3.5 h-3.5 text-muted-foreground" />
}

function AlertCard({ alert }: { alert: any }) {
  return (
    <div className={`p-4 border rounded-none ${SeverityColor(alert?.severity)} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">{alert?.account_name ?? '--'}</span>
        <Badge variant={alert?.severity === 'critical' || alert?.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs rounded-none">{alert?.severity ?? '--'}</Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{alert?.message ?? ''}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-border rounded-none">{alert?.signal_type ?? '--'}</Badge>
          <TrendIcon direction={alert?.trend_direction} />
          {alert?.rate_of_change != null && <span className="text-xs text-muted-foreground">{alert.rate_of_change}%</span>}
        </div>
        <div className="flex items-center gap-2">
          {Array.isArray(alert?.data_sources) && alert.data_sources.map((s: string, j: number) => (
            <Badge key={j} variant="secondary" className="text-xs rounded-none">{s}</Badge>
          ))}
          <Badge variant="outline" className="text-xs border-primary/30 text-primary rounded-none">Confidence: {alert?.confidence_pct ?? '--'}%</Badge>
        </div>
      </div>
    </div>
  )
}

export default function AlertsTimeline({ preRiskAlerts, actionPlans, sampleMode }: AlertsTimelineProps) {
  const [tab, setTab] = useState('pre-risk')
  const preRisk = sampleMode ? SAMPLE_PRE_RISK : (Array.isArray(preRiskAlerts) ? preRiskAlerts : [])
  const highRisk = sampleMode ? SAMPLE_HIGH_RISK : preRisk.filter(a => {
    const s = (a?.severity ?? '').toLowerCase()
    return s === 'high' || s === 'critical'
  })
  const allAlerts = sampleMode ? [...SAMPLE_HIGH_RISK, ...SAMPLE_PRE_RISK] : [...preRisk].sort((a, b) => (b?.confidence_pct ?? 0) - (a?.confidence_pct ?? 0))

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-serif tracking-wider font-light text-foreground">Alerts & Timeline</h2>
          <p className="text-sm text-muted-foreground mt-1">Risk signal monitoring and evolution tracking</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-secondary border border-border rounded-none">
            <TabsTrigger value="pre-risk" className="text-xs data-[state=active]:bg-card rounded-none">Pre-Risk Alerts</TabsTrigger>
            <TabsTrigger value="high-risk" className="text-xs data-[state=active]:bg-card rounded-none">High-Risk Alerts</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-card rounded-none">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-risk" className="mt-4 space-y-3">
            {preRisk.length === 0 ? (
              <Card className="border-border rounded-none bg-card">
                <CardContent className="py-12 text-center">
                  <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No pre-risk alerts detected</p>
                </CardContent>
              </Card>
            ) : (
              preRisk.map((alert, i) => <AlertCard key={i} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="high-risk" className="mt-4 space-y-3">
            {highRisk.length === 0 ? (
              <Card className="border-border rounded-none bg-card">
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No high-risk alerts</p>
                </CardContent>
              </Card>
            ) : (
              highRisk.map((alert, i) => <AlertCard key={i} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            {allAlerts.length === 0 ? (
              <Card className="border-border rounded-none bg-card">
                <CardContent className="py-12 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No timeline data available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-primary/30" />
                {allAlerts.map((alert, i) => (
                  <div key={i} className="relative mb-6">
                    <div className={`absolute left-[-22px] w-3 h-3 rounded-full ${(alert?.severity ?? '').toLowerCase() === 'critical' || (alert?.severity ?? '').toLowerCase() === 'high' ? 'bg-destructive' : 'bg-primary'}`} style={{ top: '6px' }} />
                    <Card className="border-border rounded-none shadow-sm bg-card">
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-card-foreground">{alert?.account_name ?? '--'}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert?.severity === 'critical' || alert?.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs rounded-none">{alert?.severity ?? '--'}</Badge>
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary rounded-none">{alert?.confidence_pct ?? '--'}%</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{alert?.message ?? ''}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs border-border rounded-none">{alert?.signal_type ?? '--'}</Badge>
                          <TrendIcon direction={alert?.trend_direction} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
