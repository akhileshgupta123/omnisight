'use client'

import React from 'react'
import { FiAlertCircle, FiCheckCircle, FiZap, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface SimulationPanelProps {
  simulationComparison: any | null
  sampleMode: boolean
}

const SAMPLE_SIMULATION = {
  no_action: { revenue_impact: -2450000, risk_level: 'Critical', churn_rate: 34 },
  recommended: { revenue_impact: -820000, risk_level: 'Medium', churn_rate: 14, cost: 180000 },
  auto_execution: { revenue_impact: -340000, risk_level: 'Low', churn_rate: 8, cost: 240000, confidence: 87 },
}

function formatCurrency(val: number): string {
  if (!val && val !== 0) return '--'
  const abs = Math.abs(val)
  const sign = val < 0 ? '-' : ''
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(0)}K`
  return `${sign}$${abs}`
}

function RiskLevelColor(level?: string): string {
  const l = (level ?? '').toLowerCase()
  if (l === 'critical' || l === 'high') return 'text-red-400'
  if (l === 'medium') return 'text-amber-400'
  return 'text-green-400'
}

function ScenarioColumn({ title, icon, data, accentClass }: { title: string; icon: React.ReactNode; data: any; accentClass: string }) {
  if (!data) return (
    <Card className="border-border flex-1">
      <CardContent className="py-12 text-center">
        <p className="text-sm text-muted-foreground font-light">No data available</p>
      </CardContent>
    </Card>
  )

  return (
    <Card className={`border-border flex-1 ${accentClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-sm font-light tracking-widest uppercase">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Revenue Impact</p>
          <p className={`text-2xl font-light tracking-wider ${(data?.revenue_impact ?? 0) < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {formatCurrency(data?.revenue_impact ?? 0)}
          </p>
        </div>
        <Separator className="bg-border" />
        <div>
          <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Risk Level</p>
          <p className={`text-lg font-light tracking-wider ${RiskLevelColor(data?.risk_level)}`}>{data?.risk_level ?? '--'}</p>
        </div>
        <Separator className="bg-border" />
        <div>
          <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Churn Rate</p>
          <p className="text-lg font-light tracking-wider text-foreground">{data?.churn_rate ?? '--'}%</p>
        </div>
        {data?.cost != null && (
          <>
            <Separator className="bg-border" />
            <div>
              <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Cost</p>
              <p className="text-lg font-light tracking-wider text-foreground">{formatCurrency(data.cost)}</p>
            </div>
          </>
        )}
        {data?.confidence != null && (
          <>
            <Separator className="bg-border" />
            <div>
              <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Confidence</p>
              <Badge variant="outline" className="text-sm font-light tracking-wider border-primary/30 text-primary">{data.confidence}%</Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function SimulationPanel({ simulationComparison, sampleMode }: SimulationPanelProps) {
  const sim = sampleMode ? SAMPLE_SIMULATION : simulationComparison

  const noAction = sim?.no_action
  const recommended = sim?.recommended
  const autoExec = sim?.auto_execution

  const noActionRev = noAction?.revenue_impact ?? 0
  const recommendedRev = recommended?.revenue_impact ?? 0
  const autoExecRev = autoExec?.revenue_impact ?? 0

  const deltaNoToRec = recommendedRev - noActionRev
  const deltaRecToAuto = autoExecRev - recommendedRev
  const netRevSaved = autoExecRev - noActionRev
  const riskReduction = noAction?.churn_rate && autoExec?.churn_rate ? ((noAction.churn_rate - autoExec.churn_rate) / noAction.churn_rate * 100).toFixed(1) : null

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-light tracking-widest text-foreground uppercase">Simulation Comparison</h2>
          <p className="text-sm text-muted-foreground font-light tracking-wide mt-1">Three-way scenario analysis</p>
        </div>

        {!sim ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FiAlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-light tracking-wider text-foreground mb-2">No Simulation Data</h3>
              <p className="text-sm text-muted-foreground font-light tracking-wide">Generate intelligence from the Risk Overview to populate simulation results.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScenarioColumn title="No Action" icon={<FiAlertCircle className="w-4 h-4 text-red-400" />} data={noAction} accentClass="border-l-2 border-l-red-500/50" />
              <ScenarioColumn title="Recommended" icon={<FiCheckCircle className="w-4 h-4 text-amber-400" />} data={recommended} accentClass="border-l-2 border-l-amber-500/50" />
              <ScenarioColumn title="Auto-Execution" icon={<FiZap className="w-4 h-4 text-primary" />} data={autoExec} accentClass="border-l-2 border-l-primary/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">No Action vs Recommended</p>
                  <p className={`text-xl font-light tracking-wider ${deltaNoToRec >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {deltaNoToRec >= 0 ? '+' : ''}{formatCurrency(deltaNoToRec)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Recommended vs Auto</p>
                  <p className={`text-xl font-light tracking-wider ${deltaRecToAuto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {deltaRecToAuto >= 0 ? '+' : ''}{formatCurrency(deltaRecToAuto)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Net Revenue Saved</p>
                  <p className={`text-xl font-light tracking-wider ${netRevSaved >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netRevSaved >= 0 ? '+' : ''}{formatCurrency(netRevSaved)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <p className="text-xs text-muted-foreground tracking-wider font-light uppercase mb-1">Risk Reduction</p>
                  <p className="text-xl font-light tracking-wider text-green-400">{riskReduction ? `${riskReduction}%` : '--'}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  )
}
