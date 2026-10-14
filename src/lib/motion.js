/**
 * Central motion vocabulary.
 *
 * Every animation on the site is composed from these primitives so the timing
 * feels authored rather than accidental. Two rules:
 *   1. Only `transform` and `opacity` are animated (compositor-friendly).
 *   2. One easing curve — expo-out — for entrances; a softer in-out for loops.
 */

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.65, 0, 0.35, 1]

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
}

/** Shared viewport config: fire once, slightly before the element is centred. */
export const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -12% 0px' }

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
}

/** Headline lines rise out of an overflow-hidden mask. */
export const maskLine = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: DURATION.cinematic, ease: EASE },
  },
}

/** Images wipe open from the bottom edge instead of simply fading. */
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: 1.4, ease: EASE },
  },
}

/** Decorative rules draw themselves in. */
export const drawLineX = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: DURATION.cinematic, ease: EASE },
  },
}

export const drawLineY = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: 1.6, ease: EASE },
  },
}

/* -------------------------------------------------------------------------- */
/* Orchestration                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Parent container that releases its children one after another.
 * Never animate everything at once — the stagger is what reads as "designed".
 */
export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

/** Collapses any variant to its final state — used when motion is reduced. */
export const still = {
  hidden: { opacity: 1, y: 0, scaleX: 1, scaleY: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  show: { opacity: 1, y: 0, scaleX: 1, scaleY: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
}
