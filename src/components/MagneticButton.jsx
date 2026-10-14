import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePointerFine } from '../hooks/usePointerFine'
import { useMotionSafe } from '../hooks/useMotionSafe'

/**
 * Primary / secondary call to action.
 *
 * On a precise pointer the button leans a few pixels toward the cursor; on
 * touch, and whenever reduced motion is requested, it is a plain button with a
 * normal hover state. The magnetism never exceeds ~8px, so the hit area and
 * the visible target stay honest.
 *
 * Renders an <a> when `href` is given, otherwise a <button> — so semantics and
 * keyboard behaviour are always correct.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...rest
}) {
  const ref = useRef(null)
  const fine = usePointerFine()
  const { reduced } = useMotionSafe()
  const magnetic = fine && !reduced

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 })

  // The inner label trails slightly less than the shell — a small depth cue.
  const lx = useTransform(sx, (val) => val * 0.35)
  const ly = useTransform(sy, (val) => val * 0.35)

  const handleMove = (event) => {
    if (!magnetic || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const strength = 0.3
    mx.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    my.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2.5 min-h-12 px-7 py-3.5 ' +
    'text-[0.8125rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber'

  const styles = {
    primary: 'bg-amber text-ink hover:bg-[#ffb224]',
    secondary:
      'border border-steel/50 text-[#e8eaed] hover:border-amber hover:text-amber bg-transparent',
  }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : 'button'}
      className={`${base} ${styles[variant]} ${className}`}
      style={magnetic ? { x: sx, y: sy } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...rest}
    >
      <motion.span
        className="pointer-events-none inline-flex items-center gap-2.5"
        style={magnetic ? { x: lx, y: ly } : undefined}
      >
        {children}
        {Icon && (
          <Icon
            size={15}
            strokeWidth={1.75}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            aria-hidden="true"
          />
        )}
      </motion.span>
    </Tag>
  )
}
