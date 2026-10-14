import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { maskLine, stagger } from '../lib/motion'

/**
 * Display heading whose lines rise out of an overflow-hidden mask, one after
 * the other. Each line is a real line of text, so it stays selectable and is
 * announced correctly by screen readers.
 *
 * `lines` is an array of strings — you choose the break points, which matters
 * at display size where automatic wrapping looks arbitrary.
 *
 * `trigger="mount"` is for above-the-fold headings that should animate as the
 * page loads; everything else waits until it scrolls into view.
 */
export function MaskedHeading({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  trigger = 'inView',
}) {
  const ref = useRef(null)
  const inView = useInViewOnce(ref, { amount: 0.2 })
  const { v } = useMotionSafe()
  const MotionTag = motion[Tag] ?? motion.h2

  const show = trigger === 'mount' || inView

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={stagger(0.1, delay)}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span className={`block ${lineClassName}`} variants={v(maskLine)}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
