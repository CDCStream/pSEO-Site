'use client'

import { useEffect } from 'react'

const GA_ID = 'G-EYQHD3FFHG'
const AHREFS_KEY = 'uQBXFDRhKP8hiFHH08h4AQ'
const AHREFS_API = 'https://analytics.ahrefs.com/api/event'

function sendAhrefsEvent(name) {
  try {
    const payload = {
      n: name,
      u: window.location.href,
      k: AHREFS_KEY,
      r: document.referrer || null,
      t: document.title || null,
    }
    try { payload.l = navigator.languages || navigator.language } catch {}
    try { payload.sw = screen.width } catch {}
    try { payload.sh = screen.height } catch {}
    try { payload.sr = window.devicePixelRatio } catch {}

    if (navigator.sendBeacon) {
      navigator.sendBeacon(AHREFS_API, JSON.stringify(payload))
    } else {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', AHREFS_API, true)
      xhr.setRequestHeader('Content-Type', 'text/plain')
      xhr.send(JSON.stringify(payload))
    }
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

    // --- Ahrefs: direct API calls, no analytics.js dependency ---
    let lastUrl = window.location.href
    sendAhrefsEvent('pageview')

    const origPushState = history.pushState
    history.pushState = function () {
      origPushState.apply(this, arguments)
      const newUrl = window.location.href
      if (newUrl !== lastUrl) {
        lastUrl = newUrl
        sendAhrefsEvent('pageview')
      }
    }

    window.addEventListener('popstate', () => {
      const newUrl = window.location.href
      if (newUrl !== lastUrl) {
        lastUrl = newUrl
        sendAhrefsEvent('pageview')
      }
    })
  }, [])

  return null
}
