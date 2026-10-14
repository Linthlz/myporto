import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { MaskedHeading } from '../components/MaskedHeading'
import { MagneticButton } from '../components/MagneticButton'
import { Media } from '../components/Media'
import { GridRules } from '../components/GridRules'
import { PhotographyBadge } from '../components/PhotographyBadge'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { profile } from '../data/profile'
import { drawLineX, EASE, fadeUp, stagger } from '../lib/motion'
import portrait from '../assets/photo-hero.webp'

/**
 * Asymmetric editorial hero: the headline owns roughly two thirds of the
 * measure, the portrait is a tall column pushed to the right and down, and the
 * baseline carries status / scroll cues. The image is deliberately smaller than
 * the type — it supports the headline rather than competing with it.
 */
export function Hero() {
  const { v } = useMotionSafe()

  return (
    <section
      id="home"
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-10 md:pt-32"
    >
      <GridRules columns={[16, 50, 84]} />

      <div className="shell relative w-full">
        <div className="grid grid-cols-1 items-end gap-x-10 gap-y-12 lg:grid-cols-12">
          {/* ---------------------------------------------------- headline */}
          <div className="lg:col-span-8 lg:pb-4">
            <motion.div
              variants={stagger(0.08, 0.15)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-4"
            >
              <motion.span variants={v(fadeUp)} className="eyebrow text-amber">
                001
              </motion.span>
              <motion.span variants={v(fadeUp)} className="eyebrow max-w-xs leading-relaxed">
                {profile.eyebrow}
              </motion.span>
            </motion.div>

            <MaskedHeading
              as="h1"
              trigger="mount"
              delay={0.3}
              lines={profile.headlineLines}
              className="mt-7 text-[length:var(--text-hero)] font-medium"
              lineClassName="[&>span]:text-amber"
            />

            <motion.div
              variants={stagger(0.1, 1.1)}
              initial="hidden"
              animate="show"
              className="mt-10"
            >
              <motion.p
                variants={v(fadeUp)}
                className="max-w-2xl text-[length:var(--text-lead)] leading-relaxed font-light text-mist"
              >
                {profile.intro}
              </motion.p>

              <motion.div variants={v(fadeUp)} className="mt-9 flex flex-wrap items-center gap-3">
                <MagneticButton href="#work" icon={ArrowDown} className="w-full sm:w-auto">
                  Explore Work
                </MagneticButton>
                <MagneticButton
                  href={`mailto:${profile.email}`}
                  variant="secondary"
                  icon={ArrowUpRight}
                  className="w-full sm:w-auto"
                >
                  Get in Touch
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------- portrait */}
          <motion.div
            className="relative lg:col-span-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          >
            {/* caption rail */}
            <div className="absolute -top-8 left-0 flex w-full items-center gap-3">
              <span className="eyebrow text-[0.625rem]">Fig. 01</span>
              <motion.span
                className="hairline flex-1 origin-left"
                variants={v(drawLineX)}
                initial="hidden"
                animate="show"
                transition={{ delay: 1 }}
              />
            </div>

            <div className="relative">
              <Media
                src={portrait}
                alt="Silhouette of Lintang at a seaside temple in northern Bali at sunset"
                ratio="3 / 4"
                priority
                className="max-h-[52vh] w-full lg:max-h-none"
              />
              {/* Seal on the print's corner: this photograph opens the
                  photography portfolio */}
              <PhotographyBadge className="absolute right-4 bottom-4 z-10 lg:right-auto lg:bottom-10 lg:-left-14" />
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <p className="eyebrow text-[0.625rem] leading-relaxed">{profile.location}</p>
              <span className="eyebrow text-[0.625rem] text-amber">2026</span>
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------- baseline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
          className="mt-10 border-t border-steel/25 pt-5 md:mt-14"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {profile.availability && (
              <p className="flex items-center gap-2.5 text-[0.75rem] tracking-[0.08em] text-mist">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
                </span>
                {profile.availability}
              </p>
            )}

            <a
              href="#work"
              className="group flex items-center gap-3 text-[0.75rem] tracking-[0.18em] text-mist uppercase transition-colors duration-500 hover:text-amber"
            >
              Scroll
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={14} strokeWidth={1.5} />
              </motion.span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
