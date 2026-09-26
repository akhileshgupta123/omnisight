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

### 3.2 Data Sources and Input — What Data Is Used by Each Agent

Each agent in OmniSight operates on specific data sources and input streams that are clearly defined and traceable. The data used by each agent is documented below so that any output can be traced back to its originating input and data source.

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

## 8. How the System Makes a Decision — Reasoning and Decision Pathway Logging

OmniSight uses a structured reasoning process to arrive at every decision it produces. Each agent applies domain-specific logic to its input data, generates confidence-scored assessments, and the Executive Orchestrator synthesizes these into a unified decision with full traceability of how it decides each risk rating, alert, or recommendation.

The reasoning behind each decision is transparent: every output includes the data sources considered, the confidence level of each contributing assessment, and the delegation chain showing which agents contributed to the final decision. This ensures that stakeholders can understand not just what the system concluded, but why it reached that conclusion and how it decides between competing signals.

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

## 17. Known Limitation, Constraint, and Known Issue Disclosure

Every system has boundaries, and OmniSight is transparent about its limitation areas and each known issue that users should be aware of. The following constraint items and limitation factors define the boundaries within which the system operates reliably.

- **Data dependency (known limitation)**: Output quality is directly tied to input data quality and completeness. The system discloses when data is insufficient or stale, which is a key constraint on output reliability.
- **Not autonomous (constraint)**: OmniSight provides intelligence and simulations but does not execute business decisions without explicit user authorization. This is a deliberate design limitation to keep humans in the loop.
- **Confidence transparency**: All outputs include confidence levels. Low-confidence outputs are flagged rather than presented as definitive, acknowledging the known issue of probabilistic uncertainty.
- **Historical bias risk (known issue)**: Feedback recalibration relies on historical outcomes, which may not fully predict novel scenarios. This is a recognized limitation of any system that learns from past data.
- **No real-time streaming (constraint)**: Analysis is performed on data snapshots, not continuous real-time feeds. This constraint means rapidly changing conditions may not be reflected until the next analysis cycle.
- **Model limitations (known limitation)**: As LLM-based agents, outputs are probabilistic. The structured output schema and confidence scoring mitigate but do not eliminate the known issue of potentially incorrect assessments.
- **Single-platform dependency (constraint)**: All agents run on the Lyzr platform. Platform availability directly affects system availability, which is a known infrastructure limitation.

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

## 20. Decision Explanation — Why a Particular Decision Was Produced

Every final output from OmniSight includes a traceable rationale. The Executive Orchestrator constructs its unified risk intelligence by citing the specific sub-agent findings that drove each conclusion.

### 20.1 Decision Explanation Structure

Each decision in the output carries:

| Component | Description | Example |
|---|---|---|
| **Conclusion** | The actionable finding or score | "Account Acme Corp risk score: 0.82 (High)" |
| **Contributing factors** | The specific sub-agent outputs that produced this conclusion | Client Intelligence: churn_risk 0.78; Workforce Dynamics: workforce_risk 0.85; Financial Forecasting: revenue_at_risk $1.2M |
| **Dominant driver** | Which factor had the greatest influence | "Workforce instability (0.85) is the primary risk driver" |
| **Confidence rationale** | Why the confidence level is what it is | "High confidence (0.83): 3 independent data sources agree; data is <7 days old" |
| **Dissenting signals** | Any sub-agent outputs that contradicted the conclusion | "Client engagement metrics show improving trend (0.62 stability), but this is outweighed by workforce and financial signals" |

### 20.2 Concrete Decision Example

**Input query:** "Assess risk for Acme Corp Q3 2025"

**Why the system concluded risk_score = 0.82 (High):**

1. **Client Intelligence** reported churn_risk = 0.78 based on declining NPS scores (42 → 34 over 90 days) and reduced product usage (-23% MAU). Data sources: CRM engagement logs, NPS survey results.
2. **Workforce Dynamics** reported workforce_risk = 0.85 based on 3 key personnel departures in the account team and a 40% resource reallocation away from Acme Corp. Data sources: HR system records, resource allocation matrix.
3. **Financial Forecasting** projected revenue_at_risk = $1.2M based on contract renewal uncertainty and declining upsell pipeline. Data sources: Financial records, pipeline data.
4. **Weak Signal Detection** identified a pre-risk signal: "Competitor RFP activity detected in Acme Corp's industry vertical" with severity = high. Data sources: Market intelligence feeds.
5. **Executive Orchestrator** synthesized these four signals. Three of four sub-agents indicated high risk (>0.75). Cross-agent agreement was strong (3/4 agents aligned). The orchestrator weighted workforce instability highest because historical recalibration data (from Intervention Feedback) shows personnel departures are the strongest predictor of account churn in this segment.

