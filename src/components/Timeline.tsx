import { Dna, ArrowRight } from "lucide-react";
import type { Patient } from "../types/patient";
import { evaluateRisk } from "../lib/riskEngine";
import { phenotypeLabels } from "../data/patients";
import { PriorityBadge } from "./ui";

export default function Timeline({
  patient,
  selectedDay,
  onSelect,
}: {
  patient: Patient;
  selectedDay: number;
  onSelect: (day: number) => void;
}) {
  const first = patient.visits[0],
    last = patient.visits.at(-1)!;
  const max = Math.max(
    60,
    ...patient.visits.flatMap((v) => [v.alt ?? 0, v.ast ?? 0]),
  );
  const y = (value: number) => 142 - (value / max) * 106;
  const x = (day: number) => 48 + (day / Math.max(last.day, 14)) * 412;
  const points = (key: "alt" | "ast") =>
    patient.visits
      .filter((v) => v[key] !== null)
      .map((v) => `${x(v.day)},${y(v[key]!)}`)
      .join(" ");
  const changed =
    evaluateRisk(patient, first).priority !==
    evaluateRisk(patient, last).priority;
  return (
    <section className="timeline-section" id="timeline">
      <div className="section-heading">
        <div>
          <h2>Monitoring over time</h2>
          <p>
            Genotype did not change.{" "}
            {changed
              ? "Monitoring priority did."
              : "New observations can change the next decision."}
          </p>
        </div>
        <span className="badge neutral">
          <Dna size={13} />
          {patient.genotype} · fixed
        </span>
      </div>
      <div className="timeline-grid">
        <div className="visit-comparison">
          {patient.visits.map((visit, i) => (
            <button
              type="button"
              key={visit.day}
              onClick={() => onSelect(visit.day)}
              aria-pressed={visit.day === selectedDay}
              className={`visit-item ${visit.day === selectedDay ? "selected" : ""}`}
            >
              <div className="row-between">
                <strong>Day {visit.day}</strong>
                <span className="small-label">
                  {i === 0 ? "Baseline" : "Follow-up"}
                </span>
              </div>
              <PriorityBadge level={evaluateRisk(patient, visit).priority} />
              <dl>
                <div>
                  <dt>ALT / AST</dt>
                  <dd>
                    {visit.alt ?? "—"} / {visit.ast ?? "—"} U/L
                  </dd>
                </div>
                <div>
                  <dt>Symptoms</dt>
                  <dd>
                    {visit.symptoms === null
                      ? "Unknown"
                      : visit.symptoms
                        ? "Reported"
                        : "None reported"}
                  </dd>
                </div>
                <div>
                  <dt>Adherence</dt>
                  <dd>{visit.adherence}</dd>
                </div>
                <div>
                  <dt>Concentration</dt>
                  <dd>
                    {visit.concentrationValue === null
                      ? "Not measured"
                      : `${visit.concentrationValue} mg/L · ${visit.sampleHours} h · ${visit.concentration}`}
                  </dd>
                </div>
              </dl>
            </button>
          ))}
          {patient.visits.length === 1 && (
            <div className="timeline-pending">
              <ArrowRight size={20} />
              <p>Add a follow-up to compare monitoring states.</p>
            </div>
          )}
        </div>
        <div className="lab-chart">
          <div className="row-between">
            <h3>Liver enzyme observations</h3>
            <span className="small-label">U/L</span>
          </div>
          <svg
            viewBox="0 0 500 184"
            role="img"
            aria-label={`ALT and AST observations: ${patient.visits.map((v) => `Day ${v.day}: ALT ${v.alt ?? "missing"}, AST ${v.ast ?? "missing"}`).join("; ")}`}
          >
            <g className="chart-grid">
              {[0, 0.5, 1].map((fraction) => (
                <g key={fraction}>
                  <line
                    x1="48"
                    x2="460"
                    y1={y(max * fraction)}
                    y2={y(max * fraction)}
                  />
                  <text x="32" y={y(max * fraction) + 4} textAnchor="end">
                    {Math.round(max * fraction)}
                  </text>
                </g>
              ))}
            </g>
            <polyline
              points={points("alt")}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2.5"
            />
            <polyline
              points={points("ast")}
              fill="none"
              stroke="var(--chart-blue)"
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
            {patient.visits.map((v) => (
              <g key={v.day}>
                {v.alt !== null && (
                  <circle
                    cx={x(v.day)}
                    cy={y(v.alt)}
                    r="4"
                    fill="var(--teal)"
                  />
                )}
                {v.ast !== null && (
                  <circle
                    cx={x(v.day)}
                    cy={y(v.ast)}
                    r="4"
                    fill="var(--chart-blue)"
                  />
                )}
                <text x={x(v.day)} y="168" textAnchor="middle">
                  Day {v.day}
                </text>
              </g>
            ))}
          </svg>
          <div className="chart-legend">
            <span>
              <i className="alt-key" />
              ALT
            </span>
            <span>
              <i className="ast-key" />
              AST
            </span>
          </div>
          <p>
            Observed synthetic values. Supplied lab ULN: ALT {patient.altULN},
            AST {patient.astULN} U/L. No diagnostic threshold is inferred.
          </p>
        </div>
      </div>
      <div className="static-genotype">
        <Dna size={17} />
        <span>
          {phenotypeLabels[patient.phenotype]} throughout this timeline
        </span>
        <strong>
          {changed
            ? "Priority changed with clinical data"
            : "Genomic context remains constant"}
        </strong>
      </div>
    </section>
  );
}
