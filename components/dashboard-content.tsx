"use client"

import type React from "react"
import type { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  UserIcon,
  Trophy,
  Calendar,
  ShoppingBag,
  LogOut,
  Settings,
  ChevronRight,
  Zap,
  Target,
  Clock,
  Home,
  Users,
  Gamepad2,
} from "lucide-react"

interface DashboardContentProps {
  user: User
}

interface GameScore {
  id: string
  game_name: string
  score: number
  time_taken?: number
  completed_at: string
}

interface LeaderboardEntry {
  user_id: string
  email: string
  game_name: string
  high_score: number
  total_plays: number
}

export function DashboardContent({ user }: DashboardContentProps) {
  const { accentColor, secondaryColor } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [gameScores, setGameScores] = useState<GameScore[]>([])
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({})
  const [scoresLoading, setScoresLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Profile"
  const gamesList = ["Memory Matrix", "Reaction Test", "Pattern Pulse", "Binary Breaker"]

  // Calculate XP based on activities
  const userXP = (gameScores.length * 10) + (registeredEvents.length * 50)
  const maxXP = 1000

  useEffect(() => {
    fetchRegisteredEvents()
    fetchGameScores()
    fetchLeaderboards()
  }, [])

  const fetchRegisteredEvents = async () => {
    try {
      const { data: regs, error: regsError } = await supabase
        .from('event_registrations')
        .select('id, registered_at, event_id')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false })

      if (regsError) {
        console.error('Error fetching registered events:', regsError?.message ?? regsError)
        setRegisteredEvents([])
        return
      }

      const eventIds = Array.from(new Set((regs ?? []).map((r: any) => r.event_id).filter(Boolean)))
      let eventsById: Record<string, any> = {}

      if (eventIds.length > 0) {
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, title, description, event_date, location, image_url, event_type')
          .in('id', eventIds)

        if (eventsError) {
          console.error('Error fetching events list:', eventsError?.message ?? eventsError)
        } else {
          eventsById = (events ?? []).reduce((acc: any, ev: any) => {
            acc[ev.id] = ev
            return acc
          }, {})
        }
      }

      const combined = (regs ?? []).map((reg: any) => ({
        ...reg,
        events: eventsById[reg.event_id] ?? null,
      }))

      const now = new Date()
      const upcomingEvents = combined.filter((reg: any) => {
        const dateStr = reg.events?.event_date
        if (!dateStr) return false
        const eventDate = new Date(dateStr)
        return eventDate >= now
      })

      setRegisteredEvents(upcomingEvents)
    } catch (err: any) {
      console.error('Error fetching registered events:', err?.message ?? err)
      setRegisteredEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  const fetchGameScores = async () => {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('score', { ascending: false })
        .order('completed_at', { ascending: false })

      if (error) {
        console.error('Error fetching game scores:', error)
        // If table doesn't exist, just set empty array
        setGameScores([])
        return
      }
      setGameScores(data || [])
    } catch (err) {
      console.error('Error fetching game scores:', err)
      setGameScores([])
    } finally {
      setScoresLoading(false)
    }
  }

  const fetchLeaderboards = async () => {
    try {
      const leaderboardData: Record<string, LeaderboardEntry[]> = {}

      for (const game of gamesList) {
        const { data, error } = await supabase
          .from('game_scores')
          .select('user_id, game_name, score, completed_at')
          .eq('game_name', game)
          .order('score', { ascending: false })
          .limit(5)

        if (error) throw error

        // Process data to get unique users with their high scores
        const uniqueUsers: Record<string, any> = {}
        data?.forEach((score: any) => {
          if (!uniqueUsers[score.user_id]) {
            uniqueUsers[score.user_id] = {
              user_id: score.user_id,
              high_score: score.score,
              total_plays: 1,
            }
          }
        })

        // Fetch user emails
        const userIds = Object.keys(uniqueUsers)
        if (userIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('user_profiles')
            .select('id, email')
            .in('id', userIds)
            .catch(() => ({ data: null }))

          if (profiles) {
            userIds.forEach((userId: string) => {
              const profile = profiles.find((p: any) => p.id === userId)
              if (profile) {
                uniqueUsers[userId].email = profile.email
              } else {
                // Fallback: get from auth
                uniqueUsers[userId].email = `User ${userId.slice(0, 8)}`
              }
            })
          }
        }

        leaderboardData[game] = Object.values(uniqueUsers).slice(0, 5) as LeaderboardEntry[]
      }

      setLeaderboards(leaderboardData)
    } catch (err) {
      console.error('Error fetching leaderboards:', err)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wider opacity-50 mb-1">Welcome back,</p>
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
                >
                  {userName}
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                    style={{ color: accentColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home size={18} />
                    <span className="text-sm">Home</span>
                  </motion.button>
                </Link>
                <Link href="/dashboard/settings">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                    style={{ color: accentColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: "rgba(255,68,68,0.1)", color: "#ff4444" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span className="text-sm">{isLoggingOut ? "..." : "Logout"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Link href="/events">
              <motion.div className="glass rounded-2xl p-4 cursor-pointer" whileHover={{ scale: 1.02, y: -2 }}>
                <Calendar size={24} style={{ color: accentColor }} className="mb-2" />
                <p className="font-medium" style={{ color: accentColor }}>
                  Events
                </p>
                <p className="text-xs opacity-50">View upcoming</p>
              </motion.div>
            </Link>
            <Link href="/merch">
              <motion.div className="glass rounded-2xl p-4 cursor-pointer" whileHover={{ scale: 1.02, y: -2 }}>
                <ShoppingBag size={24} style={{ color: secondaryColor }} className="mb-2" />
                <p className="font-medium" style={{ color: secondaryColor }}>
                  Merch
                </p>
                <p className="text-xs opacity-50">Shop gear</p>
              </motion.div>
            </Link>
            <Link href="/arcade">
              <motion.div className="glass rounded-2xl p-4 cursor-pointer" whileHover={{ scale: 1.02, y: -2 }}>
                <Gamepad2 size={24} style={{ color: accentColor }} className="mb-2" />
                <p className="font-medium" style={{ color: accentColor }}>
                  Arcade
                </p>
                <p className="text-xs opacity-50">Play games</p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard icon={<Gamepad2 size={24} />} label="Games Played" value={gameScores.length} color={accentColor} />
            <StatCard 
              icon={<Trophy size={24} />} 
              label="Highest Score" 
              value={gameScores.length > 0 ? Math.max(...gameScores.map(g => g.score)) : 0} 
              color={secondaryColor} 
            />
            <StatCard icon={<Calendar size={24} />} label="Events Joined" value={registeredEvents.length} color={accentColor} />
            <StatCard icon={<Target size={24} />} label="Unique Games" value={new Set(gameScores.map(g => g.game_name)).size} color={secondaryColor} />
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <motion.div
              className="glass rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${accentColor}20` }}
                >
                  <UserIcon size={32} style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: accentColor }}>
                    Profile
                  </h2>
                  <p className="text-sm opacity-50">{user.email}</p>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider opacity-50 flex items-center gap-2">
                    <Trophy size={14} style={{ color: secondaryColor }} />
                    Participation Credits
                  </span>
                  <span className="text-sm" style={{ color: accentColor }}>
                    {userXP} / {maxXP} XP
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(userXP / maxXP) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs opacity-40 mt-2">{maxXP - userXP} XP until next rank</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-bold" style={{ color: accentColor }}>
                    {registeredEvents.length}
                  </p>
                  <p className="text-xs opacity-50">Events</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                    {gameScores.length}
                  </p>
                  <p className="text-xs opacity-50">Games Played</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-bold" style={{ color: accentColor }}>
                    {gameScores.length > 0 ? Math.max(...gameScores.map(g => g.score)) : 0}
                  </p>
                  <p className="text-xs opacity-50">High Score</p>
                </div>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              className="glass rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: accentColor }}>
                  <Clock size={20} />
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { action: "Joined the club", time: "2 days ago", icon: Users },
                  { action: "Played Memory Matrix", time: "1 day ago", icon: Gamepad2 },
                  { action: "Updated profile", time: "5 hours ago", icon: Settings },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${accentColor}15` }}
                    >
                      <activity.icon size={18} style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs opacity-50">{activity.time}</p>
                    </div>
                    <ChevronRight size={16} className="opacity-30" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Registered Events Section */}
          <motion.div
            className="glass rounded-3xl p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: accentColor }}>
                <Calendar size={20} />
                My Registered Events
              </h2>
              <Link href="/events">
                <motion.button
                  className="text-sm px-4 py-2 rounded-xl"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Events
                </motion.button>
              </Link>
            </div>

            {eventsLoading ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-sm">Loading events...</p>
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm opacity-50 mb-4">You haven't registered for any events yet</p>
                <Link href="/events">
                  <motion.button
                    className="px-6 py-3 rounded-xl text-sm font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                      color: "#030303",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Events
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {registeredEvents.slice(0, 4).map((registration: any, index: number) => {
                  const event = registration.events
                  return (
                    <motion.div
                      key={registration.id}
                      className="p-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex gap-4">
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-sm line-clamp-1">{event.title}</h3>
                            {event.event_type && (
                              <span
                                className="text-xs px-2 py-1 rounded-lg whitespace-nowrap ml-2"
                                style={{ background: `${accentColor}20`, color: accentColor }}
                              >
                                {event.event_type}
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-60 mb-2">
                            📅{" "}
                            {new Date(event.event_date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {event.location && (
                            <p className="text-xs opacity-60">📍 {event.location}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Game Scores Section */}
          <motion.div
            className="glass rounded-3xl p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: accentColor }}>
                <Gamepad2 size={20} />
                My Game Scores
              </h2>
              <Link href="/arcade">
                <motion.button
                  className="text-sm px-4 py-2 rounded-xl"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Games
                </motion.button>
              </Link>
            </div>

            {scoresLoading ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-sm">Loading scores...</p>
              </div>
            ) : gameScores.length === 0 ? (
              <div className="text-center py-8">
                <Gamepad2 size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm opacity-50 mb-4">No game scores yet. Start playing to earn points!</p>
                <Link href="/arcade">
                  <motion.button
                    className="px-6 py-3 rounded-xl text-sm font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                      color: "#030303",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Arcade Games
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {gameScores.slice(0, 6).map((score, index) => (
                  <motion.div
                    key={score.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                        style={{ background: `${accentColor}20`, color: accentColor }}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{score.game_name}</p>
                        <p className="text-xs opacity-50">
                          {new Date(score.completed_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                        {score.score}
                      </p>
                      <p className="text-xs opacity-50">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leaderboards Section */}
          {!scoresLoading && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6" style={{ color: accentColor, fontFamily: "var(--font-orbitron)" }}>
                <Trophy size={24} />
                Game Leaderboards
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {gamesList.map((game, gameIndex) => (
                  <motion.div
                    key={game}
                    className="glass rounded-3xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + gameIndex * 0.05 }}
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: secondaryColor }}>
                      {game}
                    </h3>

                    {leaderboards[game]?.length === 0 ? (
                      <div className="text-center py-6 opacity-50">
                        <p className="text-sm">No scores yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {leaderboards[game]?.slice(0, 5).map((entry, rank) => {
                          const isCurrentUser = entry.user_id === user.id
                          return (
                            <motion.div
                              key={entry.user_id}
                              className="flex items-center justify-between p-3 rounded-lg"
                              style={{
                                background: isCurrentUser ? `${accentColor}20` : "rgba(255,255,255,0.03)",
                                border: isCurrentUser ? `1px solid ${accentColor}40` : "none",
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + gameIndex * 0.05 + rank * 0.03 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{
                                    background: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : rank === 2 ? "#CD7F32" : `${accentColor}15`,
                                    color: rank < 3 ? "#030303" : accentColor,
                                  }}
                                >
                                  {rank + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{entry.email?.split("@")[0] || "Anonymous"}</p>
                                  <p className="text-xs opacity-50">{entry.total_plays} play{entry.total_plays !== 1 ? "s" : ""}</p>
                                </div>
                              </div>
                              <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                                {entry.high_score}
                              </p>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  color: string
}) {
  return (
    <motion.div className="glass rounded-2xl p-5" whileHover={{ scale: 1.02 }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="opacity-70" style={{ color }}>
          {icon}
        </div>
        <span className="text-xs uppercase tracking-wider opacity-50">{label}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </motion.div>
  )
}
