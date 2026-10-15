import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { LanguageToggle, useLang } from '../../i18n/language'
import { COPY } from '../copy'

const LINKS = ['selected', 'archive', 'about', 'contact']

/**
 * Fixed top bar drawn with `mix-blend-difference`, so a single white layer
 * reads as dark over paper and light over photographs — no state, no flicker.
 *
 * It belongs to the opening spread only: once the hero has scrolled away it
 * leaves, and it returns only when the visitor is back at the top section.
 */
function useOnlyOverHero(id = 'top') {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const hero = document.getElementById(id)
    if (!hero) return
    let frame = null
    const check = () => {
      frame = null
      // gone once less than ~40% of a screen of the hero is still showing
      setHidden(hero.getBoundingClientRect().bottom < window.innerHeight * 0.4)
    }
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [id])
  return hidden
}

export function PhotoNav({ ready, reduced }) {
  const hidden = useOnlyOverHero()
  const { t } = useLang()

  const goTo = (event, id) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={ready ? { opacity: 1, y: hidden ? '-110%' : '0%' } : undefined}
      transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
    >
      <nav aria-label={t(COPY.nav)} className="frame flex items-center justify-between py-5 md:py-7">
        <a href="#top" onClick={(e) => goTo(e, 'top')} className="pointer-events-auto font-serif text-xl italic md:text-2xl">
          Lintang Hilmi
        </a>

        <ul className="pointer-events-auto hidden items-center gap-9 md:flex">
          {LINKS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => goTo(e, id)} className="label link-draw">
                {t(COPY.links[id])}
              </a>
            </li>
          ))}
        </ul>

        <div className="pointer-events-auto flex items-center gap-5 md:gap-7">
          <LanguageToggle className="label" idleClass="opacity-50" />
          <a href="../" className="label link-draw inline-flex items-center gap-2">
            <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" />
            {t(COPY.portfolio)}
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
