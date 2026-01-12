"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { User, Mail, Calendar, MapPin, LogOut, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Event {
  id: string
  title: string
  event_date: string
  location: string
  description: string
  image_url?: string
}

interface Registration {
  id: string
  registered_at: string
  status: string
  events: Event
}

export default function ProfilePage() {
  const { accentColor, secondaryColor } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)

        // Get profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        setProfile(profileData)

        // Get event registrations with event details
        const { data: regsData } = await supabase
          .from("event_registrations")
          .select(`
            id,
            registered_at,
            status,
            events (
              id,
              title,
              event_date,
              location,
              description,
              image_url
            )
          `)
          .eq("user_id", currentUser.id)
          .eq("status", "confirmed")
          .order("registered_at", { ascending: false })

        // Filter out past events
        const now = new Date()
        const upcomingRegs = (regsData || []).filter((reg: any) => {
          const eventDate = new Date(reg.events.event_date)
          return eventDate >= now
        })

        setRegistrations(upcomingRegs as Registration[])
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Loader2 className="animate-spin" size={48} style={{ color: accentColor }} />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="glass rounded-3xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`, color: "#030303" }}
                >
                  {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {profile?.full_name || "User"}
                  </h1>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm opacity-60">
                      <Mail size={16} />
                      {user?.email}
                    </div>
                    <div className="flex gap-4 text-sm opacity-60">
                      <span>📚 {profile?.department || "Department not set"}</span>
                      <span>📅 {profile?.study_year || "Year not set"}</span>
                    </div>
                    {profile?.roll_number && (
                      <div className="text-sm opacity-60">
                        🎓 Roll: {profile.roll_number}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/profile/settings">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                    style={{ color: accentColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⚙️ Settings
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                  style={{ color: secondaryColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Registered Events */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={32} style={{ color: accentColor }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: accentColor }}>
                  My Registered Events
                </h2>
                <p className="text-sm opacity-50">Upcoming events you're registered for</p>
              </div>
            </div>

            {registrations.length === 0 ? (
              <motion.div
                className="glass rounded-2xl p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2 opacity-50">No Upcoming Events</h3>
                <p className="text-sm opacity-40 mb-6">You haven't registered for any events yet</p>
                <Link href="/events">
                  <motion.button
                    className="px-6 py-3 rounded-xl text-sm font-bold"
                    style={{ background: accentColor, color: "#030303" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Events
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {registrations.map((registration, index) => (
                  <motion.div
                    key={registration.id}
                    className="glass rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {registration.events.image_url && (
                      <div
                        className="h-40 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${registration.events.image_url})`,
                        }}
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3" style={{ color: accentColor }}>
                        {registration.events.title}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <Calendar size={16} />
                          {new Date(registration.events.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        {registration.events.location && (
                          <div className="flex items-center gap-2 text-sm opacity-70">
                            <MapPin size={16} />
                            {registration.events.location}
                          </div>
                        )}
                      </div>
                      <p className="text-sm opacity-60 line-clamp-2">{registration.events.description}</p>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs opacity-50">
                          Registered on {new Date(registration.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
