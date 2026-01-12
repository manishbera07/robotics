"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { checkEventAchievements } from "@/lib/user-stats"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  image_url: string
  event_type: string
  registration_url: string
}

export default function EventsPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      fetchRegisteredEvents(user.id)
    }
  }

  const fetchRegisteredEvents = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', userId)
      
      if (error) throw error
      const eventIds = new Set(data?.map(r => r.event_id) || [])
      setRegisteredEvents(eventIds)
    } catch (err) {
      console.error('Error fetching registered events:', err)
    }
  }

  const handleRegister = async (eventId: string) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login'
      return
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{ 
          user_id: user.id, 
          event_id: eventId,
          college_id: user.user_metadata?.college_id || null
        }])
      
      if (error) {
        if (error.code === '23505') {
          alert('You are already registered for this event!')
        } else {
          throw error
        }
      } else {
        setRegisteredEvents(prev => new Set([...prev, eventId]))
        alert('Successfully registered for the event!')
      }
    } catch (err) {
      console.error('Error registering for event:', err)
      alert('Failed to register. Please try again.')
    }
  }

  const fetchEvents = async () => {
    try {
      console.log("Fetching events from Supabase...")
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })

      if (error) {
        console.error("Supabase error fetching events:", error)
        throw error
      }
      console.log("Events fetched successfully:", data)
      setEvents(data || [])
    } catch (err: any) {
      console.error("Error fetching events:", err)
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4 min-h-[80vh]">
        <div className="max-w-6xl mx-auto">
          {/* Events Grid */}
          {eventsLoading ? (
            <div className="text-center py-20">
              <p className="text-lg opacity-60">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: `${accentColor}20`, border: `2px solid ${accentColor}40` }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${accentColor}30, ${secondaryColor}30)` }}
                >
                  <Calendar size={48} style={{ color: accentColor }} />
                </motion.div>
              </motion.div>

              <motion.span
                className="inline-block px-4 py-1 rounded-full glass text-xs uppercase tracking-widest mb-4"
                style={{ color: secondaryColor }}
              >
                Under Construction
              </motion.span>

              <h1
                className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                COMING SOON
              </h1>

              <p className="text-base md:text-lg opacity-60 mb-8 max-w-md mx-auto leading-relaxed">
                Our events calendar is being upgraded with new features. Workshops, competitions, and hackathons from
                the Robotics Club of Heritage Institute of Technology, Kolkata will be listed here.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {events.map((event, i) => {
                const eventDate = new Date(event.event_date)
                const now = new Date()
                const isEventEnded = eventDate < now
                const isRegistered = registeredEvents.has(event.id)
                
                return (
                <motion.div
                  key={event.id}
                  className="glass rounded-2xl overflow-hidden h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {event.image_url && (
                    <div className="relative">
                      <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                      {isEventEnded && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
                            Event Ended
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold flex-1">{event.title}</h3>
                      {event.event_type && (
                        <span
                          className="text-xs px-2 py-1 rounded-lg whitespace-nowrap ml-2"
                          style={{ background: `${accentColor}20`, color: accentColor }}
                        >
                          {event.event_type}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm opacity-60 mb-4 line-clamp-2">{event.description}</p>
                    )}

                    <div className="space-y-2 text-xs opacity-60 mb-4">
                      {event.event_date && (
                        <p>
                          📅{" "}
                          {new Date(event.event_date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                      {event.location && <p>📍 {event.location}</p>}
                    </div>

                    {!isEventEnded && (
                      <>
                        <motion.button
                          onClick={() => handleRegister(event.id)}
                          disabled={isRegistered}
                          className="w-full px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider"
                          style={{
                            background: isRegistered 
                              ? 'rgba(255,255,255,0.1)' 
                              : `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                            color: isRegistered ? '#888' : "#030303",
                            opacity: isRegistered ? 0.6 : 1,
                          }}
                          whileHover={isRegistered ? {} : { scale: 1.05 }}
                          whileTap={isRegistered ? {} : { scale: 0.95 }}
                        >
                          {isRegistered ? '✓ Registered' : 'Register Now →'}
                        </motion.button>
                        {event.registration_url && (
                          <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="mt-2 block">
                            <motion.button
                              className="w-full px-4 py-2 rounded-xl text-sm font-medium"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${accentColor}30`,
                                color: accentColor,
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              View Details →
                            </motion.button>
                          </a>
                        )}
                      </>
                    )}
                    {isEventEnded && (
                      <div className="text-center py-2 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-sm opacity-50">Registration closed</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )})}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
