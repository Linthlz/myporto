import { useEffect, useState } from 'react'

/**
 * True only on devices with a precise pointer (mouse / trackpad).
 * Gates the magnetic buttons, the cursor label and parallax so touch devices
 * get a lighter, non-janky experience.
 */
export function usePointerFine() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => setFine(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return fine
}
