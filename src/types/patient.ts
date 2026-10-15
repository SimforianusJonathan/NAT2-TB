export type Phenotype = "slow" | "intermediate" | "rapid";
export type Level = "low" | "elevated" | "high";
export type Adherence = "good" | "poor" | "unknown";
export type Concentration =
  "not-measured" | "low" | "within-reference" | "uncertain";

export interface Visit {
  day: number;
  alt: number | null;
  ast: number | null;
  symptoms: boolean | null;
  adherence: Adherence;
  concentration: Concentration;
  concentrationValue: number | null;
  sampleHours: number | null;
  recordedAt: string;
}

export interface Patient {
  id: string;
  age: number;
  sex: "Female" | "Male";
  weight: number;
  dose: number;
  genotype: string;
  phenotype: Phenotype;
  altULN: number;
  astULN: number;
  scenario: string;
  visits: Visit[];
}

export interface Reason {
  rule: string;
  text: string;
  evidence: string[];
  direction: "over" | "under" | "context";
}

export interface RiskResult {
  priority: Level;
  over: Level;
  under: Level;
  overScore: number;
  underScore: number;
  reasons: Reason[];
  actions: string[];
  uncertainties: string[];
  completeness: { available: number; total: number; missing: string[] };
  mainRisk: string;
}
