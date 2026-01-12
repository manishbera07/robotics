"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Mail, Lock, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Form states
  const [fullName, setFullName] = useState("")
  const [department, setDepartment] = useState("")
  const [studyYear, setStudyYear] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [resetPassword, setResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)
        setResetEmail(currentUser.email || "")

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setFullName(profileData.full_name || "")
          setDepartment(profileData.department || "")
          setStudyYear(profileData.study_year || "")
          setRollNumber(profileData.roll_number || "")
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          department,
          study_year: studyYear,
          roll_number: rollNumber || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err instanceof Error ? err.message : "Failed to update profile" 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setMessage({ 
        type: "success", 
        text: "Password reset email sent! Check your inbox." 
      })
      setResetPassword(false)
      setTimeout(() => setMessage(null), 5000)
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err instanceof Error ? err.message : "Failed to send reset email" 
      })
    } finally {
      setResetLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <motion.div
          className="relative z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} style={{ color: accentColor }} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/profile">
              <motion.button
                className="p-2 rounded-lg glass"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={24} style={{ color: accentColor }} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
                Settings
              </h1>
              <p className="text-sm opacity-50">Manage your profile and security</p>
            </div>
          </motion.div>

          {/* Messages */}
          {message && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{ background: message.type === "success" ? "rgba(68,255,68,0.1)" : "rgba(255,68,68,0.1)" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p style={{ color: message.type === "success" ? "#44ff44" : "#ff4444" }}>
                {message.text}
              </p>
            </motion.div>
          )}

          {/* Profile Settings */}
          <motion.div
            className="glass rounded-3xl p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${accentColor}20` }}
              >
                <span className="text-lg">👤</span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: accentColor }}>
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter your department"
                  className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                />
              </div>

              {/* Study Year */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Study Year</label>
                <input
                  type="text"
                  value={studyYear}
                  onChange={(e) => setStudyYear(e.target.value)}
                  placeholder="Enter your study year"
                  className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">College Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Your roll number"
                  className="w-full px-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                />
              </div>

              {/* Save Button */}
              <motion.button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-6"
                style={{ background: accentColor, color: "#030303" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </motion.button>
            </form>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            className="glass rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${secondaryColor}20` }}
              >
                <Lock size={20} style={{ color: secondaryColor }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: secondaryColor }}>
                Security
              </h2>
            </div>

            {!resetPassword ? (
              <motion.button
                onClick={() => setResetPassword(true)}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{ background: `${secondaryColor}20`, color: secondaryColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Lock size={18} />
                Change Password
              </motion.button>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass text-sm focus:outline-none"
                      style={{ border: `1px solid ${secondaryColor}20` }}
                      required
                    />
                  </div>
                  <p className="text-xs opacity-50 mt-2">
                    We'll send a password reset link to this email address
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-3 rounded-xl font-bold"
                    style={{ background: secondaryColor, color: "#030303" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {resetLoading ? "Sending..." : "Send Reset Email"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setResetPassword(false)}
                    className="flex-1 py-3 rounded-xl font-bold glass"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
