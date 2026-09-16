'use client'

import React from 'react'
import { ArrowLeft, Shield, TrendingUp, TrendingDown, Activity, CheckCircle, AlertTriangle, Database, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface AccountDrilldownProps {
  account: any | null
  actionPlans: any[]
  simulationComparison: any | null
  onBack: () => void
}

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

export default function AccountDrilldown({ account, actionPlans, simulationComparison, onBack }: AccountDrilldownProps) {
  if (!account) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-serif tracking-wider font-light text-foreground mb-2">No Account Selected</h3>
          <p className="text-sm text-muted-foreground font-normal">Select an at-risk account from the Risk Overview dashboard to view detailed analysis.</p>
        </div>
      </div>
    )
  }

  const accountActions = Array.isArray(actionPlans) ? actionPlans.filter(a => a?.account_name === account.account_name) : []
  const preventiveActions = accountActions.filter(a => (a?.action_type ?? '').toLowerCase().includes('prevent'))
  const reactiveActions = accountActions.filter(a => !(a?.action_type ?? '').toLowerCase().includes('prevent'))
  const dataSources = Array.isArray(account?.data_sources) ? account.data_sources : []

  const riskScore = account?.risk_score ?? 0
  const riskTier = riskScore >= 80 ? 'Critical' : riskScore >= 60 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low'
  const riskColor = riskScore >= 80 ? 'text-destructive' : riskScore >= 60 ? 'text-amber-400' : riskScore >= 40 ? 'text-amber-400' : 'text-emerald-500'

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-primary hover:text-primary/80 rounded-none">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-serif tracking-wider font-light text-foreground">{account.account_name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className={`text-xs font-normal ${riskColor} border-current rounded-none`}>{riskTier} Risk</Badge>
              <div className="flex items-center gap-1">
                {account.trend_direction === 'worsening' ? <TrendingDown className="w-3.5 h-3.5 text-destructive" /> : account.trend_direction === 'improving' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <Activity className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground font-normal">{account.trend_direction ?? 'stable'}</span>
              </div>
              {dataSources.map((src: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal rounded-none">{src}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardContent className="py-4 px-4 text-center">
              <p className="text-3xl font-medium text-foreground">{riskScore}</p>
              <Progress value={riskScore} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Risk Score</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardContent className="py-4 px-4 text-center">
              <p className="text-3xl font-medium text-foreground">{account.confidence_pct ?? '--'}%</p>
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Confidence</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardContent className="py-4 px-4 text-center">
              <p className="text-3xl font-medium text-foreground">{account.revenue_impact ? formatCurrency(account.revenue_impact) : '--'}</p>
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Revenue Impact</p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardContent className="py-4 px-4 text-center">
              <p className="text-3xl font-medium text-foreground">{account.rate_of_change ?? 0}%</p>
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Rate of Change</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">What is Happening</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-normal text-muted-foreground">Churn Risk: <span className="text-card-foreground">{account.churn_risk ?? '--'}</span></p>
              <p className="text-sm font-normal text-muted-foreground">Workforce Risk: <span className="text-card-foreground">{account.workforce_risk ?? '--'}</span></p>
              <p className="text-sm font-normal text-muted-foreground">Trajectory: <span className="text-card-foreground">{account.trend_direction ?? '--'} ({account.rate_of_change ?? 0}%)</span></p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Signal Breakdown</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="churn" className="border-border">
                  <AccordionTrigger className="text-sm font-normal text-card-foreground">Churn Signals</AccordionTrigger>
                  <AccordionContent><p className="text-sm font-normal text-muted-foreground">{account.churn_risk ?? 'No data'} risk level detected from {dataSources.join(', ') || 'available sources'}</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="workforce" className="border-border">
                  <AccordionTrigger className="text-sm font-normal text-card-foreground">Workforce Signals</AccordionTrigger>
                  <AccordionContent><p className="text-sm font-normal text-muted-foreground">{account.workforce_risk ?? 'No data'} workforce risk identified</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="revenue" className="border-border">
                  <AccordionTrigger className="text-sm font-normal text-card-foreground">Revenue Signals</AccordionTrigger>
                  <AccordionContent><p className="text-sm font-normal text-muted-foreground">{account.revenue_impact ? formatCurrency(account.revenue_impact) : 'No data'} revenue at risk</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Risk Trajectory</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              {account.trend_direction === 'worsening' ? <TrendingDown className="w-10 h-10 text-destructive mb-2" /> : account.trend_direction === 'improving' ? <TrendingUp className="w-10 h-10 text-emerald-500 mb-2" /> : <Activity className="w-10 h-10 text-muted-foreground mb-2" />}
              <p className="text-sm font-normal text-card-foreground capitalize">{account.trend_direction ?? 'Stable'}</p>
              <p className="text-xs text-muted-foreground font-normal mt-1">{account.rate_of_change ?? 0}% change rate</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Preventive Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {preventiveActions.length === 0 ? <p className="text-sm font-normal text-muted-foreground">No preventive actions recommended</p> : preventiveActions.map((a, i) => (
                <div key={i} className="p-2 border border-border rounded-none space-y-1">
                  <p className="text-sm font-normal text-card-foreground">{a?.action_name ?? '--'}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs font-normal border-emerald-500/30 text-emerald-500 rounded-none">Preventive</Badge>
                    <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary rounded-none">{a?.confidence_pct ?? '--'}%</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm rounded-none bg-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Reactive Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reactiveActions.length === 0 ? <p className="text-sm font-normal text-muted-foreground">No reactive actions recommended</p> : reactiveActions.map((a, i) => (
                <div key={i} className="p-2 border border-border rounded-none space-y-1">
                  <p className="text-sm font-normal text-card-foreground">{a?.action_name ?? '--'}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs font-normal border-amber-500/30 text-amber-400 rounded-none">Reactive</Badge>
                    <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary rounded-none">Impact: {a?.impact_score ?? '--'}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm rounded-none bg-card border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Auto-Execution</CardTitle>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-normal rounded-none">Simulated</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {accountActions.length === 0 ? <p className="text-sm font-normal text-muted-foreground">No auto-execution data</p> : accountActions.filter(a => a?.auto_execution).slice(0, 1).map((a, i) => {
                const exec = a.auto_execution
                return (
                  <div key={i} className="space-y-2">
                    <p className="text-sm font-normal text-muted-foreground">Meetings: <span className="text-card-foreground">{exec?.meetings_scheduled ?? 0}</span></p>
                    <p className="text-sm font-normal text-muted-foreground">Escalations: <span className="text-card-foreground">{exec?.escalations_triggered ?? 0}</span></p>
                    <p className="text-sm font-normal text-muted-foreground">Resources Reassigned: <span className="text-card-foreground">{exec?.resources_reassigned ?? 0}</span></p>
                    <p className="text-sm font-normal text-muted-foreground">Risk Reduction: <span className="text-emerald-500">{exec?.projected_risk_reduction ?? 0}%</span></p>
                    <p className="text-sm font-normal text-muted-foreground">Revenue Saved: <span className="text-emerald-500">{exec?.projected_revenue_saved ? formatCurrency(exec.projected_revenue_saved) : '--'}</span></p>
                    <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary rounded-none">{exec?.execution_status ?? 'pending'}</Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}
