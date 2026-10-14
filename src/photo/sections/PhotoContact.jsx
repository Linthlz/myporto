import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { MaskedLines } from '../components/MaskedLines'
import { Reveal } from '../../components/Reveal'
import { photographer } from '../data/photos'

/**
 * Closing spread on dark bark — the one inverted surface on the page, so the
 * end reads like the back cover of a book.
 */
export function PhotoContact() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" data-magnet className="paper-grain relative scroll-mt-20 bg-bark pt-24 pb-10 text-paper md:pt-36">
      <div className="frame">
        <p className="label text-paper/50">(05) — Contact</p>

        <MaskedLines
          lines={['Prints, commissions,', 'or a walk with', 'a camera?']}
          className="mt-8 text-[clamp(2.75rem,1.4rem+6vw,8rem)] font-light [&_span:last-child_span]:italic"
        />

        <Reveal className="mt-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" gap={0.1}>
          <Reveal.Item>
            <a
              href={`mailto:${photographer.email}`}
              className="link-draw font-serif text-[clamp(1.4rem,1rem+1.6vw,2.5rem)] italic break-all"
            >
              {photographer.email}
            </a>
          </Reveal.Item>

          <Reveal.Item className="flex flex-wrap gap-x-8 gap-y-3">
            <a
              href={photographer.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="label link-draw inline-flex items-center gap-1.5"
            >
              Instagram <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="../" className="label link-draw inline-flex items-center gap-1.5">
              <ArrowLeft size={13} strokeWidth={1.5} aria-hidden="true" /> Developer portfolio
            </a>
          </Reveal.Item>
        </Reveal>

        <div className="label mt-24 flex flex-col justify-between gap-3 border-t border-paper/15 pt-6 text-paper/45 md:flex-row">
          <span>© {year} Lintang Hilmi Mumtaz Surath</span>
          <span>All photographs by the author</span>
        </div>
      </div>
    </footer>
  )
}
