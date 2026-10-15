import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { photoMeta, photos } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * A breath between the archive and the about page: one landscape that opens
 * from a narrow letterbox to the full width as it scrolls into view, pulling
 * back from a close crop while a single line of text rises over it.
 *
 * Not pinned — the effect plays across the section's natural passage, so it
 * adds no extra scrolling.
 */
const PHOTO = photos.find((photo) => photo.id === 'crater-lake-clear-morning') ?? photos[0]

export function Interlude({ reduced }) {
  const { t } = useLang()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.0005 })

  const side = useTransform(p, [0, 1], [18, 0])
  const vert = useTransform(p, [0, 1], [14, 0])
  const clipPath = useMotionTemplate`inset(${vert}% ${side}% ${vert}% ${side}%)`
  const zoom = useTransform(p, [0, 1], [1.35, 1])
  const lineY = useTransform(p, [0.55, 1], ['110%', '0%'])
  const fade = useTransform(p, [0.6, 1], [0, 1])

  return (
    <section ref={ref} data-magnet className="relative h-[85svh] overflow-hidden md:h-screen" aria-label={t(COPY.interlude)}>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { clipPath }}>
        <motion.img
          src={PHOTO.src}
          alt={t(PHOTO.alt)}
          loading="lazy"
          className="h-full w-full object-cover"
          style={reduced ? undefined : { scale: zoom }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-bark/70 via-bark/10 to-transparent" />
      </motion.div>

      <div className="frame absolute inset-x-0 bottom-0 pb-12 text-paper md:pb-20">
        <span className="line-mask">
          <motion.span
            className="block font-serif text-[clamp(2.4rem,1.2rem+5vw,6.5rem)] leading-[0.95] font-light italic"
            style={reduced ? undefined : { y: lineY }}
          >
            {t(COPY.waitForLight)}
          </motion.span>
        </span>
        <motion.p className="label mt-5 text-paper/75" style={reduced ? undefined : { opacity: fade }}>
          {[t(PHOTO.title), photoMeta(PHOTO)].filter(Boolean).join(' — ')}
        </motion.p>
      </div>
    </section>
  )
}
