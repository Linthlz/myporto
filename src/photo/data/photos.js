import { gallery } from './gallery'
import { galleryId } from './gallery.id'
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
 * Indonesian titles and descriptions live in `gallery.id.js`.
 *
 * Text that changes with the language is written as { en: '…', id: '…' }.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const files = import.meta.glob('../assets/gallery/*.webp', { eager: true, import: 'default' })
const fileFor = (id, kind) => files[`../assets/gallery/${id}-${kind}.webp`]

export const photographer = {
  name: 'Lintang Hilmi',
  role: { en: 'Photography', id: 'Fotografi' },
  // The two words that flank the opening print — the series title. The
  // tagline then lands over the full-bleed photograph and finishes the thought.
  title: ['Amor', 'Fati'],
  tagline: {
    en: 'Light, land and the quiet hours in between.',
    id: 'Cahaya, daratan, dan jam-jam sunyi di antaranya.',
  },
  location: 'Singaraja, Bali',
  region: { en: 'Bali · Java', id: 'Bali · Jawa' },
  email: 'lintang@student.undiksha.ac.id',
  instagram: 'https://www.instagram.com/lintanghmz/',
  intro: {
    en: 'I photograph the places I travel through — waterfalls in the Buleleng hills, temples in Bali and Java, coastlines at the end of the day. Most frames are made slowly, on foot, waiting for the light to decide.',
    id: 'Saya memotret tempat-tempat yang saya lalui — air terjun di perbukitan Buleleng, pura dan candi di Bali dan Jawa, garis pantai di penghujung hari. Sebagian besar bidikan dibuat perlahan, dengan berjalan kaki, menunggu cahaya yang menentukan.',
  },
  about: [
    {
      en: 'Photography is the part of my work that has no brief. Away from the screen, I walk with a camera and very little plan — highlands, temple courtyards, the edge of the sea.',
      id: 'Fotografi adalah bagian dari karya saya yang tidak punya brief. Jauh dari layar, saya berjalan membawa kamera dengan sedikit rencana — dataran tinggi, halaman pura, tepi laut.',
    },
    {
      en: 'What I look for is not the postcard view but the moment just before or after it — when the light is changing and the place feels briefly like it belongs to no one.',
      id: 'Yang saya cari bukan pemandangan ala kartu pos, melainkan momen tepat sebelum atau sesudahnya — saat cahaya sedang berubah dan tempat itu sejenak terasa bukan milik siapa pun.',
    },
  ],
  aboutLines: {
    en: ['I walk first,', 'and photograph', 'what waits.'],
    id: ['Saya berjalan dulu,', 'lalu memotret', 'yang menunggu.'],
  },
  // Short factual details for the About block
  notes: [
    { label: { en: 'Based in', id: 'Berbasis di' }, value: 'Singaraja, Bali' },
    {
      label: { en: 'Subjects', id: 'Subjek' },
      value: { en: 'Landscape · Coast · Heritage', id: 'Lanskap · Pesisir · Warisan Budaya' },
    },
    {
      label: { en: 'Available for', id: 'Tersedia untuk' },
      value: { en: 'Prints & commissions', id: 'Cetak foto & pesanan' },
    },
  ],
}

// The opening photograph. Hero only — it is not part of the archive, so it is
// kept at its native resolution for the full-bleed reveal.
export const coverPhoto = {
  id: 'beach-reflection',
  src: cover,
  size: [2340, 4160],
  title: { en: 'Reflection at Dusk', id: 'Pantulan Senja' },
  place: '',
  year: '2026',
  alt: {
    en: 'A figure standing on wet sand at sunset, mirrored in the shallow water beneath a fiery sky',
    id: 'Sosok berdiri di pasir basah saat matahari terbenam, terpantul di air dangkal di bawah langit membara',
  },
}

export const photos = gallery.map((photo) => {
  const [w, h] = photo.size
  const thumbScale = 1280 / Math.max(w, h)
  const thumbW = Math.round(w * Math.min(thumbScale, 1))
  const src = fileFor(photo.id, 'full')
  const thumb = fileFor(photo.id, 'thumb') ?? src
  const id = galleryId[photo.id]
  return {
    ...photo,
    title: { en: photo.title, id: id?.title ?? photo.title },
    alt: { en: photo.alt, id: id?.alt ?? photo.alt },
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
// Categories stay English internally (they drive the filter); this is what
// visitors read.
export const categoryLabel = {
  All: { en: 'All', id: 'Semua' },
  Landscape: { en: 'Landscape', id: 'Lanskap' },
  Coast: { en: 'Coast', id: 'Pesisir' },
  Waterfalls: { en: 'Waterfalls', id: 'Air Terjun' },
  Heritage: { en: 'Heritage', id: 'Warisan Budaya' },
  Sky: { en: 'Sky', id: 'Langit' },
  Places: { en: 'Places', id: 'Tempat' },
  Portraits: { en: 'Portraits', id: 'Potret' },
}

export const categories = [
  'All',
  ...ORDER.filter((c) => used.has(c)),
  ...[...used].filter((c) => !ORDER.includes(c)),
]
