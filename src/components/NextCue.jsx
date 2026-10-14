import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useMotionSafe } from '../hooks/useMotionSafe'

/**
 * End-of-section signpost: "Next — 003 About".
 *
 * An amber rule fills as the cue scrolls into place and the label drifts up
 * to meet it, so the reader feels the following section coming before it
 * arrives. It is also a real link to that section.
 */
export function NextCue({ id, index, label }) {
  const ref = useRef(null)
  const { reduced } = useMotionSafe()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  const fill = useTransform(progress, [0, 1], [0, 1])
  const lift = useTransform(progress, [0, 1], ['40%', '0%'])
  const fade = useTransform(progress, [0, 0.6], [0.25, 1])

  const goTo = (event) => {
    event.preventDefault()
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div ref={ref} className="shell relative pb-10 md:pb-16">
      <a
        href={`#${id}`}
        onClick={goTo}
        className="group block"
        aria-label={`Next section: ${label}`}
      >
        <div className="relative h-px bg-steel/25">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 origin-left bg-amber"
            style={{ scaleX: reduced ? 1 : fill }}
          />
        </div>

        <p className="eyebrow flex items-center gap-3 pt-6 md:pt-8">
          <span>Next</span>
          <span className="text-amber">{index}</span>
        </p>

        {/* Arrow sits beside the label, clear of the floating back-to-top
            button in the corner. Bottom padding keeps descenders unclipped. */}
        <div className="mt-3 flex items-center gap-5 overflow-hidden pb-[0.12em] md:gap-7">
          <motion.p
            className="font-display text-[clamp(2rem,7vw,5rem)] leading-[1.05] font-medium tracking-[-0.03em] transition-colors duration-500 group-hover:text-amber"
            style={reduced ? undefined : { y: lift, opacity: fade }}
          >
            {label}
          </motion.p>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-steel/50 transition-colors duration-500 group-hover:border-amber group-hover:text-amber md:h-14 md:w-14">
            <ArrowDown
              size={18}
              strokeWidth={1.5}
              aria-hidden="true"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1"
            />
          </span>
        </div>
      </a>
    </div>
  )
}
