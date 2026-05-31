import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import Footer from '../sections/Footer'
import { MONO } from '../utils/fonts'

interface PageLayoutProps {
  children: ReactNode
  breadcrumbs: { label: string; to?: string }[]
  title: string
  subtitle: string
  showBackButton?: boolean
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 查找实际的滚动容器
    const container = document.querySelector('.custom-scrollbar') || document.documentElement

    const handleScroll = () => {
      const scrollTop = container instanceof HTMLElement ? container.scrollTop : window.scrollY
      setVisible(scrollTop > 400)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    // 初始检查
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    const container = document.querySelector('.custom-scrollbar')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-[#d4a373]/40 bg-[#0a0a0a]/90 backdrop-blur text-[#d4a373] hover:bg-[#d4a373]/10 transition-all duration-200"
      data-cursor-hover
      title="返回顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

interface PageLayoutProps {
  children: ReactNode
  breadcrumbs: { label: string; to?: string }[]
  title: string
  subtitle: string
  showBackButton?: boolean
}

function BackgroundLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let lines: { x1: number; y1: number; x2: number; y2: number; vx: number; vy: number; life: number; maxLife: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const MAX_LINES = 12

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new lines
      if (lines.length < MAX_LINES && Math.random() < 0.05) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const angle = Math.random() * Math.PI * 2
        const len = 40 + Math.random() * 120
        lines.push({
          x1: x, y1: y,
          x2: x + Math.cos(angle) * len, y2: y + Math.sin(angle) * len,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: 0,
          maxLife: 300 + Math.random() * 400,
          opacity: 0.08 + Math.random() * 0.12,
        })
      }

      // Repulsion between lines
      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          const a = lines[i], b = lines[j]
          const dx = (a.x1 + a.x2) / 2 - (b.x1 + b.x2) / 2
          const dy = (a.y1 + a.y2) / 2 - (b.y1 + b.y2) / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = 80
          if (dist < minDist && dist > 0.1) {
            const force = (minDist - dist) / minDist * 0.075
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            a.vx += fx; a.vy += fy
            b.vx -= fx; b.vy -= fy
          }
        }
      }

      lines = lines.filter(l => l.life < l.maxLife)

      lines.forEach(l => {
        l.x1 += l.vx
        l.y1 += l.vy
        l.x2 += l.vx
        l.y2 += l.vy
        l.life++

        // Fade in / out
        const fadeIn = Math.min(l.life / 60, 1)
        const fadeOut = Math.min((l.maxLife - l.life) / 80, 1)
        const alpha = l.opacity * fadeIn * fadeOut

        ctx.beginPath()
        ctx.moveTo(l.x1, l.y1)
        ctx.lineTo(l.x2, l.y2)
        ctx.strokeStyle = `rgba(212, 163, 115, ${alpha})`
        ctx.lineWidth = 0.5 + Math.random() * 0.5
        ctx.stroke()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

export default function PageLayout({ children, breadcrumbs, showBackButton }: PageLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    const referrer = document.referrer
    if (referrer && referrer.includes(window.location.hostname)) {
      window.history.back()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] relative">
      <BackgroundLines />
      <div className="relative pt-16 pb-24" style={{ zIndex: 1 }}>
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-8">
          <div
            className="flex items-center gap-3 text-xs tracking-widest uppercase"
            style={{ fontFamily: MONO }}
          >
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-[#888888] hover:text-[#f0f0f0] transition-colors border border-white/10 px-2 py-1 hover:border-[#d4a373]/40"
                data-cursor-hover
              >
                <span className="text-[10px]">←</span>
                <span className="text-[10px]">返回</span>
              </button>
            )}
            <Link to="/" className="text-[#888888] hover:text-[#f0f0f0] transition-colors">边际结构</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-[#666666]">/</span>
                {crumb.to ? (
                  <Link to={crumb.to} className="text-[#888888] hover:text-[#f0f0f0] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#d4a373]">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        {children}
      </div>

      <Footer />

      <ScrollToTopButton />
    </div>
  )
}
