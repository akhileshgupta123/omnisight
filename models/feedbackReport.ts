import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getFeedbackReportModel() {
  if (!_model) {
    await initDB()
    _model = createModel('FeedbackReport', {
      user_id: { type: String },
      analysis_period: { type: String },
      success_rate: { type: Number },
      adjusted_scores: { type: [Object] },
      confidence_trend: { type: String },
      recommendations: { type: [String] },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
