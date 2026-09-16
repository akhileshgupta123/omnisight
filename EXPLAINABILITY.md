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

### 5.1 Model Inventory

All agents are powered by large language models accessed through the Lyzr platform. The complete model inventory:

| Agent | Platform ID | Role | Temperature | Validation Cadence |
|---|---|---|---|---|
| Executive Orchestrator | `69ec559edcdea9592ddcd911` | Manager | Moderate | Quarterly |
| Data Harmonization | `69ec55796ff27f88a5adb8ba` | Worker | Low | Quarterly |
| Client Intelligence | `69ec5579683f81d0be89f2d8` | Worker | Moderate | Quarterly |
| Workforce Dynamics | `69ec557adcdea9592ddcd90b` | Worker | Moderate | Quarterly |
| Financial Forecasting | `69ec557a25ead3c1187be946` | Worker | Low | Quarterly |
| Weak Signal Detection | `69ec557ae78e19fa5bc64d5c` | Worker | Moderate | Quarterly |
| Action Simulation | `69ec557b0263199051be3424` | Worker | Moderate | Quarterly |
| Intervention Feedback | `69ec55af25ead3c1187be94f` | Worker (Independent) | Moderate | Quarterly |

Each agent has:

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

## 6. Risk Tier and Compliance Configuration

### 6.1 Risk Tier Declaration

OmniSight is classified at **risk tier: high**.

**Rationale:** The platform provides risk intelligence that directly informs enterprise business decisions including resource allocation, client retention strategy, and financial forecasting. While it does not autonomously execute decisions, its assessments carry significant influence on high-stakes outcomes.

### 6.2 Compliance Controls

| Control | Status | Details |
|---|---|---|
| Human-in-the-loop | `always` | All actions require user confirmation; no autonomous execution |
| Audit logging | Enabled | All agent invocations, inputs, outputs, and timestamps are logged to the database |
| Kill switch | Available | System can be halted by disabling the Executive Orchestrator agent via the Lyzr platform; all sub-agents cease operation immediately |
| Immutable logs | Enabled | Audit records in `action_logs`, `risk_scores`, and `executive_summaries` collections are append-only; historical records are never modified |
| Quarterly validation | Scheduled | Agent behavior, model drift, and output accuracy are reviewed quarterly against baseline metrics |

### 6.3 Compliance Artifacts

- `agent.yaml` -- Central manifest with agent inventory, delegation mode, platform IDs, and database configuration.
- `SOUL.md` -- Agent identity, personality, core behaviors, and guardrails.
- `EXPLAINABILITY.md` -- This document; full transparency and accountability disclosure.
- `agents/*/agent.yaml` -- Per-agent configuration files with roles, goals, and instructions.
- `response_schemas/*.json` -- Auto-generated response schemas for each agent.

## 7. Segregation of Duties

### 7.1 Role Definitions

| Role | Agent(s) | Responsibility |
|---|---|---|
| Maker | Data Harmonization, Client Intelligence, Workforce Dynamics, Financial Forecasting, Weak Signal Detection | Produce raw analysis, risk scores, projections, and signals |
| Checker | Executive Orchestrator | Validates, cross-references, and synthesizes maker outputs; resolves conflicts between sub-agent assessments |
| Executor | Action Simulation | Simulates intervention scenarios; presents options for human approval (no autonomous execution) |
| Auditor | Intervention Feedback | Independently reviews historical outcomes, recalibrates impact scores, generates accountability reports |

### 7.2 Conflict Matrix

| Role Pair | Held by Same Agent? | Rationale |
|---|---|---|
| Maker + Checker | No | Sub-agents produce; Orchestrator validates |
| Maker + Auditor | No | Intervention Feedback is independent of real-time analysis agents |
| Checker + Executor | No | Orchestrator synthesizes; Action Simulation handles scenario modeling separately |
| Checker + Auditor | No | Orchestrator handles real-time synthesis; Intervention Feedback handles post-hoc review independently |
| Executor + Auditor | No | Action Simulation proposes; Intervention Feedback reviews outcomes after the fact |

### 7.3 Handoff Workflows

Critical actions require multi-agent participation:

