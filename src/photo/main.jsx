import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PhotoApp from './PhotoApp.jsx'

/* Self-hosted type: a classical serif for display, Inter for everything small */
import '@fontsource-variable/inter'
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400-italic.css'

import './photo.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PhotoApp />
  </StrictMode>
)
