import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getExecutiveSummaryModel() {
  if (!_model) {
    await initDB()
    _model = createModel('ExecutiveSummary', {
      user_id: { type: String },
      top_insights: { type: [String] },
      top_risks: { type: [String] },
      top_actions: { type: [String] },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
