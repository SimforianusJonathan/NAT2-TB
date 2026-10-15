"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>The workspace could not be displayed</h1>
      <p>
        Retry the view. Synthetic follow-ups saved in your browser are retained.
      </p>
      <button className="button primary" onClick={reset}>
        Retry view
      </button>
    </div>
  );
}
