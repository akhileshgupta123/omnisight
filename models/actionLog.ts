import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getActionLogModel() {
  if (!_model) {
    await initDB()
    _model = createModel('ActionLog', {
      user_id: { type: String },
      account_name: { type: String },
      action_type: { type: String },
      description: { type: String },
      impact_score: { type: Number },
      confidence_pct: { type: Number },
      simulated_execution_outcome: { type: Object },
      status: { type: String, default: 'pending' },
      actual_outcome: { type: String },
      outcome_date: { type: Date },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
