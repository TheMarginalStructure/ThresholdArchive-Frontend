import { useEffect, useRef, useState } from 'react'
import { MONO } from '../utils/fonts'

const BOOT_LINES = [
  { text: 'SYS::INIT', delay: 18 },
  { text: 'SYS::LOADING secure_channel... OK', delay: 25 },
  { text: 'SYS::LOADING threshold_db... OK', delay: 32 },
  { text: 'SYS::ESTABLISHING encrypted_link... OK', delay: 35 },
  { text: 'SYS::VERIFYING credentials... OK', delay: 28 },
  { text: 'SYS::DECRYPTING archive_index... OK', delay: 42 },
  { text: 'SYS::SYNCING anomaly_db... OK', delay: 25 },
  { text: 'SYS::INITIALIZING monitor_daemon... OK', delay: 28 },
  { text: 'SYS::READY.', delay: 18 },
  { text: '', delay: 0, isFinal: true },
]

export default function LoadingScreen({ onProgress, onComplete }: { onProgress?: (progress: number) => void; onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number[]>([])

  useEffect(() => {
    let lineIndex = 0
    let cumulativeDelay = 0

    const scheduleNext = () => {
      if (lineIndex >= BOOT_LINES.length) return
      const line = BOOT_LINES[lineIndex]
      cumulativeDelay += line.delay

      const t = window.setTimeout(() => {
        setVisibleLines(lineIndex + 1)
        const pct = Math.min(Math.floor(((lineIndex + 1) / BOOT_LINES.length) * 100), 100)
        onProgress?.(pct)

        if (line.isFinal) {
          setShowCursor(false)
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transform = 'translateY(-100%)'
              containerRef.current.style.transition = 'transform 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
            }
            setTimeout(onComplete, 60)
          }, 100)
          return
        }

        lineIndex++
        scheduleNext()
      }, cumulativeDelay)

      timerRef.current.push(t)
    }

    // Start blinking cursor effect
    scheduleNext()

    return () => {
      timerRef.current.forEach(clearTimeout)
    }
  }, [onComplete, onProgress])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center"
    >
      <div className="w-[520px] max-w-[90vw]">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e60012]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4a373]/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/50" />
          <span className="ml-3 text-[10px] text-[#666] tracking-wider uppercase" style={{ fontFamily: MONO }}>
            threshold_archive :: boot.efi
          </span>
        </div>

        {/* Terminal body */}
        <div className="space-y-1.5">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="text-xs leading-relaxed"
              style={{
                fontFamily: MONO,
                color: line.isFinal ? '#4ade80' : line.text.includes('... OK') ? '#a0a0a0' : '#888888',
              }}
            >
              <span className="text-[#666] mr-2">{'>'}</span>
              {line.text}
            </div>
          ))}
        </div>

        {/* Blinking cursor */}
        {showCursor && (
          <div
            className="inline-block w-2 h-4 bg-[#e60012] mt-2 ml-4"
            style={{
              animation: 'blink 1s step-end infinite',
            }}
          />
        )}

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
