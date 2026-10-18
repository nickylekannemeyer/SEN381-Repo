# CivicConnect - Engineering Decision Matrices

**Project:** SEN381 CivicConnect · **Milestone:** M3 (evidence for PED v3.0 and the ADRs)
**Team:** Nickyle Kannemeyer (601754), Juan Cornel Smith (601822), Dylan James Spurrier (602299)

## Purpose and method

These matrices make the significant CivicConnect decisions defensible by showing the comparison that produced each one, rather than asserting the conclusion. They follow the Week 2 Day 3 method (Section 8, "From requirements to a defensible technology decision"):

1. Understand the scenario and the technology-relevant needs.
2. Define the criteria from project evidence, **before** scoring.
3. Eliminate any candidate that fails a mandatory constraint. A candidate that fails a mandatory constraint cannot win on points.
4. Weight each criterion (weights sum to 1.00) and say why the weight is what it is.
5. Define what each score means (1 = poor fit, 3 = adequate, 5 = strong fit), then score each candidate with evidence.
6. Run a sensitivity check: would a small, reasonable weight change reverse the result?
7. Use the matrix as **input to judgement, not a substitute**. Close totals are not decisive on their own.

Score scale used throughout: **1 poor · 2 weak · 3 adequate · 4 good · 5 strong.** Weighted total = sum of (weight x score).

Each matrix links to the ADR it supports and the ASRs or constraints its criteria come from. AI was used only to help structure these matrices after the evidence was gathered; version, licence and compatibility claims were verified against official documentation and are recorded in the AI Usage Register.

---

## DM-1 · Architecture style (supports ADR-003 / Section 5.3)

**Engineering concern:** choose the top-level architecture that satisfies the server-side authorization boundary (ASR-1), atomic persistence (ASR-3) and extensibility for a three-person team (ASR-5), on a fixed schedule (CON-001, CON-002).

**Mandatory constraints (eliminate first):**
- Must support a separate React client over a JSON API. **MVC as the top-level style fails this** (it assumes server-rendered views) and is eliminated.
- Must be deployable and recoverable by three people on the schedule (CON-001, CON-002). Microservices does not fail outright but is tested against this below.

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Team capability and schedule fit | 0.25 | CON-001/CON-002: three students, fixed time. The dominant delivery risk. |
| Extensibility and maintainability (ASR-5) | 0.25 | The team's stated priority: easy to extend and change. |
| Deployment and operational simplicity (ASR-6) | 0.20 | One thing to build, run, back up and recover. |
| Change locality | 0.15 | A change should stay inside one module. |
| Scalability headroom | 0.15 | Growth is expected but not large-scale yet (NFR-003). |

**Matrix:**

| Criterion | Weight | Modular monolith | Plain layered monolith | Microservices |
|---|---|---|---|---|
| Team capability / schedule | 0.25 | 5 | 5 | 2 |
| Extensibility (ASR-5) | 0.25 | 4 | 2 | 4 |
| Deployment simplicity | 0.20 | 5 | 5 | 2 |
| Change locality | 0.15 | 4 | 2 | 5 |
| Scalability headroom | 0.15 | 3 | 3 | 5 |
| **Weighted total** | **1.00** | **4.30** | **3.50** | **3.40** |

**Score evidence:** a plain layered monolith is as simple to set up but groups unrelated code by technical layer, so a change ripples across a whole layer as features grow (extensibility 2, change locality 2). Microservices give the strongest change locality and scaling but add networking, deployment and failure-handling overhead disproportionate to three developers and current scope (team capability 2, deployment 2).

**Sensitivity check:** even if the scalability weight is doubled (0.30) at the expense of team capability, the modular monolith still leads (approx 4.1 vs 3.6 for microservices). The result is not fragile.

**Decision:** **modular monolith with layered modules.** Trade-off: a module cannot yet be scaled or deployed on its own, accepted and recorded as a forward engineering consideration. A module can be split into its own service later through controlled change if a real need appears.

---

## DM-2 · Technology stack (supports ADR / Section 5.5)

