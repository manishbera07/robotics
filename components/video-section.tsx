"use client"

import { motion, useInView } from "framer-motion"
import { useRef, memo } from "react"
import { useTheme } from "./theme-provider"
import { Play } from "lucide-react"

export const VideoSection = memo(function VideoSection() {
  const { accentColor, secondaryColor } = useTheme()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  return (
    <section className="relative py-20 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Stats removed per request */}

        <motion.div
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Robots Have Feelings Too
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the emotional side of robotics — where technology harmonizes with nature and machines care for our environment
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden glass border border-border/50"
          style={{
            boxShadow: isInView ? `0 0 80px ${accentColor}30` : "none",
          }}
        >
          {/* Video Container */}
          <div className="relative aspect-video overflow-hidden">
            {/* Native video element with controls */}
            <video
              className="w-full h-full object-cover"
              playsInline
              controls
              preload="metadata"
            >
              <source src="/videos/robot-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Overlay decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${secondaryColor}, transparent)`,
                }}
              />
            </div>
          </div>

          {/* Optional: YouTube/Vimeo Embed Alternative */}
          {/* Uncomment below and comment out the video element above if you want to use YouTube/Vimeo */}
          {/*
          <div className="relative aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Robotics Club Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          */}
        </motion.div>
      </div>
    </section>
  )
})
