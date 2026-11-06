// Shown when no notes are approved yet. One honest placeholder — no seeded
// fake notes (empty is honest; fake is worse than empty).
export function EmptyState() {
  return (
    <div className="wall-empty">
      <div className="wall-empty__note">
        <span className="wall-empty__text">be the first</span>
      </div>
    </div>
  );
}
