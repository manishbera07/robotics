"use client"

import { motion, useScroll } from "framer-motion"
import { memo } from "react"

export const ScrollIndicator = memo(function ScrollIndicator() {
  const { scrollYProgress } = useScroll()

  return (
    <>
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-green-500 to-cyan-500 origin-left z-50"
        style={{ scaleX: scrollYProgress, willChange: 'transform' }}
      />

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full glass flex items-center justify-center"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          opacity: scrollYProgress,
          willChange: 'opacity, transform',
        }}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </>
  )
})
