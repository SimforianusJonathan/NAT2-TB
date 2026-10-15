# GenoHack 2026 — Agentic AI Build Brief

## Project: NAT2-TB Precision Monitor

### Precision Diagnostics / Pharmacogenomics for Indonesia

> **Purpose of this file**
>
> This document is a build brief for an AI coding agent. The goal is to create a polished **local-only prototype** that can be shown through screenshots and linked through GitHub in a maximum 3-page GenoHack 2026 research/technology proposal.
>
> The prototype does **not** need deployment. Running on `localhost` is sufficient.
>
> **Important:** This is a hackathon research prototype, not a clinically validated medical device. Do not present outputs as medical advice or validated dosing recommendations.

---

# 1. Core Concept

Build a decision-support prototype that demonstrates how **NAT2 pharmacogenomics + Indonesian TB pharmacokinetic evidence + basic clinical factors** could help identify tuberculosis patients who may require more intensive monitoring during isoniazid therapy.

The system should focus on two opposing risks:

1. **Potential overexposure / toxicity risk**
   - More relevant in NAT2 slow acetylators.

2. **Potential underexposure risk**
   - More relevant in NAT2 rapid acetylators.

The innovation is **not** “NAT2-guided dosing”, because that already exists in the literature.

The prototype should instead demonstrate:

> **Risk-adaptive precision monitoring:** use pharmacogenomic and clinical information to identify which patients may need routine monitoring versus intensified monitoring / possible TDM review.

An additional innovation layer should be:

> **Evidence confidence / applicability:** show how strong the evidence behind each recommendation is, and distinguish global evidence from Indonesian-specific evidence.

---

# 2. Product Positioning

### One-line concept

**A pharmacogenomics-guided monitoring system that identifies Indonesian TB patients at higher risk of isoniazid overexposure or underexposure before treatment problems emerge.**

### Key insight

Precision medicine should not mean expensive monitoring for everyone.

It should help answer:

> **Who needs precision monitoring most?**

### Intended users

Primary:

- TB clinicians
- Clinical pharmacists
- TB program / hospital teams

Secondary:

- Research institutions
- Precision medicine programs
- Public health stakeholders

---

# 3. Prototype Goal

The localhost application must demonstrate the following story:

1. Clinician opens a patient case.
2. Patient has NAT2 genotype / phenotype.
3. System combines:
   - NAT2 acetylator phenotype
   - weight
   - isoniazid dose
   - baseline liver status
   - selected clinical risk factors
4. System generates:
   - predicted monitoring risk category
   - overexposure/toxicity risk
   - underexposure risk
   - monitoring recommendation
   - reasoning/explanation
   - evidence confidence
5. Clinician updates follow-up data.
6. Risk state can change longitudinally.
7. System clearly shows that **genotype is static but patient monitoring needs may change over time**.

---

# 4. Important Scientific Guardrails

Do NOT implement or claim:

- validated personalized dosing
- validated clinical treatment recommendations
- direct diagnosis
- automatic medication changes
- exact toxicity probability unless backed by an actual validated model
- exact AUC prediction unless a validated equation/model is implemented from a source

For the hackathon prototype, use transparent labels such as:

- `Low monitoring priority`
- `Elevated monitoring priority`
- `High monitoring priority`
- `Potential overexposure concern`
- `Potential underexposure concern`
- `Consider clinical review / therapeutic drug monitoring`
- `Research prototype — not for clinical use`

If no validated numerical model is implemented, the risk engine must be explicitly labeled:

> **Prototype rule-based risk stratification for demonstration purposes.**

Do not fabricate sensitivity, specificity, AUROC, or clinical performance.

---

# 5. MVP Scope

Keep the MVP narrow.

### Pharmacogene

- NAT2 only

### Drug

- Isoniazid only

### Disease

- Tuberculosis

### Population focus

- Indonesia

### Clinical variables

Use a limited set:

- Age
- Sex
- Weight
- Isoniazid daily dose
- NAT2 genotype
- NAT2 phenotype
- Baseline ALT
- Baseline AST
- Follow-up ALT
- Follow-up AST
- Symptoms flag
- Adherence flag
- Optional isoniazid concentration field
- Treatment day

