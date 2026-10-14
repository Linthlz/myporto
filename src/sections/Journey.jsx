import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { drawLineY } from '../lib/motion'
import { experience } from '../data/experience'

/**
 * Editorial timeline. The vertical rule draws itself as the section enters,
 * and each entry's marker is filled amber only while that work is current —
 * the accent carries meaning rather than decoration.
 */
export function Journey() {
  return (
    <section id="journey" className="relative scroll-mt-24 py-20 md:py-40">
      <span className="absolute inset-x-0 top-0 h-px bg-steel/25" aria-hidden="true" />

      <div className="shell">
        <SectionHeading
          index="005"
          label="Journey"
          lines={['Where the work', 'has taken me.']}
        />

        <Reveal className="relative mt-16 md:mt-24" gap={0.12} amount={0.08}>
          {/* the rule itself */}
          <Reveal.Item
            as="span"
            variants={drawLineY}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-steel/40 md:left-[calc(16.666%+7px)]"
          />

          <ol className="space-y-14 md:space-y-16">
            {experience.map((entry) => {
              const isCurrent = entry.status === 'current'

              return (
                <Reveal.Item
                  as="li"
                  key={entry.id}
                  className="group relative grid grid-cols-1 gap-x-8 gap-y-3 pl-9 md:grid-cols-12 md:pl-0"
                >
                  {/* period + marker */}
                  <div className="md:col-span-2 md:text-right">
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 left-0 h-3.5 w-3.5 rounded-full border transition-colors duration-500 md:left-[16.666%] ${
                        isCurrent
                          ? 'border-amber bg-amber'
                          : 'border-steel/60 bg-ink-raised group-hover:border-amber'
                      }`}
                    />
                    <span className="eyebrow text-amber">{entry.period}</span>
                  </div>

                  {/* content */}
                  <div className="md:col-span-9 md:col-start-4">
                    <h3 className="text-[length:var(--text-h3)] transition-colors duration-500 group-hover:text-amber">
                      {entry.role}
                    </h3>
                    <p className="eyebrow mt-2.5 text-[0.6875rem] normal-case">{entry.org}</p>
                    <p className="mt-4 max-w-2xl leading-relaxed text-mist">{entry.summary}</p>
                  </div>
                </Reveal.Item>
              )
            })}
          </ol>
        </Reveal>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-px bg-steel/25" aria-hidden="true" />
    </section>
  )
}
