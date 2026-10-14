import singariset from '../assets/project-singariset.webp'
import strawberryCorps from '../assets/project-strawberry-corps.webp'
import aboi from '../assets/project-aboi.webp'
import apkoi from '../assets/project-apkoi.webp'
import wisataBaliUtara from '../assets/project-wisata-bali-utara.webp'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECTS
 *
 * Ordered newest first. The CV does not list a tech stack per project, so
 * `stack` uses your main tools — correct each one to what the project actually
 * used before publishing.
 *
 *   href: null  →  the card renders without a link (no dead URLs).
 *   image      →  homepage screenshot of each site.
 *   size       →  [width, height] of the image; when set, the frame uses the
 *                 image's own ratio instead of the layout's fixed one.
 *   scale      →  'lead' | 'wide' | 'inset'. This drives the editorial grid,
 *                 so varying it is what stops the section looking like cards.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const projects = [
  {
    id: 'singariset',
    index: '01',
    title: 'Singa Riset Buleleng',
    category: 'Government Research Portal · BRIDA Buleleng',
    role: 'Frontend Developer',
    summary:
      'The official one-stop research portal of BRIDA Kabupaten Buleleng, connecting university researchers, local government, subak, tourism groups and small businesses — with research search, a research roadmap, funding opportunities and collaboration submissions.',
    stack: ['React', 'Tailwind CSS'],
    image: singariset,
    size: [1854, 915], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: 'Singa Riset Buleleng homepage with a search bar over the BRIDA Buleleng building',
    href: null, // PLACEHOLDER — add the live URL when public
    scale: 'lead',
  },
  {
    id: 'strawberry-corps',
    index: '02',
    title: 'Strawberry Corps',
    category: 'Company Website · Agrotourism',
    role: 'Frontend Developer',
    summary:
      'A company website for a strawberry plantation in Bedugul, covering its agro tours, educational activities, products, eco-waste programme and community.',
    stack: ['React', 'Tailwind CSS'],
    image: strawberryCorps,
    size: [1913, 899], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: 'Strawberry Corps homepage with a full-screen view of the Bedugul garden',
    href: null,
    scale: 'inset',
  },
  {
    id: 'aboi',
    index: '03',
    title: 'ABOI',
    category: 'Indonesian Sports Biomechanics Association',
    role: 'Web Developer',
    summary:
      'A website for Asosiasi Biomekanik Olahraga Indonesia, presenting the association’s mission of science- and data-driven sporting achievement, its vision, and its members.',
    stack: ['React', 'Tailwind CSS'],
    image: aboi,
    size: [1844, 922], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: 'ABOI homepage with the headline “Sains Gerak Untuk Prestasi Bangsa”',
    href: null,
    scale: 'wide',
  },
  {
    id: 'apkoi',
    index: '04',
    title: 'APKOI',
    category: 'Indonesian Sports Coaches Association',
    role: 'Frontend Developer',
    summary:
      'The web interface for a national association of sports coaching programmes — organisation profile, programmes, news, and member sign-in and registration.',
    stack: ['React', 'Tailwind CSS'],
    image: apkoi,
    size: [1844, 915], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: 'APKOI homepage with a photo from the association’s national meeting',
    href: null,
    scale: 'inset',
  },
  {
    id: 'wisata-bali-utara',
    index: '05',
    title: 'Wisata Bali Utara',
    category: 'Community Service · Tourism',
    role: 'Web Developer',
    summary:
      'A tourism website built for a community service programme, guiding visitors to the hidden destinations of northern Bali — from dolphins at sea to mountain waterfalls.',
    stack: ['React', 'Tailwind CSS'],
    image: wisataBaliUtara,
    size: [1839, 925], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: 'Wisata Bali Utara homepage overlooking a lake in the northern Bali highlands',
    href: null,
    scale: 'wide',
  },
]
