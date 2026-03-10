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

    const ahrefsScript = document.createElement('script')
    ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js'
    ahrefsScript.setAttribute('data-key', AHREFS_KEY)
    ahrefsScript.async = true
    document.head.appendChild(ahrefsScript)
  }, [])

  return null
}
