import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navLinks, profile } from '../data/profile'
import { useScrolled } from '../hooks/useScrolled'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { EASE } from '../lib/motion'

const SECTION_IDS = ['home', ...navLinks.map((l) => l.id)]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(32)
  const active = useActiveSection(SECTION_IDS)
  const { reduced } = useMotionSafe()

  /* Scroll to a section, respecting the reduced-motion preference. */
  const goTo = useCallback(
    (event, id) => {
      event.preventDefault()
      setOpen(false)
      const target = document.getElementById(id)
      if (!target) return
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
      // Move keyboard focus with the view so tabbing continues from here.
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    },
    [reduced]
  )

  /* Lock the page behind the mobile menu and allow Escape to close it. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <a
        href="#work"
        onClick={(e) => goTo(e, 'work')}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled || open
            ? 'border-b border-steel/25 bg-ink/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-18 items-center justify-between py-4 md:h-20"
        >
          {/* Monogram */}
          <a
            href="#home"
            onClick={(e) => goTo(e, 'home')}
            className="group relative z-10 flex items-center gap-2.5"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="font-display text-xl leading-none font-semibold tracking-tight">
              {profile.monogram}
            </span>
            <span className="h-1.5 w-1.5 bg-amber transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150" />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => goTo(e, link.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`link-underline py-2 text-[0.8125rem] tracking-[0.06em] transition-colors duration-400 ${
                      isActive ? 'text-amber' : 'text-mist hover:text-[#e8eaed]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-amber"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="group hidden items-center gap-2 border border-steel/50 px-5 py-2.5 text-[0.75rem] tracking-[0.16em] uppercase transition-colors duration-500 hover:border-amber hover:text-amber sm:inline-flex"
            >
              Let&apos;s Talk
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-10 -mr-2 inline-flex h-11 w-11 items-center justify-center text-[#e8eaed] lg:hidden"
            >
              {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu — designed for the phone, not a shrunken desktop nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 bg-ink lg:hidden"
          >
            {/* pointer-events-none is load-bearing: without it this overlay
                sits above the menu links and swallows every tap */}
            <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

            <motion.ul
              className="shell flex h-full flex-col justify-center gap-1 pb-16"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}
            >
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                  className="border-b border-steel/20"
                >
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => goTo(e, link.id)}
                    className="flex items-baseline justify-between py-5"
                  >
                    <span
                      className={`font-display text-[clamp(2rem,10vw,3rem)] leading-none tracking-tight ${
                        active === link.id ? 'text-amber' : 'text-[#e8eaed]'
                      }`}
                    >
                      {link.label}
                    </span>
                    <span className="eyebrow text-[0.625rem]">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}

              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                className="mt-10"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-h-12 items-center gap-2 bg-amber px-7 py-3.5 text-[0.8125rem] font-medium tracking-[0.16em] text-ink uppercase"
                >
                  Let&apos;s Talk
                  <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