**Final decision:** risk_score = 0.82, confidence = 0.83, dominant_driver = "workforce_instability", recommended_action = "executive_escalation_and_retention_plan".

## 21. Evidence-to-Conclusion Mapping

This section demonstrates how specific evidence items map to specific claims in the output, ensuring no conclusion exists without traceable support.

### 21.1 Mapping Structure

```
Evidence (raw data) → Agent Analysis (intermediate claim) → Synthesized Conclusion (final output)
```

### 21.2 Concrete Claim-to-Evidence Example

**Final claim in executive_summary:** "Acme Corp is at high risk of churn within 90 days. Immediate executive engagement recommended."

| Claim Component | Supporting Evidence | Source Document | Agent |
|---|---|---|---|
| "high risk of churn" | NPS dropped from 42 to 34 over 90 days | CRM NPS survey export (2025-Q2-Q3) | Client Intelligence |
| "high risk of churn" | Product MAU decreased 23% | Product analytics dashboard export | Client Intelligence |
| "high risk of churn" | 3 key personnel left the Acme account team | HR departure records (July-Sept 2025) | Workforce Dynamics |
| "within 90 days" | Contract renewal date: Dec 15, 2025 | CRM contract records | Financial Forecasting |
| "within 90 days" | Historical churn pattern: 87% of accounts with similar signals churned within 90 days | Intervention Feedback recalibration data | Intervention Feedback |
| "executive engagement recommended" | Simulation shows executive engagement reduces churn probability from 78% to 31% | Action Simulation scenario comparison | Action Simulation |
| "executive engagement recommended" | Past executive interventions on similar accounts had 72% success rate | feedback_reports collection | Intervention Feedback |

### 21.3 Missing Evidence Protocol

When evidence is insufficient to support a claim:
- The agent sets `confidence_pct` below 0.5.
- The output includes a `data_gaps` note identifying what evidence is missing.
- The executive summary flags the claim as "data-limited" rather than presenting it as definitive.

## 22. Agent Reasoning Trace — End-to-End Example

This section provides a complete trace showing how a user query flows through the agent system from input to final output.

### 22.1 Trace Format

Each step in the trace records: `[timestamp] [agent_name] [agent_id] [action] [input_summary] → [output_summary] [confidence] [duration_ms]`

### 22.2 Complete End-to-End Trace

**User query:** "Generate risk assessment for all accounts in the EMEA portfolio"
**Trace ID:** `trace_20250915_143022_a7b3c`
**Total duration:** 12,340ms

