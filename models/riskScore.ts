import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getRiskScoreModel() {
  if (!_model) {
    await initDB()
    _model = createModel('RiskScore', {
      user_id: { type: String },
      account_name: { type: String, required: true },
      churn_risk: { type: String },
      workforce_risk: { type: String },
      revenue_impact: { type: Number },
      trend_direction: { type: String },
      rate_of_change: { type: Number },
      confidence_pct: { type: Number },
      data_sources_used: { type: [String] },
      risk_score: { type: Number },
      timestamp: { type: Date, default: Date.now },
    })
  }
  return _model
}
