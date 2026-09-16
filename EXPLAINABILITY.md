# OmniSight - Explainability Document

## 1. System Purpose and Scope

OmniSight is an enterprise risk intelligence platform that orchestrates multiple AI agents to synthesize risk data from client health, workforce dynamics, financial projections, and weak signals into unified, actionable intelligence for decision-makers.

**What it does:** Produces unified risk scores, pre-risk alerts, financial forecasts, action simulations, and intervention feedback reports.

**What it does not do:** OmniSight does not make autonomous business decisions, execute transactions, or access external systems without explicit user authorization. It is an intelligence layer, not an automation layer.

## 2. Agent Architecture and Roles

OmniSight uses a manager-subagent pattern. The Executive Orchestrator is the manager agent that coordinates seven specialized worker agents.

### 2.1 Agent Inventory

| Agent | Role | Platform ID | Model | Purpose |
|---|---|---|---|---|
| Executive Orchestrator | Manager | `69ec559edcdea9592ddcd911` | LLM via Lyzr | Coordinates all sub-agents, synthesizes outputs into unified risk intelligence with confidence metadata |
| Data Harmonization | Worker | `69ec55796ff27f88a5adb8ba` | LLM via Lyzr | Normalizes and harmonizes raw data from multiple sources for downstream agents |
| Client Intelligence | Worker | `69ec5579683f81d0be89f2d8` | LLM via Lyzr | Assesses churn risk, account health, and engagement patterns |
| Workforce Dynamics | Worker | `69ec557adcdea9592ddcd90b` | LLM via Lyzr | Evaluates workforce stability, resource allocation, and team dynamics |
| Financial Forecasting | Worker | `69ec557a25ead3c1187be946` | LLM via Lyzr | Generates best/expected/worst-case revenue projections with confidence intervals |
| Weak Signal Detection | Worker | `69ec557ae78e19fa5bc64d5c` | LLM via Lyzr | Detects early-warning pre-risk signals across accounts before escalation |
| Action Simulation | Worker | `69ec557b0263199051be3424` | LLM via Lyzr | Simulates no-action, recommended, and auto-execution scenarios to compare outcomes |
| Intervention Feedback | Worker (Independent) | `69ec55af25ead3c1187be94f` | LLM via Lyzr | Analyzes historical interventions, recalibrates impact scores, generates feedback reports |

### 2.2 Delegation Pattern

- **Mode:** Router -- the Executive Orchestrator receives all user queries and delegates to the appropriate sub-agents.
- **Sub-agents** (managed by Executive Orchestrator): Data Harmonization, Client Intelligence, Workforce Dynamics, Financial Forecasting, Weak Signal Detection, Action Simulation.
- **Independent agent:** Intervention Feedback operates independently to analyze historical outcomes without being influenced by real-time orchestration.

## 3. Data Flow and Traceability

### 3.1 End-to-End Data Flow

```
User Query
    |
    v
Executive Orchestrator (Manager)
    |
    +---> Data Harmonization ---> Normalized datasets
    |         |
    |         v
    +---> Client Intelligence ---> Churn risk scores, health indicators
    +---> Workforce Dynamics ---> Stability scores, resource reports
    +---> Financial Forecasting ---> Revenue projections (best/expected/worst)
    |
    +---> Weak Signal Detection ---> Pre-risk alerts with severity
    |
    +---> Action Simulation ---> No-action vs recommended vs auto-execution outcomes
    |
    v
Executive Orchestrator (Synthesis)
    |
    v
Unified Risk Intelligence Response
    |
    v
Database (risk_scores, pre_risk_alerts, simulation_runs, executive_summaries)

Intervention Feedback (Independent)
    |
    +---> Reads: action_logs, historical outcomes
    +---> Writes: feedback_reports, recalibrated impact scores
```

### 3.2 Input-Output Mapping Per Agent

| Agent | Inputs | Outputs | Data Sources Referenced |
|---|---|---|---|
| Data Harmonization | Raw multi-source enterprise data | Standardized, normalized datasets | External data feeds, uploaded files |
| Client Intelligence | Harmonized client engagement data | `risk_score`, `confidence_pct`, `churn_risk`, `trend_direction`, `rate_of_change` | CRM data, engagement metrics |
| Workforce Dynamics | Harmonized workforce metrics | `workforce_stability`, `workforce_confidence`, `workforce_risk` | HR systems, resource allocation data |
| Financial Forecasting | Harmonized financial data | `best_case_revenue`, `expected_revenue`, `worst_case_revenue`, `confidence_pct`, period projections | Financial records, historical revenue |
| Weak Signal Detection | Cross-domain signals from all agents | `signal_type`, `severity`, `confidence_pct`, `message`, `trend_direction` | All upstream agent outputs |
| Action Simulation | Risk context, proposed actions | Three-scenario comparison (`no_action`, `recommended`, `auto_execution`) with `revenue_impact`, `risk_level`, `churn_rate`, `cost` | Current risk state, historical action data |
| Intervention Feedback | Past intervention logs and outcomes | Recalibrated `impact_score`, `confidence_pct`, feedback reports | `action_logs` collection, historical outcomes |
| Executive Orchestrator | All sub-agent outputs | Unified `dashboard_metrics`, `at_risk_accounts`, `pre_risk_alerts`, `financial_forecast`, `action_plans`, `simulation_comparison`, `executive_summary` | All sub-agent outputs synthesized |