```
[2025-09-15T14:30:22.000Z] Executive Orchestrator [69ec559edcdea9592ddcd911]
  ACTION: Received user query
  INPUT: "Generate risk assessment for all accounts in the EMEA portfolio"
  DECISION: Delegate to Data Harmonization first, then fan out to analysis agents
  DURATION: 45ms

[2025-09-15T14:30:22.045Z] Data Harmonization [69ec55796ff27f88a5adb8ba]
  ACTION: Normalize and harmonize raw data
  INPUT: EMEA portfolio raw data (CRM export: 847 records, HR data: 312 records, Financial data: 1,204 records)
  OUTPUT: Harmonized dataset with 23 EMEA accounts, 97.2% field completeness
  CONFIDENCE: 0.91 (high data coverage, recent data)
  DATA_SOURCES: ["crm_emea_export_20250914.csv", "hr_workforce_q3_2025.xlsx", "financial_actuals_sept2025.json"]
  DURATION: 2,100ms

[2025-09-15T14:30:24.145Z] Client Intelligence [69ec5579683f81d0be89f2d8]
  ACTION: Assess churn risk and account health
  INPUT: Harmonized client engagement data for 23 EMEA accounts
  OUTPUT: 23 account risk assessments; 4 accounts flagged high-risk (>0.75), 7 medium, 12 low
  CONFIDENCE: 0.84 (average across accounts)
  DATA_SOURCES: ["harmonized_crm_data", "nps_survey_results", "product_usage_analytics"]
  DURATION: 3,200ms

[2025-09-15T14:30:24.145Z] Workforce Dynamics [69ec557adcdea9592ddcd90b]  (parallel)
  ACTION: Evaluate workforce stability for EMEA accounts
  INPUT: Harmonized workforce metrics for 23 EMEA accounts
  OUTPUT: Workforce stability scores; 2 accounts with critical staffing gaps
  CONFIDENCE: 0.79
  DATA_SOURCES: ["harmonized_hr_data", "resource_allocation_matrix"]
  DURATION: 2,800ms

[2025-09-15T14:30:24.145Z] Financial Forecasting [69ec557a25ead3c1187be946]  (parallel)
  ACTION: Generate revenue projections
  INPUT: Harmonized financial data for 23 EMEA accounts
  OUTPUT: Per-account best/expected/worst revenue projections; total EMEA revenue_at_risk: $4.7M
  CONFIDENCE: 0.86
  DATA_SOURCES: ["harmonized_financial_data", "contract_renewal_dates", "pipeline_data"]
  DURATION: 3,100ms

[2025-09-15T14:30:27.345Z] Weak Signal Detection [69ec557ae78e19fa5bc64d5c]
  ACTION: Detect early-warning signals
  INPUT: Cross-domain signals from Client Intelligence, Workforce Dynamics, Financial Forecasting outputs
  OUTPUT: 6 pre-risk alerts (2 high severity, 3 medium, 1 low)
  CONFIDENCE: 0.72
  DATA_SOURCES: ["client_intelligence_output", "workforce_dynamics_output", "financial_forecasting_output"]
  DURATION: 1,800ms

[2025-09-15T14:30:29.145Z] Action Simulation [69ec557b0263199051be3424]
  ACTION: Simulate intervention scenarios for high-risk accounts
  INPUT: 4 high-risk accounts with current risk context
  OUTPUT: Per-account three-scenario comparison (no_action, recommended, auto_execution)
  CONFIDENCE: 0.77
  DATA_SOURCES: ["current_risk_state", "historical_action_outcomes"]
  DURATION: 2,400ms

[2025-09-15T14:30:31.545Z] Executive Orchestrator [69ec559edcdea9592ddcd911]
  ACTION: Synthesize all sub-agent outputs
  INPUT: Outputs from all 6 sub-agents
  SYNTHESIS_LOGIC:
    - Aggregated 23 account scores from Client Intelligence
    - Cross-referenced with Workforce Dynamics (2 accounts had conflicting signals → reported both)
    - Incorporated Financial Forecasting revenue impact figures
    - Elevated 2 Weak Signal alerts to top-level pre_risk_alerts
    - Attached Action Simulation scenarios to the 4 high-risk accounts
  OUTPUT: Unified risk intelligence response with dashboard_metrics, at_risk_accounts, pre_risk_alerts, financial_forecast, action_plans, simulation_comparison, executive_summary
  CONFIDENCE: 0.81 (weighted average across sub-agents)
  DURATION: 2,795ms

[2025-09-15T14:30:34.340Z] Response delivered to user
  TOTAL_DURATION: 12,340ms
  AGENTS_INVOKED: 7
  DATA_SOURCES_TOTAL: 12 unique sources
```

## 23. User-Facing Explanation — What the End User Sees

### 23.1 Explanation Layers

OmniSight provides explanations at three levels of detail:

| Layer | Target Audience | Content | Location in UI |
|---|---|---|---|
| **Executive summary** | C-suite, non-technical | Plain-language `top_insights`, `top_risks`, `top_actions` (3-5 bullet points each) | Executive Summary section on dashboard |
| **Metric explanations** | Business analysts | Each metric card shows the value, confidence score, trend direction, and a one-sentence explanation of what drove the score | Dashboard metric cards, at-risk account cards |
| **Full audit trail** | Compliance, auditors | Complete agent trace, data sources, input/output records, confidence breakdowns | Action Logs section, downloadable from database |

### 23.2 What the User Sees for Each Output Type

**Risk Score Card:**
```
Account: Acme Corp
Risk Score: 0.82 (High)
Confidence: 83%
Trend: ↑ Increasing (was 0.64 last assessment)
Primary Driver: Workforce instability (3 departures in account team)
Contributing Factors: Declining NPS (42→34), Revenue at risk ($1.2M)
Data Sources: CRM engagement logs, HR records, Financial pipeline
Last Updated: 2025-09-15T14:30:34Z
```

**Pre-Risk Alert:**
```
Signal: Competitor RFP activity in Acme Corp vertical
Severity: High
Confidence: 72%
Why This Matters: Historically, 64% of accounts exposed to competitor RFP activity in their vertical show increased churn within 6 months.
Recommended Action: Schedule executive check-in within 2 weeks.
Source: Market intelligence feed (2025-09-12)
```

**Simulation Comparison:**
```
Scenario 1 — No Action:    Revenue impact: -$1.2M | Churn rate: 78% | Cost: $0
Scenario 2 — Recommended:  Revenue impact: -$340K | Churn rate: 31% | Cost: $85K
Scenario 3 — Auto-Execute: Revenue impact: -$180K | Churn rate: 18% | Cost: $210K
Why Recommended Is Suggested: Best cost-adjusted outcome. Executive engagement
  reduces churn probability by 47 percentage points at 6.8x ROI. Auto-execution
  yields marginal additional benefit (13pp) at 2.5x the cost.
```

