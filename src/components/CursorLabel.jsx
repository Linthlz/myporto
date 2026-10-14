import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { usePointerFine } from '../hooks/usePointerFine'
import { useMotionSafe } from '../hooks/useMotionSafe'

/**
 * A small label that trails the cursor while a project image is hovered.
 *
 * Deliberate constraints:
 *  — `pointer-events: none`, so it never intercepts a click
 *  — the custom cursor steps aside over these images (data-cursor="hide")
 *  — only mounts on precise pointers, and not under reduced motion
 *  — the listener is attached only while the label is actually visible
 *
 * It is a redundant affordance: every project is also a real, focusable link.
 *
 * Portalled to <body>: the section it belongs to is transformed during the
 * scroll transition, and a transformed ancestor would pin `fixed` to itself.
 */
export function CursorLabel({ active, label = 'View' }) {
  const fine = usePointerFine()
  const { reduced } = useMotionSafe()
  const enabled = fine && !reduced

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 })

  useEffect(() => {
    if (!enabled || !active) return

    const move = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [enabled, active, x, y])

  if (!enabled) return null

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-50"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="-translate-x-1/2 -translate-y-1/2 inline-flex items-center rounded-full bg-amber px-5 py-2.5 text-[0.6875rem] font-medium tracking-[0.18em] text-ink uppercase">
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
