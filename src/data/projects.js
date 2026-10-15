import singariset from '../assets/project-singariset.webp'
import strawberryCorps from '../assets/project-strawberry-corps.webp'
import aboi from '../assets/project-aboi.webp'
import apkoi from '../assets/project-apkoi.webp'
import wisataBaliUtara from '../assets/project-wisata-bali-utara.webp'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECTS
 *
 * Ordered newest first. Text that changes with the language is written as
 * { en: '…', id: '…' }. The CV does not list a tech stack per project, so
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
    category: { en: 'Government Research Portal · BRIDA Buleleng', id: 'Portal Riset Pemerintah · BRIDA Buleleng' },
    role: 'Frontend Developer',
    summary: {
      en: 'The official one-stop research portal of BRIDA Kabupaten Buleleng, connecting university researchers, local government, subak, tourism groups and small businesses — with research search, a research roadmap, funding opportunities and collaboration submissions.',
      id: 'Portal riset satu pintu resmi milik BRIDA Kabupaten Buleleng yang menghubungkan peneliti kampus, pemerintah daerah, subak, kelompok pariwisata, dan UMKM — dengan pencarian riset, peta jalan riset, peluang pendanaan, dan pengajuan kolaborasi.',
    },
    stack: ['React', 'Tailwind CSS'],
    image: singariset,
    size: [1854, 915], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: {
      en: 'Singa Riset Buleleng homepage with a search bar over the BRIDA Buleleng building',
      id: 'Beranda Singa Riset Buleleng dengan kolom pencarian di atas gedung BRIDA Buleleng',
    },
    href: null, // PLACEHOLDER — add the live URL when public
    scale: 'lead',
  },
  {
    id: 'strawberry-corps',
    index: '02',
    title: 'Strawberry Corps',
    category: { en: 'Company Website · Agrotourism', id: 'Website Perusahaan · Agrowisata' },
    role: 'Frontend Developer',
    summary: {
      en: 'A company website for a strawberry plantation in Bedugul, covering its agro tours, educational activities, products, eco-waste programme and community.',
      id: 'Website perusahaan untuk kebun stroberi di Bedugul, mencakup agrowisata, kegiatan edukasi, produk, program eco-waste, dan komunitasnya.',
    },
    stack: ['React', 'Tailwind CSS'],
    image: strawberryCorps,
    size: [1913, 899], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: {
      en: 'Strawberry Corps homepage with a full-screen view of the Bedugul garden',
      id: 'Beranda Strawberry Corps dengan pemandangan kebun Bedugul layar penuh',
    },
    href: null,
    scale: 'inset',
  },
  {
    id: 'aboi',
    index: '03',
    title: 'ABOI',
    category: { en: 'Indonesian Sports Biomechanics Association', id: 'Asosiasi Biomekanik Olahraga Indonesia' },
    role: 'Web Developer',
    summary: {
      en: 'A website for Asosiasi Biomekanik Olahraga Indonesia, presenting the association’s mission of science- and data-driven sporting achievement, its vision, and its members.',
      id: 'Website untuk Asosiasi Biomekanik Olahraga Indonesia, menampilkan misi asosiasi untuk prestasi olahraga berbasis sains dan data, visi, serta anggotanya.',
    },
    stack: ['React', 'Tailwind CSS'],
    image: aboi,
    size: [1844, 922], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: {
      en: 'ABOI homepage with the headline “Sains Gerak Untuk Prestasi Bangsa”',
      id: 'Beranda ABOI dengan judul “Sains Gerak Untuk Prestasi Bangsa”',
    },
    href: null,
    scale: 'wide',
  },
  {
    id: 'apkoi',
    index: '04',
    title: 'APKOI',
    category: { en: 'Indonesian Sports Coaches Association', id: 'Asosiasi Pelatih Olahraga Indonesia' },
    role: 'Frontend Developer',
    summary: {
      en: 'The web interface for a national association of sports coaching programmes — organisation profile, programmes, news, and member sign-in and registration.',
      id: 'Antarmuka web untuk asosiasi nasional program kepelatihan olahraga — profil organisasi, program, berita, serta masuk dan pendaftaran anggota.',
    },
    stack: ['React', 'Tailwind CSS'],
    image: apkoi,
    size: [1844, 915], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: {
      en: 'APKOI homepage with a photo from the association’s national meeting',
      id: 'Beranda APKOI dengan foto dari pertemuan nasional asosiasi',
    },
    href: null,
    scale: 'inset',
  },
  {
    id: 'wisata-bali-utara',
    index: '05',
    title: 'Wisata Bali Utara',
    category: { en: 'Community Service · Tourism', id: 'Pengabdian Masyarakat · Pariwisata' },
    role: 'Web Developer',
    summary: {
      en: 'A tourism website built for a community service programme, guiding visitors to the hidden destinations of northern Bali — from dolphins at sea to mountain waterfalls.',
      id: 'Website pariwisata yang dibuat untuk program pengabdian masyarakat, memandu wisatawan ke destinasi tersembunyi Bali Utara — dari lumba-lumba di laut hingga air terjun di pegunungan.',
    },
    stack: ['React', 'Tailwind CSS'],
    image: wisataBaliUtara,
    size: [1839, 925], // natural pixel size — the frame keeps this ratio, so nothing is cropped
    alt: {
      en: 'Wisata Bali Utara homepage overlooking a lake in the northern Bali highlands',
      id: 'Beranda Wisata Bali Utara dengan pemandangan danau di dataran tinggi Bali Utara',
    },
    href: null,
    scale: 'wide',
  },
]
