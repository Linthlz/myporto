import { Code, Layers, Database, PenTool, Users } from 'lucide-react'

/**
 * Deliberately no percentages or progress bars — a number like "React 82%"
 * has no measurable basis and reads as filler. Grouped lists do the job.
 */

export const skillGroups = [
  {
    id: 'programming',
    index: '01',
    title: 'Programming',
    icon: Code,
    items: ['JavaScript', 'Python'],
  },
  {
    id: 'frameworks',
    index: '02',
    title: 'Frameworks & Tools',
    icon: Layers,
    items: ['React', 'Flutter', 'Laravel', 'Tailwind CSS', 'GitHub'],
  },
  {
    id: 'database-design',
    index: '03',
    title: 'Database & Design',
    icon: Database,
    items: ['MySQL', 'Figma'],
  },
  {
    id: 'focus',
    index: '04',
    title: 'Areas of Interest',
    icon: PenTool,
    items: ['Frontend development', 'UI/UX design', 'System development', 'Business analysis'],
  },
  {
    id: 'soft',
    index: '05',
    title: 'Soft Skills',
    icon: Users,
    items: ['Problem solving', 'Teamwork', 'Leadership', 'Communication'],
  },
]
