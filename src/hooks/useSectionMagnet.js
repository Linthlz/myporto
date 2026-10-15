import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Gentle pull into the next section.
 *
 * When scrolling comes to rest with a new section sheet already well onto the
 * screen, the page always carries the visitor down into it — whichever way
 * they were scrolling. It never pulls back up to the previous section.
 *
 * It never fires while the visitor is still scrolling, and any wheel, touch
 * or key input cancels a pull in flight — it assists, it never takes the
 * wheel. Resting with the new sheet only peeking in (below the zone) leaves
 * the page where it is, so scrolling back up stays possible.
 *
 * The pull is deliberately light: a short glide that eases in, then lands
 * with the faintest settle past the edge — present, but never insistent.
 *
 *   selector — elements whose top edges are the resting points
 */
const IDLE_MS = 180
const DURATION_MS = 900
// Pull down once the new sheet's top edge sits within this band of the screen
// (0 = top, 1 = bottom), i.e. once it covers more than about 40% of it.
const ZONE = [0.06, 0.6]

// ease-out-back with a very small overshoot (~0.5% of the distance)
const OVERSHOOT = 0.35
const easeOutBack = (t) => 1 + (OVERSHOOT + 1) * Math.pow(t - 1, 3) + OVERSHOOT * Math.pow(t - 1, 2)

export function useSectionMagnet(selector) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    let idle = null
    let frame = null
    let touching = false

    const cancel = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }

    const glide = (to) => {
      const from = window.scrollY
      const distance = to - from
      if (Math.abs(distance) < 2) return
      const start = performance.now()
      const step = (now) => {
        const t = Math.min((now - start) / DURATION_MS, 1)
        window.scrollTo({ top: from + distance * easeOutBack(t), behavior: 'instant' })
        frame = t < 1 ? requestAnimationFrame(step) : null
      }
      frame = requestAnimationFrame(step)
    }

    const settle = () => {
      if (touching || frame !== null) return
      const vh = window.innerHeight
      for (const sheet of document.querySelectorAll(selector)) {
        const top = sheet.getBoundingClientRect().top / vh
        if (top > ZONE[0] && top < ZONE[1]) return glide(window.scrollY + top * vh)
      }
    }

    const onScroll = () => {
      if (frame !== null) return // our own glide, not the visitor's
      clearTimeout(idle)
      idle = setTimeout(settle, IDLE_MS)
    }

    const onTouchStart = () => {
      touching = true
      cancel()
    }
    const onTouchEnd = () => {
      touching = false
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancel()
      clearTimeout(idle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('keydown', cancel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [selector, reduced])
}
