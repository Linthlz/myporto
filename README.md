# Premium Personal Portfolio

A single-page portfolio built as a real, runnable project — dark editorial layout, a
five-colour palette, and a motion system driven by one easing curve.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Node 18+ required.

---

## Edit your content first

All copy lives in `src/data/` — you should not need to touch a component to make this
site yours.

| File | What's in it |
| --- | --- |
| `src/data/profile.js` | Name, headline, intro, email, socials, About copy, stats |
| `src/data/projects.js` | The five project entries |
| `src/data/skills.js` | Skill groups and their items |
| `src/data/experience.js` | The Journey timeline |

**Before publishing, change these:**

1. `profile.email` — currently `hello@example.com`.
2. `profile.socials` — each entry has `href: null`, which *hides* the link. Add a URL to
   show it. Nothing on the page ever points at a dead address.
3. `src/data/experience.js` — the timeline is drafted from work you've mentioned and
   phrased conservatively. **Verify every date and title, and delete anything that
   hasn't happened yet.**
4. `projects[].href` — `null` renders an honest "Write-up in progress" label instead of
   a link. Add a URL when a repo or case study is public.
5. `index.html` — `<title>`, the description meta, and the canonical URL.

---

## Replacing the images

The visuals in `src/assets/` are generated SVG placeholders, built to the palette so the
site looks composed before you have final assets. They are marked "PLACEHOLDER" where a
real photograph belongs.

Swap them by replacing the file and keeping the import name, or by pointing the import
somewhere new:

| File | Used for | Aspect ratio to match |
| --- | --- | --- |
| `portrait-hero.svg` | Hero portrait | 4:5 (portrait) |
| `portrait-about.svg` | About portrait | 4:5 (portrait) |
| `texture-structure.svg` | About texture plate | 3:4 |
| `work-01.svg` | Project 01 (`lead`) | 16:10 |
| `work-02.svg`, `work-04.svg` | Projects at `inset` scale | 4:3 |
| `work-03.svg`, `work-05.svg` | Projects at `wide` scale | 21:9 |

Match the ratio or the image will be centre-cropped — `object-fit: cover` is used
throughout. If an image ever fails to load, `Media` renders a styled fallback instead of
a broken icon.

---

## How the layout varies

`projects[].scale` is what keeps the Works section from becoming a grid of identical
cards. Three values, defined in `src/components/ProjectEntry.jsx`:

- `lead` — large image left, metadata column right
- `inset` — metadata left, smaller image offset right
- `wide` — near-full-bleed image, metadata below in a narrow measure

Alternate them. Two `lead` entries in a row will look repetitive.

---

## Motion

Every animation composes from `src/lib/motion.js`: one easing curve (expo-out), one set
of durations, one stagger helper. Only `transform` and `opacity` are animated.

Scroll reveals all go through `<Reveal>` (`src/components/Reveal.jsx`), which drives a
single `IntersectionObserver` via `useInViewOnce`. **This is deliberate** — Framer
Motion's `whileInView` resolved unreliably in this version and left entire sections
invisible, so there is one code path to reason about instead of several.

Two related traps worth knowing if you extend this:

- A `clip-path: inset(100%)` element reports an **empty intersection rect**, so an
  observer watching it will never fire and it stays hidden forever. `Media` therefore
  observes an unclipped wrapper and clips an inner layer.
- An overlay `<div>` above interactive content needs `pointer-events-none`, or it
  silently eats every click.

`prefers-reduced-motion` is honoured twice over: in JS (`useMotionSafe` collapses
variants to their final state) and in CSS as a global safety net. Content always
arrives — only the travel is removed.

---

## Structure

```
src/
  assets/            generated SVG placeholders
  components/        Navbar, Reveal, Media, MagneticButton, ProjectEntry, …
  sections/          Hero, SelectedWorks, About, Skills, Journey, Contact
  data/              all editable content
  hooks/             useInViewOnce, useActiveSection, useScrolled, usePointerFine, useMotionSafe
  lib/motion.js      the motion vocabulary
  index.css          design tokens (Tailwind v4 @theme) + base styles
```

### Palette

Defined once, in `src/index.css`:

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#050505` | Primary background |
| `charcoal` | `#1f2933` | Panels, secondary surfaces |
| `steel` | `#4b5563` | Borders, tertiary text |
| `mist` | `#9ca3af` | Muted copy, metadata |
| `amber` | `#f59e0b` | The single accent |

Keep amber scarce — roughly one solid amber element per screen. That restraint is what
makes it read as an identity rather than decoration.

---

## The contact form

There is **no backend**. The form validates input, then opens the visitor's mail client
with a composed message. It never shows a fake "sent" confirmation, and it says so on
the page.

To wire up a real endpoint, replace the body of `handleSubmit` in
`src/sections/Contact.jsx` with your `fetch` call. The validation, error display, and
`aria-live` status region are already there.

---

## Dependencies

**Runtime:** `react`, `react-dom`, `framer-motion`, `lucide-react`,
`@fontsource-variable/inter`, `@fontsource/space-grotesk`

**Build:** `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`

Tailwind v4 configures its theme in CSS (`@theme` in `index.css`) — there is no
`tailwind.config.js`, and you don't need one.

Fonts are bundled rather than loaded from Google Fonts: one less third-party request
blocking first paint, and the typography still works offline.

---

## Deploying

`npm run build` outputs a static `dist/`. It works on Netlify, Vercel, Cloudflare Pages
or GitHub Pages with no configuration — `base: './'` in `vite.config.js` keeps asset
paths relative, so a project sub-path works too.

---

## Accessibility notes

Semantic landmarks, correct heading order (one `h1`), visible amber focus rings, a skip
link, keyboard-operable navigation with focus moved to the target section, labelled form
fields with `aria-invalid` and `aria-describedby`, and an `aria-live` status region.

The hover cursor label is decorative and desktop-only — every project is reachable as a
normal link. Verified clean at 320, 375, 768, 1024 and 1440px with no horizontal
overflow and no console errors.