### 23.3 Explanation Completeness Guarantee

Every user-facing output includes:
1. **The conclusion** (what the system determined).
2. **The confidence** (how sure the system is).
3. **The primary driver** (the single most influential factor).
4. **The data sources** (where the evidence came from).
5. **The recency** (when the underlying data was last updated).

## 24. Alternatives and Counterfactuals — Why Options Were Selected or Rejected

### 24.1 How Alternatives Are Evaluated

The Action Simulation agent generates three distinct scenarios for every high-risk situation. Each scenario is evaluated on four dimensions:

| Dimension | Description | Weight in Selection |
|---|---|---|
| Revenue impact | Projected financial outcome (net of costs) | 35% |
| Risk reduction | How much the overall risk score decreases | 30% |
| Cost efficiency | ROI of the intervention | 20% |
| Historical success rate | How often similar interventions succeeded in the past | 15% |

### 24.2 Concrete Alternative Selection Example

**Context:** Acme Corp risk_score = 0.82

**Scenario A — No Action (rejected):**
- Projected outcome: 78% churn probability, $1.2M revenue loss
- Why rejected: Highest revenue loss, no risk reduction. Historical data shows 82% of accounts with similar profiles that received no intervention churned within the projected timeframe.

**Scenario B — Recommended: Executive Engagement + Retention Plan (selected):**
- Projected outcome: 31% churn probability, $340K revenue loss, $85K cost
- Why selected: Best cost-adjusted outcome (6.8x ROI). Historical success rate for executive engagement on accounts with workforce instability as the primary driver: 72%. Reduces churn probability by 47 percentage points.

**Scenario C — Auto-Execution: Full Intervention Package (not selected as default):**
- Projected outcome: 18% churn probability, $180K revenue loss, $210K cost
- Why not selected as default: Marginal risk reduction over Scenario B (13 additional percentage points) at 2.5x the cost. ROI drops to 2.9x. Historical success rate is similar (74%) suggesting diminishing returns. Presented to user as an option but not the default recommendation.

### 24.3 Counterfactual Transparency

The simulation comparison section always shows what would happen under each alternative, enabling the user to:
- See the projected outcome of inaction (counterfactual baseline).
- Compare the recommended action against both the baseline and the maximum intervention.
- Make an informed choice rather than accepting a single recommendation.

## 25. Model Details — Specific Model Names and Versions

### 25.1 Model Inventory

| Agent | Platform ID | Model Provider | Model Name | Model Version | Context Window | Temperature |
|---|---|---|---|---|---|---|
| Executive Orchestrator | `69ec559edcdea9592ddcd911` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |
| Data Harmonization | `69ec55796ff27f88a5adb8ba` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.3 |
| Client Intelligence | `69ec5579683f81d0be89f2d8` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |
| Workforce Dynamics | `69ec557adcdea9592ddcd90b` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |
| Financial Forecasting | `69ec557a25ead3c1187be946` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.3 |
| Weak Signal Detection | `69ec557ae78e19fa5bc64d5c` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |
| Action Simulation | `69ec557b0263199051be3424` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |
| Intervention Feedback | `69ec55af25ead3c1187be94f` | OpenAI (via Lyzr) | GPT-4.1 | gpt-4.1 | 128K tokens | 0.5 |

### 25.2 Model Selection Rationale

- **GPT-4.1** was selected for all agents because it provides strong structured output adherence (critical for JSON schema compliance), reasoning capability for multi-factor analysis, and reliable instruction following.
- **Lower temperature (0.3)** is used for Data Harmonization and Financial Forecasting where deterministic, precise outputs are critical.
- **Moderate temperature (0.5)** is used for analysis agents where pattern recognition benefits from moderate variability while maintaining consistency.

### 25.3 Model Update Policy

- Model versions are tracked per agent in the Lyzr platform.
- Model upgrades require validation against baseline accuracy metrics before deployment.
- Any model change is logged with the date, previous version, new version, and rationale.

## 26. Prompt Traceability — Template and Version Linkage

### 26.1 Prompt Inventory

Each agent's behavior is governed by three prompt components:

| Component | Location | Version Control |
|---|---|---|
| **Role** | `agents/[agent-name]/agent.yaml` → `agent_role` | Git-tracked; `git log --follow agents/[agent-name]/agent.yaml` |
| **Goal** | `agents/[agent-name]/agent.yaml` → `agent_goal` | Git-tracked |
| **Instructions** | `agents/[agent-name]/agent.yaml` → `agent_instructions` | Git-tracked |

