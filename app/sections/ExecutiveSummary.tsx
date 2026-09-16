'use client'

import React from 'react'
import { FiFileText, FiZap, FiAlertTriangle, FiTarget } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface ExecutiveSummaryProps {
  executiveSummary: any | null
  loading: boolean
  onGenerateSummary: () => void
  sampleMode: boolean
}

const SAMPLE_SUMMARY = {
  top_insights: [
    'Customer satisfaction scores have declined 18% across enterprise accounts in Q1 2026, driven primarily by delayed implementation timelines.',
    'Three accounts representing $1.8M ARR show converging risk signals across CRM, support, and workforce data.',
    'Auto-execution simulations project 76% risk reduction potential with $2.1M revenue protection.',
    'Workforce stability in the customer success team is 23% below benchmark, correlating with increased churn signals.',
    'Pre-risk detection accuracy has improved to 87% confidence, up from 72% last quarter.',
  ],
  top_risks: [
    'Meridian Corp: Critical risk with 340% support volume spike and declining NPS. Revenue impact: $850K.',
    'Atlas Industries: VP of Operations departure creates succession gap. Revenue impact: $620K.',
    'Cross-portfolio churn probability has reached 34%, requiring immediate intervention.',
  ],
  top_actions: [
    'Deploy executive intervention for Meridian Corp with dedicated CSM escalation and weekly check-ins.',
    'Initiate workforce continuity plan for Atlas Industries including knowledge transfer and interim leadership.',
    'Launch automated retention campaign for Medium-risk accounts to prevent escalation.',
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

export default function ExecutiveSummary({ executiveSummary, loading, onGenerateSummary, sampleMode }: ExecutiveSummaryProps) {
  const summary = sampleMode ? SAMPLE_SUMMARY : executiveSummary
  const insights = Array.isArray(summary?.top_insights) ? summary.top_insights : []
  const risks = Array.isArray(summary?.top_risks) ? summary.top_risks : []
  const actions = Array.isArray(summary?.top_actions) ? summary.top_actions : []

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-widest text-foreground uppercase">Executive Summary</h2>
            <p className="text-sm text-muted-foreground font-light tracking-wide mt-1">Boardroom-ready intelligence briefing</p>
          </div>
          <Button size="sm" className="gap-2 font-light tracking-wider bg-primary text-primary-foreground hover:bg-primary/90" onClick={onGenerateSummary} disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent animate-spin" style={{ borderRadius: '50%' }} />
                Generating...
              </>
            ) : (
              <><FiZap className="w-4 h-4" /> Generate Summary</>
            )}
          </Button>
        </div>

        {!summary ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FiFileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-light tracking-wider text-foreground mb-2">No Summary Available</h3>
              <p className="text-sm text-muted-foreground font-light tracking-wide mb-6 max-w-md mx-auto">Click Generate Summary to create a comprehensive executive briefing from your intelligence data.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-light tracking-widest uppercase">Top Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight: string, i: number) => (
                  <div key={i} className="flex gap-4 p-3 border border-border">
                    <span className="text-primary font-light text-lg tracking-wider min-w-[2rem] text-center">{i + 1}</span>
                    <p className="text-sm font-light leading-relaxed text-foreground flex-1">{renderMarkdown(insight)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border border-l-2 border-l-red-500/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-red-400" />
                  <CardTitle className="text-sm font-light tracking-widest uppercase">Top Risks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {risks.map((risk: string, i: number) => (
                  <div key={i} className="p-3 border border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-3">
                      <Badge variant="destructive" className="text-xs font-light tracking-wider mt-0.5">{i + 1}</Badge>
                      <p className="text-sm font-light leading-relaxed text-foreground flex-1">{renderMarkdown(risk)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border border-l-2 border-l-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FiTarget className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-light tracking-widest uppercase">Top Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {actions.map((action: string, i: number) => (
                  <div key={i} className="p-3 border border-primary/20 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-light tracking-wider mt-0.5">{i + 1}</Badge>
                      <p className="text-sm font-light leading-relaxed text-foreground flex-1">{renderMarkdown(action)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ScrollArea>
  )
}

// FiTarget imported from react-icons/fi
