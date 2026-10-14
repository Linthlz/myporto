import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { fadeUp, stagger } from '../lib/motion'

/**
 * The single scroll-reveal primitive for the whole site.
 *
 * Every section drives its entrance through this component rather than Framer
 * Motion's `whileInView`, which proved unreliable here: in this version it
 * silently failed to resolve for a number of elements, leaving whole sections
 * stuck at opacity 0. One observer, one code path, one thing to verify.
 *
 *   <Reveal>
 *     <Reveal.Item>…</Reveal.Item>
 *     <Reveal.Item>…</Reveal.Item>
 *   </Reveal>
 *
 * The parent releases its children in sequence; each child animates with
 * `fadeUp` unless given another variant.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  gap = 0.08,
  amount = 0.15,
  as = 'div',
  ...rest
}) {
  const ref = useRef(null)
  const inView = useInViewOnce(ref, { amount })
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

function Item({ children, className = '', variants, as = 'div', ...rest }) {
  const { v } = useMotionSafe()
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag className={className} variants={v(variants ?? fadeUp)} {...rest}>
      {children}
    </MotionTag>
  )
}

Reveal.Item = Item
