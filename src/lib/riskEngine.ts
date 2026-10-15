import type {
  Level,
  Patient,
  Reason,
  RiskResult,
  Visit,
} from "../types/patient";

export const RULE_VERSION = "1.0";
export const levelLabels: Record<Level, string> = {
  low: "Low",
  elevated: "Elevated",
  high: "High",
};
export const RULES = [
  ["NAT2 slow", "+2 overexposure concern"],
  ["NAT2 rapid", "+2 underexposure concern"],
  [
    "Baseline ALT or AST above supplied lab ULN",
    "+1 overexposure concern (once)",
  ],
  ["Follow-up ALT ≥2× baseline and above lab ULN", "+1 overexposure concern"],
  ["Follow-up AST ≥2× baseline and above lab ULN", "+1 overexposure concern"],
  ["Symptoms reported", "+1 overexposure concern; review floor: Elevated"],
  ["Concentration manually tagged low", "+2 underexposure concern"],
  [
    "Poor adherence or missing current labs",
    "Interpretation uncertain; review floor: Elevated",
  ],
  [
    "Current ALT or AST above supplied lab ULN",
    "Clinical review floor: Elevated, even without doubling",
  ],
  [
    "Score bands (each concern independently)",
    "0–1 Low · 2 Elevated · ≥3 High",
  ],
] as const;

export function validateVisit(visit: Visit, previousDay = -1): string[] {
  const errors: string[] = [];
  if (
    !Number.isInteger(visit.day) ||
    visit.day <= previousDay ||
    visit.day > 730
  )
    errors.push(
      `Treatment day must be a whole number after day ${previousDay} and no more than 730.`,
    );
  for (const key of ["alt", "ast"] as const) {
    const value = visit[key];
    if (
      value !== null &&
      (!Number.isFinite(value) || value <= 0 || value > 10000)
    )
      errors.push(
        `${key.toUpperCase()} must be between 0 (exclusive) and 10,000 U/L, or left blank.`,
      );
  }
  if (![true, false, null].includes(visit.symptoms))
    errors.push("Choose a valid symptom status.");
  if (!["good", "poor", "unknown"].includes(visit.adherence))
    errors.push("Choose a valid adherence status.");
  if (
    !["not-measured", "low", "within-reference", "uncertain"].includes(
      visit.concentration,
    )
  )
    errors.push("Choose a valid concentration interpretation.");
  if (
    visit.concentrationValue !== null &&
    (!Number.isFinite(visit.concentrationValue) ||
      visit.concentrationValue <= 0 ||
      visit.concentrationValue > 100)
  )
    errors.push("Concentration must be above 0 and at most 100 mg/L.");
  if (
    visit.sampleHours !== null &&
    (!Number.isFinite(visit.sampleHours) ||
      visit.sampleHours <= 0 ||
      visit.sampleHours > 48)
  )
    errors.push(
      "Sampling time must be above 0 and at most 48 hours after dose.",
    );
  if ((visit.concentrationValue === null) !== (visit.sampleHours === null))
    errors.push(
      "Provide both concentration and sampling time, or leave both blank.",
    );
  if (
    visit.concentration !== "not-measured" &&
    (visit.concentrationValue === null || visit.sampleHours === null)
  )
    errors.push("A tagged concentration requires a value and sampling time.");
  if (
    visit.concentration === "not-measured" &&
    (visit.concentrationValue !== null || visit.sampleHours !== null)
  )
    errors.push(
      "Choose a concentration interpretation for the entered measurement.",
    );
  if (!Number.isFinite(Date.parse(visit.recordedAt)))
    errors.push("Invalid recorded date.");
  return errors;
}

