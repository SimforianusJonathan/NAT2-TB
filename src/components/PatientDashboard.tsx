"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  RotateCcw,
  Dna,
  Activity,
  CircleCheck,
  UsersRound,
} from "lucide-react";
import { usePatients } from "../lib/patientStore";
import { evaluateRisk } from "../lib/riskEngine";
import { phenotypeLabels } from "../data/patients";
import { PageHeading, PriorityBadge } from "./ui";

export default function PatientDashboard() {
  const { patients, ready, notice, reset } = usePatients();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [resetOpen, setResetOpen] = useState(false),
    [message, setMessage] = useState("");
  const results = patients.map((patient) => ({
    patient,
    risk: evaluateRisk(patient),
    current: patient.visits.at(-1)!,
  }));
  const visible = results.filter(
    ({ patient, risk }) =>
      `${patient.id} ${phenotypeLabels[patient.phenotype]} ${risk.mainRisk}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" || risk.priority === filter),
  );
  return (
    <>
      <PageHeading
        title="Patient workspace"
        description="A genomic starting point. An evolving monitoring picture."
      >
        <div className="synthetic-label">
          <span />4 synthetic cases
        </div>
      </PageHeading>
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
      <div className="workspace-summary">
        <div>
          <UsersRound size={19} />
          <span>
            In this workspace
            <strong>{patients.length} synthetic patients</strong>
          </span>
        </div>
        <div>
          <Activity size={19} />
          <span>
            Closer review
            <strong>
              {results.filter(({ risk }) => risk.priority === "high").length}{" "}
              high priority
            </strong>
          </span>
        </div>
        <div>
          <Dna size={19} />
          <span>
            Genomic diversity<strong>3 NAT2 phenotypes</strong>
          </span>
        </div>
        <div>
          <CircleCheck size={19} />
          <span>
            Data environment<strong>Browser-local only</strong>
          </span>
        </div>
      </div>
      <section className="patient-table-section">
        <div className="table-toolbar">
          <div>
            <h2>Monitoring overview</h2>
            <p>Priority reflects the most recent visit in each case.</p>
          </div>
          <div className="table-controls">
            <label className="search-field">
              <Search size={16} />
              <span className="sr-only">Search patient cases</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, phenotype…"
              />
            </label>
            <label>
              <span className="sr-only">Filter monitoring priority</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter monitoring priority"
              >
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="elevated">Elevated</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
        </div>
        <div className="table-scroll">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>NAT2 phenotype</th>
                <th>Treatment</th>
                <th>Monitoring priority</th>
                <th>Main concern</th>
                <th>Last update</th>
                <th>
                  <span className="sr-only">Open case</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map(({ patient, risk, current }) => (
                <tr key={patient.id}>
                  <td>
                    <Link
                      className="patient-id"
                      href={`/patients/${patient.id}`}
                    >
                      {patient.id}
                    </Link>
                    <span className="table-sub">
                      {patient.age} y · {patient.sex}
                    </span>
                  </td>
                  <td>
                    <span className={`phenotype-dot ${patient.phenotype}`} />
                    {phenotypeLabels[patient.phenotype]}
                    <span className="table-sub genotype-sub">
                      {patient.genotype}
                    </span>
                  </td>
                  <td>
                    Day {current.day}
                    <span className="table-sub">INH {patient.dose} mg/day</span>
                  </td>
                  <td>
                    <PriorityBadge level={risk.priority} />
                  </td>
                  <td>{risk.mainRisk}</td>
                  <td>
                    {new Date(current.recordedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      timeZone: "Asia/Jakarta",
                    })}
                    <span className="table-sub">
                      {patient.visits.length} visit
                      {patient.visits.length === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="icon-button"
                      href={`/patients/${patient.id}`}
                      aria-label={`Open ${patient.id}`}
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="empty-state">
              <Search size={24} />
              <h3>No matching cases</h3>
              <p>Try a different ID, phenotype or monitoring priority.</p>
              <button
                className="button secondary"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>
            {visible.length} of {patients.length} cases · all records are
            synthetic
          </span>
          <span>Prototype rule-based stratification</span>
        </div>
      </section>
      <section className="longitudinal-callout">
        <div className="callout-icon">
          <Activity size={25} />
        </div>
        <div>
          <h2>The genotype stays. The picture changes.</h2>
          <p>
            TB-004 starts with routine monitoring. Add the example day 14
            follow-up to explore how new clinical signals change its priority.
          </p>
        </div>
        <Link href="/patients/TB-004#timeline" className="text-link">
          Explore TB-004 <ArrowRight size={16} />
        </Link>
      </section>
      <div className="workspace-bottom">
        <p>
          Low priority does not rule out clinical risk. All outputs require
          independent interpretation.
        </p>
        <button
          className="text-link muted"
          onClick={() => setResetOpen(!resetOpen)}
          disabled={!ready}
        >
          <RotateCcw size={14} />
          Reset demo data
        </button>
      </div>
      {resetOpen && (
        <div className="reset-confirm">
          <p>
            Reset all four synthetic cases? Locally added follow-ups will be
            removed.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              reset();
              setResetOpen(false);
              setMessage("Original synthetic cases restored.");
            }}
          >
            Restore original cases
          </button>
          <button className="button quiet" onClick={() => setResetOpen(false)}>
            Keep changes
          </button>
        </div>
      )}
    </>
  );
}
