'use client'

import React from 'react'
import { FiRefreshCw, FiZap, FiTrendingUp, FiCheckCircle, FiPercent } from 'react-icons/fi'
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
        i % 2 === 1 ? <strong key={i} className="font-medium">{part}</strong> : <span key={i}>{part}</span>
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
            <h2 className="text-2xl font-light tracking-widest text-foreground uppercase">Feedback & Learning</h2>
            <p className="text-sm text-muted-foreground font-light tracking-wide mt-1">Intervention outcome analysis and model calibration</p>
          </div>
          <Button size="sm" className="gap-2 font-light tracking-wider bg-primary text-primary-foreground hover:bg-primary/90" onClick={onAnalyzeOutcomes} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent animate-spin" style={{ borderRadius: '50%' }} />
                Analyzing...
              </>
            ) : (
              <><FiRefreshCw className="w-4 h-4" /> Analyze Outcomes</>
            )}
          </Button>
        </div>

        {error && <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-light tracking-wide">{error}</div>}

        {!data ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FiRefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-light tracking-wider text-foreground mb-2">No Feedback Data</h3>
              <p className="text-sm text-muted-foreground font-light tracking-wide mb-6 max-w-md mx-auto">Click Analyze Outcomes to evaluate intervention effectiveness and recalibrate confidence scores.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <FiCheckCircle className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-light tracking-wider text-foreground">{data?.overall_success_rate ?? '--'}%</p>
                  <p className="text-xs text-muted-foreground tracking-wider font-light mt-1 uppercase">Success Rate</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <FiRefreshCw className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-light tracking-wider text-foreground">{data?.total_interventions_analyzed ?? '--'}</p>
                  <p className="text-xs text-muted-foreground tracking-wider font-light mt-1 uppercase">Interventions</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <FiPercent className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-light tracking-wider text-foreground">{data?.average_risk_reduction ?? '--'}%</p>
                  <p className="text-xs text-muted-foreground tracking-wider font-light mt-1 uppercase">Avg Risk Reduction</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="py-4 px-4 text-center">
                  <FiTrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-light tracking-wider text-foreground capitalize">{data?.confidence_trend ?? '--'}</p>
                  <p className="text-xs text-muted-foreground tracking-wider font-light mt-1 uppercase">Confidence +{data?.confidence_improvement ?? 0}%</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-light tracking-widest uppercase">Intervention Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {analyses.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground font-light text-center">No intervention data</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-xs tracking-wider font-light uppercase">Action Type</TableHead>
                        <TableHead className="text-xs tracking-wider font-light uppercase">Success</TableHead>
                        <TableHead className="text-xs tracking-wider font-light uppercase">Risk Reduction</TableHead>
                        <TableHead className="text-xs tracking-wider font-light uppercase">Proj. vs Actual</TableHead>
                        <TableHead className="text-xs tracking-wider font-light uppercase">Sample</TableHead>
                        <TableHead className="text-xs tracking-wider font-light uppercase">Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((a: any, i: number) => (
                        <TableRow key={i} className="border-border">
                          <TableCell className="font-light tracking-wide text-sm">{a?.action_type ?? '--'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-light">{a?.success_rate ?? '--'}%</span>
                              <Progress value={a?.success_rate ?? 0} className="w-16 h-1.5" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-light">{a?.avg_risk_reduction ?? '--'}%</TableCell>
                          <TableCell className="text-sm font-light">{a?.avg_projected_vs_actual != null ? (a.avg_projected_vs_actual * 100).toFixed(0) + '%' : '--'}</TableCell>
                          <TableCell className="text-sm font-light">{a?.sample_size ?? '--'}</TableCell>
                          <TableCell className="text-xs font-light text-muted-foreground max-w-xs">{a?.recommendation ?? '--'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-light tracking-widest uppercase">Adjusted Impact Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {adjustedScores.map((score: any, i: number) => (
                  <div key={i} className="p-3 border border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-light tracking-wide text-foreground">{score?.action_type ?? '--'}</p>
                      <p className="text-xs text-muted-foreground font-light mt-1">{score?.adjustment_reason ?? ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-light text-muted-foreground line-through">{score?.previous_score ?? '--'}</span>
                      <span className="text-lg font-light text-foreground">{score?.adjusted_score ?? '--'}</span>
                      {(score?.adjusted_score ?? 0) > (score?.previous_score ?? 0) ? (
                        <FiTrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <FiTrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-light tracking-widest uppercase text-primary">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-3 p-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-light mt-0.5">{i + 1}</Badge>
                      <p className="text-sm font-light leading-relaxed text-foreground">{renderMarkdown(rec)}</p>
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
