import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MaskedLines } from '../components/MaskedLines'
import { useInViewOnce } from '../../hooks/useInViewOnce'
import { EASE } from '../../lib/motion'
import { categoryLabel, photoMeta, photos } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * Selected works as an endless carousel — a merry-go-round of prints.
 *
 * The set is laid out three times in a row. The visitor always browses the
 * middle copy; whenever the strip comes to rest inside the first or last copy
 * it is shifted, invisibly, by exactly one set width back into the middle. So
 * after the last print the first one simply arrives from the right, and the
 * strip can turn forever in either direction without ever rewinding.
 *
 * Handle it however you like: drag with the mouse (it keeps a little
 * momentum), swipe on touch, slide on a trackpad, or step with the arrows.
 * Vertical scrolling passes straight through.
 *
 * Every card is measured against the centre of the view: the one in focus
 * sits at full size, its neighbours ease back, and each photograph drifts
 * slightly inside its frame. Portrait prints only, set in a zig-zag.
 *
 * It turns by itself every two seconds while on screen. Resting the cursor on
 * it does not stop it; actually handling it pauses the turn for a few seconds.
 */
const FEATURED = photos.filter((photo) => photo.featured && photo.size[1] > photo.size[0])
const N = FEATURED.length
const SETS = 3
const RING = Array.from({ length: N * SETS }, (_, i) => FEATURED[i % N])
const INTERVAL_MS = 2000
const RESUME_AFTER_MS = 4000
const SETTLE_MS = 140

function Card({ photo, slot, onOpen, register, entered, reduced }) {
  const { t } = useLang()
  const [w, h] = photo.size
  const index = slot % N
  const clone = Math.floor(slot / N) !== 1 // only the middle copy is "real"
  return (
    <motion.figure
      ref={register}
      aria-hidden={clone || undefined}
      className={`selected-card shrink-0 snap-center ${index % 2 ? 'mt-10 md:mt-20' : ''}`}
      style={{ '--ratio': w / h }}
      initial={reduced ? false : { opacity: 0, x: 160 }}
      animate={entered || reduced ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 1.2, ease: EASE, delay: 0.08 * index }}
    >
      <button
        type="button"
        tabIndex={clone ? -1 : undefined}
        onClick={(event) => onOpen(photo.id, event.currentTarget.getBoundingClientRect())}
        data-photo-cursor={t(COPY.view)}
        aria-label={`${t(COPY.open)} “${t(photo.title)}”`}
        className="selected-frame group block overflow-hidden bg-linen"
      >
        <img
          src={photo.thumb}
          srcSet={photo.srcSet}
          sizes={`(min-width: 768px) calc(60vh * ${(w / h).toFixed(3)}), 76vw`}
          alt={clone ? '' : t(photo.alt)}
          loading="lazy"
          draggable={false}
          className="selected-img h-[48svh] w-[calc(48svh*var(--ratio))] max-w-[76vw] object-cover md:h-[60vh] md:w-[calc(60vh*var(--ratio))] md:max-w-none"
        />
      </button>
      <figcaption className="selected-caption mt-5 flex items-baseline gap-4">
        <span className="label text-clay">{String(index + 1).padStart(2, '0')}</span>
        <span>
          <span className="block font-serif text-2xl leading-tight md:text-3xl">{t(photo.title)}</span>
          <span className="label mt-1.5 block text-umber">{photoMeta(photo) || t(categoryLabel[photo.category])}</span>
        </span>
      </figcaption>
    </motion.figure>
  )
}

