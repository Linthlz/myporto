import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import { MaskedHeading } from '../components/MaskedHeading'
import { MagneticButton } from '../components/MagneticButton'
import { Reveal } from '../components/Reveal'
import { GridRules } from '../components/GridRules'
import { drawLineX } from '../lib/motion'
import { profile } from '../data/profile'
import { useLang } from '../i18n/language'

/**
 * Closing section.
 *
 * Messages are delivered to your inbox through Web3Forms (a static site has no
 * server of its own). The access key comes from VITE_WEB3FORMS_KEY in `.env`;
 * it is designed to be public, since it can only send mail to the address it
 * was created for.
 *
 * Without a key the form stays honest: it hands a composed draft to the
 * visitor's own mail client instead of pretending to send.
 */
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const ENDPOINT = 'https://api.web3forms.com/submit'

// Errors and status hold these { en, id } objects rather than strings, so a
// message already on screen follows a language switch.
const COPY = {
  label: { en: 'Contact', id: 'Kontak' },
  name: { en: 'Name', id: 'Nama' },
  email: { en: 'Email', id: 'Email' },
  message: { en: 'Message', id: 'Pesan' },
  namePh: { en: 'Your name', id: 'Nama kamu' },
  messagePh: { en: 'Tell me about your project', id: 'Ceritakan tentang proyekmu' },
  needName: { en: 'Please add your name.', id: 'Mohon isi namamu.' },
  needEmail: { en: 'Please add an email address.', id: 'Mohon isi alamat email.' },
  badEmail: { en: 'That address does not look right.', id: 'Alamat email itu sepertinya kurang tepat.' },
  needMessage: {
    en: 'A little more detail would help — 10 characters minimum.',
    id: 'Tambahkan sedikit detail — minimal 10 karakter.',
  },
  fixFields: { en: 'Please correct the fields above and try again.', id: 'Mohon perbaiki isian di atas lalu coba lagi.' },
  mailApp: {
    en: 'Your email app should now be opening with this message ready to send. Nothing has been sent from this page.',
    id: 'Aplikasi email kamu akan terbuka dengan pesan ini siap dikirim. Belum ada yang terkirim dari halaman ini.',
  },
  sendingNow: { en: 'Sending your message…', id: 'Mengirim pesanmu…' },
  sent: {
    en: 'Thank you — your message has been sent. I will reply to the address you gave.',
    id: 'Terima kasih — pesanmu sudah terkirim. Saya akan membalas ke alamat email yang kamu berikan.',
  },
  failed: {
    en: 'The message could not be sent just now. Please try again, or email {email} directly.',
    id: 'Pesan belum bisa terkirim saat ini. Coba lagi, atau kirim email langsung ke {email}.',
  },
  send: { en: 'Send message', id: 'Kirim pesan' },
  sending: { en: 'Sending…', id: 'Mengirim…' },
  compose: { en: 'Compose message', id: 'Tulis pesan' },
  noteKey: {
    en: 'Your name, email and message are sent straight to my inbox and used only to reply to you.',
    id: 'Nama, email, dan pesanmu dikirim langsung ke inbox saya dan hanya dipakai untuk membalasmu.',
  },
  noteMailto: {
    en: 'This form opens your own mail client with the message pre-filled, so nothing is stored or transmitted by this site.',
    id: 'Form ini membuka aplikasi email kamu dengan pesan yang sudah terisi, jadi tidak ada yang disimpan atau dikirim oleh situs ini.',
  },
}

