import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Two-language support (English / Bahasa Indonesia) shared by both pages.
 *
 * Copy that differs per language is written as `{ en: …, id: … }` — in the
 * data files and in each component's own `COPY` table. `t()` picks the right
 * side and passes anything else (names, URLs, numbers) through untouched, so
 * untranslated values never need wrapping.
 *
 * The choice is remembered in localStorage and shared between the main
 * portfolio and the photography page (same origin). First visit: Indonesian,
 * until the visitor picks otherwise.
 */
const STORAGE_KEY = 'lang'
const LANGS = ['en', 'id']

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    /* storage blocked — fall through */
  }
  return 'id'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* not remembered, still switched */
    }
  }, [])

  const value = useMemo(() => {
    const t = (v) =>
      v && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'id' in v ? v[lang] : v
    return { lang, setLang, t }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}

/**
 * The switch itself: "EN / ID", the active side emphasised. Colours come from
 * the page via className, so it sits in either theme.
 *
 *   activeClass / idleClass — classes for the selected / unselected side
 */
export function LanguageToggle({ className = '', activeClass = '', idleClass = 'opacity-45' }) {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language / Bahasa" className={`inline-flex items-center ${className}`}>
      {LANGS.map((code, i) => (
        <span key={code} className="inline-flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5 opacity-40">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            lang={code}
            title={code === 'en' ? 'English' : 'Bahasa Indonesia'}
            className={`min-h-9 min-w-7 uppercase transition-opacity duration-300 hover:opacity-100 ${
              lang === code ? activeClass : idleClass
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  )
}
