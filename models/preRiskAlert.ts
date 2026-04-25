import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getPreRiskAlertModel() {
  if (!_model) {
    await initDB()
    _model = createModel('PreRiskAlert', {
      user_id: { type: String },
      account_name: { type: String, required: true },
      signal_type: { type: String },
      severity: { type: String },
      trend_direction: { type: String },
      rate_of_change: { type: Number },
      confidence_pct: { type: Number },
      data_sources_used: { type: [String] },
      message: { type: String },
      acknowledged: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
