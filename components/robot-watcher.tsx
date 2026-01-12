"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"

// Throttle helper for performance
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const RobotWatcher = memo(function RobotWatcher() {
  const { accentColor, secondaryColor } = useTheme()
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)

  const handleMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      const robotX = typeof window !== "undefined" ? window.innerWidth - 60 : 0
      const robotY = typeof window !== "undefined" ? window.innerHeight - 80 : 0
      const deltaX = e.clientX - robotX
      const deltaY = e.clientY - robotY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const maxMove = 4

      if (distance > 0) {
        setEyePosition({
          x: (deltaX / distance) * Math.min(maxMove, distance / 50),
          y: (deltaY / distance) * Math.min(maxMove, distance / 50),
        })
      }
    }, 50),
    [],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as any)
    return () => window.removeEventListener("mousemove", handleMouseMove as any)
  }, [handleMouseMove])

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      },
      3000 + Math.random() * 2000,
    )

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 cursor-pointer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
            {/* Glow effect */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Antenna */}
            <motion.line x1="35" y1="8" x2="35" y2="18" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
            <motion.circle
              cx="35"
              cy="6"
              r="4"
              fill={secondaryColor}
              filter="url(#glow)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Head */}
            <rect
              x="12"
              y="18"
              width="46"
              height="40"
              rx="10"
              fill="transparent"
              stroke={accentColor}
              strokeWidth="2"
            />

            {/* Face plate */}
            <rect
              x="17"
              y="23"
              width="36"
              height="30"
              rx="6"
              fill={`${accentColor}08`}
              stroke={`${accentColor}30`}
              strokeWidth="1"
            />

            {/* Eyes */}
            <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
              {/* Left eye */}
              <circle cx="27" cy="38" r="7" fill={`${secondaryColor}20`} stroke={secondaryColor} strokeWidth="1" />
              <motion.circle
                cx="27"
                cy="38"
                r={isBlinking ? 1 : 4}
                fill={secondaryColor}
                filter="url(#glow)"
                animate={isBlinking ? {} : { scale: [1, 0.9, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Right eye */}
              <circle cx="43" cy="38" r="7" fill={`${secondaryColor}20`} stroke={secondaryColor} strokeWidth="1" />
              <motion.circle
                cx="43"
                cy="38"
                r={isBlinking ? 1 : 4}
                fill={secondaryColor}
                filter="url(#glow)"
                animate={isBlinking ? {} : { scale: [1, 0.9, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
              />
            </g>

            {/* Mouth */}
            <motion.rect
              x="28"
              y="48"
              width="14"
              height="2"
              rx="1"
              fill={accentColor}
              animate={{ width: [14, 10, 14] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Neck */}
            <rect x="30" y="58" width="10" height="6" fill={`${accentColor}30`} />

            {/* Body */}
            <rect x="18" y="64" width="34" height="20" rx="6" fill="transparent" stroke={accentColor} strokeWidth="2" />

            {/* Body lights */}
            <motion.circle
              cx="28"
              cy="74"
              r="3"
              fill={secondaryColor}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.circle
              cx="42"
              cy="74"
              r="3"
              fill={accentColor}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg glass text-xs whitespace-nowrap opacity-0 pointer-events-none"
        style={{ color: accentColor }}
        whileHover={{ opacity: 1 }}
      >
        Hi, I&apos;m Chip!
      </motion.div>
    </motion.div>
  )
})
