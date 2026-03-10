'use client'

import { useEffect } from 'react'

export default function AhrefsAnalytics() {
  useEffect(() => {
    if (document.querySelector('script[data-key="uQBXFDRhKP8hiFHH08h4AQ"]')) return

    const script = document.createElement('script')
    script.src = 'https://analytics.ahrefs.com/analytics.js'
    script.setAttribute('data-key', process.env.NEXT_PUBLIC_AHREFS_KEY || 'uQBXFDRhKP8hiFHH08h4AQ')
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}
