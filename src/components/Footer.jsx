import { navLinks, profile } from '../data/profile'
import { useMotionSafe } from '../hooks/useMotionSafe'
import { LanguageToggle, useLang } from '../i18n/language'

const COPY = {
  rights: { en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
  photo: { en: 'Photography portfolio ↗', id: 'Portfolio fotografi ↗' },
}

export function Footer() {
  const { reduced } = useMotionSafe()
  const { t } = useLang()
  const year = new Date().getFullYear()
  const activeSocials = profile.socials.filter((social) => social.href)

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
              © {year} {profile.name}. {t(COPY.rights)}
            </p>
            <LanguageToggle
              className="mt-5 text-[0.75rem] font-medium tracking-[0.16em]"
              activeClass="text-amber"
              idleClass="text-mist opacity-70"
            />
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
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="photography/"
              className="link-underline mt-5 inline-block text-[0.8125rem] text-amber transition-colors duration-500 hover:text-[#e8eaed]"
            >
              {t(COPY.photo)}
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
        </div>
      </div>
    </footer>
  )
}
