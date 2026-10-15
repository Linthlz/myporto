import { MaskedLines } from '../components/MaskedLines'
import { Reveal } from '../../components/Reveal'
import { photographer, photos } from '../data/photos'
import { useLang } from '../../i18n/language'
import { COPY } from '../copy'

/**
 * About, set like the colophon of a photo book: a large italic pull line, two
 * short paragraphs, and a plain table of facts. One small print anchors it.
 */
const PRINT = photos.find((photo) => photo.id === 'portrait-single-bulb') ?? photos[0]

export function AboutPhotographer() {
  const { t } = useLang()
  return (
    <section id="about" data-magnet className="paper-grain relative scroll-mt-20 bg-linen py-24 md:py-36">
      <div className="frame grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <p className="label text-umber">{t(COPY.about)}</p>
          <Reveal className="mt-10 hidden md:block">
            <Reveal.Item>
              <img
                src={PRINT.thumb}
                alt={t(PRINT.alt)}
                loading="lazy"
                className="w-full max-w-xs"
                style={{ aspectRatio: `${PRINT.size[0]} / ${PRINT.size[1]}` }}
              />
              <p className="label mt-3 text-umber">
                {[t(PRINT.title), PRINT.place, PRINT.year].filter(Boolean).join(', ')}
              </p>
            </Reveal.Item>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <MaskedLines
            as="h2"
            lines={t(photographer.aboutLines)}
            className="text-[length:var(--text-h2)] italic"
          />

          <Reveal className="mt-12 grid gap-6 md:grid-cols-2 md:gap-10" gap={0.12}>
            {photographer.about.map((paragraph, i) => (
              <Reveal.Item key={i}>
                <p className="leading-relaxed text-umber">{t(paragraph)}</p>
              </Reveal.Item>
            ))}
          </Reveal>

          <Reveal as="dl" className="mt-14 border-t border-bark/20" gap={0.08}>
            {photographer.notes.map((note) => (
              <Reveal.Item
                key={note.label.en}
                className="flex items-baseline justify-between gap-6 border-b border-bark/20 py-4"
              >
                <dt className="label text-umber">{t(note.label)}</dt>
                <dd className="text-right font-serif text-xl">{t(note.value)}</dd>
              </Reveal.Item>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
