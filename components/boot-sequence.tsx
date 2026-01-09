"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const bootMessages = [
  { text: "INITIALIZING ROBOTICS CLUB SYSTEMS...", delay: 0 },
  { text: "LOADING NEURAL CORE MATRIX...", delay: 400 },
  { text: "ESTABLISHING SECURE CONNECTION...", delay: 800 },
  { text: "HERITAGE INSTITUTE NETWORK DETECTED...", delay: 1200 },
  { text: "KOLKATA NODE ONLINE...", delay: 1600 },
  { text: "WELCOME, ENGINEER.", delay: 2000 },
]

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessages, setCurrentMessages] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    // Message reveal animation
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setCurrentMessages((prev) => [...prev, msg.text])
      }, msg.delay)
    })

    // Complete sequence
    const completeTimer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(onComplete, 500)
    }, 2800)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#030303" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245, 166, 35, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245, 166, 35, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative w-full max-w-2xl px-8">
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #f5a623, #00ff88)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(245, 166, 35, 0.3)",
                      "0 0 40px rgba(245, 166, 35, 0.5)",
                      "0 0 20px rgba(245, 166, 35, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <img
                    src="/Logo Symbol_Robotics Club HITK.png"
                    alt="Robotics Club Logo"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Terminal output */}
            <div className="mb-8 min-h-[180px]">
              {currentMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <span className="text-[#00ff88] text-sm">&gt;</span>
                  <span
                    className="text-sm tracking-wide"
                    style={{ color: index === currentMessages.length - 1 ? "#f5a623" : "#888888" }}
                  >
                    {msg}
                  </span>
                  {index === currentMessages.length - 1 && (
                    <motion.span
                      className="w-2 h-4 bg-[#f5a623]"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00ff88, #f5a623)",
                    width: `${progress}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#666666]">SYSTEM BOOT</span>
                <span className="text-xs" style={{ color: "#f5a623" }}>
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
