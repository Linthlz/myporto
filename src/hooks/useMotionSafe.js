import { useReducedMotion } from 'framer-motion'
import { useCallback } from 'react'
import { still } from '../lib/motion'

/**
 * Returns a `v()` helper that swaps any variant for a no-op when the visitor
 * has asked for reduced motion. Content still appears — it just appears
 * instantly instead of travelling.
 *
 *   const { v, reduced } = useMotionSafe()
 *   <motion.div variants={v(fadeUp)} />
 */
export function useMotionSafe() {
  const reduced = useReducedMotion()

  const v = useCallback((variant) => (reduced ? still : variant), [reduced])

  return { v, reduced }
}
