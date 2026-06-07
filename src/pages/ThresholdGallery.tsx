import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import PageLayout from '../components/PageLayout'
import { api, type ApiArchive } from '../lib/api'
import { MONO, BODY } from '../utils/fonts'

// ── 映射威胁等级到颜色 ──
const THREAT_COLORS: Record<string, string> = {
  '红色-O': '#DC2626',
  '橙色-CP': '#EA580C',
  '黄色-CP': '#D97706',
  '黄色': '#CA8A04',
  '琥珀色-C': '#B45309',
  '蓝色': '#2563EB',
  '黑色-O': '#6B21A8',
}

export default function ThresholdGallery() {
  const [archives, setArchives] = useState<ApiArchive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const abort = new AbortController()

    async function fetch() {
      try {
        setLoading(true)
        setError(null)
        const res = await api.archives.list({ limit: 50 })
        // 筛选 TMS 且含有 logoSvg 的档案
        const tms = res.data.filter(a => a.code.startsWith('TMS') && a.logoSvg)
        // 按 code 排序
        tms.sort((a, b) => a.code.localeCompare(b.code))
        setArchives(tms)
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetch()
    return () => abort.abort()
  }, [])

  return (
    <PageLayout
      breadcrumbs={[
        { label: '首页', to: '/' },
        { label: '阈界徽记' },
      ]}
      title="阈界徽记"
      subtitle="THRESHOLD SIGILS — 每一枚徽记都是通向另一个现实的钥匙"
    >
      {/* 描述区 */}
      <div className="max-w-[1400px] mx-auto px-6 mb-10">
        <p
          className="text-xs text-[#888888] leading-relaxed max-w-2xl"
          style={{ fontFamily: BODY }}
        >
          以下为归档于边际结构的所有已知阈界（TMS）档案之专属徽记。<br />
          每一枚徽记由该阈界的编码、威胁等级与本质特征所决定——其几何构型与色彩光谱均非随机，而是异常信息在符号系统中的映射投影。
        </p>
      </div>

      {/* 加载态 */}
      {loading && (
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* 错误态 */}
      {error && (
        <div className="max-w-[1400px] mx-auto px-6 text-center py-20">
          <p className="text-xs text-[#e60012]" style={{ fontFamily: MONO }}>
            ERROR: {error}
          </p>
        </div>
      )}

      {/* 空态 */}
      {!loading && !error && archives.length === 0 && (
        <div className="max-w-[1400px] mx-auto px-6 text-center py-20">
          <p className="text-xs text-[#666666]" style={{ fontFamily: MONO }}>
            ∎ 未找到阈界徽记数据
          </p>
        </div>
      )}

      {/* 徽记宫格 */}
      {!loading && !error && archives.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {archives.map((archive) => (
              <div
                key={archive.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/archive/${archive.id}`)}
                onMouseEnter={() => setHoveredId(archive.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor-hover
              >
                {/* SVG 容器 — 1:1 正方形 */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-white/5 transition-all duration-500 group-hover:border-[#d4a373]/40 group-hover:shadow-[0_0_30px_rgba(212,163,115,0.15)]">
                  {/* 内联 SVG */}
                  <div
                    className="w-full h-full flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-110"
                    dangerouslySetInnerHTML={{ __html: archive.logoSvg || '' }}
                  />

                  {/* 悬浮遮罩信息 */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-400 ${hoveredId === archive.id
                        ? 'opacity-100 bg-black/70'
                        : 'opacity-0 pointer-events-none'
                      }`}
                  >
                    <span
                      className="text-xs text-[#d4a373] tracking-wider"
                      style={{ fontFamily: MONO }}
                    >
                      查看详情 →
                    </span>
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] text-[#d4a373] tracking-wider"
                      style={{ fontFamily: MONO }}
                    >
                      {archive.code}
                    </span>
                    {archive.threatLevel && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: MONO,
                          color: THREAT_COLORS[archive.threatLevel] || '#888888',
                          border: `1px solid ${THREAT_COLORS[archive.threatLevel] || '#888888'}33`,
                          background: `${THREAT_COLORS[archive.threatLevel] || '#888888'}11`,
                        }}
                      >
                        {archive.threatLevel}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-[#aaaaaa] line-clamp-1 leading-tight"
                    style={{ fontFamily: BODY }}
                  >
                    {archive.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