Do not add unrelated genes, diseases, drugs, or multi-omics.

---

# 6. Required Screens / Pages

## A. Landing / Overview

Purpose:
Explain the problem in <10 seconds.

Hero copy concept:

**Precision TB monitoring, guided by pharmacogenomics.**

Subtext:

> NAT2 variation can substantially affect isoniazid metabolism. This prototype combines pharmacogenomic and clinical information to identify patients who may benefit from intensified monitoring.

Include 3 concise cards:

- Genomic risk
- Clinical monitoring
- Indonesian evidence

Include visible label:

`Research prototype — not for clinical use`

---

## B. Patient Dashboard

Show a list of 4–6 synthetic patients.

Columns:

- Patient ID
- NAT2 phenotype
- Current treatment day
- Monitoring priority
- Main risk
- Last update

Example:

- TB-001 — Slow acetylator — Day 0 — High — Potential overexposure
- TB-002 — Rapid acetylator — Day 14 — High — Potential underexposure
- TB-003 — Intermediate — Day 14 — Moderate — Rising liver enzymes
- TB-004 — Intermediate — Day 0 — Low — Routine monitoring

Use synthetic patient data only.

---

## C. Patient Detail

This is the core demo screen.

### Section 1 — Patient Profile

- Age
- Sex
- Weight
- TB treatment day
- INH dose

### Section 2 — Pharmacogenomic Profile

- NAT2 genotype
- NAT2 phenotype
- phenotype explanation

Example:

**NAT2 Slow Acetylator**

> Reduced acetylation capacity may increase isoniazid exposure compared with faster acetylator phenotypes.

### Section 3 — Dual Risk View

Show two independent horizontal risk indicators:

**Potential Overexposure / Toxicity Concern**
`HIGH`

**Potential Underexposure Concern**
`LOW`

Avoid fake probability percentages unless explicitly marked as demo-only.

### Section 4 — Monitoring Recommendation

Example:

**High monitoring priority**

Rationale:

- NAT2 slow acetylator phenotype
- current dose / body weight context
- elevated follow-up ALT
- treatment day 14

Suggested action:

- Clinical review
- Consider intensified liver monitoring
- Consider whether TDM is appropriate

Again: no autonomous treatment change.

### Section 5 — Why this result?

Make the reasoning transparent.

Example:

```
NAT2 slow acetylator
        ↓
Potential slower isoniazid clearance
        ↓
Higher exposure concern
        +
ALT increased at follow-up
        ↓
Monitoring priority increased
```

---

## D. Longitudinal Timeline

Show:

### Day 0

- NAT2 phenotype
- baseline ALT / AST
- initial monitoring category

### Day 14

- new ALT / AST
- symptoms
- adherence
- optional drug concentration

### Updated risk state

The UI should visually communicate:

> Genotype did not change. Monitoring priority did.

This is a key demo moment.

---

## E. Evidence Panel

For each rule or interpretation, show:

- Evidence source name
- Evidence type
- Geography
- Confidence / applicability label

Suggested categories:

### Global evidence

- NAT2–isoniazid pharmacogenomics
- pharmacokinetic evidence

### Indonesian evidence

- Indonesian NAT2 / TB studies
- Indonesian population PK evidence

Example UI:

| Evidence                     | Scope     | Applicability              |
| ---------------------------- | --------- | -------------------------- |
| NAT2 affects INH metabolism  | Global    | High                       |
| NAT2-associated liver injury | Indonesia | Moderate–High              |
| Indonesian INH population PK | Indonesia | High                       |
| Exact patient-specific dose  | —         | Not validated in prototype |

Do not create fake citations. Add citation placeholders in a single source file so they can later be replaced with verified references.

---

# 7. Prototype Risk Logic

Create a transparent rule engine, not a black-box AI model.

Example conceptual logic:

```ts
if (nat2Phenotype === "slow") {
  overexposureConcern += 2;
}

if (nat2Phenotype === "rapid") {
  underexposureConcern += 2;
}

if (followUpALT is meaningfully elevated vs baseline) {
  overexposureConcern += 1;
}

if (symptomsFlag === true) {
  overexposureConcern += 1;
}

if (optionalDrugConcentration === "low") {
  underexposureConcern += 2;
}

if (adherence === "poor") {
  flagInterpretationUncertain = true;
}
```

