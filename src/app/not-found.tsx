import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Case or page not found</h1>
      <p>Choose one of the four synthetic cases in the patient workspace.</p>
      <Link href="/patients" className="button primary">
        Return to patient workspace
      </Link>
    </div>
  );
}
