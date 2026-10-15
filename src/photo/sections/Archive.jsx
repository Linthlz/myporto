import { useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { MaskedLines } from '../components/MaskedLines'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { EASE } from '../../lib/motion'
import { categories, categoryLabel, photos } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * The full archive: a filterable masonry wall. Each print is revealed by a
 * wipe from below with a slight counter-zoom; hovering lifts a caption. The
 * frames keep each photograph's true ratio — nothing is cropped.
 *
 * The wall opens with one page of prints and grows on request, so a long
 * archive never makes the page heavy before the visitor asks for more.
 *
 * Entrance: the archive arrives as a small, rounded linen sheet far below and
 * rushes up to fill the screen, while its contents settle from a close zoom —
 * the feeling of being drawn in through a doorway rather than scrolling past.
 */
const PAGE = 12

function Tile({ photo, index, onOpen, reduced }) {
  const { t } = useLang()
  const ref = useRef(null)
  const seen = useInViewOnce(ref, { amount: 0.2 })
  const shown = reduced || seen
  const [w, h] = photo.size

  return (
    <motion.figure
      ref={ref}
      // a rising wave: each tile lifts into place, staggered by its column
      initial={{ opacity: 0, y: reduced ? 0 : 70 }}
      animate={{ opacity: 1, y: shown ? 0 : 70 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: EASE } }}
      transition={{
        opacity: { duration: 0.5, ease: EASE },
        y: { duration: 1.4, ease: EASE, delay: (index % 3) * 0.11 },
      }}
      className="group mb-6 break-inside-avoid md:mb-8"
    >
      <button
        type="button"
        onClick={(event) => onOpen(photo.id, event.currentTarget.getBoundingClientRect())}
        data-photo-cursor={t(COPY.view)}
        aria-label={`${t(COPY.open)} “${t(photo.title)}”`}
        className="relative block w-full overflow-hidden bg-linen"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <img
          src={photo.thumb}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={t(photo.alt)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-[clip-path,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          style={{
            clipPath: shown ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            transform: shown ? undefined : 'scale(1.15)',
            transitionDelay: shown ? `${(index % 3) * 90}ms` : '0ms',
          }}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between bg-linear-to-t from-bark/70 to-transparent p-4 pt-14 text-left text-paper opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="font-serif text-xl leading-tight italic">{t(photo.title)}</span>
          <span className="label shrink-0 pl-3 text-paper/80">{photo.year}</span>
        </span>
      </button>
      <figcaption className="mt-3 flex justify-between gap-4">
        <span className="font-serif text-lg leading-snug">{t(photo.title)}</span>
        <span className="label shrink-0 pt-1 text-umber">{t(categoryLabel[photo.category])}</span>
      </figcaption>
    </motion.figure>
  )
}

export function Archive({ reduced, onOpen }) {
  const { t } = useLang()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 0.1'] })
  const pull = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 })
  const sheetScale = useTransform(pull, [0, 1], [0.76, 1])
  const sheetY = useTransform(pull, [0, 1], [140, 0])
  const sheetRadius = useTransform(pull, [0, 1], [48, 0])
  const innerScale = useTransform(pull, [0, 1], [1.14, 1])

  const [active, setActive] = useState('All')
  const [shown, setShown] = useState(PAGE)
  const list = useMemo(
    () => (active === 'All' ? photos : photos.filter((photo) => photo.category === active)),
    [active],
  )
  const visible = list.slice(0, shown)
  const remaining = list.length - visible.length

  const choose = (category) => {
    setActive(category)
    setShown(PAGE)
  }

  return (
    <section id="archive" ref={sectionRef} data-magnet className="scroll-mt-20">
      <motion.div
        className="origin-top overflow-hidden bg-linen"
        style={reduced ? undefined : { scale: sheetScale, y: sheetY, borderRadius: sheetRadius }}
      >
        <motion.div
          className="frame origin-top py-24 md:py-36"
          style={reduced ? undefined : { scale: innerScale }}
        >
          <div className="flex flex-col gap-8 md:gap-10">
            <div>
              <p className="label text-umber">{t(COPY.archive)}</p>
              <MaskedLines
                lines={[
                  <>
                    {t(COPY.archiveTitle)[0]} <span className="italic">{t(COPY.archiveTitle)[1]}</span>
                  </>,
                ]}
                className="mt-5 text-[length:var(--text-h2)]"
              />
            </div>

            <div role="group" aria-label={t(COPY.filter)} className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const count =
                  category === 'All'
                    ? photos.length
                    : photos.filter((p) => p.category === category).length
                const on = active === category
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(category)}
                    className={`label relative isolate rounded-full border px-4 py-2.5 transition-colors duration-500 ${
                      on ? 'border-bark text-paper' : 'border-bark/25 text-bark hover:border-bark'
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-bark"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    <span className="relative">
                      {t(categoryLabel[category] ?? category)} <sup className="opacity-60">{count}</sup>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-14 columns-1 gap-6 sm:columns-2 md:mt-20 md:gap-8 lg:columns-3">
            <AnimatePresence initial={false}>
              {visible.map((photo, i) => (
                <Tile
                  key={photo.id}
                  photo={photo}
                  index={i}
                  reduced={reduced}
                  onOpen={(id, rect) =>
                    onOpen(
                      id,
                      list.map((p) => p.id),
                      rect,
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </div>

          {remaining > 0 && (
            <div className="mt-6 flex justify-center md:mt-10">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="label group inline-flex min-h-12 items-center gap-3 rounded-full border border-bark/30 px-7 py-3 transition-colors duration-500 hover:border-bark hover:bg-bark hover:text-paper"
              >
                {t(COPY.showMore)}
                <span className="text-umber transition-colors duration-500 group-hover:text-paper/70">
                  {remaining} {t(COPY.left)}
                </span>
                <Plus
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:rotate-90"
                />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
