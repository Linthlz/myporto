import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { coverPhoto, photoMeta, photographer, placeholderStyle } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * Opening spread. A small framed print sits between the two halves of the
 * name; scrolling opens it to a full-bleed photograph while the name parts
 * and slides out of the way. The image counter-zooms as the frame opens, so
 * it feels like stepping into the picture rather than enlarging it.
 *
 * Built as a tall section with a sticky viewport — the scroll distance is the
 * animation timeline.
 */
const COVER = coverPhoto
// Side inset of the opening print on wide screens (percent of the viewport).
const PRINT_SIDE = 37

export function PhotoHero({ ready, reduced }) {
  const { t } = useLang()
  const ref = useRef(null)
  const leftWordRef = useRef(null)
  const rightWordRef = useRef(null)
  const [narrow, setNarrow] = useState(false)

  /* Mirror the two words around the print: the right word sits exactly as far
     from the print as the left word does. Uses offset* (unaffected by the
     scroll transforms) and re-measures once the display font has loaded. */
  useLayoutEffect(() => {
    const left = leftWordRef.current
    const right = rightWordRef.current
    const place = () => {
      right.style.marginRight = '0px'
      if (window.innerWidth < 768) return
      const vw = window.innerWidth
      const gap = (vw * PRINT_SIDE) / 100 - (left.offsetLeft + left.offsetWidth)
      const target = vw * (1 - PRINT_SIDE / 100) + gap
      right.style.marginRight = `${Math.max(right.offsetLeft - target, 0)}px`
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 })

  // Frame insets (percent of the viewport): a portrait print → full bleed.
  const side = useTransform(p, [0, 0.7], [narrow ? 16 : PRINT_SIDE, 0], { clamp: true })
  const vert = useTransform(p, [0, 0.7], [narrow ? 22 : 16, 0], { clamp: true })
  const round = useTransform(p, [0, 0.7], [4, 0], { clamp: true })
  const clipPath = useMotionTemplate`inset(${vert}% ${side}% ${vert}% ${side}% round ${round}px)`
  const zoom = useTransform(p, [0, 0.7], [1.15, 1], { clamp: true })

  const leftX = useTransform(p, [0, 0.55], ['0vw', '-30vw'], { clamp: true })
  const rightX = useTransform(p, [0, 0.55], ['0vw', '30vw'], { clamp: true })
  const nameFade = useTransform(p, [0.25, 0.55], [1, 0], { clamp: true })
  const captionIn = useTransform(p, [0.72, 0.92], [0, 1], { clamp: true })
  const captionY = useTransform(p, [0.72, 0.92], [30, 0], { clamp: true })

  const rise = (delay) => ({
    initial: { y: '105%' },
    animate: ready ? { y: '0%' } : undefined,
    transition: { duration: 1.3, ease: EASE, delay },
  })

  return (
    <section id="top" ref={ref} className="relative h-[260vh]" aria-label={t(COPY.introSection)}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* the opening print */}
        <motion.div
          className="absolute inset-0 bg-linen"
          style={{
            ...placeholderStyle(COVER, COVER.placeholder, '50% 42%'),
            ...(reduced ? {} : { clipPath }),
          }}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        >
          <motion.img
            src={COVER.src}
            srcSet={COVER.srcSet}
            sizes={COVER.sizes}
            alt={t(COVER.alt)}
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_42%]"
            style={reduced ? undefined : { scale: zoom }}
          />
          {/* darken the base so the caption holds over any photograph */}
          <div className="absolute inset-0 bg-linear-to-t from-bark/60 via-transparent to-transparent" />
        </motion.div>

        {/* the name, split around the print */}
        {/* Phones: one word above the print, one below. Wider: either side,
            pinned to the screen edges (no max-width) and sized to the free
            space beside the print, so they never touch it. */}
        <h1 className="pointer-events-none absolute inset-x-0 top-[10%] bottom-[10%] md:top-1/2 md:bottom-auto md:-translate-y-1/2">
          <span className="sr-only">
            {photographer.title.join(' ')} — {t(photographer.role)} {t(COPY.by)} {photographer.name}
          </span>
          <motion.span
            aria-hidden="true"
            className="flex h-full w-full flex-col justify-between px-[clamp(1.25rem,0.8rem+3vw,4.5rem)] font-serif text-[length:var(--text-display)] leading-none font-light md:h-auto md:flex-row md:items-center md:text-[min(var(--text-display),10vw)]"
            style={reduced ? undefined : { opacity: nameFade }}
          >
            <motion.span ref={leftWordRef} className="line-mask" style={reduced ? undefined : { x: leftX }}>
              <motion.span className="block" {...rise(0.15)}>
                {photographer.title[0]}
              </motion.span>
            </motion.span>
            <motion.span
              ref={rightWordRef}
              className="line-mask self-end md:self-auto"
              style={reduced ? undefined : { x: rightX }}
            >
              <motion.span className="block italic" {...rise(0.3)}>
                {photographer.title[1]}
              </motion.span>
            </motion.span>
          </motion.span>
        </h1>

        {/* caption that lands once the print is full bleed */}
        <motion.div
          className="frame absolute inset-x-0 bottom-0 pb-10 text-paper md:pb-14"
          style={reduced ? undefined : { opacity: captionIn, y: captionY }}
        >
          <p className="max-w-3xl font-serif text-[length:var(--text-lead)] leading-tight font-light italic">
            {t(photographer.tagline)}
          </p>
          <p className="label mt-5 text-paper/75">
            {[t(COVER.title), photoMeta(COVER)].filter(Boolean).join(' — ')}
          </p>
        </motion.div>

        {/* corner metadata, visible from the start */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={reduced ? undefined : { opacity: nameFade }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.9 }}
            className="frame label flex justify-between pb-6 text-umber"
          >
            <span>{t(photographer.role)} · {photographer.location}</span>
            <span className="hidden sm:inline">{t(COPY.scrollToOpen)}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
