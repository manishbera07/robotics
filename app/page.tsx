"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import { BootSequence } from "@/components/boot-sequence"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"

// Dynamic imports for better code splitting and performance
const MissionGrid = dynamic(() => import("@/components/mission-grid").then(mod => ({ default: mod.MissionGrid })), {
  loading: () => <div className="min-h-screen" />,
})
const ParticleNetwork = dynamic(() => import("@/components/particle-network").then(mod => ({ default: mod.ParticleNetwork })), {
  ssr: false,
})
const RobotWatcher = dynamic(() => import("@/components/robot-watcher").then(mod => ({ default: mod.RobotWatcher })), {
  ssr: false,
})
const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })))
const ScrollIndicator = dynamic(() => import("@/components/scroll-indicator").then(mod => ({ default: mod.ScrollIndicator })), {
  ssr: false,
})

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)

  const handleBootComplete = useCallback(() => {
    setIsBooting(false)
  }, [])

  return (
    <>
      {isBooting && <BootSequence onComplete={handleBootComplete} />}
      {!isBooting && (
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Background effects */}
          <div className="noise-overlay" />
          <div className="scan-line" />
          <Suspense fallback={null}>
            <ParticleNetwork />
            <ScrollIndicator />
          </Suspense>

          {/* Content */}
          <Navbar />
          <main className="relative z-10">
            <HeroSection />
            <Suspense fallback={<div className="min-h-screen" />}>
              <MissionGrid />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
            <RobotWatcher />
          </Suspense>
        </div>
      )}
    </>
  )
}