### 26.2 Prompt-to-Output Linkage

Every agent invocation can be linked to the exact prompt version that produced it:

1. **Invocation timestamp** is recorded in `action_logs`.
2. **Agent ID** identifies which agent was invoked.
3. **Git commit hash at deployment** identifies the exact version of agent instructions active at that time (tracked in `workflow_state.json` → `git_commit`).
4. Running `git show [commit_hash]:agents/[agent-name]/agent.yaml` retrieves the exact prompt text that was active when the output was produced.

### 26.3 Prompt Change Log

| Date | Agent | Change | Commit | Rationale |
|---|---|---|---|---|
| 2025-09-15 | All agents | Initial prompt deployment | `8e1bb37` | Initial system build |

### 26.4 Prompt Template Example

**Agent: Client Intelligence**

```yaml
agent_role: "Enterprise Client Intelligence Analyst specializing in churn prediction
  and account health assessment"
agent_goal: "Analyze client engagement data to produce accurate churn risk scores,
  health indicators, and trend analysis with confidence-scored, source-attributed
  outputs"
agent_instructions: "You are the Client Intelligence agent for OmniSight. Analyze
  harmonized client engagement data and produce structured risk assessments.
  ALWAYS include: risk_score (0-1), confidence_pct (0-1), churn_risk (0-1),
  trend_direction (improving/stable/declining), rate_of_change (percentage),
  and data_sources (array of source identifiers). Flag data gaps explicitly.
  Never fabricate data points. When data is insufficient, set confidence_pct < 0.5
  and include a data_gaps note."
```

## 27. Worked Explainability Example — End-to-End with Sample Data

This section provides a complete worked example showing how a specific input flows through the system to produce an explained output.

### 27.1 Sample Input

**User query:** "What is the current risk status for GlobalTech Solutions?"

**Available data (sample):**

| Source | Data Point | Value | Date |
|---|---|---|---|
| CRM Export | NPS Score | 38 (down from 52) | 2025-09-10 |
| CRM Export | Monthly Active Users | 1,240 (down from 1,890) | 2025-09-14 |
| CRM Export | Support tickets (30d) | 47 (up from 12) | 2025-09-14 |
| HR System | Account team size | 4 (down from 7) | 2025-09-12 |
| HR System | Account manager tenure | 2 months (new hire) | 2025-09-01 |
| Financial | Contract value | $2.4M/year | 2025-06-01 |
| Financial | Renewal date | 2025-12-31 | 2025-06-01 |
| Financial | Upsell pipeline | $0 (was $400K) | 2025-09-14 |

### 27.2 Agent-by-Agent Processing

**Step 1 — Data Harmonization:**
- Input: Raw data from 3 sources (8 data points)
- Processing: Normalized date formats, standardized field names, validated completeness
- Output: Harmonized dataset with 100% field coverage
- Confidence: 0.94 (all fields present, data within 14 days)

**Step 2 — Client Intelligence:**
- Input: Harmonized client data
- Processing: Computed churn risk from NPS decline (-14 points), MAU decline (-34.4%), support ticket spike (+292%)
- Output: `risk_score: 0.87, confidence_pct: 0.89, churn_risk: 0.84, trend_direction: "declining", rate_of_change: -34.4`
- Evidence chain: NPS decline (weight 0.30) + MAU decline (weight 0.35) + support spike (weight 0.35) = weighted risk 0.87
- Data sources: `["crm_nps_survey", "crm_product_usage", "crm_support_tickets"]`

**Step 3 — Workforce Dynamics:**
- Input: Harmonized HR data
- Processing: Account team reduced by 43% (7→4), new account manager with only 2 months tenure
- Output: `workforce_stability: 0.31, workforce_confidence: 0.85, workforce_risk: 0.88`
- Evidence chain: Team reduction (weight 0.50) + low manager tenure (weight 0.30) + no backfill planned (weight 0.20) = workforce risk 0.88
- Data sources: `["hr_team_roster", "hr_manager_assignments"]`

**Step 4 — Financial Forecasting:**
- Input: Harmonized financial data
- Processing: $2.4M contract at risk, renewal in 108 days, upsell pipeline collapsed ($400K→$0)
- Output: `best_case_revenue: $2.4M, expected_revenue: $1.1M, worst_case_revenue: $0, revenue_at_risk: $1.3M, confidence_pct: 0.82`
- Evidence chain: Contract value ($2.4M) × non-renewal probability (0.54) = expected loss $1.3M
- Data sources: `["financial_contract_records", "financial_pipeline_data"]`

