"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionConfig } from "framer-motion"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} reducedMotion="user">
      <ThemeProvider>{children}</ThemeProvider>
    </MotionConfig>
  )
}
