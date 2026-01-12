"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const { accentColor } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        
        if (!code) {
          throw new Error("No authorization code received")
        }

        const supabase = createClient()

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          throw exchangeError
        }

        // Get current user to verify auth
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          throw new Error("Failed to authenticate user")
        }

        // Redirect to profile
        setTimeout(() => {
          router.push("/profile")
        }, 1500)
      } catch (err) {
        console.error("OAuth callback error:", err)
        setError(err instanceof Error ? err.message : "Authentication failed")
        setIsLoading(false)
        
        // Redirect to login after error
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

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
          {isLoading && !error ? (
            <>
              <motion.div
                className="flex justify-center mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={48} style={{ color: accentColor }} />
              </motion.div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
                Completing Sign In
              </h1>
              <p className="text-sm opacity-70">
                Authenticating with your provider...
              </p>
            </>
          ) : error ? (
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: `#ff4444` }}
              >
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: "#ff4444" }}>
                Authentication Failed
              </h1>
              <p className="text-sm opacity-70 mb-6">
                {error}
              </p>
              <p className="text-xs opacity-50">
                Redirecting to login...
              </p>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}
