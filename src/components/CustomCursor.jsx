import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePointerFine } from '../hooks/usePointerFine'
import { useMotionSafe } from '../hooks/useMotionSafe'

/**
 * Viewfinder cursor: an amber square point (the same mark as the monogram)
 * inside four hairline corner brackets that trail it on a spring.
 *
 *   default   — point + small frame
 *   link      — frame opens up and turns amber, point folds away
 *   pressed   — frame tightens
 *   text      — custom cursor steps aside so the native caret shows
 *   hidden    — over targets that bring their own label (project images)
 *
 * Only mounts on precise pointers without reduced motion; everywhere else the
 * native cursor is untouched. The native cursor is hidden through a class on
 * <html>, so removing this component restores it completely.
 */
const INTERACTIVE = 'a, button, [role="button"], label, select, summary'
const TEXT = 'input, textarea, [contenteditable="true"]'

export function CustomCursor() {
  const fine = usePointerFine()
  const { reduced } = useMotionSafe()
  const enabled = fine && !reduced

  const [mode, setMode] = useState('default')
  const [pressed, setPressed] = useState(false)
  const [present, setPresent] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const fx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const fy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const onMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setPresent(true)
    }
    const onOver = (event) => {
      const el = event.target instanceof Element ? event.target : null
      if (!el) return
      if (el.closest('[data-cursor="hide"]')) setMode('hidden')
      else if (el.closest(TEXT)) setMode('text')
      else if (el.closest(INTERACTIVE)) setMode('link')
      else setMode('default')
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setPresent(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    root.addEventListener('pointerleave', onLeave)

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const visible = present && mode !== 'text' && mode !== 'hidden'
  const isLink = mode === 'link'
  const frameScale = pressed ? 0.75 : isLink ? 1.6 : 1

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      {/* trailing frame */}
      <motion.div className="absolute top-0 left-0" style={{ x: fx, y: fy }}>
        <motion.div
          className={`cursor-frame -translate-x-1/2 -translate-y-1/2 ${isLink ? 'is-link' : ''}`}
          animate={{ scale: visible ? frameScale : 0.4, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span /><span /><span /><span />
        </motion.div>
      </motion.div>

      {/* exact point */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.span
          className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-amber"
          animate={{ scale: visible && !isLink ? 1 : 0, rotate: pressed ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </div>
  )
}
