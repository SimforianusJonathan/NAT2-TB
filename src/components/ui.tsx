import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import type { Level, Patient, RiskResult } from "../types/patient";
import { levelLabels } from "../lib/riskEngine";
import { evidence } from "../data/evidence";

export function PriorityBadge({
  level,
  suffix = "",
}: {
  level: Level;
  suffix?: string;
}) {
  return (
    <span className={`badge status-${level}`}>
      <span className="status-dot" />
      {levelLabels[level]}
      {suffix}
    </span>
  );
}
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function EvidenceLink({ id }: { id: string }) {
  return (
    <Link
      href={`/evidence#${id}`}
      className="evidence-link"
      aria-label={`View evidence ${id}`}
    >
      {id}
      <ArrowUpRight size={11} />
    </Link>
  );
}
export function RiskIndicator({
  title,
  level,
  description,
}: {
  title: string;
  level: Level;
  description: string;
}) {
  const count = level === "high" ? 3 : level === "elevated" ? 2 : 1;
  return (
    <div className={`risk-indicator status-text-${level}`}>
      <div className="row-between">
        <h3>{title}</h3>
        <PriorityBadge level={level} />
      </div>
      <div
        className="risk-track"
        role="img"
        aria-label={`${title}: ${levelLabels[level]}, qualitative demonstration indicator`}
      >
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= count ? "filled" : ""} />
        ))}
      </div>
      <p>{description}</p>
    </div>
  );
}
export function MonitoringRecommendation({ result }: { result: RiskResult }) {
  return (
    <section className="recommendation">
      <div className="section-icon">
        <ShieldCheck size={21} />
      </div>
      <div>
        <div className="row-between wrap">
          <h2>{levelLabels[result.priority]} monitoring priority</h2>
          <span className="small-label">Prototype output</span>
        </div>
        <p className="recommendation-lead">
          {result.priority === "high"
            ? "Multiple demo signals support closer review."
            : result.priority === "elevated"
              ? "Additional monitoring context deserves review."
              : "No added monitoring signal in the current demo data."}
        </p>
        <ul className="action-list">
          {result.actions.map((a) => (
            <li key={a}>
              <ArrowRight size={14} aria-hidden="true" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export function ConfidencePanel({ result }: { result: RiskResult }) {
  return (
    <section className="confidence-panel">
      <h2>How much can this tell us?</h2>
      <div className="confidence-grid">
        <div>
          <span className="small-label">Evidence strength</span>
          <strong>Association supported</strong>
          <p>
            Literature supports NAT2–exposure relationships. The combined score
            is unvalidated.
          </p>
        </div>
        <div>
          <span className="small-label">Indonesian applicability</span>
          <strong>Contextual / limited</strong>
          <p>
            Local PK evidence exists; study populations and regimens differ from
            these cases.
          </p>
        </div>
        <div>
          <span className="small-label">Core data completeness</span>
          <strong>
            {result.completeness.available} / {result.completeness.total} fields
          </strong>
          <p>
            {result.completeness.missing.length
              ? `Missing: ${result.completeness.missing.join(", ")}.`
              : "Core demo inputs available. Optional TDM is assessed separately."}
          </p>
        </div>
      </div>
      <div className="uncertainty">
        <FlaskConical size={16} />
        <p>
          {result.uncertainties.join(" ") ||
            "Complete inputs do not establish clinical validity or rule out clinical risk."}
        </p>
      </div>
    </section>
  );
}
export function EvidencePanel({
  ids = ["E01", "E02", "E03", "P01"],
}: {
  ids?: string[];
}) {
  return (
    <section className="evidence-panel">
      <div className="section-heading">
        <h2>Evidence behind the interpretation</h2>
        <Link href="/evidence" className="text-link">
          Open evidence library <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Evidence</th>
              <th>Scope</th>
              <th>Applicability</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {ids
              .map((id) => evidence.find((e) => e.id === id)!)
              .map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.title}</strong>
                    <span className="table-sub">{e.type}</span>
                  </td>
                  <td>{e.geography}</td>
                  <td>{e.applicability}</td>
                  <td>
                    <EvidenceLink id={e.id} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function ProfileFacts({
  patient,
  day,
}: {
  patient: Patient;
  day: number;
}) {
  return (
    <dl className="profile-facts">
      <div>
        <dt>Age / sex</dt>
        <dd>
          {patient.age} years · {patient.sex}
        </dd>
      </div>
      <div>
        <dt>Body weight</dt>
        <dd>
          {patient.weight} <span>kg</span>
        </dd>
      </div>
      <div>
        <dt>Isoniazid daily dose</dt>
        <dd>
          {patient.dose} <span>mg</span>
        </dd>
      </div>
      <div>
        <dt>Dose / weight context</dt>
        <dd>
          {(patient.dose / patient.weight).toFixed(2)}{" "}
          <span>mg/kg · descriptive only</span>
        </dd>
      </div>
      <div>
        <dt>Selected treatment day</dt>
        <dd>Day {day}</dd>
      </div>
    </dl>
  );
}