1. **Risk Assessment Flow**: Data Harmonization (maker) produces normalized data -> Client Intelligence + Workforce Dynamics + Financial Forecasting (makers) produce domain scores -> Executive Orchestrator (checker) validates and synthesizes -> User reviews unified output.
2. **Action Recommendation Flow**: Executive Orchestrator (checker) identifies risk -> Action Simulation (executor) generates three scenarios -> User selects action -> Intervention Feedback (auditor) tracks outcome for future recalibration.
3. **Recalibration Flow**: Intervention Feedback (auditor) independently analyzes historical outcomes -> Publishes recalibrated impact scores -> Executive Orchestrator incorporates updated scores in future assessments.

## 8. Decision Pathway Logging

### 8.1 What Is Logged Per Decision

Every agent invocation captures:

| Data Point | Description |
|---|---|
| Timestamp | ISO 8601 timestamp of invocation |
| Agent ID | Platform ID of the invoked agent |
| Agent Role | maker, checker, executor, or auditor |
| Input Summary | Structured summary of the query or data passed to the agent |
| Output | Full structured JSON response from the agent |
| Model Version | Model identifier used for the invocation (tracked by Lyzr platform) |
| Confidence Scores | All confidence values produced in the output |
| Data Sources | List of data sources referenced in producing the output |
| Delegation Chain | Which agent delegated to which (for manager-subagent calls) |
| Latency | Time taken from invocation to response |

### 8.2 Log Storage

- Agent invocation logs are stored in the `action_logs` collection with `owner_user_id` scoping.
- Risk assessment outputs are stored in `risk_scores` with full input/output records.
- Pre-risk alerts are stored in `pre_risk_alerts` with detection metadata.
- Simulation runs are stored in `simulation_runs` with all scenario comparisons.
- Executive summaries are stored in `executive_summaries` for historical traceability.

### 8.3 Traceability via Git

- All agent configuration changes are tracked via Git (`git diff` for change tracking, `git blame` for attribution).
- Agent definitions in `agents/*/agent.yaml` provide a version-controlled record of agent behavior over time.
- Response schemas in `response_schemas/` are version-controlled to track output structure changes.

## 9. Evidence — Source Documents Are Recorded

### 9.1 Source Document Recording Policy

Every agent output in OmniSight records the source documents and data inputs that contributed to its conclusions. This ensures that any risk score, alert, projection, or recommendation can be traced back to the specific evidence that produced it.

| Evidence Requirement | Implementation | Verification |
|---|---|---|
| Source documents are recorded | Every agent output includes a `data_sources` array listing all documents, datasets, and data feeds referenced | Stored in database collections alongside outputs |
| Input-to-output traceability | Each response schema field maps to identified source data via `data_sources` references | Queryable via `risk_scores`, `pre_risk_alerts`, `simulation_runs` collections |
| Evidence attribution per claim | Risk scores, alerts, and projections each carry their own `data_sources` list specific to that assessment | Enforced by agent instructions (source-attributing prompt principle) |
| Evidence preservation | Source document references are stored as part of the immutable audit record in the database | Append-only collections prevent retroactive modification |
| Evidence completeness flagging | When source data is incomplete or missing, agents flag the gap and reduce confidence scores rather than proceeding without evidence | Visible via `confidence_pct` < 0.5 and data-limited warnings |

### 9.2 How Source Documents Are Captured

1. **At ingestion**: The Data Harmonization agent records which raw data sources (uploaded files, data feeds, CRM exports, HR system exports, financial records) were processed and normalized.
2. **At analysis**: Each downstream agent (Client Intelligence, Workforce Dynamics, Financial Forecasting, Weak Signal Detection) logs which normalized datasets and upstream agent outputs it consumed in its `data_sources` output field.
3. **At synthesis**: The Executive Orchestrator records the complete set of sub-agent outputs that contributed to the unified risk intelligence response, preserving the full chain of evidence.
4. **At simulation**: The Action Simulation agent records the current risk state and historical action data used as inputs for its three-scenario comparison.
5. **At audit**: The Intervention Feedback agent records which `action_logs` and historical outcome records it analyzed to produce recalibrated impact scores.

### 9.3 Evidence Storage Locations

| Evidence Type | Storage Collection | Key Fields |
|---|---|---|
| Raw data source references | `risk_scores`, `pre_risk_alerts` | `data_sources` array |
| Agent input summaries | `action_logs` | `input_summary`, `agent_id`, `timestamp` |
| Sub-agent delegation chain | `action_logs` | `delegation_chain` |
| Simulation input state | `simulation_runs` | Input risk context, historical action data |
| Recalibration evidence | `feedback_reports` | Before/after impact scores, source `action_logs` referenced |
| Executive synthesis evidence | `executive_summaries` | Aggregated `data_sources` from all contributing sub-agents |

