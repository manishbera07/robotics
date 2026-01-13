"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, memo } from "react"
import { useTheme } from "./theme-provider"
import { Calendar, ShoppingBag, Gamepad2, ArrowRight, Sparkles, Trophy, Users } from "lucide-react"
import Link from "next/link"

const missions = [
  {
    icon: Calendar,
    title: "UPCOMING EVENTS",
    description: "Workshops, hackathons, and competitions",
    statusColor: "#00ff88",
    button: "VIEW ALL EVENTS",
    href: "/events",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: ShoppingBag,
    title: "THE ARMORY",
    description: "Official club merchandise",
    highlight: "New Collection Available",
    status: "LIMITED STOCK",
    statusColor: "#f5a623",
    button: "SHOP NOW",
    href: "/merch",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Gamepad2,
    title: "NEURAL ARCADE",
    description: "Test your engineering skills",
    highlight: "Circuit Breaker Game",
    status: "PLAY NOW",
    statusColor: "#00ff88",
    button: "LAUNCH GAME",
    href: "/arcade",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
]

const features = [
  { icon: Sparkles, title: "Innovation Lab", description: "Access to cutting-edge tools and equipment" },
  { icon: Trophy, title: "Competitions", description: "National and international robotics championships" },
  { icon: Users, title: "Community", description: "Network with passionate engineers" },
]

export function MissionGrid() {
  const { accentColor, secondaryColor } = useTheme()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })

  return (
    <section className="relative py-16 sm:py-24 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            className="inline-block px-3 sm:px-4 py-1 rounded-full glass text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest mb-3 sm:mb-4"
            style={{ color: secondaryColor }}
          >
            Explore
          </motion.span>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 px-2"
            style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
          >
            MISSION CONTROL
          </h2>
          <p className="text-xs sm:text-sm md:text-base opacity-50 max-w-xl mx-auto px-4">
            Your gateway to events, merchandise, and interactive experiences at the Robotics Club of Heritage Institute
            of Technology, Kolkata.
          </p>
        </motion.div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {missions.map((mission, index) => (
            <MissionCard key={index} mission={mission} index={index} accentColor={accentColor} />
          ))}
        </div>

        {/* Features Row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 flex items-start gap-4"
              whileHover={{ scale: 1.02, borderColor: `${accentColor}30` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accentColor}15` }}
              >
                <feature.icon size={24} style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-bold mb-1" style={{ color: accentColor }}>
                  {feature.title}
                </h3>
                <p className="text-sm opacity-50">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const MissionCard = memo(function MissionCard({
  mission,
  index,
  accentColor,
}: {
  mission: (typeof missions)[0]
  index: number
  accentColor: string
}) {
  const Icon = mission.icon
  const cardRef = useRef(null)
  const isCardInView = useInView(cardRef, { once: false, amount: 0.3 })

  return (
    <Link href={mission.href}>
      <motion.div
        ref={cardRef}
        className="group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden glass cursor-pointer h-full"
        whileHover={{ scale: 1.03, y: -8, boxShadow: `0 20px 40px ${accentColor}25` }}
      >
        {/* Background gradient on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${mission.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: accentColor }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}20`,
            }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.2 }}
          >
            <Icon size={24} className="sm:w-7 sm:h-7" style={{ color: accentColor }} />
          </motion.div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
            {mission.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm opacity-50 mb-3 sm:mb-4">{mission.description}</p>

          {/* Button */}
          <motion.div
            className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            <span>{mission.button}</span>
            <motion.div className="group-hover:translate-x-2 transition-transform duration-200">
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
})