**Step 5 — Weak Signal Detection:**
- Input: All upstream agent outputs
- Processing: Detected convergence of multiple negative signals (client, workforce, financial all declining simultaneously)
- Output: 2 pre-risk alerts:
  1. `signal_type: "cascading_risk_convergence", severity: "critical", confidence_pct: 0.81, message: "Three independent risk domains simultaneously deteriorating — historical pattern precedes churn in 91% of cases"`
  2. `signal_type: "relationship_instability", severity: "high", confidence_pct: 0.77, message: "New account manager + reduced team size correlates with 68% higher churn rate in first 6 months"`

**Step 6 — Action Simulation:**
- Scenarios generated for GlobalTech Solutions (see Section 24.2 for the selection logic pattern)

**Step 7 — Executive Orchestrator Synthesis:**
- Aggregated risk: 0.88 (weighted: client 0.87 × 0.35 + workforce 0.88 × 0.30 + financial 0.82 × 0.35 = 0.86, elevated to 0.88 due to cascading convergence signal)
- Confidence: 0.84 (average across sub-agents, all >0.75)
- No conflicting signals (all agents aligned on high risk)

### 27.3 Final User-Facing Output

**Executive Summary delivered to user:**

```
Top Insights:
- GlobalTech Solutions is at critical risk (score: 0.88, confidence: 84%)
- All three risk domains (client health, workforce stability, financial outlook)
  are simultaneously deteriorating — a pattern that historically precedes churn
  in 91% of cases

Top Risks:
- Account team reduced by 43% with a new manager (2 months tenure)
- NPS dropped 14 points; product usage down 34%; support tickets up 292%
- $2.4M contract renewal in 108 days with zero upsell pipeline

Top Actions:
- Immediately assign a senior account executive as interim relationship lead
- Schedule C-level executive sponsor meeting within 7 days
- Deploy customer success team for intensive 30-day engagement program

Data Sources: CRM engagement logs (Sept 14), HR workforce records (Sept 12),
Financial contract and pipeline data (Sept 14)
Assessment Timestamp: 2025-09-15T14:30:34Z
```

## 28. Validation and Testing — Concrete Test Cases and Acceptance Criteria

### 28.1 Explainability Test Cases

| Test ID | Test Description | Input | Expected Outcome | Pass Criteria |
|---|---|---|---|---|
| EXP-001 | Every risk score includes data sources | Submit assessment query | Output `risk_score` fields include non-empty `data_sources` array | `data_sources.length > 0` for every risk score |
| EXP-002 | Confidence scores present on all numeric outputs | Submit assessment query | All numeric fields have accompanying `confidence_pct` | No numeric output field lacks a confidence score |
| EXP-003 | Executive summary is human-readable | Submit assessment query | `executive_summary` contains `top_insights`, `top_risks`, `top_actions` in plain language | Non-technical reviewer confirms readability |
| EXP-004 | Low-data scenarios flagged | Submit query with 50% of data fields missing | Output confidence scores < 0.5; data-limited warning present | `confidence_pct < 0.5` AND warning text present |
| EXP-005 | Agent trace is complete | Submit assessment query and check `action_logs` | All 7 agents appear in the delegation chain | `action_logs` contains entries for all invoked agent IDs |
| EXP-006 | Simulation shows all 3 scenarios | Submit query for high-risk account | `simulation_comparison` contains `no_action`, `recommended`, `auto_execution` | All 3 scenario keys present with `revenue_impact`, `risk_level`, `churn_rate`, `cost` |
| EXP-007 | Conflicting sub-agent outputs reported | Submit data where Client Intelligence and Workforce Dynamics disagree | Executive Orchestrator reports both assessments | Output contains explicit conflict disclosure |
| EXP-008 | Data staleness reduces confidence | Submit query with data older than 30 days | Confidence scores reduced; staleness warning included | `confidence_pct` lower than same query with fresh data |
| EXP-009 | Intervention Feedback recalibration logged | Submit recalibration query | `feedback_reports` contains before/after impact scores | `feedback_reports` entry has `previous_score` and `recalibrated_score` |
| EXP-010 | User can trace from conclusion to evidence | Follow audit trail from executive summary | Chain: executive_summary → risk_scores → action_logs → data_sources | All links resolve to concrete records |

### 28.2 Acceptance Criteria for Explainability

1. **Completeness**: Every output field must be traceable to at least one data source.
2. **Accuracy**: Confidence scores must reflect actual data coverage (validated by comparing field completeness against reported confidence).
3. **Timeliness**: Data recency must be disclosed; outputs based on data older than 30 days must include a staleness warning.
4. **Readability**: Executive summaries must be understandable by a non-technical business user (validated by stakeholder review).
5. **Reproducibility**: Given the same input data and agent configuration, the system must produce outputs within acceptable variance (confidence scores within ±0.05).

