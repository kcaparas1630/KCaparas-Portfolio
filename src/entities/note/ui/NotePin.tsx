// a pushpin head seen from above, the needle is through the paper
export function NotePin() {
  return (
    <svg className="note-pin" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <circle className="note-pin__head" cx="10" cy="10" r="7.5" />
      <circle className="note-pin__ring" cx="10" cy="10" r="3.8" />
      <ellipse className="note-pin__shine" cx="7.4" cy="6.9" rx="1.9" ry="1.2" transform="rotate(-35 7.4 6.9)" />
    </svg>
  );
}
