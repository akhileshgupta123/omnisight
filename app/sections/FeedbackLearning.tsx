'use client'

import React from 'react'
import { RefreshCw, Zap, TrendingUp, CheckCircle, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

interface FeedbackLearningProps {
  feedbackData: any | null
  loading: boolean
  onAnalyzeOutcomes: () => void
  sampleMode: boolean
  error: string | null
}

const SAMPLE_FEEDBACK = {
  overall_success_rate: 73,
  total_interventions_analyzed: 48,
  average_risk_reduction: 31,
  confidence_trend: 'improving',
  confidence_improvement: 12,
  intervention_analysis: [
    { action_type: 'Executive Escalation', success_rate: 82, avg_risk_reduction: 38, avg_projected_vs_actual: 0.91, sample_size: 14, recommendation: 'Continue prioritizing for high-risk accounts. Increase frequency for critical accounts.' },
    { action_type: 'CSM Intervention', success_rate: 71, avg_risk_reduction: 28, avg_projected_vs_actual: 0.84, sample_size: 22, recommendation: 'Effective for medium-risk. Add structured check-in cadence.' },
    { action_type: 'Resource Reallocation', success_rate: 65, avg_risk_reduction: 22, avg_projected_vs_actual: 0.78, sample_size: 12, recommendation: 'Moderate effectiveness. Combine with direct engagement for better results.' },
  ],
  adjusted_impact_scores: [
    { action_type: 'Executive Escalation', previous_score: 85, adjusted_score: 89, adjustment_reason: 'Higher than projected success rate in recent interventions' },
    { action_type: 'CSM Intervention', previous_score: 72, adjusted_score: 68, adjustment_reason: 'Slightly below projected effectiveness in Q1' },
    { action_type: 'Resource Reallocation', previous_score: 70, adjusted_score: 64, adjustment_reason: 'Lower impact when used as standalone intervention' },
  ],
  recommendations: [
    'Prioritize executive escalation for all Critical-tier accounts based on 82% historical success rate.',
    'Combine resource reallocation with direct engagement strategies to improve standalone effectiveness.',
    'Increase confidence weighting for pre-risk signals from Support Tickets data source (highest correlation with actual outcomes).',
    'Consider automating CSM check-in scheduling for Medium-risk accounts to reduce response time.',
  ],
}

function renderMarkdown(text: string) {
  if (!text) return null
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return <span>{text}</span>
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : <span key={i}>{part}</span>
      )}
    </span>
  )
}

export default function FeedbackLearning({ feedbackData, loading, onAnalyzeOutcomes, sampleMode, error }: FeedbackLearningProps) {
  const data = sampleMode ? SAMPLE_FEEDBACK : feedbackData
  const analyses = Array.isArray(data?.intervention_analysis) ? data.intervention_analysis : []
  const adjustedScores = Array.isArray(data?.adjusted_impact_scores) ? data.adjusted_impact_scores : []
  const recommendations = Array.isArray(data?.recommendations) ? data.recommendations : []

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif tracking-wider font-light text-foreground">Feedback & Learning</h2>
            <p className="text-sm text-muted-foreground mt-1">Intervention outcome analysis and model calibration</p>
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none" onClick={onAnalyzeOutcomes} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Analyze Outcomes</>
            )}
          </Button>
        </div>

        {error && <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-sm rounded-none">{error}</div>}

        {!data ? (
          <Card className="border-border rounded-none bg-card">
            <CardContent className="py-16 text-center">
              <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-serif tracking-wider font-light text-foreground mb-2">No Feedback Data</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Click Analyze Outcomes to evaluate intervention effectiveness and recalibrate confidence scores.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border rounded-none shadow-sm bg-card border-t-4 border-t-emerald-500">
                <CardContent className="py-4 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-medium text-foreground">{data?.overall_success_rate ?? '--'}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                </CardContent>
              </Card>
              <Card className="border-border rounded-none shadow-sm bg-card border-t-4 border-t-primary">
                <CardContent className="py-4 px-4 text-center">
                  <RefreshCw className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-medium text-foreground">{data?.total_interventions_analyzed ?? '--'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Interventions</p>
                </CardContent>
              </Card>
              <Card className="border-border rounded-none shadow-sm bg-card border-t-4 border-t-amber-400">
                <CardContent className="py-4 px-4 text-center">
                  <Percent className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-medium text-foreground">{data?.average_risk_reduction ?? '--'}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Risk Reduction</p>
                </CardContent>
              </Card>
              <Card className="border-border rounded-none shadow-sm bg-card border-t-4 border-t-card-foreground">
                <CardContent className="py-4 px-4 text-center">
                  <TrendingUp className="w-5 h-5 text-card-foreground mx-auto mb-2" />
                  <p className="text-2xl font-medium text-foreground capitalize">{data?.confidence_trend ?? '--'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Confidence +{data?.confidence_improvement ?? 0}%</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border rounded-none shadow-sm bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Intervention Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {analyses.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground text-center">No intervention data</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Action Type</TableHead>
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Success</TableHead>
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Risk Reduction</TableHead>
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Proj. vs Actual</TableHead>
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Sample</TableHead>
                        <TableHead className="text-xs font-medium uppercase text-muted-foreground">Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((a: any, i: number) => (
                        <TableRow key={i} className="border-border">
                          <TableCell className="font-medium text-sm text-card-foreground">{a?.action_type ?? '--'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-card-foreground">{a?.success_rate ?? '--'}%</span>
                              <Progress value={a?.success_rate ?? 0} className="w-16 h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-card-foreground">{a?.avg_risk_reduction ?? '--'}%</TableCell>
                          <TableCell className="text-sm text-card-foreground">{a?.avg_projected_vs_actual != null ? (a.avg_projected_vs_actual * 100).toFixed(0) + '%' : '--'}</TableCell>
                          <TableCell className="text-sm text-card-foreground">{a?.sample_size ?? '--'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs">{a?.recommendation ?? '--'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="border-border rounded-none shadow-sm bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Adjusted Impact Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {adjustedScores.map((score: any, i: number) => (
                  <div key={i} className="p-3 border border-border rounded-none flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{score?.action_type ?? '--'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{score?.adjustment_reason ?? ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground line-through">{score?.previous_score ?? '--'}</span>
                      <span className="text-lg font-medium text-card-foreground">{score?.adjusted_score ?? '--'}</span>
                      {(score?.adjusted_score ?? 0) > (score?.previous_score ?? 0) ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <Card className="border-border rounded-none shadow-sm bg-card border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-serif tracking-wider font-light text-card-foreground uppercase">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-3 p-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mt-0.5 rounded-none">{i + 1}</Badge>
                      <p className="text-sm leading-relaxed text-card-foreground">{renderMarkdown(rec)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}
