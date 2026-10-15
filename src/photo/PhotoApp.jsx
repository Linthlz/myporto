import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Preloader } from './components/Preloader'
import { PhotoNav } from './components/PhotoNav'
import { PhotoCursor } from './components/PhotoCursor'
import { Marquee } from './components/Marquee'
import { Lightbox } from './components/Lightbox'
import { SquareToTop } from './components/SquareToTop'
import { useSectionMagnet } from '../hooks/useSectionMagnet'
import { PhotoHero } from './sections/PhotoHero'
import { Statement } from './sections/Statement'
import { Selected } from './sections/Selected'
import { Archive } from './sections/Archive'
import { Interlude } from './sections/Interlude'
import { AboutPhotographer } from './sections/AboutPhotographer'
import { PhotoContact } from './sections/PhotoContact'
import { photos } from './data/photos'
import { useLang } from '../i18n/language'
import { COPY } from './copy'

const FEATURED_IDS = photos.filter((photo) => photo.featured).map((photo) => photo.id)

/**
 * The photography portfolio — a separate page with its own earthy theme.
 *
 *   preloader → opening print → intro → subjects band → selected strip
 *   → filterable archive → interlude → about → contact
 *
 * The lightbox is owned here so both the strip and the archive can open it,
 * each passing the set of photographs the viewer should browse through.
 */
export default function PhotoApp() {
  const reduced = Boolean(useReducedMotion())
  const { t } = useLang()
  // Same gentle pull as the main portfolio: a section caught half-way onto
  // the screen when scrolling stops is carried the rest of the way.
  useSectionMagnet('[data-magnet]')
  const [ready, setReady] = useState(false)
  const [viewer, setViewer] = useState(null)

  const onLoaded = useCallback(() => setReady(true), [])
  // `rect` is where the clicked print sits, so the viewer can fly it out from there.
  const open = useCallback((id, ids = FEATURED_IDS, rect = null) => {
    const origin = rect && { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    setViewer({ id, ids, origin })
  }, [])
  const close = useCallback(() => setViewer(null), [])

  return (
    <>
      <Preloader reduced={reduced} onDone={onLoaded} />
      <PhotoNav ready={ready} reduced={reduced} />

      <main className="paper-grain relative">
        <PhotoHero ready={ready} reduced={reduced} />
        <Statement reduced={reduced} />
        <Marquee items={t(COPY.marquee)} reduced={reduced} />
        <Selected reduced={reduced} onOpen={open} paused={viewer !== null} />
        <Archive reduced={reduced} onOpen={open} />
        <Interlude reduced={reduced} />
        <AboutPhotographer />
      </main>

      <PhotoContact />
      <Lightbox state={viewer} onClose={close} reduced={reduced} />
      <SquareToTop reduced={reduced} />
      <PhotoCursor reduced={reduced} />
    </>
  )
}
