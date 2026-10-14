import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { AmbientField } from './AmbientField'

/**
 * Scroll-scrubbed hand-off between two sections, built as a stack of sheets.
 *
 *   outgoing — sinks back: scales down from its bottom edge, drifts downward
 *              (so it lags behind the scroll) and dims under a veil.
 *   incoming — rises over it as a rounded, inset sheet that widens to full
 *              bleed, while an amber seam draws across its top edge from the
 *              centre and then dissolves.
 *
 * Every value is tied to scroll position, not time, then passed through a
 * spring — the page carries a little weight and settles rather than snapping.
 *
 * Each wrapper sits one layer above the previous one and has an opaque
 * background, so the incoming sheet genuinely covers the receding one. The
 * sheet owns that background (`tone`) so the ambient field can sit between it
 * and the section's content.
 */
const SPRING = { stiffness: 130, damping: 30, mass: 0.6, restDelta: 0.0005 }

const TONE = { ink: 'bg-ink', raised: 'bg-ink-raised' }

export function SectionTransition({ children, layer = 0, enter = true, exit = true, tone = 'ink' }) {
  const { reduced } = useMotionSafe()
  const ref = useRef(null)

  // Entry: from this sheet's top touching the viewport bottom until it reaches the top.
  const { scrollYProgress: enterRaw } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })
  // Exit: the last viewport of this sheet, exactly while the next one is arriving.
  const { scrollYProgress: exitRaw } = useScroll({
    target: ref,
    offset: ['end end', 'end start'],
  })

  const enterP = useSpring(enterRaw, SPRING)
  const exitP = useSpring(exitRaw, SPRING)

  /* ----------------------------------------------------------- incoming */
  const inset = useTransform(enterP, [0, 0.85], [7, 0], { clamp: true })
  const radius = useTransform(enterP, [0, 0.85], [36, 0], { clamp: true })
  const clipPath = useMotionTemplate`inset(0% ${inset}% 0% ${inset}% round ${radius}px ${radius}px 0px 0px)`

  const sheen = useTransform(enterP, [0, 0.9], [1, 0], { clamp: true })
  const seamScale = useTransform(enterP, [0.05, 0.6], [0, 1], { clamp: true })
  const seamOpacity = useTransform(enterP, [0.05, 0.2, 0.7, 0.95], [0, 1, 1, 0], { clamp: true })

  /* ----------------------------------------------------------- outgoing */
  const scale = useTransform(exitP, [0, 1], [1, 0.9], { clamp: true })
  const y = useTransform(exitP, [0, 1], ['0vh', '28vh'], { clamp: true })
  const veil = useTransform(exitP, [0, 1], [0, 0.78], { clamp: true })

  if (reduced) {
    return (
      <div className={`relative ${TONE[tone]}`} style={{ zIndex: layer }}>
        <AmbientField />
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      data-sheet={enter ? '' : undefined} /* resting point for useSectionMagnet */
      className={`relative ${TONE[tone]}`}
      style={{
        zIndex: layer,
        // Clip only while entering; at rest there is no clip to trap anything.
        clipPath: enter ? clipPath : undefined,
        ...(exit ? { scale, y, transformOrigin: '50% 100%' } : {}),
      }}
    >
      <AmbientField />
      {children}

      {exit && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-ink"
          style={{ opacity: veil }}
        />
      )}

      {enter && (
        /* Raised-surface sheen: lifts the sheet off a background of the same
           ink so its rounded edge reads, then fades once it lands. */
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-linear-to-b from-charcoal/70 to-transparent"
          style={{ opacity: sheen }}
        />
      )}

      {enter && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-amber"
          style={{ scaleX: seamScale, opacity: seamOpacity }}
        />
      )}
    </motion.div>
  )
}