## 4. Output Structure and Interpretation

### 4.1 Response Schema

The Executive Orchestrator produces a structured JSON response with these top-level sections:

- **dashboard_metrics**: Aggregate scores -- `overall_risk_score`, `overall_risk_confidence`, `revenue_at_risk`, `churn_probability`, `workforce_stability`, each with a corresponding confidence value and list of `data_sources`.
- **at_risk_accounts**: Array of accounts with `risk_score`, `confidence_pct`, `data_sources`, `trend_direction`, `rate_of_change`, `churn_risk`, `workforce_risk`, `revenue_impact`.
- **pre_risk_alerts**: Array of early-warning signals with `signal_type`, `severity`, `confidence_pct`, `data_sources`, `message`.
- **financial_forecast**: Three-scenario projections (`best_case_revenue`, `expected_revenue`, `worst_case_revenue`) with `confidence_pct` and period-level breakdowns.
- **action_plans**: Recommended actions with `impact_score`, `confidence_pct`, and `auto_execution` details (meetings scheduled, escalations triggered, resources reassigned, projected risk reduction and revenue saved).
- **simulation_comparison**: Side-by-side comparison of `no_action`, `recommended`, and `auto_execution` scenarios showing `revenue_impact`, `risk_level`, `churn_rate`, and `cost`.
- **executive_summary**: Human-readable `top_insights`, `top_risks`, and `top_actions` arrays.

### 4.2 How to Interpret Confidence Scores

Every numeric output includes a confidence score (0.0 to 1.0):

| Confidence Range | Interpretation | Recommended Action |
|---|---|---|
| > 0.8 (High) | Strong data support; reliable for decision-making | Act with reasonable certainty |
| 0.5 - 0.8 (Medium) | Sufficient for awareness; data may be incomplete | Monitor closely; verify before major decisions |
| < 0.5 (Low) | Limited data; treat as directional signal only | Do not base critical decisions on this alone |

### 4.3 How Confidence Is Calculated

Confidence scores are derived from:
1. **Data coverage** -- percentage of expected data fields that are present and non-stale.
2. **Source diversity** -- number of independent data sources contributing to the score (more sources = higher confidence).
3. **Temporal recency** -- how current the underlying data is (stale data reduces confidence).
4. **Cross-agent agreement** -- when multiple agents assess the same entity, agreement raises confidence; disagreement lowers it.

## 5. Model and Parameter Transparency

### 5.1 Model Configuration

All agents are powered by large language models accessed through the Lyzr platform. Each agent has:

- A **defined role** (manager or worker) constraining its scope of action.
- A **goal statement** describing what the agent optimizes for.
- An **instruction set** that specifies behavior, output format, and constraints.
- **Temperature settings** tuned per agent:
  - Lower temperature (more deterministic) for Financial Forecasting, Data Harmonization -- where precision matters.
  - Moderate temperature for Client Intelligence, Workforce Dynamics, Weak Signal Detection -- balancing pattern recognition with consistency.
  - The Executive Orchestrator uses moderate temperature to synthesize diverse inputs coherently.

### 5.2 Prompt Design Principles

Agent instructions follow these principles:
- **Role-bounded**: Each agent only operates within its defined domain.
- **Output-structured**: Agents are instructed to return structured JSON conforming to defined schemas.
- **Confidence-mandatory**: Agents must include confidence scores with every numeric output.
- **Source-attributing**: Agents must list data sources used for each assessment.
- **Limitation-aware**: Agents must flag when data is insufficient rather than guessing.

## 6. Tool Usage Disclosure

Currently, OmniSight agents do not use external tool integrations (e.g., web search, email, calendar). All analysis is performed on data provided through the platform's database and user inputs. If tools are added in the future, they will be disclosed here with their purpose and access scope.

## 7. Data Handling and Privacy

### 7.1 Database