### 9.4 Evidence Retrieval

Any assessment can be audited by:
1. Querying the relevant collection (e.g., `risk_scores`) by timestamp and `owner_user_id`.
2. Inspecting the `data_sources` array to identify which source documents contributed.
3. Following the `delegation_chain` in `action_logs` to trace which agents participated.
4. Reviewing the input summaries to see exactly what data each agent received.

## 10. Tool Usage Disclosure

Currently, OmniSight agents do not use external tool integrations (e.g., web search, email, calendar). All analysis is performed on data provided through the platform's database and user inputs. If tools are added in the future, they will be disclosed here with their purpose and access scope.

## 11. Data Handling and Privacy

### 11.1 Database

- All persistent data is stored in the provisioned MongoDB database: `app_d35edbe23760fcbc1d91f5a0`.
- Collections: `users`, `risk_scores`, `pre_risk_alerts`, `simulation_runs`, `action_logs`, `alerts`, `executive_summaries`, `feedback_reports`.

### 11.2 Row-Level Security

- User data is scoped per authenticated user via row-level security (RLS).
- Each record is tagged with `owner_user_id` automatically.
- Users can only read, update, and delete their own data.
- No cross-user data access is possible through the application.

### 11.3 Data Governance and Bias Testing

- **Bias testing**: Enabled. The Intervention Feedback agent continuously evaluates whether historical intervention outcomes show systematic biases in risk scoring across client segments, regions, or teams.
- **Less Discriminatory Alternative (LDA) search**: When bias is detected in risk scoring patterns, the system flags the affected metrics and recommends recalibration.
- **Explainable adverse actions**: When a risk score exceeds a threshold or an alert is generated, the output includes `data_sources`, `confidence_pct`, and `trend_direction` so the user can understand exactly what drove the assessment.
- **Data quality validation**: Data Harmonization agent validates data completeness and flags missing or stale fields before downstream agents process them.

### 11.4 Data Retention

- Data persists in the database until explicitly deleted by the user.
- No data is exported to external services without explicit user action.
- Agent processing is stateless -- agents do not retain data between invocations beyond what is stored in the database.

## 12. Human-in-the-Loop Controls

- **No autonomous execution**: OmniSight provides recommendations and simulations but never executes business decisions without user confirmation.
- **Simulation-first**: Before any action recommendation, the system presents three scenarios (no-action, recommended, auto-execution) so the user can evaluate trade-offs.
- **User-initiated analysis**: All risk assessments are triggered by user queries or scheduled reports -- the system does not independently initiate actions.
- **Override capability**: Users can dismiss alerts, adjust risk scores, or reject recommendations at any point.

## 13. Failure Modes and Fallback Behavior

| Failure Scenario | System Behavior |
|---|---|
| Sub-agent timeout or error | Executive Orchestrator reports partial results with a note indicating which agent(s) failed and which data sections are incomplete |
| Insufficient input data | Agent returns a low confidence score and flags the output as data-limited rather than fabricating values |
| Conflicting sub-agent outputs | Executive Orchestrator reports the conflict explicitly and presents both assessments with their respective confidence levels |
| Database unavailable | API routes return error responses; UI displays error state; no data loss occurs as writes are transactional |
| Model API unavailable | Agent calls return error; UI shows retry option; no stale data is presented as fresh |

## 14. Bias and Fairness Considerations

- **Historical bias**: The Intervention Feedback agent recalibrates based on historical outcomes. If past data reflects biased decisions, recalibration may perpetuate those biases. Users should review feedback reports critically.
- **Data representation**: Risk scores depend on available data. If certain clients, teams, or regions have less data coverage, their risk assessments will have lower confidence -- this is disclosed via the `data_sources` and `confidence_pct` fields.
- **No demographic profiling**: OmniSight analyzes business metrics (revenue, engagement, workforce allocation) and does not profile individuals based on protected characteristics.
- **Transparency over certainty**: The system prefers disclosing uncertainty (low confidence) over presenting incomplete analysis as definitive.

## 15. Audit Trail and Accountability

### 15.1 What Is Logged

