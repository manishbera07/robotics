import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Mono, Orbitron } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Robotics Club of Heritage Institute of Technology, Kolkata",
  description:
    "The Official Robotics & Automation Hub of Heritage Institute of Technology, Kolkata. Building the future, one robot at a time.",
  keywords: ["robotics", "heritage institute", "kolkata", "engineering", "automation", "technology"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#050505",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceMono.variable} ${orbitron.variable} font-mono antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
