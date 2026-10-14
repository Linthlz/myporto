import { MaskedHeading } from './MaskedHeading'
import { Reveal } from './Reveal'
import { drawLineX } from '../lib/motion'

/**
 * The repeating section header: index · label · rule, then a display heading
 * and an optional lead paragraph. Consistent across sections so the varied
 * layouts underneath still read as one system.
 */
export function SectionHeading({ index, label, lines, lead, align = 'left', className = '' }) {
  return (
    <Reveal as="header" className={className} gap={0.09}>
      <Reveal.Item className={`flex items-center gap-4 ${align === 'right' ? 'justify-end' : ''}`}>
        <span className="eyebrow text-amber">{index}</span>
        <span className="eyebrow">{label}</span>
        <Reveal.Item
          as="span"
          variants={drawLineX}
          className="hairline hidden max-w-32 flex-1 origin-left sm:block"
        />
      </Reveal.Item>

      <MaskedHeading
        lines={lines}
        className={`mt-6 text-[length:var(--text-h2)] ${align === 'right' ? 'text-right' : ''}`}
      />

      {lead && (
        <Reveal.Item
          as="p"
          className={`mt-7 max-w-xl text-[length:var(--text-lead)] leading-relaxed font-light text-mist ${
            align === 'right' ? 'ml-auto text-right' : ''
          }`}
        >
          {lead}
        </Reveal.Item>
      )}
    </Reveal>
  )
}
