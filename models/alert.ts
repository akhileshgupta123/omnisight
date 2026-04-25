import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getAlertModel() {
  if (!_model) {
    await initDB()
    _model = createModel('Alert', {
      user_id: { type: String },
      alert_type: { type: String },
      severity: { type: String },
      account_name: { type: String },
      message: { type: String },
      confidence_pct: { type: Number },
      acknowledged: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
