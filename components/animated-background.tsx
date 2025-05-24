"use client"

import { useEffect, useState } from "react"

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-orange-100/40 to-red-100/50" />

      {/* Animated glowing orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      <div className="glow-orb glow-orb-4" />
      <div className="glow-orb glow-orb-5" />
      <div className="glow-orb glow-orb-6" />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className={`floating-particle particle-${i + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Spice jar silhouettes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`jar-${i}`}
          className={`spice-jar jar-${i + 1}`}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
            animationDelay: `${i * 2}s`,
          }}
        >
          <svg width="50" height="70" viewBox="0 0 50 70" className="text-orange-400/40">
            <rect x="10" y="20" width="30" height="40" rx="3" fill="currentColor" />
            <rect x="15" y="15" width="20" height="10" rx="2" fill="currentColor" />
            <circle cx="25" cy="20" r="3" fill="rgba(255,255,255,0.4)" />
            <rect x="12" y="30" width="26" height="2" fill="rgba(255,255,255,0.3)" />
            <rect x="12" y="40" width="26" height="2" fill="rgba(255,255,255,0.3)" />
            <rect x="12" y="50" width="26" height="2" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>
      ))}

      {/* Geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`shape-${i}`}
          className={`geometric-shape shape-${(i % 4) + 1}`}
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      {/* Pulsing background waves */}
      <div className="pulse-wave wave-1" />
      <div className="pulse-wave wave-2" />
      <div className="pulse-wave wave-3" />
    </div>
  )
}
