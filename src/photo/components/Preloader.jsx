import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { photographer } from '../data/photos'
import { coverReady } from '../coverLoad'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * Opening curtain: a counter runs to 100 over the photographer's name, then
 * the whole panel lifts away like a print being pulled from a tray.
 *
 * The counter is honest: it climbs to 90 on a timer, then waits for the opening
 * photograph to finish loading before reaching 100 — so the curtain never
 * lifts onto an empty frame. (Gives up waiting after MAX_WAIT_MS.)
 *
 * Skipped entirely under reduced motion. Scroll is locked while it shows.
 */
const DURATION_MS = 1700
const MAX_WAIT_MS = 8000

export function Preloader({ reduced, onDone }) {
  const { t } = useLang()
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(!reduced)

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    document.documentElement.style.overflow = 'hidden'
    const start = performance.now()
    let frame
    let loaded = false
    let finished = false
    let lift = null
    const giveUp = setTimeout(() => (loaded = true), MAX_WAIT_MS)
    coverReady.then(() => (loaded = true))

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION_MS, 1)
      // ease-out so the last few numbers linger; hold at 90 until the photo is in
      const eased = 1 - Math.pow(1 - t, 3)
      const done = t >= 1 && loaded
      setCount(done ? 100 : Math.round(eased * 90))
      if (!done) frame = requestAnimationFrame(tick)
      else if (!finished) {
        finished = true
        lift = setTimeout(() => setOpen(false), 250)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(giveUp)
      clearTimeout(lift)
      document.documentElement.style.overflow = ''
    }
  }, [reduced, onDone])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = ''
        onDone()
      }}
    >
      {open && (
        <motion.div
          key="preloader"
          aria-hidden="true"
          className="paper-grain fixed inset-0 z-[90] flex flex-col justify-between bg-bark p-6 text-paper md:p-10"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="label flex justify-between text-paper/60">
            <span>{t(COPY.nav)}</span>
            <span>{t(photographer.region)}</span>
          </div>

          <div className="overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              // room below the baseline so the "g" descender is not clipped by the mask
              className="pb-[0.22em] font-serif text-[clamp(2.5rem,8vw,7rem)] leading-[1.05] font-light italic"
            >
              Lintang Hilmi
            </motion.p>
          </div>

          <div className="flex items-end justify-between">
            <span className="label text-paper/60">{t(COPY.loading)}</span>
            <span className="font-serif text-[clamp(3rem,10vw,9rem)] leading-none font-light tabular-nums">
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
