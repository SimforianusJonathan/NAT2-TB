"use client";

import { useEffect, useState } from "react";
import { demoPatients } from "../data/patients";
import type { Patient, Visit } from "../types/patient";
import { validateVisit } from "./riskEngine";

const KEY = "nat2-tb.synthetic-cases.v1";
function readPatients(): Patient[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return structuredClone(demoPatients);
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length !== demoPatients.length)
    throw new Error("Invalid saved cases");
  return demoPatients.map((seed) => {
    const saved = parsed.find((item) => item?.id === seed.id);
    if (
      !saved ||
      !Array.isArray(saved.visits) ||
      !saved.visits.length ||
      saved.visits.length > 60 ||
      JSON.stringify(saved.visits[0]) !== JSON.stringify(seed.visits[0])
    )
      throw new Error("Invalid saved visits");
    saved.visits.forEach((v: Visit, i: number) => {
      if (!v || validateVisit(v, i === 0 ? -1 : saved.visits[i - 1].day).length)
        throw new Error("Invalid saved visit");
    });
    // Genotype, phenotype and profile remain the original synthetic record.
    return { ...structuredClone(seed), visits: saved.visits };
  });
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setPatients(readPatients());
    } catch {
      setNotice(
        "Saved demo data could not be loaded. Original synthetic cases are shown; reset demo data to clear the saved copy.",
      );
    }
    setReady(true);
  }, []);

  function persist(next: Patient[]) {
    setPatients(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setNotice("");
    } catch {
      setNotice(
        "Browser storage is unavailable. Changes work in this view but will not survive navigation or reload.",
      );
    }
  }
  function addVisit(id: string, visit: Visit): string[] {
    const patient = patients.find((p) => p.id === id);
    if (!ready || !patient) return ["Demo data is still loading. Try again."];
    if (patient.visits.length >= 60)
      return [
        "This demo supports 60 visits per case. Reset the demo to start again.",
      ];
    const errors = validateVisit(visit, patient.visits.at(-1)!.day);
    if (errors.length) return errors;
    persist(
      patients.map((p) =>
        p.id === id ? { ...p, visits: [...p.visits, visit] } : p,
      ),
    );
    return [];
  }
  function reset() {
    persist(structuredClone(demoPatients));
  }
  return { patients, ready, notice, addVisit, reset };
}
