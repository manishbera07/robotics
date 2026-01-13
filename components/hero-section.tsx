"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "./theme-provider"
import { Zap, ChevronDown } from "lucide-react"
import Link from "next/link"

const targetText = "BUILDING THE FUTURE"
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"

export const HeroSection = memo(function HeroSection() {
  const { theme, accentColor, secondaryColor } = useTheme()
  const [displayText, setDisplayText] = useState("")
  const [isDecoding, setIsDecoding] = useState(true)
  const { scrollY } = useScroll()

  const decodeText = useCallback(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (index < iteration) return targetText[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iteration >= targetText.length) {
        setIsDecoding(false)
        clearInterval(interval)
      }

      iteration += 0.5
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cleanup = decodeText()
    return cleanup
  }, [decodeText])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      {/* Animated gradient orbs with parallax - Optimized */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ 
          background: accentColor,
          y: useTransform(scrollY, [0, 300], [0, 50]),
          willChange: 'transform'
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ 
          background: secondaryColor,
          y: useTransform(scrollY, [0, 300], [0, -50]),
          willChange: 'transform'
        }}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
        
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full glass mb-6 sm:mb-8 mt-8 sm:mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.25 }}
          >
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: secondaryColor }} />
            <span className="text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider opacity-90">
              Heritage Institute of Technology
            </span>
          </motion.div>

          {/* Main headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-4 px-2"
            style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
          >
            {displayText}
            {isDecoding && (
              <motion.span
                className="inline-block w-1 sm:w-1.5 md:w-2 h-8 sm:h-10 md:h-16 lg:h-20 ml-1 sm:ml-2 align-middle"
                style={{ backgroundColor: secondaryColor }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
          </h1>

          {/* Subtitle */}
          <motion.h2
            className="text-base sm:text-lg md:text-2xl lg:text-3xl font-light tracking-wide mb-6 opacity-80 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.15 }}
          >
            at Heritage Institute of Technology, Kolkata
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xs sm:text-sm md:text-base opacity-50 mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2 }}
          >
            The Official Robotics & Automation Hub of Heritage Institute of Technology, Kolkata. Where innovation meets
            engineering excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link href="/events" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-widest overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                  color: "#030303",
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${accentColor}50` }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3 justify-center font-bold">
                  <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                  EXPLORE EVENTS
                </span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </Link>

            <Link href="/auth/sign-up" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-widest glass glass-hover"
                style={{ color: accentColor, border: `1px solid ${accentColor}30` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN THE CLUB
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats removed per request */}

          {/* Scroll indicator removed per request */}
        </motion.div>
      </div>
    </section>
  )
})
