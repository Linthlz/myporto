import { useEffect, useState } from 'react'

/**
 * Minimal one-shot viewport observer.
 *
 * Framer Motion's own `whileInView` is used for text and list reveals, but it
 * resolves unreliably for elements nested inside a parent that propagates
 * variant labels. Image reveals therefore drive themselves from this hook:
 * one observer, disconnected the moment it has fired.
 */
export function useInViewOnce(ref, { amount = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    // If IntersectionObserver is unavailable, show the content rather than
    // leaving it permanently hidden.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: amount, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, amount, rootMargin, inView])

  return inView
}