Then translate score bands to:

- Low
- Moderate
- High

Do not pretend this rule engine is clinically validated.

In the UI display:

`Prototype rule-based stratification`

---

# 8. Optional Evidence Confidence Layer

Each result may have:

- **Evidence Strength**
- **Indonesian Applicability**
- **Data Completeness**

Example:

```
Evidence Strength: HIGH
Indonesian Applicability: MODERATE-HIGH
Patient Data Completeness: 85%
```

Use simple deterministic logic.

Example:

- NAT2 phenotype available → + evidence completeness
- Indonesian-specific evidence exists → high applicability
- missing follow-up labs → reduced patient-data confidence
- optional TDM absent → interpretation remains provisional

Again, this is a prototype confidence framework, not a validated clinical score.

---

# 9. Demo Scenarios

Create at least 4 synthetic demo patients.

## Patient 1 — Slow Acetylator / Toxicity Concern

- NAT2: slow acetylator
- normal baseline ALT
- increased ALT at day 14
- adherence good

Expected:

- High monitoring priority
- Potential overexposure concern
- Intensified liver monitoring suggested

---

## Patient 2 — Rapid Acetylator / Underexposure Concern

- NAT2: rapid acetylator
- liver labs normal
- optional low INH concentration

Expected:

- High monitoring priority
- Underexposure concern
- Consider TDM / exposure review

---

## Patient 3 — Intermediate / Stable

- NAT2: intermediate
- normal labs
- no symptoms
- adherence good

Expected:

- Low or routine monitoring priority

---

## Patient 4 — Intermediate / Dynamic Escalation

Day 0:

- normal labs
- routine monitoring

Day 14:

- ALT/AST rise
- symptoms appear

Expected:

- monitoring priority changes from low → elevated/high

This patient demonstrates the longitudinal concept.

---

# 10. UI / Design Direction

The app should look like a credible precision medicine / clinical decision-support prototype.

Avoid:

- generic hackathon gradient
- excessive glassmorphism
- neon AI visuals
- chatbot-first UI

Preferred:

- clean white background
- dark text
- restrained clinical UI
- clear cards
- strong information hierarchy
- readable tables
- high-quality typography
- subtle status badges

Visual hierarchy:

1. Patient status
2. Genomic phenotype
3. Risk state
4. Monitoring recommendation
5. Reasoning
6. Evidence

The prototype must look polished enough for proposal screenshots.

---

# 11. Recommended Tech Stack

Preferred:

- Next.js
- TypeScript
- Tailwind CSS
- local static / mock data
- no external backend required

Optional:

- shadcn/ui
- Recharts for small longitudinal charts

No deployment required.

Run:

```bash
npm install
npm run dev
```

Expected:
`http://localhost:3000`

---

# 12. Suggested Repository Structure

```text
genohack-nat2-tb/
├── README.md
├── package.json
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── patients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── evidence/
│   │       └── page.tsx
│   ├── components/
│   │   ├── PatientCard.tsx
│   │   ├── RiskIndicator.tsx
│   │   ├── GenomicProfile.tsx
│   │   ├── EvidencePanel.tsx
│   │   ├── Timeline.tsx
│   │   └── MonitoringRecommendation.tsx
│   ├── data/
│   │   ├── patients.ts
│   │   └── evidence.ts
│   ├── lib/
│   │   └── riskEngine.ts
│   └── types/
│       └── patient.ts
└── public/
```

---

# 13. README Requirements

README should include:

## Problem

Explain NAT2 variability and why one-size-fits-all monitoring may be inefficient.

## Solution

Explain risk-adaptive precision monitoring.

## Why Indonesia

Mention:

- high TB burden
- Indonesian NAT2 / pharmacokinetic evidence exists
- limited resource environments benefit from prioritization

Do not include unsupported numerical claims unless sources are attached.

## Prototype

Explain:

- synthetic patients
- rule-based demonstration
- no clinical validation
- no medical use

