import { useEffect, useRef } from 'react'
import { MONO } from '../utils/fonts'

interface ConfirmModalProps {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title = '确认操作',
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* 弹窗 */}
      <div
        className="relative border border-white/[0.08] bg-[#0c0c0c] w-80 shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
      >
        {/* 顶部装饰线 */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, ${danger ? '#e60012' : '#d4a373'}44, transparent)` }}
        />

        {/* 头部 */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-white/[0.04]">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: danger ? '#e60012' : '#d4a373' }}
          />
          <span className="text-xs tracking-wider" style={{ fontFamily: MONO, color: '#888' }}>
            {danger ? 'WARNING' : 'CONFIRM'}
          </span>
        </div>

        {/* 内容 */}
        <div className="px-5 py-4">
          <div className="text-xs text-[#aaa] leading-relaxed">{message}</div>
        </div>

        {/* 按钮 */}
        <div className="flex items-center justify-end gap-2 px-5 pb-4">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs border border-white/[0.06] text-[#666] hover:text-[#aaa] hover:border-white/20 transition-colors"
            style={{ fontFamily: MONO }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs border transition-colors"
            style={{
              fontFamily: MONO,
              color: danger ? '#e60012' : '#d4a373',
              borderColor: danger ? 'rgba(230,0,18,0.3)' : 'rgba(212,163,115,0.3)',
              background: danger ? 'rgba(230,0,18,0.06)' : 'rgba(212,163,115,0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = danger ? 'rgba(230,0,18,0.12)' : 'rgba(212,163,115,0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = danger ? 'rgba(230,0,18,0.06)' : 'rgba(212,163,115,0.06)'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
