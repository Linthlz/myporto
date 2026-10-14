import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * A 1px amber rule across the top of the viewport showing read progress.
 * Decorative only — hidden from assistive tech.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-amber"
    />
  )
}
