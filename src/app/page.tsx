import Link from "next/link";
import {
  ArrowRight,
  Dna,
  Activity,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function Overview() {
  return (
    <div className="overview">
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Precision TB monitoring,
            <br />
            <span>guided by pharmacogenomics.</span>
          </h1>
          <p>
            NAT2 variation can affect isoniazid metabolism. Connect genomic
            context with clinical changes to explore who may benefit from closer
            monitoring.
          </p>
          <Link href="/patients" className="button primary">
            Explore patient workspace <ArrowRight size={17} />
          </Link>
          <Link href="/evidence" className="text-link hero-secondary">
            Explore the evidence <ArrowUpRight size={15} />
          </Link>
          <div className="hero-footnote">
            <ShieldCheck size={15} /> Monitoring support. No automated dosing.
          </div>
        </div>
        <div className="mechanism">
          <div className="mechanism-heading">
            <Dna size={19} />
            <span>Same therapy. Different context.</span>
          </div>
          <div className="therapy-line">
            <span>Isoniazid</span>
            <span>Daily therapy</span>
          </div>
          <div className="mechanism-paths">
            <div>
              <span className="path-label">NAT2 · SLOW</span>
              <div className="metabolism slow">
                <i />
                <i />
                <i />
              </div>
              <strong>Slower acetylation</strong>
              <p>Potential overexposure concern</p>
              <span className="concern-tag concern-over">
                Liver monitoring context
              </span>
            </div>
            <div>
              <span className="path-label">NAT2 · RAPID</span>
              <div className="metabolism rapid">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <strong>Faster acetylation</strong>
              <p>Potential underexposure concern</p>
              <span className="concern-tag concern-under">
                Exposure review context
              </span>
            </div>
          </div>
          <div className="mechanism-outcome">
            <Activity size={18} />
            <span>Clinical changes inform monitoring over time.</span>
          </div>
          <p className="diagram-note">
            Conceptual relationships · no exposure or probability prediction
          </p>
        </div>
      </section>
      <section className="overview-principle">
        <h2>Who needs precision monitoring most?</h2>
        <p>
          Genotype is static. Monitoring needs are not. A transparent proof of
          concept for prioritizing attention as new patient information arrives.
        </p>
      </section>
      <div className="concept-grid">
        <article>
          <Dna size={23} />
          <h3>Genomic risk</h3>
          <p>
            NAT2 acetylator phenotype offers a starting point for understanding
            potential exposure differences.
          </p>
          <span>Static genomic context</span>
        </article>
        <article>
          <Activity size={23} />
          <h3>Clinical monitoring</h3>
          <p>
            Follow-up liver enzymes, symptoms and adherence can change the
            monitoring priority.
          </p>
          <span>Dynamic patient context</span>
        </article>
        <article>
          <MapPin size={23} />
          <h3>Indonesian evidence</h3>
          <p>
            Local pharmacokinetic studies add context, with their limitations
            kept visible alongside global evidence.
          </p>
          <span>Source-linked interpretation</span>
        </article>
      </div>
      <section className="demo-invitation">
        <div>
          <h2>Four cases. One clear demonstration.</h2>
          <p>
            Compare slow, rapid and intermediate acetylators, then add a
            follow-up to see a priority change.
          </p>
        </div>
        <Link href="/patients/TB-004" className="button secondary">
          Try the longitudinal case <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
