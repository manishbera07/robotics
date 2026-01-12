"use client"

import { useEffect, useRef, useCallback, memo } from "react"
import { useTheme } from "./theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

// Throttle helper
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const ParticleNetwork = memo(function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { accentColor, secondaryColor } = useTheme()

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return null

    let particles: Particle[] = []
    let animationId: number
    let lastTime = performance.now()

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      // Reduce particle count for better performance
      const particleCount = Math.floor((canvas.width * canvas.height) / 30000)
      particles = []
      for (let i = 0; i < Math.min(particleCount, 50); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const draw = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime
      
      // Limit frame rate to 60fps for consistent performance
      if (deltaTime < 16) {
        animationId = requestAnimationFrame(draw)
        return
      }
      
      lastTime = currentTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Mouse interaction - simplified
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx -= (dx / dist) * force * 0.015
          p.vy -= (dy / dist) * force * 0.015
        }

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Boundary check with smooth wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Apply friction
        p.vx *= 0.99
        p.vy *= 0.99

        // Draw particle - simplified for performance
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = accentColor
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1

        // Draw connections - optimized
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.2
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = secondaryColor
            ctx.globalAlpha = opacity
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }, 50)

    resize()
    draw()

    window.addEventListener("resize", throttle(resize, 250))
    window.addEventListener("mousemove", handleMouseMove as any)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove as any)
      cancelAnimationFrame(animationId)
    }
  }, [accentColor, secondaryColor])

  useEffect(() => {
    const cleanup = animate()
    return () => cleanup?.()
  }, [animate])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: 'transform' }} />
})