export function Contact() {
  const { t } = useLang()
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  // Honeypot: invisible to people, irresistible to form-filling bots.
  const [trap, setTrap] = useState(false)

  const activeSocials = profile.socials.filter((social) => social.href)

  const update = (key) => (event) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setStatus(null)
  }

  const validate = () => {
    const next = {}
    if (!fields.name.trim()) next.name = COPY.needName
    if (!fields.email.trim()) next.email = COPY.needEmail
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim()))
      next.email = COPY.badEmail
    if (fields.message.trim().length < 10)
      next.message = COPY.needMessage
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (sending) return
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      setStatus({ type: 'error', text: COPY.fixFields })
      return
    }

    const name = fields.name.trim()
    const email = fields.email.trim()
    const message = fields.message.trim()

    if (!ACCESS_KEY) {
      const subject = encodeURIComponent(`Project enquiry from ${name}`)
      const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      setStatus({
        type: 'info',
        text: COPY.mailApp,
      })
      return
    }

    setSending(true)
    setStatus({ type: 'info', text: COPY.sendingNow })

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry from ${name}`,
          from_name: 'Portfolio website',
          name,
          email,
          message,
          botcheck: trap,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.success === false) throw new Error(result.message)

      setFields({ name: '', email: '', message: '' })
      setStatus({
        type: 'success',
        text: COPY.sent,
      })
    } catch {
      setStatus({
        type: 'error',
        text: COPY.failed,
      })
    } finally {
      setSending(false)
    }
  }

  const inputClass =
    'w-full border-b border-steel/40 bg-transparent py-3.5 text-[length:var(--text-body)] ' +
    'text-[#e8eaed] placeholder:text-steel transition-colors duration-400 ' +
    'focus:border-amber focus:outline-none'

  return (
    <section id="contact" className="grain relative scroll-mt-24 overflow-hidden py-20 md:py-40">
      <GridRules columns={[25, 50, 75]} />

      <div className="shell relative">
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          {/* --------------------------------------------------- statement */}
          <div className="lg:col-span-6">
            <Reveal className="flex items-center gap-4">
              <Reveal.Item as="span" className="eyebrow text-amber">
                006
              </Reveal.Item>
              <Reveal.Item as="span" className="eyebrow">
                {t(COPY.label)}
              </Reveal.Item>
              <Reveal.Item
                as="span"
                variants={drawLineX}
                className="hairline max-w-24 flex-1 origin-left"
              />
            </Reveal>

            <MaskedHeading
              lines={t(profile.contact.lines)}
              className="mt-7 text-[clamp(2rem,4.5vw,3.75rem)]"
            />

            <Reveal className="mt-8 space-y-9">
              <Reveal.Item>
                <p className="max-w-md leading-relaxed text-mist">{t(profile.contact.body)}</p>
              </Reveal.Item>

              <Reveal.Item>
                <MagneticButton
                  href={`mailto:${profile.email}`}
                  icon={Mail}
                  className="w-full px-5 sm:w-auto sm:px-7"
                >
                  {/* An address reads better unshouted, and fits a phone */}
                  <span className="text-[0.875rem] tracking-[0.02em] normal-case">{profile.email}</span>
                </MagneticButton>
              </Reveal.Item>

              {activeSocials.length > 0 && (
                <Reveal.Item>
                  <ul className="flex flex-wrap gap-x-7 gap-y-3 pt-2">
                    {activeSocials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link-underline inline-flex items-center gap-1.5 text-[0.8125rem] tracking-[0.06em] text-mist transition-colors duration-500 hover:text-amber"
                        >
                          {social.label}
                          <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal.Item>
              )}

              <Reveal.Item>
                <p className="eyebrow text-[0.625rem] leading-relaxed">{profile.location}</p>
              </Reveal.Item>
            </Reveal>
          </div>

          {/* -------------------------------------------------------- form */}
          <Reveal className="lg:col-span-5 lg:col-start-8" gap={0.07}>
            <form onSubmit={handleSubmit} noValidate className="space-y-7">
              {/* Honeypot — kept out of view and out of the tab order */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                checked={trap}
                onChange={(event) => setTrap(event.target.checked)}
                className="hidden"
              />

              <Reveal.Item>
                <label htmlFor="c-name" className="eyebrow mb-1 block text-[0.625rem]">
                  {t(COPY.name)}
                </label>
                <input
                  id="c-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={update('name')}
                  placeholder={t(COPY.namePh)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'c-name-error' : undefined}
                  className={inputClass}
                />
                {errors.name && (
                  <p id="c-name-error" className="mt-2 text-[0.75rem] text-amber">
                    {t(errors.name)}
                  </p>
                )}
              </Reveal.Item>

              <Reveal.Item>
                <label htmlFor="c-email" className="eyebrow mb-1 block text-[0.625rem]">
                  {t(COPY.email)}
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={update('email')}
                  placeholder="you@domain.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'c-email-error' : undefined}
                  className={inputClass}
                />
                {errors.email && (
                  <p id="c-email-error" className="mt-2 text-[0.75rem] text-amber">
                    {t(errors.email)}
                  </p>
                )}
              </Reveal.Item>

              <Reveal.Item>
                <label htmlFor="c-message" className="eyebrow mb-1 block text-[0.625rem]">
                  {t(COPY.message)}
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={4}
                  value={fields.message}
                  onChange={update('message')}
                  placeholder={t(COPY.messagePh)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'c-message-error' : undefined}
                  className={`${inputClass} resize-none`}
                />
                {errors.message && (
                  <p id="c-message-error" className="mt-2 text-[0.75rem] text-amber">
                    {t(errors.message)}
                  </p>
                )}
              </Reveal.Item>

              <Reveal.Item>
                {/* Secondary styling on purpose: the mailto button on the left
                    is the single solid amber mark in this view. */}
                <MagneticButton
                  onClick={handleSubmit}
                  icon={ArrowUpRight}
                  variant="secondary"
                  disabled={sending}
                  className="w-full disabled:opacity-60 sm:w-auto"
                >
                  {t(ACCESS_KEY ? (sending ? COPY.sending : COPY.send) : COPY.compose)}
                </MagneticButton>
              </Reveal.Item>

              {/* Status is announced to screen readers as it changes */}
              <div aria-live="polite" className="min-h-6">
                {status && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[0.8125rem] leading-relaxed ${
                      status.type === 'error' ? 'text-amber' : 'text-mist'
                    }`}
                  >
                    {t(status.text).replace('{email}', profile.email)}
                  </motion.p>
                )}
              </div>

              <Reveal.Item>
                <p className="border-t border-steel/25 pt-5 text-[0.6875rem] leading-relaxed text-steel">
                  {t(ACCESS_KEY ? COPY.noteKey : COPY.noteMailto)}
                </p>
              </Reveal.Item>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
