import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { usePointerFine } from '../../hooks/usePointerFine'

/**
 * A clay disc that trails the pointer and reads "View" while over anything
 * marked `data-photo-cursor`. The native cursor stays visible; this is a
 * label, not a replacement. Precise pointers only.
 */
export function PhotoCursor({ reduced }) {
  const fine = usePointerFine()
  const enabled = fine && !reduced
  const [label, setLabel] = useState(null)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 })

  useEffect(() => {
    if (!enabled) return
    const move = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    const over = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-photo-cursor]') : null
      setLabel(target ? target.getAttribute('data-photo-cursor') : null)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return createPortal(
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[70]"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="label flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-clay text-paper"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  )
}
