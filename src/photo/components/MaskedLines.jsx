import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { useMotionSafe } from '../../hooks/useMotionSafe'
import { maskLine, stagger } from '../../lib/motion'

/**
 * Serif display lines that rise out of a mask in turn once scrolled into view.
 * (Same idea as the main site's MaskedHeading, without its sans styling.)
 */
export function MaskedLines({ lines, as: Tag = 'h2', className = '' }) {
  const ref = useRef(null)
  const inView = useInViewOnce(ref, { amount: 0.3 })
  const { v } = useMotionSafe()
  const MotionTag = motion[Tag] ?? motion.h2

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={stagger(0.12)}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span className="block" variants={v(maskLine)}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
