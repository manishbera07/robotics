"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { Gamepad2, Trophy, ArrowLeft } from "lucide-react"

// Game Components
import { MemoryMatrix } from "@/components/games/memory-matrix"
import { ReactionTest } from "@/components/games/reaction-test"
import { PatternPulse } from "@/components/games/pattern-pulse"
import { BinaryBreaker } from "@/components/games/binary-breaker"

type GameType = "menu" | "memory-matrix" | "reaction-test" | "pattern-pulse" | "binary-breaker"

const games = [
  {
    id: "memory-matrix" as GameType,
    name: "Memory Matrix",
    description: "Remember and recreate the pattern. Test your visual memory with increasing difficulty.",
    icon: "🧠",
    color: "#00ff88",
    difficulty: "Medium",
  },
  {
    id: "reaction-test" as GameType,
    name: "Reaction Test",
    description: "Test your reflexes! Click as fast as possible when the screen turns green.",
    icon: "⚡",
    color: "#ffaa00",
    difficulty: "Easy",
  },
  {
    id: "pattern-pulse" as GameType,
    name: "Pattern Pulse",
    description: "Follow the sequence of lights and sounds. How long can you remember?",
    icon: "🎵",
    color: "#ff4488",
    difficulty: "Hard",
  },
  {
    id: "binary-breaker" as GameType,
    name: "Binary Breaker",
    description: "Convert decimal numbers to binary before time runs out. Perfect for coders!",
    icon: "💻",
    color: "#44aaff",
    difficulty: "Expert",
  },
]

export default function ArcadePage() {
  const { accentColor, secondaryColor } = useTheme()
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [highScores, setHighScores] = useState<Record<string, number>>({})

  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('gameHighScores')
    if (savedScores) {
      try {
        setHighScores(JSON.parse(savedScores))
      } catch (e) {
        console.error('Error loading high scores:', e)
      }
    }
  }, [])

  const updateHighScore = (gameId: string, score: number) => {
    setHighScores((prev) => {
      const newScores = {
        ...prev,
        [gameId]: Math.max(prev[gameId] || 0, score),
      }
      localStorage.setItem('gameHighScores', JSON.stringify(newScores))
      return newScores
    })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {currentGame === "menu" ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Gamepad2 size={16} style={{ color: secondaryColor }} />
                    <span style={{ color: secondaryColor }}>Neural Training Center</span>
                  </motion.div>

                  <h1
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                    style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
                  >
                    THE ARCADE
                  </h1>

                  <p className="text-sm md:text-base opacity-50 max-w-xl mx-auto">
                    Train your cognitive abilities with these neural enhancement games from the Robotics Club of
                    Heritage Institute of Technology, Kolkata.
                  </p>
                </div>

                {/* Games Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      className="group glass rounded-3xl p-6 cursor-pointer overflow-hidden relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentGame(game.id)}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle at center, ${game.color}, transparent 70%)` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                            style={{ background: `${game.color}20` }}
                          >
                            {game.icon}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className="px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                              style={{ background: `${game.color}20`, color: game.color }}
                            >
                              {game.difficulty}
                            </span>
                            {highScores[game.id] && (
                              <span className="flex items-center gap-1 text-xs opacity-60">
                                <Trophy size={12} />
                                {highScores[game.id]}
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-2" style={{ color: game.color }}>
                          {game.name}
                        </h2>

                        <p className="text-sm opacity-60 leading-relaxed">{game.description}</p>

                        <motion.div
                          className="mt-4 flex items-center gap-2 text-sm font-medium"
                          style={{ color: game.color }}
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                        >
                          Play Now
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`game-${currentGame}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Back Button */}
                <motion.button
                  onClick={() => setCurrentGame("menu")}
                  className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl glass"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} />
                  Back to Menu
                </motion.button>

                {/* Game Container */}
                <motion.div
                  className="glass rounded-3xl p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {currentGame === "memory-matrix" && (
                    <MemoryMatrix
                      onScore={(score) => updateHighScore(currentGame, score)}
                      currentHighScore={highScores[currentGame] || 0}
                    />
                  )}
                  {currentGame === "reaction-test" && (
                    <ReactionTest
                      onScore={(score) => updateHighScore(currentGame, score)}
                      currentHighScore={highScores[currentGame] || 0}
                    />
                  )}
                  {currentGame === "pattern-pulse" && (
                    <PatternPulse
                      onScore={(score) => updateHighScore(currentGame, score)}
                      currentHighScore={highScores[currentGame] || 0}
                    />
                  )}
                  {currentGame === "binary-breaker" && (
                    <BinaryBreaker
                      onScore={(score) => updateHighScore(currentGame, score)}
                      currentHighScore={highScores[currentGame] || 0}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
