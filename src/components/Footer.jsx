import { ArrowUp } from 'lucide-react'
import { navLinks, profile } from '../data/profile'
import { useMotionSafe } from '../hooks/useMotionSafe'

export function Footer() {
  const { reduced } = useMotionSafe()
  const year = new Date().getFullYear()
  const activeSocials = profile.socials.filter((social) => social.href)

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const goTo = (event, id) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <footer className="border-t border-steel/25 bg-ink">
      <div className="shell py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* identity */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl leading-none font-semibold">
                {profile.monogram}
              </span>
              <span className="h-1.5 w-1.5 bg-amber" aria-hidden="true" />
              <span className="text-[0.9375rem] tracking-tight">{profile.name}</span>
            </div>
            <p className="eyebrow mt-4 text-[0.625rem] leading-relaxed">
              © {year} {profile.name}. All rights reserved.
            </p>
          </div>

          {/* navigation */}
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => goTo(e, link.id)}
                    className="link-underline text-[0.8125rem] text-mist transition-colors duration-500 hover:text-amber"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="photography/"
              className="link-underline mt-5 inline-block text-[0.8125rem] text-amber transition-colors duration-500 hover:text-[#e8eaed]"
            >
              Photography portfolio ↗
            </a>

            {activeSocials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
                {activeSocials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline text-[0.8125rem] text-mist transition-colors duration-500 hover:text-amber"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          {/* back to top */}
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex min-h-12 items-center gap-2.5 self-start text-[0.75rem] tracking-[0.18em] text-mist uppercase transition-colors duration-500 hover:text-amber"
          >
            Back to top
            <span className="flex h-9 w-9 items-center justify-center border border-steel/50 transition-colors duration-500 group-hover:border-amber">
              <ArrowUp
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
