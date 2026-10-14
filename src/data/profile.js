/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EDIT ME FIRST.
 * Everything a visitor reads about you lives here. No copy is hard-coded in
 * the components.
 *
 * Fields marked PLACEHOLDER are intentionally inert — the UI hides or disables
 * any link whose value is still null, so nothing on the live site 404s.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Lintang Hilmi Mumtaz Surath',
  monogram: 'L',

  // Shown above the hero headline
  eyebrow: 'Frontend Developer · Information Systems Student',

  // The hero headline, split into lines so each can rise independently.
  // Keep lines short — they are rendered at display size.
  headlineLines: ['Interfaces built', 'around the people', 'who use them.'],

  // One short paragraph. Resist the urge to make this longer.
  intro:
    'I am an Information Systems student and web developer focused on the frontend — building responsive, user-centred interfaces with React.js and Tailwind CSS, backed by a working understanding of the backend.',

  // Availability pill in the hero. Set to null to hide it entirely.
  availability: 'Open to frontend projects & internships',

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
    headline: 'Good interfaces start with understanding the need.',
    paragraphs: [
      'I am an undergraduate in Information Systems at Universitas Pendidikan Ganesha, working as a web developer with a focus on frontend development. Most of my work is in React.js and Tailwind CSS, turning requirements into interfaces that are responsive and easy to use.',
      'Beyond the frontend, I am interested in system development, business analysis and UI/UX design. I have contributed to the front end of several web applications built with React and Flutter, and I understand enough of the backend to work well across the whole stack.',
    ],
    // Short, factual focus statements — not achievements.
    focus: [
      'Frontend development with React & Tailwind CSS',
      'User-centred UI/UX design',
      'System development & business analysis',
      'Research on 3D pose estimation for sport',
    ],
    // Metrics must be honest. Remove any line you cannot stand behind.
    stats: [
      { value: '2023', label: 'Started studies' },
      { value: '5', label: 'Web projects' },
      { value: '3', label: 'Research programmes' },
    ],
  },

  contact: {
    headline: 'Have a project in mind?',
    body: 'Whether it is a website for an organisation, an interface that needs rethinking, or a team looking for a frontend developer — I would be glad to hear about it.',
  },
}

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]
