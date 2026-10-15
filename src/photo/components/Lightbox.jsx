import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { categoryLabel, photoMeta, photos, placeholderStyle } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * Full-screen viewer.
 *
 * Opening: the print that was clicked lifts out of the page and flies to its
 * place in the viewer while the room darkens around it. Closing on that same
 * print sends it back into its slot. (Any other print simply fades.)
 *
 * The stage is measured and every photograph is laid into it with a computed
 * "contain" box — so the flight lands exactly where the real image sits.
 *
 * Arrow keys, on-screen buttons and a horizontal swipe move through the set
 * that was open when it launched. Escape closes; focus returns to the print.
 */
const byId = Object.fromEntries(photos.map((photo) => [photo.id, photo]))
const FLIGHT = { duration: 0.85, ease: EASE }

function fit(size, box) {
  if (!box) return null
  const [w, h] = size
  const scale = Math.min(box.width / w, box.height / h)
  const width = w * scale
  const height = h * scale
  return { left: (box.width - width) / 2, top: (box.height - height) / 2, width, height }
}

export function Lightbox({ state, onClose, reduced }) {
  const { t } = useLang()
  const closeRef = useRef(null)
  const stageRef = useRef(null)
  const returnFocus = useRef(null)
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)
  const [stage, setStage] = useState(null)
  // 'opening' → flight in · 'open' → browsing · 'closing' → flight back
  const [phase, setPhase] = useState('open')

  const ids = state?.ids ?? []
  const photo = byId[ids[index]]
  const flies = Boolean(state?.origin) && !reduced

  useEffect(() => {
    if (!state) return
    setIndex(Math.max(ids.indexOf(state.id), 0))
    setDir(0)
    setPhase(flies ? 'opening' : 'open')
    returnFocus.current = document.activeElement
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.documentElement.style.overflow = ''
      returnFocus.current?.focus?.()
    }
  }, [state]) // re-run only when a new set is opened

  // Measure the stage in viewport coordinates so boxes can be computed.
  useLayoutEffect(() => {
    if (!state) return
    const el = stageRef.current
    if (!el) return
    const read = () => {
      const r = el.getBoundingClientRect()
      setStage({ left: r.left, top: r.top, width: r.width, height: r.height })
    }
    read()
    const observer = new ResizeObserver(read)
    observer.observe(el)
    return () => observer.disconnect()
  }, [state])

  const requestClose = useCallback(() => {
    const backToOrigin = flies && photo && photo.id === state?.id && phase === 'open'
    if (backToOrigin) setPhase('closing')
    else onClose()
  }, [flies, onClose, phase, photo, state])

  const step = (delta) => {
    setDir(delta)
    setIndex((i) => (i + delta + ids.length) % ids.length)
  }

  useEffect(() => {
    if (!state) return
    const onKey = (event) => {
      if (event.key === 'Escape') requestClose()
      if (phase !== 'open') return
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const box = photo ? fit(photo.size, stage) : null
  const target = box && stage ? { ...box, left: box.left + stage.left, top: box.top + stage.top } : null
  const origin = state?.origin
  const slide = reduced ? 0 : 80
  const live = phase === 'open'

  return (
    <>
      <AnimatePresence>
        {state && photo && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${t(photo.title)} — ${t(COPY.photoOf).replace('{n}', index + 1).replace('{total}', ids.length)}`}
            className="fixed inset-0 z-[80] flex flex-col text-paper"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* the room darkens behind the flight */}
            <motion.div
              className="absolute inset-0 bg-bark"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'closing' ? 0 : 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />

            <motion.div
              className="frame relative flex items-center justify-between py-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: live ? 1 : 0, y: live ? 0 : -10 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="label text-paper/60 tabular-nums">
                {String(index + 1).padStart(2, '0')} / {String(ids.length).padStart(2, '0')}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                className="label inline-flex min-h-11 items-center gap-2 text-paper/80 transition-colors hover:text-paper"
              >
                {t(COPY.close)} <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </motion.div>

            <div className="relative min-h-0 flex-1 px-4 md:px-24">
              <div ref={stageRef} className="relative h-full w-full">
                {box && (
                  <AnimatePresence initial={false} custom={dir} mode="popLayout">
                    <motion.img
                      key={photo.id}
                      src={photo.src}
                      alt={t(photo.alt)}
                      custom={dir}
                      initial={{ opacity: 0, x: dir * slide, scale: 0.97 }}
                      animate={{ opacity: live ? 1 : 0, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -dir * slide, scale: 0.97 }}
                      // swap in instantly where the flight lands; glide between photos
                      transition={{ duration: !live || dir === 0 ? 0 : 0.7, ease: EASE }}
                      drag={reduced || !live ? false : 'x'}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -70) step(1)
                        else if (info.offset.x > 70) step(-1)
                      }}
                      draggable={false}
                      className="absolute cursor-grab object-cover active:cursor-grabbing"
                      // the grid's thumbnail is already cached: it shows at once
                      // and the full-size file sharpens over it when it lands
                      style={{
                        left: box.left,
                        top: box.top,
                        width: box.width,
                        height: box.height,
                        ...placeholderStyle(photo, photo.thumb),
                      }}
                    />
                  </AnimatePresence>
                )}
              </div>

              {ids.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: live ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="pointer-events-none absolute inset-0 hidden items-center justify-between px-3 md:flex md:px-8"
                >
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t(COPY.previous)}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-paper"
                  >
                    <ArrowLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t(COPY.next)}
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-paper"
                  >
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </button>
                </motion.div>
              )}
            </div>

            <motion.div
              className="frame relative flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: live ? 1 : 0, y: live ? 0 : 10 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/* the title rises again with each new photograph */}
              <span className="line-mask">
                <motion.span
                  key={photo.id}
                  className="block font-serif text-2xl italic md:text-3xl"
                  initial={reduced ? false : { y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  {t(photo.title)}
                </motion.span>
              </span>
              <p className="label text-paper/60">
                {photoMeta(photo) || t(categoryLabel[photo.category])}
                <span className="md:hidden"> · {t(COPY.swipe)}</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The flying print — outside the dialog so it never fades with it. */}
      {state && photo && origin && target && phase !== 'open' && (
        <motion.img
          aria-hidden="true"
          src={photo.thumb}
          alt=""
          className="pointer-events-none fixed z-[85] object-cover"
          initial={phase === 'opening' ? origin : target}
          animate={phase === 'opening' ? target : origin}
          transition={FLIGHT}
          onAnimationComplete={() => (phase === 'opening' ? setPhase('open') : onClose())}
        />
      )}
    </>
  )
}
