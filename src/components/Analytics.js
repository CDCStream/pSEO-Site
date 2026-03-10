'use client'

import { useEffect } from 'react'

const GA_ID = 'G-EYQHD3FFHG'
const AHREFS_KEY = 'uQBXFDRhKP8hiFHH08h4AQ'

export default function Analytics() {
  useEffect(() => {
    if (window.__analytics_loaded) return
    window.__analytics_loaded = true

    const gtagScript = document.createElement('script')
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    gtagScript.async = true
    document.head.appendChild(gtagScript)

    gtagScript.onload = () => {
      window.dataLayer = window.dataLayer || []
      function gtag() { window.dataLayer.push(arguments) }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', GA_ID)
    }

    // Ahrefs analytics.js reads document.currentScript.getAttribute("data-key")
    // but document.currentScript is null for dynamically created scripts.
    // We temporarily override it so Ahrefs can read the data-key attribute.
    const ahrefsScript = document.createElement('script')
    ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js'
    ahrefsScript.setAttribute('data-key', AHREFS_KEY)
    ahrefsScript.async = true

    Object.defineProperty(document, 'currentScript', {
      value: ahrefsScript,
      writable: true,
      configurable: true,
    })

    const restoreCurrentScript = () => {
      delete document.currentScript
    }
    ahrefsScript.addEventListener('load', restoreCurrentScript)
    ahrefsScript.addEventListener('error', restoreCurrentScript)

    document.head.appendChild(ahrefsScript)
  }, [])

  return null
}
