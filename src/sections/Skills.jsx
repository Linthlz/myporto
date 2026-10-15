import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { skillGroups } from '../data/skills'
import { useLang } from '../i18n/language'

const COPY = {
  label: { en: 'Skills & Expertise', id: 'Keahlian' },
  lines: { en: ['What I actually', 'work with.'], id: ['Yang benar-benar', 'saya kuasai.'] },
}

/**
 * Skills as horizontal editorial rows — label on the left, capabilities set as
 * a separated inline list on the right. No cards, no percentage bars: a
 * progress bar implies a measurement that does not exist.
 */
export function Skills() {
  const { t } = useLang()
  return (
    <section id="skills" className="relative scroll-mt-24 py-20 md:py-40">
      <div className="shell">
        <SectionHeading
          index="004"
          label={t(COPY.label)}
          lines={t(COPY.lines)}
        />

        <div className="mt-16 md:mt-24">
          {skillGroups.map((group) => {
            const Icon = group.icon

            return (
              <Reveal
                key={group.id}
                gap={0.06}
                amount={0.3}
                className="group grid grid-cols-1 gap-x-8 gap-y-5 border-t border-steel/25 py-8 transition-colors duration-500 last:border-b hover:border-amber/40 md:py-10 lg:grid-cols-12"
              >
                {/* ------------------------------------------------- label */}
                <Reveal.Item className="flex items-center gap-4 lg:col-span-4">
                  <span className="eyebrow text-[0.625rem] text-steel transition-colors duration-500 group-hover:text-amber">
                    {group.index}
                  </span>
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-mist transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:text-amber"
                  />
                  <h3 className="text-[clamp(1.125rem,2vw,1.5rem)] transition-colors duration-500 group-hover:text-amber">
                    {t(group.title)}
                  </h3>
                </Reveal.Item>

                {/* ------------------------------------------------- items */}
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2.5 lg:col-span-7 lg:col-start-6 lg:justify-end">
                  {group.items.map((item, i) => (
                    <Reveal.Item as="li" key={i} className="flex items-center gap-3">
                      {i > 0 && <span className="h-1 w-1 bg-steel/60" aria-hidden="true" />}
                      <span className="cursor-default text-[0.9375rem] text-mist transition-colors duration-400 hover:text-[#e8eaed]">
                        {t(item)}
                      </span>
                    </Reveal.Item>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
