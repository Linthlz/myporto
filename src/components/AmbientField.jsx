import { useEffect, useRef } from 'react'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { usePointerFine } from '../hooks/usePointerFine'

/**
 * Section backdrop: a near-invisible line grid, and an amber spotlight that
 * follows the cursor and lights the grid up beneath it.
 *
 * Pure CSS layers driven by two custom properties (--spot-x / --spot-y). The
 * spot eases toward the pointer with a short lerp loop that only runs while
 * it is still travelling — idle, the backdrop costs nothing.
 *
 * It is a sticky, viewport-tall layer with a negative bottom margin, so it
 * occupies no space in the flow yet stays in view while its section scrolls.
 *
 * Touch / reduced motion: the glow is parked, dimmed, in the upper right, and
 * the amber grid stays off — without a cursor it would just be lines over text.
 */
const EASE_FACTOR = 0.14

export function AmbientField() {
  const ref = useRef(null)
  const { reduced } = useMotionSafe()
  const fine = usePointerFine()
  const live = fine && !reduced

  useEffect(() => {
    const el = ref.current
    if (!live) {
      el.style.setProperty('--spot-x', '78%')
      el.style.setProperty('--spot-y', '22%')
      el.style.setProperty('--spot-on', '0.45')
      el.dataset.parked = ''
      return () => delete el.dataset.parked
    }

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = null
    let placed = false

    const paint = () => {
      el.style.setProperty('--spot-x', `${current.x}px`)
      el.style.setProperty('--spot-y', `${current.y}px`)
    }

    const tick = () => {
      current.x += (target.x - current.x) * EASE_FACTOR
      current.y += (target.y - current.y) * EASE_FACTOR
      paint()
      const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5
      frame = settled ? null : requestAnimationFrame(tick)
    }

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      target.x = event.clientX - rect.left
      target.y = event.clientY - rect.top
      if (!placed) {
        // First sighting: appear under the cursor instead of sliding in from 0,0.
        current.x = target.x
        current.y = target.y
        placed = true
        paint()
      }
      el.style.setProperty('--spot-on', '1')
      if (frame === null) frame = requestAnimationFrame(tick)
    }

    const onLeave = () => el.style.setProperty('--spot-on', '0')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [live])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ambient pointer-events-none sticky top-0 mb-[-100svh] h-svh overflow-hidden"
    >
      <span className="ambient-grid" />
      <span className="ambient-grid ambient-grid--lit" />
      <span className="ambient-spot" />
    </div>
  )
}
