import { coverPhoto } from './data/photos'

/**
 * Starts downloading the opening photograph the moment the page's script
 * runs — before React renders anything — using the same srcset/sizes as the
 * hero <img>, so the hero picks up the very same file from cache.
 *
 * Resolves once the image is decoded (or failed); never rejects.
 */
export const coverReady = (() => {
  if (typeof Image === 'undefined') return Promise.resolve()
  const img = new Image()
  img.decoding = 'async'
  img.fetchPriority = 'high'
  img.sizes = coverPhoto.sizes
  img.srcset = coverPhoto.srcSet
  img.src = coverPhoto.src
  return img.decode().catch(() => {})
})()
