import { motion } from 'framer-motion'
import { ArrowUpRight, Lock } from 'lucide-react'
import { Media } from './Media'
import { Reveal } from './Reveal'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { drawLineX, fadeUp } from '../lib/motion'

/**
 * One project, laid out at one of three scales. The scale is what keeps the
 * section editorial rather than a grid of identical tiles:
 *
 *   lead   — large image left, metadata column right
 *   inset  — metadata left, smaller image offset right (reads as a breath)
 *   wide   — near-full-bleed image, metadata below in a narrow measure
 */
const LAYOUT = {
  lead: {
    media: 'lg:col-span-7 lg:col-start-1 lg:row-start-1',
    meta: 'lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end lg:pb-2',
    ratio: '16 / 10',
    parallax: 4,
  },
  inset: {
    media: 'lg:col-span-6 lg:col-start-7 lg:row-start-1',
    meta: 'lg:col-span-4 lg:col-start-2 lg:row-start-1 lg:self-center',
    ratio: '4 / 3',
    parallax: 6,
  },
  wide: {
    media: 'lg:col-span-11 lg:col-start-2 lg:row-start-1',
    meta: 'lg:col-span-5 lg:col-start-2 lg:row-start-2 lg:mt-8',
    ratio: '21 / 9',
    parallax: 3,
  },
}

export function ProjectEntry({ project, onHoverChange }) {
  const { v } = useMotionSafe()
  const layout = LAYOUT[project.scale] ?? LAYOUT.lead
  const hasLink = Boolean(project.href)
  // With a known size, show the whole image: its own ratio and no parallax,
  // since the parallax over-scales the image and trims its edges.
  const natural = Array.isArray(project.size)

  const MediaWrapper = hasLink ? motion.a : motion.div
  const wrapperProps = hasLink
    ? {
        href: project.href,
        target: '_blank',
        rel: 'noreferrer noopener',
        'aria-label': `${project.title} — open project`,
      }
    : {}

  return (
    <Reveal
      as="article"
      gap={0.1}
      className="group relative grid grid-cols-1 items-start gap-x-8 gap-y-7 lg:grid-cols-12"
    >
      {/* ------------------------------------------------------------ media */}
      <MediaWrapper
        {...wrapperProps}
        className={`relative block overflow-hidden ${layout.media}`}
        data-cursor="hide" /* CursorLabel takes over here */
        onMouseEnter={() => onHoverChange?.(hasLink ? 'View Project' : 'In Progress')}
        onMouseLeave={() => onHoverChange?.(null)}
        onFocus={() => onHoverChange?.(null)}
        variants={v(fadeUp)}
      >
        <Media
          src={project.image}
          alt={project.alt}
          ratio={natural ? `${project.size[0]} / ${project.size[1]}` : layout.ratio}
          parallax={natural ? 0 : layout.parallax}
          zoomOnHover
        />

        {/* Metadata overlay — appears on hover, never hides anything essential */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-ink/85 px-4 py-3 backdrop-blur-sm">
            {project.stack.map((tech) => (
              <span key={tech} className="eyebrow text-[0.5625rem] text-mist">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </MediaWrapper>

      {/* ------------------------------------------------------------- meta */}
      <motion.div className={layout.meta} variants={v(fadeUp)}>
        <div className="flex items-baseline gap-4">
          <span className="font-display text-[length:var(--text-numeral)] leading-none font-light text-steel/45 transition-colors duration-700 group-hover:text-amber/70">
            {project.index}
          </span>
          <motion.span className="hairline flex-1 origin-left" variants={v(drawLineX)} />
        </div>

        <h3 className="mt-5 text-[length:var(--text-h3)] transition-[color,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-amber">
          {project.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="eyebrow">{project.category}</span>
          <span className="hidden h-1 w-1 bg-steel sm:block" aria-hidden="true" />
          <span className="eyebrow w-full text-amber sm:w-auto">{project.role}</span>
        </div>

        <p className="mt-5 max-w-md leading-relaxed text-mist">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-x-2.5 gap-y-2 lg:hidden">
          {project.stack.map((tech) => (
            <li key={tech} className="border border-steel/35 px-2.5 py-1 text-[0.6875rem] text-mist">
              {tech}
            </li>
          ))}
        </ul>

        {hasLink ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="link-underline mt-7 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.16em] text-[#e8eaed] uppercase transition-colors duration-500 hover:text-amber"
          >
            View project
            <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ) : (
          /* Honest empty state — better than a link that goes nowhere */
          <p className="mt-7 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.16em] text-steel uppercase">
            <Lock size={13} strokeWidth={1.5} aria-hidden="true" />
            Write-up in progress
          </p>
        )}
      </motion.div>
    </Reveal>
  )
}