- All persistent data is stored in the provisioned MongoDB database: `app_d35edbe23760fcbc1d91f5a0`.
- Collections: `users`, `risk_scores`, `pre_risk_alerts`, `simulation_runs`, `action_logs`, `alerts`, `executive_summaries`, `feedback_reports`.

### 7.2 Row-Level Security

- User data is scoped per authenticated user via row-level security (RLS).
- Each record is tagged with `owner_user_id` automatically.
- Users can only read, update, and delete their own data.
- No cross-user data access is possible through the application.

### 7.3 Data Retention

- Data persists in the database until explicitly deleted by the user.
- No data is exported to external services without explicit user action.
- Agent processing is stateless -- agents do not retain data between invocations beyond what is stored in the database.

## 8. Human-in-the-Loop Controls

- **No autonomous execution**: OmniSight provides recommendations and simulations but never executes business decisions without user confirmation.
- **Simulation-first**: Before any action recommendation, the system presents three scenarios (no-action, recommended, auto-execution) so the user can evaluate trade-offs.
- **User-initiated analysis**: All risk assessments are triggered by user queries or scheduled reports -- the system does not independently initiate actions.
- **Override capability**: Users can dismiss alerts, adjust risk scores, or reject recommendations at any point.

## 9. Failure Modes and Fallback Behavior

| Failure Scenario | System Behavior |
|---|---|
| Sub-agent timeout or error | Executive Orchestrator reports partial results with a note indicating which agent(s) failed and which data sections are incomplete |
| Insufficient input data | Agent returns a low confidence score and flags the output as data-limited rather than fabricating values |
| Conflicting sub-agent outputs | Executive Orchestrator reports the conflict explicitly and presents both assessments with their respective confidence levels |
| Database unavailable | API routes return error responses; UI displays error state; no data loss occurs as writes are transactional |
| Model API unavailable | Agent calls return error; UI shows retry option; no stale data is presented as fresh |

## 10. Bias and Fairness Considerations

- **Historical bias**: The Intervention Feedback agent recalibrates based on historical outcomes. If past data reflects biased decisions, recalibration may perpetuate those biases. Users should review feedback reports critically.
- **Data representation**: Risk scores depend on available data. If certain clients, teams, or regions have less data coverage, their risk assessments will have lower confidence -- this is disclosed via the `data_sources` and `confidence_pct` fields.
- **No demographic profiling**: OmniSight analyzes business metrics (revenue, engagement, workforce allocation) and does not profile individuals based on protected characteristics.
- **Transparency over certainty**: The system prefers disclosing uncertainty (low confidence) over presenting incomplete analysis as definitive.

## 11. Audit Trail and Accountability

### 11.1 What Is Logged

- Every risk assessment is stored in the `risk_scores` collection with timestamp, input summary, and confidence metadata.
- Pre-risk alerts are stored in `pre_risk_alerts` with severity, signal type, and detection time.
- Simulation runs are stored in `simulation_runs` with all three scenarios and their projected outcomes.
- Action recommendations and their outcomes are tracked in `action_logs`.
- Executive summaries are stored in `executive_summaries` for historical review.
- Intervention feedback reports are stored in `feedback_reports` with before/after impact scores.

### 11.2 Traceability

- Each output links back to the data sources used (via `data_sources` arrays in the response schema).
- Confidence scores provide a measure of how well-supported each conclusion is.
- The executive summary provides human-readable top-level insights that can be reviewed against the underlying data.

## 12. Limitations and Boundaries

- **Data dependency**: Output quality is directly tied to input data quality and completeness. The system discloses when data is insufficient or stale.
- **Not autonomous**: OmniSight provides intelligence and simulations but does not execute business decisions without explicit user authorization.
- **Confidence transparency**: All outputs include confidence levels. Low-confidence outputs are flagged rather than presented as definitive.
- **Historical bias risk**: Feedback recalibration relies on historical outcomes, which may not fully predict novel scenarios.
- **No real-time streaming**: Analysis is performed on data snapshots, not continuous real-time feeds.
- **Model limitations**: As LLM-based agents, outputs are probabilistic. The structured output schema and confidence scoring mitigate but do not eliminate the possibility of incorrect assessments.
- **Single-platform dependency**: All agents run on the Lyzr platform. Platform availability directly affects system availability.

## 13. Version and Change Tracking

- **Spec version**: 0.1.0
- **Application version**: 1.0.0
- **Agent definitions**: Stored in `/agents/*/agent.yaml` files with platform IDs for traceability.
- **Response schemas**: Auto-generated and stored in `/response_schemas/` for each agent.
- **Workflow state**: Tracked in `workflow_state.json` with all agent IDs and database configuration.
- Changes to agent behavior (instructions, model, temperature) are managed through the Lyzr platform and reflected in the agent configuration.
