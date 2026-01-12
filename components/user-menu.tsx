"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Home, User as UserIcon, Users, LogOut } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface UserMenuProps {
  accentColor: string
}

export function UserMenu({ accentColor }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (event === "SIGNED_OUT") {
        router.push("/")
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    setSigningOut(false)
  }

  if (loading) {
    return (
      <div
        className="px-4 py-2 rounded-xl text-sm uppercase tracking-wide glass"
        style={{ color: accentColor }}
      >
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <Link href="/auth/login">
        <motion.button
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm uppercase tracking-wide ml-2"
          style={{
            background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
            border: `1px solid ${accentColor}50`,
            color: accentColor,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${accentColor}30` }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Login</span>
        </motion.button>
      </Link>
    )
  }

  const initial = user.email?.[0]?.toUpperCase() ?? "P"
  const display = user.user_metadata?.full_name || user.email || "Profile"

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm uppercase tracking-wide glass"
        style={{ color: accentColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
          style={{ background: `${accentColor}20` }}
        >
          {initial}
        </div>
        <span className="truncate max-w-[120px] text-left">{display}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 glass rounded-2xl p-2 z-50"
          >
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5">
                <Home size={16} />
                <span className="text-sm">Dashboard</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl mt-1"
              style={{ background: "rgba(255,68,68,0.1)", color: "#ff6666" }}
            >
              <LogOut size={16} />
              <span className="text-sm">{signingOut ? "Signing out..." : "Logout"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
