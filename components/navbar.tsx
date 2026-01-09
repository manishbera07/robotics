"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./theme-provider"
import { Monitor, Moon, Calendar, ShoppingBag, Gamepad2, Fingerprint, Menu, X, Users, Images } from "lucide-react"
import { UserMenu } from "./user-menu"
import Link from "next/link"

export function Navbar() {
  const { theme, toggleTheme, accentColor } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { icon: <Calendar size={16} />, label: "EVENTS", href: "/events" },
    { icon: <ShoppingBag size={16} />, label: "MERCH", href: "/merch" },
    { icon: <Images size={16} />, label: "GALLERY", href: "/gallery" },
    { icon: <Users size={16} />, label: "TEAM", href: "/team" },
    { icon: <Gamepad2 size={16} />, label: "ARCADE", href: "/arcade" },
  ]

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/Logo Symbol_Robotics Club HITK.png"
                  alt="Robotics Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-wider opacity-60">Robotics Club</p>
                <p className="text-sm font-bold tracking-wide" style={{ color: accentColor }}>
                  Heritage Institute of Technology, Kolkata
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm uppercase tracking-wide glass glass-hover"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div animate={{ rotate: theme === "cyber" ? 0 : 180 }} transition={{ duration: 0.3 }}>
                {theme === "cyber" ? <Monitor size={16} /> : <Moon size={16} />}
              </motion.div>
              <span>{theme === "cyber" ? "CYBER" : "STEALTH"}</span>
            </motion.button>

            {navItems.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                accentColor={accentColor}
              />
            ))}

            <UserMenu accentColor={accentColor} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass"
              style={{ color: accentColor }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "cyber" ? <Monitor size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass"
              style={{ color: accentColor }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-4 right-4 glass rounded-2xl p-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl glass-hover"
                      style={{ color: accentColor }}
                    >
                      {item.icon}
                      <span className="text-sm uppercase tracking-wide">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <div className="mt-2">
                    <UserMenu accentColor={accentColor} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({
  icon,
  label,
  href,
  accentColor,
}: {
  icon: React.ReactNode
  label: string
  href: string
  accentColor: string
}) {
  return (
    <Link href={href}>
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm uppercase tracking-wide glass glass-hover"
        style={{ color: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        <span>{label}</span>
      </motion.div>
    </Link>
  )
}
