"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { Mail, ArrowRight, KeyRound } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
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
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
              instructions to reset your password.
            </p>
            <Link href="/auth/login">
              <motion.button
                className="px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: accentColor, color: "#030303" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
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

        {/* Reset Password Card */}
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `${secondaryColor}15` }}
            >
              <KeyRound size={32} style={{ color: secondaryColor }} />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
              Forgot Password?
            </h1>
            <p className="text-sm opacity-50">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
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
              {isLoading ? "SENDING..." : "SEND RESET LINK"}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm opacity-50">
              Remember your password?{" "}
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
