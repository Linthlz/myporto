import { Media } from '../components/Media'
import { MaskedHeading } from '../components/MaskedHeading'
import { Reveal } from '../components/Reveal'
import { drawLineX } from '../lib/motion'
import { profile } from '../data/profile'
import photoBrin from '../assets/photo-brin.webp'
import photoApkoi from '../assets/photo-apkoi.webp'
import { useLang } from '../i18n/language'

const COPY = {
  label: { en: 'About', id: 'Tentang' },
  focus: { en: 'Current focus', id: 'Fokus saat ini' },
  brin: {
    en: 'Lintang with the research team at the BRIN dissemination of the 3D sports pose estimation study',
    id: 'Lintang bersama tim riset pada diseminasi BRIN untuk studi estimasi pose 3D olahraga',
  },
  apkoi: {
    en: 'Lintang and a teammate at the inauguration of the Indonesian sports coaching education association board',
    id: 'Lintang dan rekan pada pelantikan pengurus asosiasi pendidikan kepelatihan olahraga Indonesia',
  },
}

/**
 * Two-column asymmetry with a sticky image column on large screens. The image
 * stack (portrait over texture, offset) gives the section a different rhythm
 * from the Works grid above it.
 */
export function About() {
  const { t } = useLang()
  return (
    <section id="about" className="relative scroll-mt-24 py-20 md:py-40">
      {/* Top and bottom hairlines mark the tonal shift without a hard edge */}
      <span className="absolute inset-x-0 top-0 h-px bg-steel/25" aria-hidden="true" />

      <div className="shell">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          {/* ------------------------------------------------------ visual */}
          <div className="lg:col-span-5 lg:self-start">
            <div className="lg:sticky lg:top-28">
              <div className="relative">
                <Media
                  src={photoBrin}
                  alt={t(COPY.brin)}
                  ratio="4 / 3"
                  className="w-[86%]"
                />
                {/* Offset second photo — overlapping planes instead of a card.
                    Inline positioning: the overlap is a specific composition,
                    not a utility-scale value. */}
                <Media
                  src={photoApkoi}
                  alt={t(COPY.apkoi)}
                  ratio="4 / 3"
                  className="w-[50%]"
                  style={{ position: 'absolute', right: '-4%', bottom: '-22%' }}
                />
              </div>

              <Reveal className="mt-16 grid grid-cols-3 gap-4 lg:mt-24" gap={0.1}>
                {profile.about.stats.map((stat) => (
                  <Reveal.Item key={stat.value}>
                    <div className="border-t border-steel/30 pt-4">
                      <div className="font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-none text-amber">
                        {stat.value}
                      </div>
                      <div className="eyebrow mt-2.5 text-[0.5625rem] leading-relaxed">
                        {t(stat.label)}
                      </div>
                    </div>
                  </Reveal.Item>
                ))}
              </Reveal>
            </div>
          </div>

          {/* -------------------------------------------------------- copy */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal className="flex items-center gap-4">
              <Reveal.Item as="span" className="eyebrow text-amber">
                003
              </Reveal.Item>
              <Reveal.Item as="span" className="eyebrow">
                {t(COPY.label)}
              </Reveal.Item>
              <Reveal.Item
                as="span"
                variants={drawLineX}
                className="hairline max-w-24 flex-1 origin-left"
              />
            </Reveal>

            <MaskedHeading
              lines={t(profile.about.headline).split(' ').reduce(
                // Break the headline into balanced lines without hard-coding them
                (lines, word) => {
                  const last = lines[lines.length - 1]
                  if (last && (last + ' ' + word).length <= 26) {
                    lines[lines.length - 1] = last + ' ' + word
                  } else {
                    lines.push(word)
                  }
                  return lines
                },
                []
              )}
              className="mt-7 text-[clamp(1.75rem,3.2vw,3rem)]"
            />

            <Reveal className="mt-9 space-y-6" gap={0.09}>
              {profile.about.paragraphs.map((paragraph, i) => (
                <Reveal.Item key={i}>
                  <p className="max-w-xl leading-[1.8] text-mist">{t(paragraph)}</p>
                </Reveal.Item>
              ))}
            </Reveal>

            {/* Focus list — hairline-separated rows, no bullets, no boxes */}
            <Reveal className="mt-14" gap={0.07}>
              <Reveal.Item>
                <p className="eyebrow mb-5">{t(COPY.focus)}</p>
              </Reveal.Item>

              <ul>
                {profile.about.focus.map((item, i) => (
                  <Reveal.Item key={i} as="li">
                    <div className="group flex items-baseline gap-5 border-t border-steel/25 py-4 transition-colors duration-500 last:border-b hover:border-amber/50">
                      <span className="eyebrow w-8 shrink-0 text-[0.625rem] text-steel transition-colors duration-500 group-hover:text-amber">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[length:var(--text-body)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        {t(item)}
                      </span>
                    </div>
                  </Reveal.Item>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-px bg-steel/25" aria-hidden="true" />
    </section>
  )
}
