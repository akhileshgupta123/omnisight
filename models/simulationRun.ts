import { initDB, createModel } from 'lyzr-architect'

let _model: any = null
export default async function getSimulationRunModel() {
  if (!_model) {
    await initDB()
    _model = createModel('SimulationRun', {
      user_id: { type: String },
      scenario_type: { type: String },
      parameters: { type: Object },
      no_action_outcome: { type: Object },
      recommended_outcome: { type: Object },
      auto_execution_outcome: { type: Object },
      confidence_pct: { type: Number },
      created_at: { type: Date, default: Date.now },
    })
  }
  return _model
}
