"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Dna,
  LockKeyhole,
  Download,
  GitBranch,
} from "lucide-react";
import { usePatients } from "../lib/patientStore";
import { evaluateRisk, RULE_VERSION } from "../lib/riskEngine";
import { phenotypeDescriptions, phenotypeLabels } from "../data/patients";
import type { Visit } from "../types/patient";
import {
  ConfidencePanel,
  EvidenceLink,
  EvidencePanel,
  MonitoringRecommendation,
  PriorityBadge,
  ProfileFacts,
  RiskIndicator,
} from "./ui";
import Timeline from "./Timeline";
import FollowUpForm from "./FollowUpForm";

export default function PatientDetail({ id }: { id: string }) {
  const { patients, ready, notice, addVisit } = usePatients();
  const [selectedDay, setSelectedDay] = useState<number | null>(null),
    [showForm, setShowForm] = useState(false),
    [message, setMessage] = useState("");
  const patient = patients.find((p) => p.id === id)!;
  const latest = patient.visits.at(-1)!;
  const visit = patient.visits.find((v) => v.day === selectedDay) ?? latest;
  const result = evaluateRisk(patient, visit);
  function save(followup: Visit): string[] {
    const errors = addVisit(id, followup);
    if (!errors.length) {
      setSelectedDay(followup.day);
      setShowForm(false);
      setMessage(
        `Day ${followup.day} follow-up saved. Monitoring priority recalculated; NAT2 genotype is unchanged.`,
      );
    }
    return errors;
  }
  function exportCase() {
    const data = {
      disclaimer:
        "Synthetic research demonstration — not for clinical use; no dosing recommendation.",
      ruleVersion: RULE_VERSION,
      patient,
      selectedVisit: visit,
      result,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.id}-synthetic-case.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <Link href="/patients" className="back-link">
        <ArrowLeft size={15} />
        Patient workspace
      </Link>
      <div className="patient-heading">
        <div>
          <div className="patient-title">
            <h1>{patient.id}</h1>
            <span className="badge neutral">Synthetic patient</span>
          </div>
          <p>{patient.scenario}</p>
        </div>
        <div className="patient-actions">
          <button
            type="button"
            className="button secondary"
            onClick={exportCase}
            disabled={!ready}
          >
            <Download size={15} />
            Export case
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
            disabled={!ready || showForm}
          >
            <Plus size={16} />
            Add follow-up
          </button>
        </div>
      </div>
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {message && (
        <p role="status" className="success-notice">
          {message}
        </p>
      )}
      <div className="detail-navigation">
        <a href="#assessment">Current assessment</a>
        <a href="#timeline">Longitudinal timeline</a>
        <a href="#case-evidence">Evidence & confidence</a>
      </div>
      <section className="profile-section">
        <ProfileFacts patient={patient} day={visit.day} />
        <div className="genomic-profile">
          <div className="genomic-symbol">
            <Dna size={34} strokeWidth={1.4} />
          </div>
          <div>
            <div className="row-between wrap">
              <h2>NAT2 {phenotypeLabels[patient.phenotype]}</h2>
              <span className="fixed-label">
                <LockKeyhole size={12} />
                Static genotype
              </span>
            </div>
            <strong className="genotype-text">{patient.genotype}</strong>
            <p>{phenotypeDescriptions[patient.phenotype]}</p>
          </div>
          <EvidenceLink id="E01" />
        </div>
        <p className="profile-note">
          Phenotype and diplotype are preassigned synthetic examples, not
          inferred from uploaded variants. Dose / weight is descriptive and does
          not affect the score.
        </p>
      </section>
      {showForm && (
        <FollowUpForm
          patient={patient}
          onSave={save}
          onClose={() => setShowForm(false)}
        />
      )}
      <section id="assessment" className="assessment-section">
        <div className="section-heading">
          <div>
            <h2>Two concerns. One monitoring picture.</h2>
            <p>
              Selected visit: day {visit.day}
              {visit.day !== latest.day
                ? " · historical assessment"
                : " · latest assessment"}
            </p>
          </div>
          <PriorityBadge level={result.priority} suffix=" priority" />
        </div>
        <div className="risk-grid">
          <RiskIndicator
            title="Potential overexposure / toxicity concern"
            level={result.over}
            description="Genomic exposure context and liver monitoring signals; not a diagnosis of toxicity."
          />
          <RiskIndicator
            title="Potential underexposure concern"
            level={result.under}
            description="Metabolic context and tagged concentrations; not a prediction of treatment failure."
          />
        </div>
        <MonitoringRecommendation result={result} />
        <div className="reasoning-section">
          <div className="section-heading">
            <h2>
              <GitBranch size={18} />
              Why this result?
            </h2>
            <Link href="/evidence#rules" className="text-link">
              Inspect all rules <ArrowRight size={14} />
            </Link>
          </div>
          <ol className="reason-list">
            {result.reasons.map((reason) => (
              <li key={reason.rule}>
                <span className={`reason-marker ${reason.direction}`} />
                <p>{reason.text}</p>
                <span className="reason-sources">
                  {reason.evidence.map((e) => (
                    <EvidenceLink key={e} id={e} />
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <p className="reasoning-disclaimer">
            Prototype rule-based risk stratification for demonstration purposes.
            Liver enzyme changes and symptoms are nonspecific; they do not
            establish isoniazid overexposure or drug-induced injury.
          </p>
        </div>
      </section>
      <Timeline
        patient={patient}
        selectedDay={visit.day}
        onSelect={setSelectedDay}
      />
      <div id="case-evidence">
        <ConfidencePanel result={result} />
        <EvidencePanel />
      </div>
    </>
  );
}
