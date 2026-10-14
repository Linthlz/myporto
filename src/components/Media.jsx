import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { usePointerFine } from '../hooks/usePointerFine'

/**
 * Image frame used everywhere on the site.
 *
 *  — reserves space via `ratio`, so nothing shifts while loading (no CLS)
 *  — wipes open on first view instead of fading
 *  — optional, very small parallax (desktop + motion allowed only)
 *  — renders a styled fallback if the file is missing, rather than a broken
 *    image icon
 *
 * Implementation note — two elements, deliberately:
 *
 * The clip-path wipe CANNOT live on the element being observed. A target
 * clipped to `inset(100%)` reports an empty intersection rect, so the observer
 * that is meant to release the clip never fires and the image stays invisible
 * forever. The outer element is therefore unclipped and observed; the inner
 * one carries the wipe. (This is the same trap behind Framer Motion's
 * `whileInView` silently failing on clip-path reveals.)
 */
export function Media({
  src,
  alt,
  ratio = '4 / 5',
  className = '',
  imgClassName = '',
  parallax = 0,
  priority = false,
  zoomOnHover = false,
  style,
}) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { reduced } = useMotionSafe()
  const fine = usePointerFine()

  const inView = useInViewOnce(ref)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const allowParallax = parallax > 0 && fine && !reduced
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])

  // Reduced motion: no wipe, no scale — the image is simply there.
  const revealStyle = reduced
    ? undefined
    : {
        clipPath: inView ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
        transform: inView ? 'scale(1)' : 'scale(1.06)',
        transition:
          'clip-path 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }

  return (
    <figure
      ref={ref}
      className={className}
      /* position lives in the style object, not a class, so a caller can
         override it (the About section overlaps two plates) without fighting
         utility-class ordering */
      style={{ position: 'relative', aspectRatio: ratio, ...style }}
    >
      <div
        className="absolute inset-0 overflow-hidden bg-charcoal-deep"
        style={revealStyle}
      >
        {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-steel/30 text-mist">
          <ImageOff size={22} strokeWidth={1.25} aria-hidden="true" />
          <span className="eyebrow text-[0.625rem]">Image unavailable</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          style={allowParallax ? { y, scale: 1.12 } : undefined}
          className={`h-full w-full object-cover ${
            zoomOnHover
              ? 'transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]'
              : ''
          } ${imgClassName}`}
        />
        )}
      </div>

      {/* Hairline frame keeps images sitting in the grid rather than floating */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-steel/25"
      />
    </figure>
  )
}
