import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view using a single IntersectionObserver
 * (no scroll listener, no per-frame measuring).
 *
 * The observer fires on a band across the upper-middle of the viewport, which
 * matches how people perceive "the section I'm reading".
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Of everything currently intersecting, pick the highest on screen.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
