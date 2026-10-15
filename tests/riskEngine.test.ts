import { describe, expect, it } from "vitest";
import { demoPatients } from "../src/data/patients";
import { evaluateRisk, validateVisit } from "../src/lib/riskEngine";
import type { Visit } from "../src/types/patient";

describe("required research demonstration scenarios", () => {
  it("escalates a slow acetylator when follow-up clinical signals appear", () => {
    const p = demoPatients[0];
    expect(evaluateRisk(p, p.visits[0]).priority).toBe("elevated");
    const result = evaluateRisk(p);
    expect(result.priority).toBe("high");
    expect(result.over).toBe("high");
    expect(result.under).toBe("low");
    expect(result.reasons.some((r) => r.rule === "rising-alt")).toBe(true);
  });
  it("separates rapid-acetylator underexposure concern from toxicity concern", () => {
    const result = evaluateRisk(demoPatients[1]);
    expect(result.priority).toBe("high");
    expect(result.under).toBe("high");
    expect(result.over).toBe("low");
  });
  it("keeps the stable intermediate case low without implying absence of risk", () => {
    const result = evaluateRisk(demoPatients[2]);
    expect(result.priority).toBe("low");
    expect(result.reasons[0].text).toContain("does not exclude");
  });
  it("changes monitoring state without changing genomic information", () => {
    const patient = structuredClone(demoPatients[3]);
    const genotype = patient.genotype;
    const followup: Visit = {
      ...patient.visits[0],
      day: 14,
      alt: 118,
      ast: 86,
      symptoms: true,
    };
    expect(evaluateRisk(patient).priority).toBe("low");
    patient.visits.push(followup);
    expect(evaluateRisk(patient).priority).toBe("high");
    expect(patient.genotype).toBe(genotype);
    expect(evaluateRisk(patient, patient.visits[0]).priority).toBe("low");
  });
});

describe("uncertainty and demonstration boundaries", () => {
  it("does not treat missing current labs as normal", () => {
    const p = demoPatients[2];
    const result = evaluateRisk(p, {
      ...p.visits[1],
      alt: null,
      ast: null,
      symptoms: null,
      adherence: "unknown",
    });
    expect(result.priority).toBe("elevated");
    expect(result.completeness.available).toBe(4);
    expect(result.completeness.missing).toContain("Current ALT");
  });
  it("flags poor adherence without turning it into a metabolic exposure score", () => {
    const p = demoPatients[2];
    const result = evaluateRisk(p, { ...p.visits[1], adherence: "poor" });
    expect(result.priority).toBe("elevated");
    expect(result.underScore).toBe(0);
    expect(result.uncertainties.join(" ")).toContain("confound");
  });
  it("requires both doubling and above-ULN for the lab-change point", () => {
    const p = demoPatients[3];
    expect(
      evaluateRisk(p, { ...p.visits[0], day: 14, alt: 49 }).overScore,
    ).toBe(0);
    expect(
      evaluateRisk(p, { ...p.visits[0], day: 14, alt: 50 }).overScore,
    ).toBe(1);
    const lowBaseline = { ...p, visits: [{ ...p.visits[0], alt: 10 }] };
    expect(
      evaluateRisk(lowBaseline, { ...p.visits[0], day: 14, alt: 20 }).overScore,
    ).toBe(0);
  });
  it("keeps abnormal current labs and symptoms above the routine floor", () => {
    const p = demoPatients[3];
    expect(evaluateRisk(p, { ...p.visits[0], day: 14, alt: 45 }).priority).toBe(
      "elevated",
    );
    expect(
      evaluateRisk(p, { ...p.visits[0], day: 14, symptoms: true }).priority,
    ).toBe("elevated");
  });
  it("counts baseline abnormalities once and does not use future labs", () => {
    const p = {
      ...demoPatients[2],
      visits: [
        { ...demoPatients[2].visits[0], alt: 55, ast: 60 },
        { ...demoPatients[2].visits[1], alt: 150, ast: 160 },
      ],
    };
    expect(evaluateRisk(p, p.visits[0]).overScore).toBe(1);
    expect(evaluateRisk(p).overScore).toBe(3);
  });
  it("does not infer concentration interpretation from a numerical measurement", () => {
    const p = demoPatients[2];
    const visit = {
      ...p.visits[1],
      concentrationValue: 0.1,
      sampleHours: 2,
      concentration: "uncertain" as const,
    };
    expect(evaluateRisk(p, visit).underScore).toBe(0);
  });
  it("does not change risk when dose, age or sex changes", () => {
    const p = demoPatients[2];
    expect(
      evaluateRisk({ ...p, dose: 400, weight: 80, age: 70, sex: "Male" })
        .priority,
    ).toBe(evaluateRisk(p).priority);
  });
  it("does not mutate a source patient", () => {
    const p = structuredClone(demoPatients[0]);
    const before = JSON.stringify(p);
    evaluateRisk(p);
    expect(JSON.stringify(p)).toBe(before);
  });
});

describe("follow-up validation", () => {
  const valid = { ...demoPatients[2].visits[1] };
  it("accepts an incomplete visit while preserving missing values", () => {
    expect(
      validateVisit({ ...valid, alt: null, ast: null, symptoms: null }, 0),
    ).toEqual([]);
  });
  it.each([NaN, -1, 0, 14.5, 731])(
    "rejects an invalid/non-increasing day %s",
    (day) => {
      expect(validateVisit({ ...valid, day }, 14).length).toBeGreaterThan(0);
    },
  );
  it.each([NaN, Infinity, -5, 0, 10001])(
    "rejects invalid liver observations %s",
    (alt) => {
      expect(validateVisit({ ...valid, alt }, 0).length).toBeGreaterThan(0);
    },
  );
  it("requires paired measurement and timing for interpreted concentrations", () => {
    expect(
      validateVisit({ ...valid, concentration: "low" }, 0).length,
    ).toBeGreaterThan(0);
    expect(
      validateVisit(
        {
          ...valid,
          concentration: "low",
          concentrationValue: 1.2,
          sampleHours: 2,
        },
        0,
      ),
    ).toEqual([]);
    expect(
      validateVisit({ ...valid, concentrationValue: 1.2 }, 0).length,
    ).toBeGreaterThan(0);
  });
});