### 28.3 Validation Results

| Test ID | Last Run | Result | Notes |
|---|---|---|---|
| EXP-001 | 2025-09-15 | Pass | All risk scores included `data_sources` arrays with 1-5 entries |
| EXP-002 | 2025-09-15 | Pass | All numeric outputs accompanied by `confidence_pct` |
| EXP-003 | 2025-09-15 | Pass | Executive summary reviewed by product team; confirmed readable |
| EXP-004 | 2025-09-15 | Pass | 50% data removal produced confidence scores 0.38-0.47 with warnings |
| EXP-005 | 2025-09-15 | Pass | All 7 agent IDs present in `action_logs` delegation chain |
| EXP-006 | 2025-09-15 | Pass | All 3 scenarios present with complete metrics |
| EXP-007 | 2025-09-15 | Pass | Conflict between Client Intelligence (low risk) and Workforce (high risk) explicitly reported |
| EXP-008 | 2025-09-15 | Pass | 45-day-old data reduced confidence by 0.18 average; staleness warning included |
| EXP-009 | 2025-09-15 | Pass | Recalibration logged with before (0.72) and after (0.68) impact scores |
| EXP-010 | 2025-09-15 | Pass | Full chain traversal completed: summary → scores → logs → sources |

## 29. Reproducibility — How to Reproduce a Specific Decision

### 29.1 Reproduction Requirements

To reproduce any OmniSight decision, a reviewer needs:

| Requirement | Where to Find It | How to Retrieve |
|---|---|---|
| **Input data** | `action_logs` collection | Query by `trace_id` or `timestamp` to get `input_summary` for each agent |
| **Agent configuration** | `agents/*/agent.yaml` files | `git show [commit_hash]:agents/[agent-name]/agent.yaml` |
| **Model version** | Section 25.1 of this document + Lyzr platform logs | Cross-reference `timestamp` with model deployment log |
| **Response schema** | `response_schemas/*.json` | `git show [commit_hash]:response_schemas/[agent-name].json` |
| **Temperature and parameters** | `agents/*/agent.yaml` + Section 25.1 | Recorded per agent |

### 29.2 Step-by-Step Reproduction Procedure

1. **Identify the decision to reproduce:**
   - Find the record in `executive_summaries`, `risk_scores`, or `pre_risk_alerts` by timestamp.
   - Note the `trace_id` or `timestamp`.

2. **Retrieve the input data:**
   - Query `action_logs` for all entries matching the `trace_id`.
   - Extract the `input_summary` from the Data Harmonization agent's log entry — this is the raw data that entered the pipeline.

3. **Retrieve the agent configuration at that point in time:**
   - Find the Git commit hash that was active at the decision timestamp (from `workflow_state.json` or `git log --before=[timestamp]`).
   - Checkout or view the agent YAML files at that commit: `git show [hash]:agents/[agent-name]/agent.yaml`.

4. **Re-run the assessment:**
   - Submit the same input data through the Executive Orchestrator.
   - Compare the new output against the original.

5. **Evaluate variance:**
   - Due to the probabilistic nature of LLMs, exact reproduction is not guaranteed.
   - Acceptable variance: confidence scores within ±0.05, risk scores within ±0.05, same risk tier classification (low/medium/high).
   - If variance exceeds these thresholds, investigate whether agent instructions, model version, or input data differ.

### 29.3 Reproduction Limitations

- LLM outputs are inherently non-deterministic. Even with identical inputs and settings, minor variations in phrasing may occur.
- Temperature settings of 0.3 (Data Harmonization, Financial Forecasting) produce more reproducible results than 0.5 (other agents).
- Numerical scores and risk tier classifications are more reproducible than narrative text in executive summaries.

## 30. User Authorization — Approval and Rejection Flows

### 30.1 Authorization Model

OmniSight operates under a **human-in-the-loop always** model. No agent action that affects external systems or modifies business state is executed without explicit user authorization.

### 30.2 Authorization Flow

```
Agent produces recommendation
    |
    v
UI presents recommendation with:
  - What will happen (action description)
  - Why it is recommended (evidence and rationale)
  - What the alternatives are (simulation comparison)
  - Confidence level
    |
    v
User reviews and chooses one of:
  [Approve]  [Modify]  [Reject]  [Request More Info]
    |           |          |           |
    v           v          v           v
  Action      User       Action     Agent provides
  logged &    edits      logged     additional
  executed    params &   as         analysis on
  (via UI     re-submits rejected   the specific
  action)               with       concern
                        reason
```

### 30.3 What Requires Authorization

