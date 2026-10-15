import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ScrollProgress'
import { Footer } from './components/Footer'
import { SectionTransition } from './components/SectionTransition'
import { BackToTop } from './components/BackToTop'
import { CustomCursor } from './components/CustomCursor'
import { NextCue } from './components/NextCue'
import { useSectionMagnet } from './hooks/useSectionMagnet'
import { Hero } from './sections/Hero'
import { SelectedWorks } from './sections/SelectedWorks'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Journey } from './sections/Journey'
import { Contact } from './sections/Contact'

// `tone` is each section's surface; the raised ones alternate for rhythm.
// `id`, `index` and `label` feed the "Next" cue at the end of the previous one.
const SECTIONS = [
  { Section: Hero, tone: 'ink', id: 'home' },
  { Section: SelectedWorks, tone: 'ink', id: 'work', index: '002', label: { en: 'Selected Works', id: 'Karya Pilihan' } },
  { Section: About, tone: 'raised', id: 'about', index: '003', label: { en: 'About', id: 'Tentang' } },
  { Section: Skills, tone: 'ink', id: 'skills', index: '004', label: { en: 'Skills', id: 'Keahlian' } },
  { Section: Journey, tone: 'raised', id: 'journey', index: '005', label: { en: 'Journey', id: 'Perjalanan' } },
  { Section: Contact, tone: 'ink', id: 'contact', index: '006', label: { en: 'Contact', id: 'Kontak' } },
]

export default function App() {
  useSectionMagnet('[data-sheet]')

  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main id="main">
        {/* Each section is a sheet stacked one layer above the last: the
            incoming one rises over the outgoing one as it sinks back. */}
        {SECTIONS.map(({ Section, tone }, i) => {
          const next = SECTIONS[i + 1]
          return (
            <SectionTransition
              key={i}
              layer={i}
              tone={tone}
              enter={i > 0}
              exit={Boolean(next)}
            >
              <Section />
              {/* The hero has its own scroll cue */}
              {next && i > 0 && <NextCue id={next.id} index={next.index} label={next.label} />}
            </SectionTransition>
          )
        })}
      </main>

      <Footer />
      <BackToTop />
      <CustomCursor />
    </>
  )
}
