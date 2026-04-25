'use client'

import React, { useState } from 'react'
import { FiBell, FiAlertTriangle, FiClock, FiCheckCircle, FiDatabase, FiTrendingDown, FiTrendingUp, FiActivity } from 'react-icons/fi'
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
  if (s === 'critical') return 'border-red-500/50 bg-red-500/5'
  if (s === 'high') return 'border-red-500/30 bg-red-500/5'
  if (s === 'medium') return 'border-amber-500/30 bg-amber-500/5'
  return 'border-border'
}

function TrendIcon({ direction }: { direction?: string }) {
  if (direction === 'worsening') return <FiTrendingDown className="w-3.5 h-3.5 text-red-400" />
  if (direction === 'improving') return <FiTrendingUp className="w-3.5 h-3.5 text-green-400" />
  return <FiActivity className="w-3.5 h-3.5 text-muted-foreground" />
}

function AlertCard({ alert }: { alert: any }) {
  return (
    <div className={`p-4 border ${SeverityColor(alert?.severity)} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-light tracking-wide text-foreground">{alert?.account_name ?? '--'}</span>
        <Badge variant={alert?.severity === 'critical' || alert?.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs font-light tracking-wider">{alert?.severity ?? '--'}</Badge>
      </div>
      <p className="text-sm font-light text-muted-foreground leading-relaxed">{alert?.message ?? ''}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-light border-border">{alert?.signal_type ?? '--'}</Badge>
          <TrendIcon direction={alert?.trend_direction} />
          {alert?.rate_of_change != null && <span className="text-xs text-muted-foreground font-light">{alert.rate_of_change}%</span>}
        </div>
        <div className="flex items-center gap-2">
          {Array.isArray(alert?.data_sources) && alert.data_sources.map((s: string, j: number) => (
            <Badge key={j} variant="secondary" className="text-xs font-light">{s}</Badge>
          ))}
          <Badge variant="outline" className="text-xs font-light border-primary/30 text-primary">{alert?.confidence_pct ?? '--'}%</Badge>
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
          <h2 className="text-2xl font-light tracking-widest text-foreground uppercase">Alerts & Timeline</h2>
          <p className="text-sm text-muted-foreground font-light tracking-wide mt-1">Risk signal monitoring and evolution tracking</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/30 border border-border">
            <TabsTrigger value="pre-risk" className="text-xs tracking-wider font-light data-[state=active]:bg-card">Pre-Risk Alerts</TabsTrigger>
            <TabsTrigger value="high-risk" className="text-xs tracking-wider font-light data-[state=active]:bg-card">High-Risk Alerts</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs tracking-wider font-light data-[state=active]:bg-card">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-risk" className="mt-4 space-y-3">
            {preRisk.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12 text-center">
                  <FiBell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-light tracking-wide">No pre-risk alerts detected</p>
                </CardContent>
              </Card>
            ) : (
              preRisk.map((alert, i) => <AlertCard key={i} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="high-risk" className="mt-4 space-y-3">
            {highRisk.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12 text-center">
                  <FiAlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-light tracking-wide">No high-risk alerts</p>
                </CardContent>
              </Card>
            ) : (
              highRisk.map((alert, i) => <AlertCard key={i} alert={alert} />)
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            {allAlerts.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12 text-center">
                  <FiClock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-light tracking-wide">No timeline data available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                {allAlerts.map((alert, i) => (
                  <div key={i} className="relative mb-6">
                    <div className={`absolute left-[-22px] w-3 h-3 ${(alert?.severity ?? '').toLowerCase() === 'critical' || (alert?.severity ?? '').toLowerCase() === 'high' ? 'bg-red-400' : 'bg-primary'}`} style={{ borderRadius: '50%', top: '6px' }} />
                    <Card className="border-border">
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-light tracking-wide text-foreground">{alert?.account_name ?? '--'}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={alert?.severity === 'critical' || alert?.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs font-light tracking-wider">{alert?.severity ?? '--'}</Badge>
                            <Badge variant="outline" className="text-xs font-light border-primary/30 text-primary">{alert?.confidence_pct ?? '--'}%</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-light">{alert?.message ?? ''}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs font-light border-border">{alert?.signal_type ?? '--'}</Badge>
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
