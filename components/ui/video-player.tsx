"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react"

type VideoPlayerProps = {
  src: string
  poster?: string
  className?: string
}

export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [bufferedEnd, setBufferedEnd] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOverlayPlay, setShowOverlayPlay] = useState(true)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = () => setDuration(v.duration || 0)
    const onTime = () => {
      setCurrentTime(v.currentTime || 0)
      try {
        if (v.buffered && v.buffered.length > 0) {
          setBufferedEnd(v.buffered.end(v.buffered.length - 1))
        }
      } catch {}
    }
    const onPlay = () => {
      setIsPlaying(true)
      setShowOverlayPlay(false)
    }
    const onPause = () => setIsPlaying(false)
    const onVolume = () => {
      setVolume(v.volume)
      setIsMuted(v.muted)
    }

    v.addEventListener("loadedmetadata", onLoaded)
    v.addEventListener("timeupdate", onTime)
    v.addEventListener("progress", onTime)
    v.addEventListener("play", onPlay)
    v.addEventListener("pause", onPause)
    v.addEventListener("volumechange", onVolume)
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded)
      v.removeEventListener("timeupdate", onTime)
      v.removeEventListener("progress", onTime)
      v.removeEventListener("play", onPlay)
      v.removeEventListener("pause", onPause)
      v.removeEventListener("volumechange", onVolume)
    }
  }, [])

  // Autohide controls when playing
  useEffect(() => {
    let hideTimer: any
    const onMouseMove = () => {
      setShowControls(true)
      if (isPlaying) {
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => setShowControls(false), 2000)
      }
    }
    const el = containerRef.current
    if (!el) return
    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", () => isPlaying && setShowControls(false))
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
    }
  }, [isPlaying])

  // Keyboard shortcuts: space/k toggle, m mute, f fullscreen, arrows seek
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current
      if (!v) return
      if ([" ", "Spacebar", "k"].includes(e.key)) {
        e.preventDefault()
        togglePlay()
      } else if (e.key === "m") {
        e.preventDefault()
        toggleMute()
      } else if (e.key === "f") {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key === "ArrowRight") {
        v.currentTime = Math.min(v.currentTime + 5, duration)
      } else if (e.key === "ArrowLeft") {
        v.currentTime = Math.max(v.currentTime - 5, 0)
      }
    }
    const el = containerRef.current
    if (!el) return
    el.tabIndex = 0
    el.addEventListener("keydown", onKey)
    return () => el.removeEventListener("keydown", onKey)
  }, [duration])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }
  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }
  function onVolumeChange(val: number) {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = Math.max(0, Math.min(1, val))
    setVolume(v.volume)
    setIsMuted(false)
  }
  function onSeek(val: number) {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(0, Math.min(duration, val))
    setCurrentTime(v.currentTime)
  }
  function changeRate(rate: number) {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = rate
    setPlaybackRate(rate)
  }
  function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const bufferedPercent = duration ? (bufferedEnd / duration) * 100 : 0

  const formatTime = (t: number) => {
    if (!isFinite(t)) return "0:00"
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = Math.floor(t % 60)
    const mm = h > 0 ? String(m).padStart(2, "0") : String(m)
    const ss = String(s).padStart(2, "0")
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
  }

  return (
    <div ref={containerRef} className={`relative aspect-video overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
      />

      {/* Big center play overlay (YouTube style) */}
      {showOverlayPlay && (
        <button
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex items-center justify-center"
        >
          <span className="rounded-full bg-white/80 hover:bg-white shadow-lg p-6 transition">
            <Play className="w-8 h-8 text-black" />
          </span>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress */}
        <div className="px-4 pt-3">
          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <button aria-label="Play/Pause" onClick={togglePlay} className="p-2 rounded hover:bg-white/10">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <button aria-label="Mute" onClick={toggleMute} className="p-2 rounded hover:bg-white/10">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-24 accent-white"
              />
            </div>

            <div className="text-xs tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback rate quick toggles */}
            <div className="hidden md:flex items-center gap-1">
              {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                <button
                  key={r}
                  aria-label={`Rate ${r}x`}
                  onClick={() => changeRate(r)}
                  className={`px-2 py-1 rounded text-xs ${playbackRate === r ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  {r}x
                </button>
              ))}
            </div>

            <button aria-label="Settings" className="p-2 rounded hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </button>
            <button aria-label="Fullscreen" onClick={toggleFullscreen} className="p-2 rounded hover:bg-white/10">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