**Engineering concern:** choose the stack that implements the architecture and data decisions, for a three-person team on a low-cost host. This is the Week 2 Day 3 Stack A (JavaScript) versus Stack B (C# on ASP.NET Core) comparison, carried into the project.

**Mandatory constraints:** must support role-based access and server-side auth (NFR-002, FR-010); must run on a free or low-cost host (CON-003); must be buildable and testable by the team on schedule. Both candidates pass, so neither is eliminated and the matrix decides.

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Team capability | 0.25 | CON-001/CON-003: team skill is the main delivery risk; familiarity is evidence about delivery risk, not about meeting requirements. |
| Deployment / host compatibility | 0.20 | Must run on the chosen free-tier PaaS (ASR-6, CON-003). |
| Maintainability | 0.15 | ASR-5. |
| Security and support | 0.15 | NFR-002 and patch responsiveness. |
| Ecosystem and testing | 0.15 | Available test tooling and libraries. |
| Cost / licensing | 0.10 | CON-003, free or low-cost preference. |

**Matrix:**

| Criterion | Weight | JavaScript (React, Node/Express, PostgreSQL) | C# on ASP.NET Core |
|---|---|---|---|
| Team capability | 0.25 | 4 | 3 |
| Deployment / host compatibility | 0.20 | 5 | 4 |
| Maintainability | 0.15 | 4 | 5 |
| Security and support | 0.15 | 4 | 5 |
| Ecosystem and testing | 0.15 | 5 | 5 |
| Cost / licensing | 0.10 | 5 | 4 |
| **Weighted total** | **1.00** | **4.45** | **4.20** |

**Score evidence:** one language front to back (React and Node) lowers the learning curve for a mixed-skill student team and shares tooling (team capability 4 vs 3). ASP.NET Core scores higher on maintainability and built-in security support (5 vs 4) as a mature, opinionated framework. Both have strong ecosystems and test tooling.

**Sensitivity check (important and honest):** the decisive criterion is team capability. If the team's C# capability were scored equal to its JavaScript capability (4), the totals tie at about 4.45. The decision therefore rests on an honest reading of the team's own skill, which is exactly why it is a judgement supported by the matrix and not an objective truth produced by it. Both stacks are defensible; CivicConnect selects JavaScript on team capability and cost.

**Decision:** **JavaScript stack.** Trade-off: the team takes on dependency and version management discipline (lock files, transitive dependencies) that a more opinionated framework would partly handle.

---

## DM-3 · Persistence model (supports ADR / Section 5.4)

**Engineering concern:** choose the persistence model for correctness-sensitive, related request data (SO8: read the data before naming a database).

**Mandatory constraint:** multi-entity transactional integrity so a status change and its history record succeed or fail together (ASR-3, FR-007). Key-value and document stores give weaker multi-row transactional guarantees, so they are at a mandatory disadvantage here rather than eliminated outright, and the matrix shows the gap.

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Transactional integrity | 0.30 | ASR-3 and FR-007 are the core correctness requirement. |
| Relationship modelling | 0.20 | Users, requests, categories and history are strongly related. |
| Query flexibility | 0.15 | Staff and management filtering and reporting. |
| Team familiarity | 0.15 | Delivery risk (CON-001). |
| Operational simplicity | 0.10 | One store to run and back up. |
| Growth fit | 0.10 | NFR-003, modest growth. |

**Matrix:**

| Criterion | Weight | Relational (PostgreSQL) | Document | Key-value |
|---|---|---|---|---|
| Transactional integrity | 0.30 | 5 | 3 | 2 |
| Relationship modelling | 0.20 | 5 | 3 | 1 |
| Query flexibility | 0.15 | 5 | 3 | 2 |
| Team familiarity | 0.15 | 4 | 3 | 3 |
| Operational simplicity | 0.10 | 4 | 4 | 5 |
| Growth fit | 0.10 | 4 | 4 | 3 |
| **Weighted total** | **1.00** | **4.65** | **3.20** | **2.20** |

**Sensitivity check:** relational leads on every requirement-driven criterion; no reasonable weight change reverses it.

**Decision:** **relational persistence on PostgreSQL**, with application and domain validation plus database constraints. Trade-off: schema changes are more deliberate than a schemaless store, accepted for the integrity guarantee.

---

## DM-4 · Request lifecycle design (supports ADR-001 / Section 5.6)

**Engineering concern:** represent the Open to In Progress to Resolved to Closed lifecycle so only valid transitions are allowed and a new status can be added without editing the others (ASR-5, FR-007).

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Extensibility (add a status without editing existing ones) | 0.30 | ASR-5, the stated priority. |
| Cohesion and clarity | 0.20 | The lifecycle is central to the system. |
| Testability | 0.20 | Transitions must be unit-testable. |
| Simplicity for current size | 0.15 | Only four states today. |
| Maintainability | 0.15 | ASR-5. |

**Matrix:**

| Criterion | Weight | State pattern | Scattered conditionals | Enum transition table |
|---|---|---|---|---|
| Extensibility | 0.30 | 5 | 2 | 4 |
| Cohesion and clarity | 0.20 | 5 | 2 | 4 |
| Testability | 0.20 | 5 | 3 | 4 |
| Simplicity for current size | 0.15 | 3 | 4 | 5 |
| Maintainability | 0.15 | 5 | 2 | 4 |
| **Weighted total** | **1.00** | **4.70** | **2.50** | **4.15** |

**Sensitivity check (honest):** the enum transition table is the real alternative, not the conditionals. If the "simplicity for current size" weight is raised to 0.30 (arguing four states is a small, stable set), the enum table closes to about 4.3 versus the State pattern at about 4.5. The State pattern is chosen, but the enum table is recorded as the reasonable fallback if the set of states stays small, exactly as noted in ADR-001.

**Decision:** **State pattern.** Trade-off: more small classes than a single conditional, accepted because the lifecycle is central and benefits from being explicit and testable.

---

## DM-5 · Recording and reacting to a status change (supports ADR-002 / Section 5.6, 5.7)

**Engineering concern:** guarantee the history/audit record for every status change (FR-007, ASR-3) while keeping non-critical reactions (feedback, future notifications) loosely coupled.

**Mandatory constraint:** the history record must be guaranteed. **"History as an Observer whose failure is tolerated" fails this mandatory constraint and is eliminated** - a failed observer could leave a status change with no history, breaking FR-007. This is the correction recorded in ADR-002.

**Criteria and weights (among the surviving options):**

| Criterion | Weight | Why this weight |
|---|---|---|
| Low coupling and extensibility | 0.35 | Must be able to add notifications later without touching the status logic. |
| Simplicity | 0.30 | Three-person team. |
| Clarity | 0.20 | The behaviour must be easy to reason about and test. |
| Future-notification fit | 0.15 | Deferred email/SMS feature. |

**Matrix:**

| Criterion | Weight | Transactional history + Observer for non-critical | Mediator | Direct method calls |
|---|---|---|---|---|
| Low coupling / extensibility | 0.35 | 5 | 4 | 2 |
| Simplicity | 0.30 | 4 | 2 | 5 |
| Clarity | 0.20 | 4 | 3 | 4 |
| Future-notification fit | 0.15 | 5 | 4 | 2 |
| **Weighted total** | **1.00** | **4.50** | **3.20** | **3.30** |

**Sensitivity check:** direct calls win only if simplicity is weighted far above coupling, which contradicts the stated extensibility priority. The chosen option is stable.

**Decision:** history and the status update commit inside **one database transaction** (critical, not an observer); the **Observer pattern handles only non-critical reactions after commit.** Trade-off: the service owns the transaction boundary explicitly, accepted because it is what guarantees FR-007.

---

## DM-6 · Concurrency control (supports ADR-002 / Section 5.4.5)

**Engineering concern:** prevent lost updates when two staff act on the same request, for a low-contention workload.

**Mandatory constraint:** must prevent a lost update on concurrent edits. **"No concurrency control" fails this and is eliminated.**

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Correctness under contention | 0.30 | The core requirement. |
| Fit to the usage pattern (low contention) | 0.25 | Same request edited at the same instant is rare. |
| Simplicity | 0.20 | Three-person team. |
| Responsiveness (no lock held during think-time) | 0.15 | NFR-001. |
| Scalability | 0.10 | NFR-003. |

**Matrix:**

| Criterion | Weight | Optimistic (version check) | Pessimistic locking |
|---|---|---|---|
| Correctness under contention | 0.30 | 4 | 5 |
| Fit to usage pattern | 0.25 | 5 | 2 |
| Simplicity | 0.20 | 4 | 3 |
| Responsiveness | 0.15 | 5 | 2 |
| Scalability | 0.10 | 5 | 2 |
| **Weighted total** | **1.00** | **4.50** | **3.10** |

**Important clarification (resolves the M2 inconsistency):** the version check is the only concurrency mechanism. It prevents a lost update across a fetch-edit-submit cycle where no lock is held. Atomicity of the status and history writes is a separate concern, provided by the surrounding transaction, not by a row lock. There is no `SELECT ... FOR UPDATE`. This removes the optimistic-versus-pessimistic contradiction raised in Milestone 2.

**Decision:** **optimistic concurrency (version check) only.** A version column is checked on every update; atomicity of the status and history writes comes from one transaction, not a row lock, so there is no pessimistic `SELECT ... FOR UPDATE`. Trade-off: a user whose update is rejected must refetch and retry, acceptable given low contention.

---

## DM-7 · Testing framework (supports ADR / Section 5.5.4)

**Engineering concern:** choose the test runner for the Node/Express backend, where all the current automated tests live (domain, state machine, authorization and API integration).

**Mandatory constraint:** must run the backend unit and API-integration tests in CI with minimal setup for a three-person team (CON-001, CON-003). All candidates pass, so the matrix decides.

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Zero/low dependency and config (CON-003) | 0.30 | Fewer tools to install, pin and manage is a direct project constraint. |
| Backend fit (Node/Express + supertest) | 0.25 | All current tests are backend behaviour. |
| Maturity and stability | 0.20 | Reliability of the test base. |
| Team familiarity | 0.15 | Delivery risk (CON-001). |
| Speed and feedback loop | 0.10 | Developer feedback loop. |

**Matrix:**

| Criterion | Weight | node:test (built-in) | Jest | Vitest |
|---|---|---|---|---|
| Zero/low dependency and config (CON-003) | 0.30 | 5 | 2 | 3 |
| Backend fit (Node/Express + supertest) | 0.25 | 5 | 4 | 4 |
| Maturity and stability | 0.20 | 4 | 5 | 3 |
| Team familiarity | 0.15 | 3 | 4 | 3 |
| Speed and feedback loop | 0.10 | 4 | 3 | 5 |
| **Weighted total** | **1.00** | **4.45** | **3.40** | **3.40** |

**Sensitivity check:** the built-in runner leads mainly on the zero-dependency criterion. If that weight is halved to 0.15 (arguing maturity should dominate), node:test and Jest draw close (about 4.0 versus 3.7), so the lead is not fragile. Jest's larger ecosystem and Vitest's Vite-native speed are real advantages and are not dismissed; they are judged a low-benefit gain for a small backend suite that adds a dependency to manage.

**Decision:** **Node's built-in test runner (`node --test`) with supertest.** Chosen to avoid adding a test-framework dependency and its configuration for a small project (CON-003); it covers the unit, state-transition, decision-table and API-integration tests needed. Jest or Vitest can be revisited if richer mocking or coverage reporting is required, or when the frontend grows a test suite (where Vitest's Vite integration would weigh more).