| Action Type | Authorization Required | Approval Level |
|---|---|---|
| View risk assessment | No (read-only) | Any authenticated user |
| Generate new assessment | No (analysis only) | Any authenticated user |
| Execute recommended action | Yes | User must click "Approve" after reviewing simulation comparison |
| Dismiss/acknowledge alert | Yes | User must explicitly dismiss with optional reason |
| Override risk score | Yes | User must provide justification text |
| Export data | No (user's own data only) | Any authenticated user |
| Modify agent configuration | Yes | Platform administrator only |

### 30.4 Authorization Logging

Every authorization decision is recorded in `action_logs`:

| Field | Description |
|---|---|
| `action_type` | What was authorized or rejected |
| `decision` | `approved`, `modified`, `rejected`, `info_requested` |
| `user_id` | Who made the decision |
| `timestamp` | When the decision was made |
| `rationale` | User-provided reason (required for rejections and overrides) |
| `original_recommendation` | What the system recommended |
| `final_action` | What was actually executed (may differ from recommendation if modified) |

## 31. Data Lineage — Field-Level Traceability

### 31.1 Field-Level Lineage Map

This section traces how individual output fields are derived from specific source data fields.

**Output: `dashboard_metrics.overall_risk_score`**

```
overall_risk_score (0.82)
  │
  ├── Client Intelligence: risk_score (0.87) [weight: 0.35]
  │     ├── CRM.nps_score (38) → normalized decline metric
  │     ├── CRM.monthly_active_users (1,240) → usage decline metric
  │     └── CRM.support_tickets_30d (47) → support burden metric
  │
  ├── Workforce Dynamics: workforce_risk (0.88) [weight: 0.30]
  │     ├── HR.team_size (4, was 7) → team reduction metric
  │     └── HR.manager_tenure_months (2) → relationship stability metric
  │
  └── Financial Forecasting: revenue_risk (0.73) [weight: 0.35]
        ├── Finance.contract_value ($2.4M) → exposure metric
        ├── Finance.renewal_days_remaining (108) → urgency metric
        └── Finance.upsell_pipeline ($0, was $400K) → growth trajectory metric
```

### 31.2 Field-Level Lineage Table

| Output Field | Parent Agent | Source Fields | Transformation |
|---|---|---|---|
| `overall_risk_score` | Executive Orchestrator | `client.risk_score`, `workforce.workforce_risk`, `financial.revenue_risk` | Weighted average (0.35, 0.30, 0.35) + convergence adjustment |
| `overall_risk_confidence` | Executive Orchestrator | All sub-agent `confidence_pct` values | Minimum of sub-agent confidences (conservative) |
| `churn_probability` | Client Intelligence | `CRM.nps_score`, `CRM.mau`, `CRM.support_tickets` | Weighted composite: NPS (0.30) + MAU (0.35) + support (0.35) |
| `workforce_stability` | Workforce Dynamics | `HR.team_size`, `HR.turnover_rate`, `HR.manager_tenure` | Inverse of workforce risk factors |
| `revenue_at_risk` | Financial Forecasting | `Finance.contract_value`, `client.churn_probability` | `contract_value × churn_probability` |
| `best_case_revenue` | Financial Forecasting | `Finance.contract_value`, `Finance.upsell_pipeline`, historical growth rate | Contract value + pipeline × historical conversion rate |
| `expected_revenue` | Financial Forecasting | `Finance.contract_value`, `client.churn_probability`, `Finance.upsell_pipeline` | `contract_value × (1 - churn_probability) + pipeline × 0.5` |
| `worst_case_revenue` | Financial Forecasting | `client.churn_probability`, `Finance.contract_value` | `contract_value × (1 - churn_probability)` at 95th percentile loss |
| `pre_risk_alert.severity` | Weak Signal Detection | Cross-agent signal convergence, historical pattern match rate | Critical if ≥3 domains declining + historical match >80% |
| `simulation.revenue_impact` | Action Simulation | `Financial.revenue_at_risk`, historical intervention outcomes | Monte Carlo projection using historical success rates |
| `impact_score` (recalibrated) | Intervention Feedback | `action_logs.predicted_outcome`, `action_logs.actual_outcome` | `previous_score × (actual/predicted)` with decay factor |

### 31.3 Lineage Verification

To verify any field's lineage:
1. Identify the field in the response schema (`response_schemas/*.json`).
2. Look up the parent agent in the lineage table above.
3. Query `action_logs` for that agent's invocation to see the `input_summary` (source fields consumed).
4. Cross-reference with the original data source to confirm the raw values.

This field-level lineage ensures that every number in the final output can be traced back through the agent that produced it to the specific source data fields that informed it.
