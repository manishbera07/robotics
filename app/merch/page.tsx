"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { ShoppingBag, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  image_url: string | null
  available: boolean
  display_order: number
}

export default function MerchPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("merchandise")
          .select("*")
          .order("display_order", { ascending: true })

        if (error) {
          console.error("Supabase error fetching products:", error.message, error.details)
          throw error
        }
        setProducts(data || [])
      } catch (err: any) {
        console.error("Error fetching products:", err?.message || err)
        setProducts([])
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
              style={{ color: secondaryColor }}
            >
              <ShoppingBag size={16} />
              The Armory
            </motion.div>

            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
            >
              OFFICIAL MERCH
            </h1>

            <p className="text-sm md:text-base opacity-50 max-w-xl mx-auto">
              Exclusive merchandise from the Robotics Club of Heritage Institute of Technology, Kolkata. Hoodies,
              t-shirts, caps, and limited edition gear.
            </p>
          </motion.div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="text-center py-20">
              <p className="text-lg opacity-60">Loading merchandise...</p>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              className="glass rounded-3xl p-8 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accentColor}30, ${secondaryColor}30)` }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <ShoppingBag size={40} style={{ color: accentColor }} />
              </motion.div>

              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                COMING SOON
              </h2>

              <p className="text-sm opacity-60 max-w-md mx-auto mb-6">
                Official merchandise from the Robotics Club of Heritage Institute of Technology, Kolkata is on its way.
                Hoodies, t-shirts, caps, and exclusive limited edition gear.
              </p>

              {/* Preview Categories */}
              <motion.div className="grid grid-cols-3 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {["Hoodies", "T-Shirts", "Accessories"].map((item, index) => (
                  <motion.div
                    key={item}
                    className="glass rounded-2xl p-4 aspect-square flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${accentColor}20` }}
                    >
                      <ShoppingBag size={24} style={{ color: accentColor }} />
                    </div>
                    <p className="text-xs uppercase tracking-wider opacity-70">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="glass rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                  ) : (
                    <motion.div
                      className="w-full h-48 flex items-center justify-center"
                      style={{ background: `${accentColor}20` }}
                    >
                      <ShoppingBag size={40} style={{ color: accentColor }} className="opacity-50" />
                    </motion.div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1" style={{ color: accentColor }}>
                          {product.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wider" style={{ color: secondaryColor }}>
                          {product.category}
                        </p>
                      </div>

                      {product.available ? (
                        <span
                          className="text-xs px-3 py-1 rounded-full font-bold"
                          style={{ background: `${accentColor}30`, color: accentColor }}
                        >
                          Available
                        </span>
                      ) : (
                        <span
                          className="text-xs px-3 py-1 rounded-full font-bold opacity-50"
                          style={{ color: accentColor }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {product.description && <p className="text-xs opacity-60 mb-4">{product.description}</p>}

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xl font-bold"
                        style={{ color: accentColor }}
                      >
                        ₹{product.price}
                      </span>

                      <motion.button
                        disabled={!product.available}
                        className="px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold disabled:opacity-50"
                        style={{
                          background: product.available
                            ? `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`
                            : `${accentColor}20`,
                          color: product.available ? "#030303" : accentColor,
                        }}
                        whileHover={{ scale: product.available ? 1.05 : 1 }}
                        whileTap={{ scale: product.available ? 0.95 : 1 }}
                      >
                        {product.available ? "Get Now" : "Unavailable"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <Link href="/">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-sm mx-auto"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={18} />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
