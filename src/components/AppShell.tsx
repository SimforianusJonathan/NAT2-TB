"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dna,
  LayoutDashboard,
  UsersRound,
  BookOpen,
  FlaskConical,
  ArrowUpRight,
  Monitor,
} from "lucide-react";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/patients", label: "Patient workspace", icon: UsersRound },
  { href: "/evidence", label: "Evidence library", icon: BookOpen },
];
export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="NAT2-TB home">
          <span className="brand-mark">
            <Dna size={25} strokeWidth={1.6} />
          </span>
          <span>
            NAT2<span className="brand-divider">—</span>TB
            <small>PRECISION MONITOR</small>
          </span>
        </Link>
        <div className="workspace-label">Research workspace</div>
        <nav aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${(href === "/" ? path === href : path.startsWith(href)) ? "active" : ""}`}
              aria-current={
                (href === "/" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              <Icon size={18} />
              {label}
              <ArrowUpRight size={13} className="nav-arrow" />
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-status">
            <span />
            Local demo environment
          </div>
          <p>
            One gene. One drug.
            <br />A more considered approach
            <br />
            to monitoring.
          </p>
          <span className="sidebar-version">
            <Monitor size={13} /> GenoHack 2026 · v1.0
          </span>
        </div>
      </aside>
      <div className="main-shell">
        <div className="research-banner">
          <FlaskConical size={15} />
          <span>
            <strong>Research prototype</strong>
            <span className="banner-divider"> / </span>Not for clinical use.
            Synthetic patient data only.
          </span>
          <span className="banner-tag">TRL 2–3 · concept estimate</span>
        </div>
        <header className="topbar">
          <span>
            Indonesia <span className="crumb-divider">/</span> Precision
            diagnostics <span className="crumb-divider">/</span>{" "}
            <strong>
              {path.startsWith("/patients/")
                ? "Patient case"
                : path === "/patients"
                  ? "Patient workspace"
                  : path === "/evidence"
                    ? "Evidence library"
                    : "Overview"}
            </strong>
          </span>
          <span className="study-tag">NAT2 × Isoniazid</span>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>
            Prototype rule-based stratification · no clinical validation
          </span>
          <span>Made for the question: who needs closer monitoring?</span>
        </footer>
      </div>
    </div>
  );
}
