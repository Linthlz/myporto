import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useScrolled } from '../../hooks/useScrolled'
import { EASE } from '../../lib/motion'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * Square return-to-top control for the photography page — a small print
 * frame whose clay edge draws itself around as the page is read. Appears
 * once the opening spread is behind you.
 */
export function SquareToTop({ reduced }) {
  const { t } = useLang()
  const show = useScrolled(1200)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 })

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t(COPY.toTop)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="group fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center bg-paper/85 text-bark backdrop-blur-md transition-colors duration-500 hover:bg-bark hover:text-paper md:right-8 md:bottom-8 md:h-14 md:w-14"
        >
          <svg aria-hidden="true" viewBox="0 0 56 56" className="absolute inset-0 h-full w-full">
            <rect x="0.5" y="0.5" width="55" height="55" fill="none" strokeWidth="1" className="stroke-bark/25" />
            {/* starts top-centre and runs clockwise, like the ring on the main site */}
            <motion.path
              d="M28 0.75 H55.25 V55.25 H0.75 V0.75 H28"
              fill="none"
              strokeWidth="1.5"
              className="stroke-clay"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* the arrow exits upward and a twin rises in from below on hover */}
          <span className="relative h-4 w-4 overflow-hidden">
            <ArrowUp
              size={16}
              strokeWidth={1.5}
              className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
            />
            <ArrowUp
              size={16}
              strokeWidth={1.5}
              className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
