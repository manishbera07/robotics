"use client"

import type React from "react"
import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTheme } from "./theme-provider"
import { Monitor, Moon, Calendar, ShoppingBag, Gamepad2, Menu, X, Users, Images, LogIn, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export const Navbar = memo(function Navbar() {
  const { theme, toggleTheme, accentColor } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { scrollY } = useScroll()
  const navBackground = useTransform(scrollY, [0, 50], ["rgba(3, 3, 3, 0)", "rgba(3, 3, 3, 0.8)"])

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4 backdrop-blur-md"
        style={{ background: navBackground }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto glass rounded-2xl px-3 py-2 md:px-6 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 md:gap-3 min-w-0"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src="/Logo Symbol_Robotics Club HITK.png"
                  alt="Robotics Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-wider opacity-70 sm:opacity-60 truncate">Robotics Club</p>
                <p className="text-xs sm:text-sm md:text-sm font-bold tracking-wide truncate" style={{ color: accentColor }}>
                  HITK
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-wrap justify-end">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm uppercase tracking-wide glass glass-hover whitespace-nowrap"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div animate={{ rotate: theme === "cyber" ? 0 : 180 }} transition={{ duration: 0.3 }}>
                {theme === "cyber" ? <Monitor size={16} /> : <Moon size={16} />}
              </motion.div>
              <span className="hidden lg:inline">{theme === "cyber" ? "CYBER" : "STEALTH"}</span>
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

            {/* Auth Buttons */}
            {user ? (
              <Link href="/profile">
                <motion.div
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm uppercase tracking-wide glass glass-hover whitespace-nowrap"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserIcon size={16} />
                  <span className="hidden sm:inline">PROFILE</span>
                </motion.div>
              </Link>
            ) : (
              <Link href="/auth/login">
                <motion.div
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm uppercase tracking-wide whitespace-nowrap"
                  style={{ background: accentColor, color: "#030303" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">LOGIN</span>
                </motion.div>
              </Link>
            )}
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
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                
                {/* Mobile Auth Button */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  {user ? (
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-hover" style={{ color: accentColor }}>
                        <UserIcon size={16} />
                        <span className="text-sm uppercase tracking-wide">PROFILE</span>
                      </div>
                    </Link>
                  ) : (
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: accentColor, color: "#030303" }}>
                        <LogIn size={16} />
                        <span className="text-sm uppercase tracking-wide font-bold">LOGIN</span>
                      </div>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

const NavLink = memo(function NavLink({
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
        className="flex items-center gap-1 px-2 lg:gap-2 lg:px-4 py-2 rounded-xl text-xs lg:text-sm uppercase tracking-wide glass glass-hover whitespace-nowrap"
        style={{ color: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={label}
      >
        {icon}
        <span className="hidden lg:inline">{label}</span>
      </motion.div>
    </Link>
  )
})
