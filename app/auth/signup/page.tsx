"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [studyYear, setStudyYear] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (!department) {
      setError("Department is required")
      setIsLoading(false)
      return
    }

    if (!studyYear) {
      setError("Study year is required")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
          data: {
            full_name: fullName,
            department,
            study_year: studyYear,
            roll_number: rollNumber || null,
          },
        },
      })

      if (signUpError) throw signUpError
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="noise-overlay" />
        <ParticleNetwork />

        <motion.div
          className="relative z-10 w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="glass rounded-3xl p-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `${accentColor}20` }}
            >
              <Mail size={40} style={{ color: accentColor }} />
            </div>
            <h1 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
              Check Your Email
            </h1>
            <p className="text-sm opacity-70 mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link
              to verify your account.
            </p>
            <Link href="/auth/login">
              <motion.button
                className="px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: accentColor, color: "#030303" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="noise-overlay" />
      <ParticleNetwork />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link href="/">
          <motion.div className="flex items-center justify-center gap-3 mb-8" whileHover={{ scale: 1.02 }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                color: "#030303",
              }}
            >
              RC
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider opacity-60">Robotics Club</p>
              <p className="text-sm font-bold" style={{ color: accentColor }}>
                Heritage Institute, Kolkata
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Signup Card */}
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `${secondaryColor}15` }}
            >
              <UserPlus size={32} style={{ color: secondaryColor }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
              Create Account
            </h1>
            <p className="text-sm opacity-50">Join the Robotics Club community</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="EE">Electrical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>

            {/* Study Year */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Study Year</label>
              <select
                value={studyYear}
                onChange={(e) => setStudyYear(e.target.value)}
                className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
                required
              >
                <option value="">Select Study Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Roll Number */}
            <div>
              <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">College Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Your roll number"
                className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none"
                style={{ border: `1px solid ${accentColor}20` }}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                className="text-sm text-center py-3 rounded-xl"
                style={{ background: "rgba(255,68,68,0.1)", color: "#ff4444" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                color: "#030303",
                opacity: isLoading ? 0.7 : 1,
              }}
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm opacity-50">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4" style={{ color: accentColor }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
            Back to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
