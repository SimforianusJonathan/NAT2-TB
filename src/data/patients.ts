import type { Patient, Visit } from "../types/patient";

function visit(
  day: number,
  alt: number,
  ast: number,
  extras: Partial<Visit> = {},
): Visit {
  return {
    day,
    alt,
    ast,
    symptoms: false,
    adherence: "good",
    concentration: "not-measured",
    concentrationValue: null,
    sampleHours: null,
    recordedAt:
      day === 0 ? "2026-10-01T08:00:00.000Z" : "2026-10-15T08:00:00.000Z",
    ...extras,
  };
}

export const demoPatients: Patient[] = [
  {
    id: "TB-001",
    age: 42,
    sex: "Female",
    weight: 54,
    dose: 300,
    genotype: "NAT2 *6A/*7B",
    phenotype: "slow",
    altULN: 40,
    astULN: 40,
    scenario: "Slow acetylation with new liver monitoring signals.",
    visits: [visit(0, 24, 22), visit(14, 128, 92, { symptoms: true })],
  },
  {
    id: "TB-002",
    age: 31,
    sex: "Male",
    weight: 62,
    dose: 300,
    genotype: "NAT2 *4/*4",
    phenotype: "rapid",
    altULN: 40,
    astULN: 40,
    scenario: "Rapid acetylation with a low, researcher-tagged concentration.",
    visits: [
      visit(0, 21, 23),
      visit(14, 25, 24, {
        concentration: "low",
        concentrationValue: 1.2,
        sampleHours: 2,
      }),
    ],
  },
  {
    id: "TB-003",
    age: 36,
    sex: "Female",
    weight: 58,
    dose: 300,
    genotype: "NAT2 *4/*6A",
    phenotype: "intermediate",
    altULN: 40,
    astULN: 40,
    scenario: "Stable follow-up with no additional monitoring signals.",
    visits: [visit(0, 22, 20), visit(14, 26, 23)],
  },
  {
    id: "TB-004",
    age: 48,
    sex: "Male",
    weight: 60,
    dose: 300,
    genotype: "NAT2 *4/*7B",
    phenotype: "intermediate",
    altULN: 40,
    astULN: 40,
    scenario: "Add a day 14 follow-up to see monitoring priority change.",
    visits: [visit(0, 25, 24)],
  },
];

export const phenotypeLabels = {
  slow: "Slow acetylator",
  intermediate: "Intermediate acetylator",
  rapid: "Rapid acetylator",
};
export const phenotypeDescriptions = {
  slow: "Reduced acetylation capacity may increase isoniazid exposure compared with faster acetylator phenotypes.",
  intermediate:
    "Intermediate acetylation provides context. New clinical signals can still change monitoring needs.",
  rapid:
    "Faster acetylation may reduce isoniazid exposure. Sampling context and adherence are needed to interpret a concentration.",
};
