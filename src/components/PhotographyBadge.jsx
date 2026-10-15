import { Aperture } from 'lucide-react'
import { useLang } from '../i18n/language'

/**
 * Seal-style link to the photography portfolio: an aperture mark ringed by
 * slowly turning text. The ring spins only on hover (and never under reduced
 * motion), so at rest it reads as a stamp, not an ad.
 */
const COPY = {
  ring: { en: 'Photography · Field Notes · ', id: 'Fotografi · Catatan Lapangan · ' },
  label: { en: 'Open the photography portfolio', id: 'Buka portfolio fotografi' },
}
// circumference of the ring path (r = 38); the text is fitted to it exactly
const RING_LENGTH = 2 * Math.PI * 38

export function PhotographyBadge({ className = '', style }) {
  const { t } = useLang()
  return (
    <a
      href="photography/"
      aria-label={t(COPY.label)}
      className={`group relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-ink/85 text-[#e8eaed] backdrop-blur-md transition-colors duration-500 hover:text-amber md:h-32 md:w-32 ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running] motion-reduce:animate-none"
      >
        <defs>
          <path id="badge-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current text-[8.6px] font-medium uppercase">
          <textPath href="#badge-ring" textLength={RING_LENGTH - 2} lengthAdjust="spacing">
            {t(COPY.ring)}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[22%] rounded-full border border-steel/50 transition-colors duration-500 group-hover:border-amber" />
      <Aperture
        size={22}
        strokeWidth={1.25}
        aria-hidden="true"
        className="relative text-amber transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90"
      />
    </a>
  )
}
