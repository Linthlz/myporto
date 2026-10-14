import { useEffect, useState } from 'react'

/**
 * True once the page has scrolled past `threshold`.
 * Uses a passive listener throttled to the next animation frame so the navbar
 * state change never competes with scrolling.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = null

    const onScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold)
        frame = null
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return scrolled
}
