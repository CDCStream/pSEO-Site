'use client'

import { useEffect } from 'react'

const GA_ID = 'G-EYQHD3FFHG'
const AHREFS_KEY = 'uQBXFDRhKP8hiFHH08h4AQ'
const AHREFS_API = 'https://analytics.ahrefs.com/api/event'

function sendAhrefsDirect(name) {
  try {
    const payload = { n: name, u: window.location.href, k: AHREFS_KEY, r: window.document.referrer || null }
    try { payload.l = navigator.languages || navigator.language } catch {}
    try { payload.t = document.title } catch {}
    try { payload.sw = screen.width } catch {}
    try { payload.sh = screen.height } catch {}
    try { payload.sr = window.devicePixelRatio } catch {}
    const xhr = new XMLHttpRequest()
    xhr.open('POST', AHREFS_API, true)
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send(JSON.stringify(payload))
  } catch {}
}

export default function Analytics() {
  useEffect(() => {
    if (window.__analytics_loaded) return
    window.__analytics_loaded = true

    // --- GA4 ---
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

    // --- Ahrefs: inject via createContextualFragment for parser-inserted behavior ---
    // This ensures document.currentScript works so analytics.js can read data-key
    try {
      const range = document.createRange()
      range.setStart(document.head, 0)
      const fragment = range.createContextualFragment(
        '<script src="https://analytics.ahrefs.com/analytics.js" data-key="' + AHREFS_KEY + '" async><\/script>'
      )
      document.head.appendChild(fragment)
    } catch {
      // Fallback: direct API call if createContextualFragment fails
      sendAhrefsDirect('pageview')
    }

    // Safety net: if analytics.js fails to init after 5s, send pageview directly
    setTimeout(() => {
      if (typeof window.AhrefsAnalytics === 'undefined') {
        sendAhrefsDirect('pageview')
      }
    }, 5000)
  }, [])

  return null
}