export function Selected({ reduced, onOpen, paused = false }) {
  const { t } = useLang()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const cards = useRef([])
  const nearestRef = useRef(N) // slot in the ring closest to the centre
  const entered = useInViewOnce(sectionRef, { amount: 0.2 })
  const [current, setCurrent] = useState(0) // 0…N-1, what the counter shows
  const [onScreen, setOnScreen] = useState(false)
  const heldUntil = useRef(0) // visitor is handling the strip until this time
  const playing = onScreen && !reduced && !paused

  const progress = useMotionValue(0)
  const bar = useSpring(progress, { stiffness: 160, damping: 30, restDelta: 0.001 })

  /* Depth: scale, caption fade and inner drift from distance to centre. */
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const centre = track.getBoundingClientRect().left + track.clientWidth / 2
    let nearest = 0
    let best = Infinity
    cards.current.forEach((card, i) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const offset = (rect.left + rect.width / 2 - centre) / track.clientWidth // ~ -1…1
      if (Math.abs(offset) < best) {
        best = Math.abs(offset)
        nearest = i
      }
      if (reduced) return
      const d = Math.max(-1, Math.min(1, offset))
      card.style.setProperty('--depth', Math.abs(d).toFixed(3))
      card.style.setProperty('--drift', d.toFixed(3))
    })
    nearestRef.current = nearest
    setCurrent(nearest % N)
    progress.set(N > 1 ? (nearest % N) / (N - 1) : 0)
  }, [progress, reduced])

  /* Scroll position (instant) that centres a given slot. */
  const leftFor = (slot) => {
    const track = trackRef.current
    const card = cards.current[slot]
    return card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2
  }

  const centre = useCallback(
    (slot) => {
      const track = trackRef.current
      if (!track || !cards.current[slot]) return
      track.scrollTo({ left: leftFor(slot), behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced]
  )

  /* Invisible jump: move by one whole set without the eye noticing. */
  const jump = (by) => {
    const track = trackRef.current
    track.style.scrollSnapType = 'none'
    track.scrollLeft += by
    measure()
    requestAnimationFrame(() => (track.style.scrollSnapType = ''))
  }

  // Start in the middle copy, first print centred.
  useLayoutEffect(() => {
    const track = trackRef.current
    track.style.scrollSnapType = 'none'
    track.scrollLeft = leftFor(N)
    measure()
    requestAnimationFrame(() => (track.style.scrollSnapType = ''))
  }, []) // once, on mount

  useEffect(() => {
    const track = trackRef.current
    let frame = null
    let settle = null

    // Once the strip is at rest, bring it back into the middle copy if it
    // has wandered into either clone.
    const recentre = () => {
      if (track.classList.contains('is-dragging')) return
      const setWidth = cards.current[N].offsetLeft - cards.current[0].offsetLeft
      const slot = nearestRef.current
      if (slot < N) jump(setWidth)
      else if (slot >= 2 * N) jump(-setWidth)
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(() => ((frame = null), measure()))
      clearTimeout(settle)
      settle = setTimeout(recentre, SETTLE_MS)
    }
    const onResize = () => {
      track.style.scrollSnapType = 'none'
      track.scrollLeft = leftFor(N + (nearestRef.current % N))
      measure()
      requestAnimationFrame(() => (track.style.scrollSnapType = ''))
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame !== null) cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [measure]) // leftFor/jump only read refs, so they need no dependency

  /* Mouse drag with a little throw. Touch and trackpads scroll natively. */
  useEffect(() => {
    const track = trackRef.current
    let start = null
    let moved = false
    let lastX = 0
    let lastT = 0
    let velocity = 0

    const down = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      start = { x: event.clientX, left: track.scrollLeft }
      moved = false
      lastX = event.clientX
      lastT = performance.now()
      velocity = 0
    }
    const move = (event) => {
      if (!start) return
      const dx = event.clientX - start.x
      if (!moved && Math.abs(dx) > 6) {
        moved = true
        track.classList.add('is-dragging')
      }
      if (!moved) return
      track.scrollLeft = start.left - dx
      const now = performance.now()
      velocity = (event.clientX - lastX) / Math.max(now - lastT, 1)
      lastX = event.clientX
      lastT = now
    }
    const up = () => {
      if (!start) return
      start = null
      if (!moved) return
      track.classList.remove('is-dragging')
      track.scrollBy({ left: -velocity * 260, behavior: reduced ? 'auto' : 'smooth' })
    }
    // A drag must not also count as a click that opens the lightbox.
    const swallowClick = (event) => {
      if (moved) {
        event.stopPropagation()
        event.preventDefault()
        moved = false
      }
    }

    track.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    track.addEventListener('click', swallowClick, true)
    return () => {
      track.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      track.removeEventListener('click', swallowClick, true)
    }
  }, [reduced])

  /* Any real interaction pauses the turning for a few seconds. */
  const hold = () => {
    heldUntil.current = performance.now() + RESUME_AFTER_MS
  }

  const go = (delta) => {
    hold()
    centre(nearestRef.current + delta)
  }

  /* Only turn while the strip is actually on screen. */
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.35,
    })
    observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [])

  /* One print to the left every two seconds — always forward, never back. */
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      if (document.hidden || performance.now() < heldUntil.current) return
      centre(nearestRef.current + 1)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [playing, centre])

  const arrow =
    'flex h-12 w-12 items-center justify-center rounded-full border border-bark/25 transition-colors duration-500 hover:border-bark hover:bg-bark hover:text-paper'

  return (
    <section id="selected" ref={sectionRef} data-magnet className="scroll-mt-20 py-24 md:py-32" aria-roledescription={t(COPY.carousel)}>
      <div className="frame flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-umber">{t(COPY.selected)}</p>
          <MaskedLines
            lines={[
              <>
                {t(COPY.selectedTitle)[0]} <span className="italic">{t(COPY.selectedTitle)[1]}</span>
              </>,
            ]}
            className="mt-5 text-[length:var(--text-h2)]"
          />
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="label text-umber tabular-nums" aria-live="polite">
              {String(current + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              <span className="hidden lg:inline"> — {t(COPY.dragOrSwipe)}</span>
            </p>
            {/* fills over each two-second beat while the carousel turns */}
            <div className="relative mt-2 h-px w-full bg-bark/15">
              <motion.span
                key={`${current}-${playing}`}
                className="absolute inset-y-0 left-0 bg-clay"
                initial={{ width: '0%' }}
                animate={{ width: playing ? '100%' : '0%' }}
                transition={{ duration: playing ? INTERVAL_MS / 1000 : 0.3, ease: 'linear' }}
              />
            </div>
          </div>
          <button type="button" className={arrow} onClick={() => go(-1)} aria-label={t(COPY.previous)}>
            <ArrowLeft size={17} strokeWidth={1.5} />
          </button>
          <button type="button" className={arrow} onClick={() => go(1)} aria-label={t(COPY.next)}>
            <ArrowRight size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        onPointerDown={hold}
        onTouchStart={hold}
        onWheel={(event) => Math.abs(event.deltaX) > Math.abs(event.deltaY) && hold()}
        onKeyDown={hold}
        aria-label={t(COPY.stripLabel)}
        className="selected-track mt-12 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto overscroll-x-contain pb-6 md:mt-16 md:gap-12"
      >
        {RING.map((photo, slot) => (
          <Card
            key={slot}
            photo={photo}
            slot={slot}
            onOpen={(id, rect) => onOpen(id, FEATURED.map((p) => p.id), rect)}
            register={(el) => (cards.current[slot] = el)}
            entered={entered}
            reduced={reduced}
          />
        ))}
      </div>

      <div className="frame mt-6">
        <div className="relative h-px bg-bark/15">
          <motion.span className="absolute inset-0 origin-left bg-clay" style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  )
}
