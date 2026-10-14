import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

/**
 * An endless band of subjects in italic serif. The phrase is rendered twice
 * and the track slides by exactly half its width, so the loop has no seam.
 *
 * The band leans with the reader: scroll fast and it shears a few degrees in
 * the direction of travel, then springs back upright when the page settles.
 */
export function Marquee({ items, reduced }) {
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 })
  const skewX = useTransform(velocity, [-2500, 0, 2500], [7, 0, -7], { clamp: true })

  const run = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-serif text-[clamp(3rem,2rem+5vw,7.5rem)] leading-none font-light italic md:px-10">
            {item}
          </span>
          <span className="h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
        </span>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y border-bark/15 py-8 md:py-12">
      <motion.div style={reduced ? undefined : { skewX }}>
        <div className="marquee-track">
          {run(false)}
          {run(true)}
        </div>
      </motion.div>
    </div>
  )
}