- Every risk assessment is stored in the `risk_scores` collection with timestamp, input summary, and confidence metadata.
- Pre-risk alerts are stored in `pre_risk_alerts` with severity, signal type, and detection time.
- Simulation runs are stored in `simulation_runs` with all three scenarios and their projected outcomes.
- Action recommendations and their outcomes are tracked in `action_logs`.
- Executive summaries are stored in `executive_summaries` for historical review.
- Intervention feedback reports are stored in `feedback_reports` with before/after impact scores.

### 15.2 Traceability

- Each output links back to the data sources used (via `data_sources` arrays in the response schema).
- Confidence scores provide a measure of how well-supported each conclusion is.
- The executive summary provides human-readable top-level insights that can be reviewed against the underlying data.

### 15.3 Retention Policy

- Audit logs are retained for a minimum of 3 years in the database.
- Historical records are append-only; past assessments are never modified or deleted by the system.
- Users may request data deletion for their own records per data retention policies.

## 16. Ongoing Monitoring and Drift Detection

### 16.1 Monitoring Framework

| Metric | Monitored By | Frequency | Action on Anomaly |
|---|---|---|---|
| Confidence score distribution | Executive Orchestrator | Per invocation | Flag if average confidence drops below 0.5 across assessments |
| Risk score accuracy | Intervention Feedback | Continuous | Recalibrate impact scores when predicted vs actual outcomes diverge by >20% |
| Agent response latency | Platform metrics | Continuous | Alert if agent response time exceeds thresholds |
| Data staleness | Data Harmonization | Per invocation | Flag stale data sources; reduce confidence scores accordingly |
| Cross-agent agreement rate | Executive Orchestrator | Per invocation | Report conflicts explicitly when sub-agents disagree |

### 16.2 Drift Detection

- The Intervention Feedback agent serves as the primary drift detection mechanism by comparing predicted outcomes against actual results over time.
- When recalibrated impact scores diverge significantly from initial predictions, the system flags potential model drift.
- Quarterly validation reviews assess whether agent outputs remain aligned with baseline accuracy metrics.

### 16.3 Outcomes Analysis

- Historical intervention outcomes are continuously analyzed by the Intervention Feedback agent.
- Success/failure rates of past recommendations are tracked and used to adjust future confidence scores.
- Trends in risk score accuracy over time are available in `feedback_reports` for review.

## 17. Limitations and Boundaries

- **Data dependency**: Output quality is directly tied to input data quality and completeness. The system discloses when data is insufficient or stale.
- **Not autonomous**: OmniSight provides intelligence and simulations but does not execute business decisions without explicit user authorization.
- **Confidence transparency**: All outputs include confidence levels. Low-confidence outputs are flagged rather than presented as definitive.
- **Historical bias risk**: Feedback recalibration relies on historical outcomes, which may not fully predict novel scenarios.
- **No real-time streaming**: Analysis is performed on data snapshots, not continuous real-time feeds.
- **Model limitations**: As LLM-based agents, outputs are probabilistic. The structured output schema and confidence scoring mitigate but do not eliminate the possibility of incorrect assessments.
- **Single-platform dependency**: All agents run on the Lyzr platform. Platform availability directly affects system availability.

## 18. Emergency Controls (Kill Switch)

- **Mechanism**: The Executive Orchestrator agent can be disabled via the Lyzr platform, immediately halting all sub-agent coordination and preventing new risk assessments.
- **Scope**: Disabling the manager agent stops all delegated sub-agent invocations. Independent agents (Intervention Feedback) can be disabled separately.
- **Recovery**: Re-enabling the Executive Orchestrator restores normal operation. No data is lost during a kill switch activation; all prior assessments remain in the database.
- **Authorization**: Kill switch activation requires platform administrator access.

## 19. Version and Change Tracking

- **Spec version**: 0.1.0
- **Application version**: 1.0.0
- **Agent definitions**: Stored in `/agents/*/agent.yaml` files with platform IDs for traceability.
- **Response schemas**: Auto-generated and stored in `/response_schemas/` for each agent.
- **Workflow state**: Tracked in `workflow_state.json` with all agent IDs and database configuration.
- **SOUL.md**: Agent identity, personality, and guardrails definition.
- **EXPLAINABILITY.md**: This document; full transparency and accountability disclosure.
- Changes to agent behavior (instructions, model, temperature) are managed through the Lyzr platform and reflected in the agent configuration.
- All configuration changes are version-controlled via Git for full auditability (`git diff` for changes, `git blame` for attribution).