function band(score: number): Level {
  return score >= 3 ? "high" : score >= 2 ? "elevated" : "low";
}
export function evaluateRisk(
  patient: Patient,
  visit: Visit = patient.visits[patient.visits.length - 1],
): RiskResult {
  if (!patient.visits.length || !visit)
    throw new Error("A baseline visit is required.");
  const baseline = patient.visits[0];
  let overScore = 0,
    underScore = 0;
  const reasons: Reason[] = [],
    uncertainties: string[] = [];
  const add = (
    rule: string,
    text: string,
    direction: Reason["direction"],
    evidence: string[],
  ) => reasons.push({ rule, text, direction, evidence });
  if (patient.phenotype === "slow") {
    overScore += 2;
    add(
      "nat2-slow",
      "Slow acetylation may reduce isoniazid clearance (+2 overexposure concern).",
      "over",
      ["E01", "E02", "P01"],
    );
  }
  if (patient.phenotype === "rapid") {
    underScore += 2;
    add(
      "nat2-rapid",
      "Rapid acetylation may lower isoniazid exposure (+2 underexposure concern).",
      "under",
      ["E01", "E02", "P01"],
    );
  }
  if (
    (baseline.alt !== null && baseline.alt > patient.altULN) ||
    (baseline.ast !== null && baseline.ast > patient.astULN)
  ) {
    overScore++;
    add(
      "baseline-labs",
      "Baseline liver enzymes exceed the supplied lab reference (+1); causation is not inferred.",
      "over",
      ["P01"],
    );
  }
  for (const key of ["alt", "ast"] as const) {
    const current = visit[key],
      initial = baseline[key],
      uln = key === "alt" ? patient.altULN : patient.astULN;
    if (
      visit.day > baseline.day &&
      current !== null &&
      initial !== null &&
      current >= initial * 2 &&
      current > uln
    ) {
      overScore++;
      add(
        `rising-${key}`,
        `${key.toUpperCase()} changed from ${initial} to ${current} U/L (≥2× baseline and above the supplied lab ULN; +1). This is a demo trigger.`,
        "over",
        ["P01"],
      );
    } else if (visit.day > baseline.day && current !== null && current > uln) {
      add(
        `abnormal-${key}`,
        `${key.toUpperCase()} is above the supplied lab ULN; clinical context needs review even without the demo doubling trigger.`,
        "context",
        ["P01"],
      );
    }
  }
  if (visit.symptoms) {
    overScore++;
    add(
      "symptoms",
      "Symptoms are reported (+1). They are nonspecific and require independent clinical review.",
      "over",
      ["P01"],
    );
  }
  if (visit.concentration === "low") {
    underScore += 2;
    add(
      "low-concentration",
      "A researcher manually tagged the concentration as low (+2). The app does not determine a therapeutic threshold.",
      "under",
      ["P01"],
    );
  }
  if (visit.adherence === "poor") {
    uncertainties.push(
      "Poor adherence can confound exposure interpretation; review adherence before attributing low exposure to NAT2.",
    );
    add(
      "adherence",
      "Poor adherence is a confounder, not proof of rapid metabolism.",
      "context",
      ["P01"],
    );
  }
  if (visit.adherence === "unknown")
    uncertainties.push("Adherence has not been assessed.");
  if (visit.symptoms === null)
    uncertainties.push("Symptom status has not been assessed.");
  if (visit.concentration === "not-measured")
    uncertainties.push(
      "No drug concentration is available; exposure concerns remain provisional.",
    );
  if (visit.concentration === "uncertain")
    uncertainties.push(
      "The entered concentration has uncertain interpretation.",
    );
  const checks: [string, boolean][] = [
    ["NAT2 phenotype", !!patient.phenotype],
    ["Weight and dose", patient.weight > 0 && patient.dose > 0],
    ["Baseline ALT", baseline.alt !== null],
    ["Baseline AST", baseline.ast !== null],
    ["Current ALT", visit.alt !== null],
    ["Current AST", visit.ast !== null],
    ["Symptoms", visit.symptoms !== null],
    ["Adherence", visit.adherence !== "unknown"],
  ];
  const missing = checks
    .filter(([, present]) => !present)
    .map(([name]) => name);
  if (missing.length)
    uncertainties.push(
      `Missing core data: ${missing.join(", ")}. Missing values are not treated as normal.`,
    );
  const over = band(overScore),
    under = band(underScore);
  const clinicalReview =
    visit.symptoms === true ||
    visit.adherence === "poor" ||
    visit.alt === null ||
    visit.ast === null ||
    (visit.alt !== null && visit.alt > patient.altULN) ||
    (visit.ast !== null && visit.ast > patient.astULN);
  const priority: Level =
    over === "high" || under === "high"
      ? "high"
      : over === "elevated" || under === "elevated" || clinicalReview
        ? "elevated"
        : "low";
  const actions: string[] = [];
  if (priority !== "low")
    actions.push(
      "Consider clinical review of the full case and monitoring context.",
    );
  if (
    over !== "low" ||
    visit.symptoms ||
    (visit.alt !== null && visit.alt > patient.altULN) ||
    (visit.ast !== null && visit.ast > patient.astULN)
  )
    actions.push(
      "Discuss whether intensified liver monitoring is appropriate.",
    );
  if (under !== "low")
    actions.push(
      "Consider whether therapeutic drug monitoring / exposure review is appropriate.",
    );
  if (visit.adherence !== "good")
    actions.push(
      "Clarify adherence and sampling context before interpreting exposure.",
    );
  if (missing.length)
    actions.push(
      "Complete missing clinical data before relying on this demonstration.",
    );
  if (priority === "low")
    actions.push(
      "No added demo signal: continue clinician-defined routine monitoring.",
    );
  actions.push(
    "Medication decisions remain with the treating team; this app recommends no dose changes.",
  );
  if (!reasons.length)
    add(
      "no-signal",
      "No additional rule trigger in the supplied data. A low demo category does not exclude clinical risk.",
      "context",
      ["P01"],
    );
  return {
    priority,
    over,
    under,
    overScore,
    underScore,
    reasons,
    actions,
    uncertainties,
    completeness: {
      available: checks.length - missing.length,
      total: checks.length,
      missing,
    },
    mainRisk:
      overScore >= 2 && underScore >= 2
        ? "Dual exposure concern"
        : underScore >= 2
          ? "Potential underexposure"
          : overScore >= 2
            ? "Potential overexposure"
            : clinicalReview
              ? "Clinical monitoring signal"
              : "Routine monitoring",
  };
}
