import { Code, Layers, Database, PenTool, Users } from 'lucide-react'

/**
 * Deliberately no percentages or progress bars — a number like "React 82%"
 * has no measurable basis and reads as filler. Grouped lists do the job.
 */

export const skillGroups = [
  {
    id: 'programming',
    index: '01',
    title: { en: 'Programming', id: 'Pemrograman' },
    icon: Code,
    items: ['JavaScript', 'Python'],
  },
  {
    id: 'frameworks',
    index: '02',
    title: { en: 'Frameworks & Tools', id: 'Framework & Tools' },
    icon: Layers,
    items: ['React', 'Flutter', 'Laravel', 'Tailwind CSS', 'GitHub'],
  },
  {
    id: 'database-design',
    index: '03',
    title: { en: 'Database & Design', id: 'Database & Desain' },
    icon: Database,
    items: ['MySQL', 'Figma'],
  },
  {
    id: 'focus',
    index: '04',
    title: { en: 'Areas of Interest', id: 'Bidang Minat' },
    icon: PenTool,
    items: [
      { en: 'Frontend development', id: 'Pengembangan frontend' },
      { en: 'UI/UX design', id: 'Desain UI/UX' },
      { en: 'System development', id: 'Pengembangan sistem' },
      { en: 'Business analysis', id: 'Analisis bisnis' },
    ],
  },
  {
    id: 'soft',
    index: '05',
    title: { en: 'Soft Skills', id: 'Soft Skill' },
    icon: Users,
    items: [
      { en: 'Problem solving', id: 'Pemecahan masalah' },
      { en: 'Teamwork', id: 'Kerja sama tim' },
      { en: 'Leadership', id: 'Kepemimpinan' },
      { en: 'Communication', id: 'Komunikasi' },
    ],
  },
]
