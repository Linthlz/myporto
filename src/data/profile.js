/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EDIT ME FIRST.
 * Everything a visitor reads about you lives here. No copy is hard-coded in
 * the components.
 *
 * Text that changes with the language is written as { en: '…', id: '…' }.
 * Fields marked PLACEHOLDER are intentionally inert — the UI hides or disables
 * any link whose value is still null, so nothing on the live site 404s.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Lintang Hilmi Mumtaz Surath',
  monogram: 'L',

  // Shown above the hero headline
  eyebrow: {
    en: 'Frontend Developer · Information Systems Student',
    id: 'Frontend Developer · Mahasiswa Sistem Informasi',
  },

  // The hero headline, split into lines so each can rise independently.
  // Keep lines short — they are rendered at display size.
  headlineLines: {
    en: ['Interfaces built', 'around the people', 'who use them.'],
    id: ['Antarmuka yang', 'dibangun untuk', 'penggunanya.'],
  },

  // One short paragraph. Resist the urge to make this longer.
  intro: {
    en: 'I am an Information Systems student and web developer focused on the frontend — building responsive, user-centred interfaces with React.js and Tailwind CSS, backed by a working understanding of the backend.',
    id: 'Saya mahasiswa Sistem Informasi dan web developer yang berfokus pada frontend — membangun antarmuka yang responsif dan berpusat pada pengguna dengan React.js dan Tailwind CSS, didukung pemahaman backend yang memadai.',
  },

  // Availability pill in the hero. Set to null to hide it entirely.
  availability: {
    en: 'Open to frontend projects & internships',
    id: 'Terbuka untuk proyek frontend & magang',
  },

  location: 'Singaraja, Bali · Indonesia',

  email: 'lintang@student.undiksha.ac.id',

  // Set href to null to hide a link.
  socials: [
    { label: 'GitHub', href: 'https://github.com/Linthlz' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lintang-hilmi-91927828a/' },
    { label: 'Instagram', href: 'https://www.instagram.com/lintanghmz/' },
    // wa.me needs the international format: 0821… → 62821…
    { label: 'WhatsApp', href: 'https://wa.me/6282147837573' },
  ],

  // About section
  about: {
    headline: {
      en: 'Good interfaces start with understanding the need.',
      id: 'Antarmuka yang baik dimulai dari memahami kebutuhan.',
    },
    paragraphs: [
      {
        en: 'I am an undergraduate in Information Systems at Universitas Pendidikan Ganesha, working as a web developer with a focus on frontend development. Most of my work is in React.js and Tailwind CSS, turning requirements into interfaces that are responsive and easy to use.',
        id: 'Saya mahasiswa S1 Sistem Informasi di Universitas Pendidikan Ganesha dan bekerja sebagai web developer dengan fokus pada frontend. Sebagian besar karya saya dibuat dengan React.js dan Tailwind CSS, mengubah kebutuhan menjadi antarmuka yang responsif dan mudah digunakan.',
      },
      {
        en: 'Beyond the frontend, I am interested in system development, business analysis and UI/UX design. I have contributed to the front end of several web applications built with React and Flutter, and I understand enough of the backend to work well across the whole stack.',
        id: 'Di luar frontend, saya tertarik pada pengembangan sistem, analisis bisnis, dan desain UI/UX. Saya telah berkontribusi pada sisi frontend beberapa aplikasi web yang dibangun dengan React dan Flutter, dan cukup memahami backend untuk bekerja baik di seluruh bagian sistem.',
      },
    ],
    // Short, factual focus statements — not achievements.
    focus: [
      { en: 'Frontend development with React & Tailwind CSS', id: 'Pengembangan frontend dengan React & Tailwind CSS' },
      { en: 'User-centred UI/UX design', id: 'Desain UI/UX yang berpusat pada pengguna' },
      { en: 'System development & business analysis', id: 'Pengembangan sistem & analisis bisnis' },
      { en: 'Research on 3D pose estimation for sport', id: 'Riset estimasi pose 3D untuk olahraga' },
    ],
    // Metrics must be honest. Remove any line you cannot stand behind.
    stats: [
      { value: '2023', label: { en: 'Started studies', id: 'Mulai kuliah' } },
      { value: '5', label: { en: 'Web projects', id: 'Proyek web' } },
      { value: '3', label: { en: 'Research programmes', id: 'Program riset' } },
    ],
  },

  contact: {
    headline: { en: 'Have a project in mind?', id: 'Punya proyek yang ingin diwujudkan?' },
    lines: {
      en: ['Have a project', 'in mind?'],
      id: ['Punya proyek', 'untuk dikerjakan?'],
    },
    body: {
      en: 'Whether it is a website for an organisation, an interface that needs rethinking, or a team looking for a frontend developer — I would be glad to hear about it.',
      id: 'Entah itu website untuk organisasi, antarmuka yang perlu dirancang ulang, atau tim yang mencari frontend developer — saya senang mendengarnya.',
    },
  },
}

export const navLinks = [
  { id: 'work', label: { en: 'Work', id: 'Karya' } },
  { id: 'about', label: { en: 'About', id: 'Tentang' } },
  { id: 'skills', label: { en: 'Skills', id: 'Keahlian' } },
  { id: 'journey', label: { en: 'Journey', id: 'Perjalanan' } },
  { id: 'contact', label: { en: 'Contact', id: 'Kontak' } },
]
