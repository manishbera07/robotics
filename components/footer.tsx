"use client"

import { motion, useInView } from "framer-motion"
import { useRef, memo } from "react"
import { useTheme } from "./theme-provider"
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export const Footer = memo(function Footer() {
  const { accentColor, secondaryColor } = useTheme()
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: false, amount: 0.3 })

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/robotics_hitk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/robotics-club-hitk/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:roboticsclub.hitk@gmail.com", label: "Email" },
  ]

  const quickLinks = [
    { label: "Events", href: "/events" },
    { label: "Merch", href: "/merch" },
    { label: "Arcade", href: "/arcade" },
    { label: "Login", href: "/auth/login" },
  ]

  return (
    <footer className="relative py-16 px-4 border-t border-border/50" ref={footerRef}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/Logo Symbol_Robotics Club HITK.png"
                  alt="Robotics Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold" style={{ color: accentColor }}>
                  Robotics Club
                </p>
                <p className="text-xs opacity-50">Heritage Institute of Technology, Kolkata</p>
              </div>
            </motion.div>
            <p className="text-sm opacity-50 leading-relaxed mb-6 max-w-sm">
              Building the future through robotics, automation, and innovation. Join us in shaping tomorrow&apos;s
              technology today.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.1, background: `${accentColor}20` }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 opacity-50">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: accentColor }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 opacity-50">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm opacity-70">
                <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: secondaryColor }} />
                <span>Heritage Institute of Technology, Chowbaga Road, Anandapur, Kolkata - 700107</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail size={16} style={{ color: secondaryColor }} />
                <span>roboticsclub.hitk@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} Robotics Club of Heritage Institute of Technology, Kolkata. All rights
            reserved.
          </p>
          <p className="text-xs opacity-40">Built with passion by the RC Tech Team</p>
        </motion.div>
      </div>
    </footer>
  )
})
