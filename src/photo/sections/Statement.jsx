import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { photographer } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * The introduction is read at the pace of the scroll: each word starts as a
 * faint impression and darkens in turn, like a print coming up in the tray.
 */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1], { clamp: true })
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

export function Statement({ reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const { t } = useLang()
  const intro = t(photographer.intro)
  const words = intro.split(' ')

  return (
    <section ref={ref} data-magnet className="frame py-28 md:py-44" aria-labelledby="intro-label">
      <div className="grid gap-10 md:grid-cols-12">
        <p id="intro-label" className="label text-umber md:col-span-3">
          {t(COPY.intro)}
        </p>
        <p className="font-serif text-[clamp(1.75rem,1.1rem+2.6vw,3.6rem)] leading-[1.12] font-light md:col-span-9">
          {reduced
            ? intro
            : words.map((word, i) => (
                <Word
                  key={i}
                  progress={scrollYProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                >
                  {word}
                </Word>
              ))}
        </p>
      </div>
    </section>
  )
}