## Run locally

```bash
npm install
npm run dev
```

## Screenshots

Create `/docs/screenshots/` and save the final screenshots there.

---

# 14. Screenshots Required for Proposal

Capture clean screenshots of:

### Screenshot 1 — Main Patient Dashboard

Shows:

- several patients
- different NAT2 phenotypes
- different monitoring priorities

Purpose:
Show the system at a glance.

### Screenshot 2 — High-Risk Patient Detail

Shows:

- NAT2 phenotype
- dual risk indicators
- monitoring recommendation
- transparent reasoning

Purpose:
Show core innovation.

### Screenshot 3 — Longitudinal Risk Change

Shows Day 0 vs Day 14.

Purpose:
Demonstrate dynamic monitoring.

### Optional Screenshot 4 — Evidence Panel

Shows Indonesian evidence / confidence.

Purpose:
Strengthen scientific credibility.

Use browser screenshot or high-resolution OS screenshot.
Do not include browser clutter if avoidable.

---

# 15. GitHub Preparation

Before finalizing:

- clean commit history
- complete README
- clear project title
- no secrets
- no unnecessary `.env`
- no fake API integration
- no broken buttons
- all important navigation works
- include screenshots in repository
- include disclaimer

Suggested GitHub description:

> Pharmacogenomics-guided risk-adaptive monitoring prototype for isoniazid therapy in Indonesian tuberculosis care.

---

# 16. What the Agent Must NOT Build

Do not waste time on:

- authentication
- database
- user accounts
- payment
- deployment
- mobile app
- real hospital integration
- SATUSEHAT integration
- genomic sequencing pipeline
- LLM chatbot
- multiple genes
- multiple drugs
- real dosing calculator

The goal is a **credible decision-support proof of concept**, not a full clinical product.

---

# 17. Proposal Support

The prototype will support a maximum **3 A4-page GenoHack proposal** containing:

1. Background and problem statement
2. Proposed research / technology / innovation
3. Development plan
4. Current or proposed team
5. Partner / user support, if any
6. Current Technology Readiness Level
7. Early prototype / lo-fi design

The prototype screenshots should be inserted primarily in:

- Proposed innovation
- Early prototype / lo-fi design

A GitHub link can be placed near the prototype figure.

---

# 18. Suggested Technology Readiness Level

Unless actual clinical validation already exists, present the project conservatively as approximately:

**TRL 2–3**

- Technology concept formulated
- Experimental proof-of-concept prototype being developed

Do not claim clinical validation.

---

# 19. Development Roadmap for Proposal

## Phase 1 — Hackathon

- literature-backed concept
- rule-based prototype
- synthetic patients
- localhost dashboard
- evidence map

## Phase 2 — Technical validation

- retrospective clinical dataset
- refine risk model
- compare against existing monitoring workflow
- assess sensitivity / specificity / calibration where appropriate

## Phase 3 — Clinical pilot

- prospective observational study
- clinician usability testing
- workflow integration
- health-economic assessment

## Phase 4 — Scale-up

- broader TB centers
- validated pharmacokinetic integration
- potential integration with national health infrastructure

---

# 20. Success Criteria for the Coding Agent

The task is complete when:

- [ ] App runs locally without error
- [ ] Landing page is polished
- [ ] Patient dashboard works
- [ ] At least 4 synthetic patients exist
- [ ] Patient detail page works
- [ ] NAT2 phenotype is visible
- [ ] dual-risk concept is visible
- [ ] monitoring recommendation is visible
- [ ] explanation / reasoning is visible
- [ ] longitudinal update is visible
- [ ] evidence confidence panel exists
- [ ] disclaimers are visible
- [ ] screenshots are captured
- [ ] README is complete
- [ ] project is GitHub-ready

---

# 21. Final Instruction to the Coding Agent

Prioritize **clarity, scientific restraint, and demonstration value** over feature count.

The strongest demo should make the reviewer understand within seconds:

> Two TB patients receiving the same drug can have different metabolic risk because of NAT2 variation, and their monitoring needs can change as clinical evidence accumulates.

Build only what is necessary to make that story convincing.
