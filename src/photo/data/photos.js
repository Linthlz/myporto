import { gallery } from './gallery'
import cover from '../assets/cover-beach-reflection.webp'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PHOTOGRAPHS
 *
 * Everything on the photography page reads from here. Picture details live in
 * `gallery.js`; the image files in ../assets/gallery are picked up by id:
 *
 *   <id>-full.webp   long edge 2560 px — lightbox and hero
 *   <id>-thumb.webp  long edge 1280 px — grid and strip (via srcset)
 *
 * To add a photograph: drop both files in that folder and add an entry to
 * `gallery.js`. `place` may be left blank; captions skip empty parts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const files = import.meta.glob('../assets/gallery/*.webp', { eager: true, import: 'default' })
const fileFor = (id, kind) => files[`../assets/gallery/${id}-${kind}.webp`]

export const photographer = {
  name: 'Lintang Hilmi',
  role: 'Photography',
  // The two words that flank the opening print — the series title. The
  // tagline then lands over the full-bleed photograph and finishes the thought.
  title: ['Amor', 'Fati'],
  tagline: 'Light, land and the quiet hours in between.',
  location: 'Singaraja, Bali',
  region: 'Bali · Java',
  email: 'lintang@student.undiksha.ac.id',
  instagram: 'https://www.instagram.com/lintanghmz/',
  intro:
    'I photograph the places I travel through — waterfalls in the Buleleng hills, temples in Bali and Java, coastlines at the end of the day. Most frames are made slowly, on foot, waiting for the light to decide.',
  about: [
    'Photography is the part of my work that has no brief. Away from the screen, I walk with a camera and very little plan — highlands, temple courtyards, the edge of the sea.',
    'What I look for is not the postcard view but the moment just before or after it — when the light is changing and the place feels briefly like it belongs to no one.',
  ],
  // Short factual details for the About block
  notes: [
    { label: 'Based in', value: 'Singaraja, Bali' },
    { label: 'Subjects', value: 'Landscape · Coast · Heritage' },
    { label: 'Available for', value: 'Prints & commissions' },
  ],
}

// The opening photograph. Hero only — it is not part of the archive, so it is
// kept at its native resolution for the full-bleed reveal.
export const coverPhoto = {
  id: 'beach-reflection',
  src: cover,
  size: [2340, 4160],
  title: 'Reflection at Dusk',
  place: '',
  year: '2026',
  alt: 'A figure standing on wet sand at sunset, mirrored in the shallow water beneath a fiery sky',
}

export const photos = gallery.map((photo) => {
  const [w, h] = photo.size
  const thumbScale = 1280 / Math.max(w, h)
  const thumbW = Math.round(w * Math.min(thumbScale, 1))
  const src = fileFor(photo.id, 'full')
  const thumb = fileFor(photo.id, 'thumb') ?? src
  return {
    ...photo,
    src,
    thumb,
    // Let the browser pick the thumbnail for small frames and the full file
    // for large or high-density ones.
    srcSet: `${thumb} ${thumbW}w, ${src} ${w}w`,
  }
})

/** "Place · Year", skipping whichever part is blank. */
export const photoMeta = (photo) => [photo.place, photo.year].filter(Boolean).join(' · ')

// Filter order: broad subjects first, people last. Only categories in use show.
const ORDER = ['Landscape', 'Coast', 'Waterfalls', 'Heritage', 'Sky', 'Places', 'Portraits']
const used = new Set(photos.map((photo) => photo.category))
export const categories = [
  'All',
  ...ORDER.filter((c) => used.has(c)),
  ...[...used].filter((c) => !ORDER.includes(c)),
]
