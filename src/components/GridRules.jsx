/**
 * Faint vertical rules pinned behind a section. They give the page an
 * underlying measure — the thing that makes a layout feel set rather than
 * stacked — without adding visible chrome.
 *
 * `columns` positions are percentages; fewer rules show on small screens.
 */
export function GridRules({ columns = [25, 50, 75], className = '' }) {
  return (
    <div className={`grid-rules ${className}`} aria-hidden="true">
      {columns.map((left, i) => (
        <span
          key={left}
          style={{ left: `${left}%` }}
          className={i === 1 ? '' : 'hidden md:block'}
        />
      ))}
    </div>
  )
}
