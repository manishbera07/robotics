/*
 Crop black bars from a video using ffmpeg's cropdetect.
 Requires: ffmpeg-static
 Usage:
   pnpm add -D ffmpeg-static
   pnpm run video:crop
 Optional args:
   node scripts/crop-video.js --in public/videos/robot-video.mp4 --out public/videos/robot-video-cropped.mp4 --duration 20
*/

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const ffmpegPath = require('ffmpeg-static')

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--in') opts.input = args[++i]
    else if (a === '--out') opts.output = args[++i]
    else if (a === '--duration') opts.duration = Number(args[++i])
  }
  return opts
}

async function detectCrop(input, duration = 20) {
  return new Promise((resolve, reject) => {
    const args = ['-hide_banner', '-i', input, '-t', String(duration), '-vf', 'cropdetect=24:16:0', '-f', 'null', '-']
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    proc.stderr.on('data', (d) => {
      stderr += d.toString()
    })
    proc.on('error', reject)
    proc.on('close', (code) => {
      if (code !== 0) {
        // Even when ffmpeg exits non-zero, cropdetect data may be present.
      }
      const matches = [...stderr.matchAll(/crop=([0-9]+):([0-9]+):([0-9]+):([0-9]+)/g)]
      if (matches.length === 0) return resolve(null)
      const last = matches[matches.length - 1]
      const cropStr = `crop=${last[1]}:${last[2]}:${last[3]}:${last[4]}`
      resolve(cropStr)
    })
  })
}

async function applyCrop(input, output, cropFilter) {
  return new Promise((resolve, reject) => {
    const args = ['-y', '-hide_banner', '-i', input, '-vf', cropFilter, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-c:a', 'copy', output]
    const proc = spawn(ffmpegPath, args, { stdio: 'inherit' })
    proc.on('error', reject)
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg exited with code ${code}`))
      resolve()
    })
  })
}

async function main() {
  const { input = path.join('public', 'videos', 'robot-video.mp4'), output = path.join('public', 'videos', 'robot-video-cropped.mp4'), duration = 20 } = parseArgs()
  if (!fs.existsSync(input)) {
    console.error(`Input not found: ${input}`)
    process.exit(1)
  }
  console.log('Detecting crop area…')
  const crop = await detectCrop(input, duration)
  if (!crop) {
    console.error('Could not auto-detect crop. Try increasing --duration or provide manual crop filter like "crop=w:h:x:y".')
    process.exit(2)
  }
  console.log(`Applying filter: ${crop}`)
  await applyCrop(input, output, crop)
  console.log(`Wrote cropped video: ${output}`)
  console.log('Tip: Update your source to point to the cropped file if desired.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
