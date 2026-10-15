import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useScrolled } from '../hooks/useScrolled'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { EASE } from '../lib/motion'
import { useLang } from '../i18n/language'

/**
 * Floating return-to-top control. Appears once the hero is behind you; its
 * ring fills in amber with read progress, so it doubles as a quiet gauge.
 */
const R = 22

export function BackToTop() {
  const show = useScrolled(700)
  const { reduced } = useMotionSafe()
  const { t } = useLang()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 })

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={t({ en: 'Back to top', id: 'Kembali ke atas' })}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="group fixed right-4 bottom-4 z-30 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-ink/80 text-[#e8eaed] backdrop-blur-md transition-colors duration-500 hover:text-amber md:right-8 md:bottom-8"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 56 56"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle cx="28" cy="28" r={R} fill="none" strokeWidth="1" className="stroke-steel/50" />
            <motion.circle
              cx="28"
              cy="28"
              r={R}
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="stroke-amber"
              style={{ pathLength: progress }}
            />
          </svg>

          {/* The arrow exits upward and a twin rises in from below on hover */}
          <span className="relative h-4 w-4 overflow-hidden">
            <ArrowUp
              size={16}
              strokeWidth={1.75}
              className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
            />
            <ArrowUp
              size={16}
              strokeWidth={1.75}
              className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
