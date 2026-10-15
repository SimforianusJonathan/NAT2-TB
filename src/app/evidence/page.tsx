import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, FlaskConical } from "lucide-react";
import { evidence } from "../../data/evidence";
import { RULES, RULE_VERSION } from "../../lib/riskEngine";
import { PageHeading } from "../../components/ui";
export const metadata: Metadata = { title: "Evidence library" };
export default function EvidencePage() {
  return (
    <>
      <PageHeading
        title="Evidence, with its boundaries."
        description="Trace each interpretation to its source. See where evidence ends and the prototype begins."
      >
        <span className="badge neutral">
          <BookOpen size={13} />
          Source registry
        </span>
      </PageHeading>
      <div className="evidence-intro">
        <FlaskConical size={22} />
        <div>
          <h2>
            Literature supports the concept. It does not validate this tool.
          </h2>
          <p>
            Evidence strength and Indonesian applicability are qualitative
            editorial labels, not graded clinical recommendations. The
            monitoring score, thresholds and combined outputs have not been
            validated.
          </p>
        </div>
      </div>
      <div className="evidence-library">
        {evidence.map((e) => (
          <article
            id={e.id}
            key={e.id}
            className={`evidence-record ${e.status}`}
          >
            <div className="evidence-record-head">
              <span className="source-id">{e.id}</span>
              <div>
                <h2>{e.title}</h2>
                <p>
                  {e.type} · {e.year}
                </p>
              </div>
              <span
                className={`badge ${e.status === "verified" ? "neutral" : "status-elevated"}`}
              >
                {e.status === "verified"
                  ? "Literature reference"
                  : e.status === "prototype"
                    ? "Prototype choice"
                    : "Placeholder"}
              </span>
            </div>
            <div className="evidence-record-body">
              <div>
                <p>{e.summary}</p>
                <blockquote>{e.source}</blockquote>
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Read original source <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
              <dl>
                <div>
                  <dt>Geographic scope</dt>
                  <dd>{e.geography}</dd>
                </div>
                <div>
                  <dt>Evidence context</dt>
                  <dd>{e.strength}</dd>
                </div>
                <div>
                  <dt>Applicability to this prototype</dt>
                  <dd>{e.applicability}</dd>
                </div>
              </dl>
            </div>
            <p className="evidence-limitation">
              <strong>Boundary</strong>
              {e.limitation}
            </p>
          </article>
        ))}
      </div>
      <section id="rules" className="rules-section">
        <div className="section-heading">
          <div>
            <h2>Every rule is inspectable.</h2>
            <p>
              Rule specification v{RULE_VERSION} · deterministic demonstration
            </p>
          </div>
          <span className="badge status-elevated">Unvalidated</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Input / trigger</th>
                <th>Prototype behavior</th>
              </tr>
            </thead>
            <tbody>
              {RULES.map(([trigger, behavior]) => (
                <tr key={trigger}>
                  <td>{trigger}</td>
                  <td>{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Overall priority is the higher of the two concern bands, with an
          Elevated floor for symptoms, poor adherence, missing current labs, or
          current ALT/AST above the supplied lab ULN. Baseline abnormalities
          count once; ALT and AST follow-up changes count independently. A low
          category does not exclude clinical risk.
        </p>
        <p>
          Age and sex are profile context only. Dose / weight is displayed as a
          descriptive ratio and never interpreted as a dosing target. No
          numerical concentration threshold, AUC equation, variant-to-phenotype
          inference or autonomous medication change is implemented.
        </p>
      </section>
      <section className="roadmap">
        <h2>From concept to a testable research question.</h2>
        <div>
          <article>
            <strong>Hackathon proof of concept</strong>
            <p>
              Synthetic cases, transparent rules, source-linked evidence map.
              Approximate concept maturity: TRL 2–3.
            </p>
          </article>
          <article>
            <strong>Technical validation</strong>
            <p>
              Partner-approved retrospective data, refined model, comparison
              with current workflow and appropriate validation metrics.
            </p>
          </article>
          <article>
            <strong>Clinical pilot</strong>
            <p>
              Prospective observational study, clinician usability testing,
              workflow and health-economic assessment.
            </p>
          </article>
          <article>
            <strong>Scale-up after validation</strong>
            <p>
              Broader TB centers, validated PK integration and potential
              national infrastructure alignment.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
