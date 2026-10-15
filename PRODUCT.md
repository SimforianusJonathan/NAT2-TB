# NAT2-TB Precision Monitor

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js, TypeScript and Tailwind CSS, as requested in the supplied build brief. Browser-local synthetic data; no backend, API keys, deployment, or Docker dependency.

## Users

TB clinicians, clinical pharmacists and hospital teams evaluating a hackathon proof of concept, with research reviewers as a secondary audience.

## Product Purpose

Demonstrate who might need closer monitoring during isoniazid therapy, and how monitoring needs can change while NAT2 genotype stays fixed.

## Capabilities and Constraints

Overview, four synthetic patient cases, dual independent concern indicators, transparent rule reasoning, editable longitudinal follow-up, evidence applicability and screenshots. No diagnosis, personalized dosing, exact exposure prediction, clinical performance or real patient data. Approximate concept maturity TRL 2–3, without clinical validation.

## Brand Commitments

The brief pins a restrained white clinical interface, dark readable text, strong hierarchy, subtle status badges and clear tables. Direct implementation is authorized by the user; the supplied brief settles audience, scope, visual direction and stack.

## Evidence on Hand

Original brief in docs/BUILD_BRIEF.md. Evidence records in src/data/evidence.ts distinguish verified literature metadata, applicability limitations and unvalidated prototype choices. No supplied clinical dataset or clinical validation.

## Product Principles

- Monitoring priority is a demonstration, not treatment advice.
- Separate exposure concerns from observed clinical signals.
- Show evidence limitations beside interpretations.
- Keep genotype static and follow-up changes inspectable.
