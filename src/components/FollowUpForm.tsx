"use client";
import { useState } from "react";
import { ArrowRight, FlaskConical, X } from "lucide-react";
import type {
  Adherence,
  Concentration,
  Patient,
  Visit,
} from "../types/patient";
import { validateVisit } from "../lib/riskEngine";

export default function FollowUpForm({
  patient,
  onSave,
  onClose,
}: {
  patient: Patient;
  onSave: (visit: Visit) => string[];
  onClose: () => void;
}) {
  const latest = patient.visits.at(-1)!;
  const [errors, setErrors] = useState<string[]>([]);
  const [day, setDay] = useState(String(latest.day + 14));
  const [alt, setAlt] = useState(""),
    [ast, setAst] = useState("");
  const [symptoms, setSymptoms] = useState("unknown"),
    [adherence, setAdherence] = useState<Adherence>("unknown");
  const [concentration, setConcentration] =
      useState<Concentration>("not-measured"),
    [value, setValue] = useState(""),
    [sample, setSample] = useState("");
  function fillDemo() {
    setDay(String(latest.day + 14));
    setAlt("118");
    setAst("86");
    setSymptoms("yes");
    setAdherence("good");
    setConcentration("not-measured");
    setValue("");
    setSample("");
    setErrors([]);
  }
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const numberOrNull = (v: string) => (v.trim() === "" ? null : Number(v));
    const visit: Visit = {
      day: Number(day),
      alt: numberOrNull(alt),
      ast: numberOrNull(ast),
      symptoms: symptoms === "unknown" ? null : symptoms === "yes",
      adherence,
      concentration,
      concentrationValue: numberOrNull(value),
      sampleHours: numberOrNull(sample),
      recordedAt: new Date().toISOString(),
    };
    const issues = validateVisit(visit, latest.day);
    if (issues.length) {
      setErrors(issues);
      return;
    }
    setErrors(onSave(visit));
  }
  return (
    <section className="followup-panel" id="followup">
      <div className="section-heading">
        <div>
          <h2>Add synthetic follow-up</h2>
          <p>
            Genotype and therapy stay fixed. Update clinical observations only.
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close follow-up form"
        >
          <X size={19} />
        </button>
      </div>
      <div className="demo-fill">
        <FlaskConical size={17} />
        <span>
          For the longitudinal demo, load an example with rising labs and
          reported symptoms.
        </span>
        <button className="text-link" type="button" onClick={fillDemo}>
          Fill day {latest.day + 14} demo <ArrowRight size={14} />
        </button>
      </div>
      <form onSubmit={submit}>
        {errors.length > 0 && (
          <div role="alert" className="notice">
            <strong>Check the follow-up data</strong>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="form-grid">
          <label>
            Treatment day
            <input
              type="number"
              value={day}
              required
              min={latest.day + 1}
              max={730}
              step={1}
              onChange={(e) => setDay(e.target.value)}
            />
            <small>After day {latest.day}; maximum 730</small>
          </label>
          <label>
            ALT (U/L)
            <input
              type="number"
              value={alt}
              min={0.1}
              max={10000}
              step="any"
              placeholder="Unknown if blank"
              onChange={(e) => setAlt(e.target.value)}
            />
            <small>Supplied lab ULN: {patient.altULN} U/L</small>
          </label>
          <label>
            AST (U/L)
            <input
              type="number"
              value={ast}
              min={0.1}
              max={10000}
              step="any"
              placeholder="Unknown if blank"
              onChange={(e) => setAst(e.target.value)}
            />
            <small>Supplied lab ULN: {patient.astULN} U/L</small>
          </label>
          <label>
            Symptoms
            <select
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            >
              <option value="unknown">Not assessed</option>
              <option value="no">None reported</option>
              <option value="yes">Reported</option>
            </select>
          </label>
          <label>
            Adherence
            <select
              value={adherence}
              onChange={(e) => setAdherence(e.target.value as Adherence)}
            >
              <option value="unknown">Not assessed</option>
              <option value="good">Good (synthetic report)</option>
              <option value="poor">Poor (synthetic report)</option>
            </select>
          </label>
          <label>
            Concentration interpretation
            <select
              value={concentration}
              onChange={(e) => {
                const next = e.target.value as Concentration;
                setConcentration(next);
                if (next === "not-measured") {
                  setValue("");
                  setSample("");
                }
              }}
            >
              <option value="not-measured">Not measured</option>
              <option value="low">Low · researcher tagged</option>
              <option value="within-reference">
                Within supplied reference
              </option>
              <option value="uncertain">Uncertain interpretation</option>
            </select>
          </label>
          {concentration !== "not-measured" && (
            <>
              <label>
                INH concentration (mg/L)
                <input
                  type="number"
                  required
                  min={0.001}
                  max={100}
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>
              <label>
                Sample time after dose (hours)
                <input
                  type="number"
                  required
                  min={0.01}
                  max={48}
                  step="any"
                  value={sample}
                  onChange={(e) => setSample(e.target.value)}
                />
              </label>
            </>
          )}
        </div>
        <p className="form-note">
          Concentrations are contextual observations. This app does not
          calculate a target, diagnose toxicity, or recommend a dose. Leave
          unavailable labs blank; missing values reduce data completeness.
        </p>
        <div className="form-actions">
          <button className="button primary" type="submit">
            Save follow-up & update priority <ArrowRight size={16} />
          </button>
          <button className="button quiet" type="button" onClick={onClose}>
            Cancel
          </button>
          <span>Saved only in this browser</span>
        </div>
      </form>
    </section>
  );
}