---

## DM-8 · Deployment target (supports ADR / Section 5.8)

**Engineering concern:** choose a deployment direction that is plausible, low-cost and recoverable for a three-person team.

**Mandatory constraints:** free or low-cost (CON-003); redeploy from the repository and restore from a backup (NFR-004); minimal operations for three people. Container orchestration (Kubernetes) does not meet the proportionality and operations constraint and is tested below rather than adopted.

**Criteria and weights:**

| Criterion | Weight | Why this weight |
|---|---|---|
| Cost (free tier) | 0.25 | CON-003. |
| Operational simplicity | 0.25 | Three-person team, no ops specialist. |
| Deploy-from-git fit | 0.20 | A single deployable pushed from the repo. |
| Recovery and backup fit | 0.15 | NFR-004. |
| Scalability headroom | 0.15 | NFR-003. |

**Matrix:**

| Criterion | Weight | git-push PaaS (e.g. Render free tier) | Self-managed VM | Container orchestration (Kubernetes) |
|---|---|---|---|---|
| Cost (free tier) | 0.25 | 5 | 3 | 2 |
| Operational simplicity | 0.25 | 5 | 2 | 1 |
| Deploy-from-git fit | 0.20 | 5 | 3 | 3 |
| Recovery and backup fit | 0.15 | 4 | 3 | 4 |
| Scalability headroom | 0.15 | 3 | 4 | 5 |
| **Weighted total** | **1.00** | **4.55** | **2.90** | **2.70** |

**Sensitivity check:** orchestration leads only on scalability; raising that weight cannot overcome its cost and operations penalties for this team and scope. Stable result.

**Decision:** **git-push PaaS with a free tier.** Trade-off: a shared free tier has a real capacity ceiling and the single managed database remains a single point of failure, recorded as a deployment risk and a forward engineering consideration. Orchestration is revisited only if demonstrated scale requires it.

---

## How these feed the submission

- Each matrix becomes the **comparison section of its ADR**, so every ADR shows the scored comparison before the decision (answers the Week 2 Day 3 ADR structure and the M2 feedback).
- The criteria trace back to the **ASRs and constraints**, which feeds the RTM.
- The closest decisions (DM-2 team capability, DM-4 enum fallback, DM-7 built-in runner vs Jest vs Vitest) are flagged for the **individual defence**, because an honest sensitivity check is stronger evidence than a rigged clean win.
- AI assistance in structuring these matrices is recorded in the **AI Usage Register**; all version, licence and compatibility claims are verified against official documentation.
