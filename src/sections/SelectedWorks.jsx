import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { ProjectEntry } from '../components/ProjectEntry'
import { CursorLabel } from '../components/CursorLabel'
import { GridRules } from '../components/GridRules'
import { projects } from '../data/projects'
import { useLang } from '../i18n/language'

const COPY = {
  label: { en: 'Selected Works', id: 'Karya Pilihan' },
  lines: { en: ['Five websites,', 'one focus.'], id: ['Lima website,', 'satu fokus.'] },
  lead: {
    en: 'Websites for local government, associations, companies and community programmes. Each one started with what its visitors needed to find, and the interface was shaped around that.',
    id: 'Website untuk pemerintah daerah, asosiasi, perusahaan, dan program pengabdian masyarakat. Setiap proyek dimulai dari apa yang perlu ditemukan pengunjungnya, lalu antarmukanya dibentuk dari situ.',
  },
}

export function SelectedWorks() {
  // A single cursor label is shared by every project rather than one per entry.
  const [cursorLabel, setCursorLabel] = useState(null)
  const { t } = useLang()

  return (
    <section id="work" className="relative scroll-mt-24 py-20 md:py-40">
      <GridRules columns={[16, 50, 84]} />

      <div className="shell relative">
        <SectionHeading
          index="002"
          label={t(COPY.label)}
          lines={t(COPY.lines)}
          lead={t(COPY.lead)}
        />

        {/* Generous vertical rhythm: the whitespace between projects is doing
            as much work as the images themselves. */}
        <div className="mt-20 flex flex-col gap-24 md:mt-28 md:gap-32 lg:gap-40">
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} onHoverChange={setCursorLabel} />
          ))}
        </div>
      </div>

      <CursorLabel active={Boolean(cursorLabel)} label={cursorLabel ?? ''} />
    </section>
  )
}
