'use client'

import { useEffect } from 'react'

const GA_ID = 'G-EYQHD3FFHG'
const AHREFS_KEY = 'uQBXFDRhKP8hiFHH08h4AQ'
const AHREFS_API = 'https://analytics.ahrefs.com/api/event'

function buildAhrefsPayload(name) {
  const payload = {
    n: name,
    u: window.location.href,
    k: AHREFS_KEY,
    r: window.document.referrer || null,
  }
  try { payload.l = navigator.languages || navigator.language || navigator.browserLanguage || navigator.userLanguage } catch {}
  try { var t = document.title; if (t != null) payload.t = t } catch {}
  try { var sw = window.screen.width; if (sw != null) payload.sw = sw } catch {}
  try { var sh = window.screen.height; if (sh != null) payload.sh = sh } catch {}
  try { var sr = window.devicePixelRatio; if (sr != null) payload.sr = sr } catch {}
  return payload
}

function sendAhrefsXHR(name) {
  try {
    const payload = buildAhrefsPayload(name)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', AHREFS_API, true)
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send(JSON.stringify(payload))
  } catch {}
}

function sendAhrefsBeacon(name) {
  try {
    const payload = buildAhrefsPayload(name)
    const json = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'text/plain' })
      navigator.sendBeacon(AHREFS_API, blob)
    } else {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', AHREFS_API, true)
      xhr.setRequestHeader('Content-Type', 'text/plain')
      xhr.send(json)
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

    // --- Ahrefs: direct API (XHR for pageviews, matching analytics.js behavior) ---
    let lastUrl

    function trackPageview() {
      const href = window.location.href
      if (href !== lastUrl) {
        lastUrl = href
        sendAhrefsXHR('pageview')
      }
    }

    if (document.visibilityState === 'prerender') {
      document.addEventListener('visibilitychange', function onVisible() {
        if (!lastUrl && document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVisible)
          trackPageview()
        }
      })
    } else {
      trackPageview()
    }

    const origPushState = history.pushState
    history.pushState = function () {
      origPushState.apply(this, arguments)
      trackPageview()
    }
    window.addEventListener('popstate', trackPageview)

    document.addEventListener('visibilitychange', function () {
      if (lastUrl == null) return
      if (document.visibilityState === 'hidden') sendAhrefsBeacon('x-visibilitychange-hidden')
      else if (document.visibilityState === 'visible') sendAhrefsBeacon('x-visibilitychange-visible')
    })
    document.addEventListener('pagehide', function () {
      sendAhrefsBeacon('x-pagehide')
    })
  }, [])

  return null
}
