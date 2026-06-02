import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { MONO } from '../../utils/fonts'
import { api } from '../../lib/api'

interface Stats {
  archives: number
  news: number
  equipment: number
  reviews: number
  reviewsVerified: number
  announcements: number
}

const QUICK_LINKS = [
  { label: '新建档案', path: '/admin/archives/new', desc: '创建新的威胁档案或勘探报告' },
  { label: '人事管理', path: '/admin/personnel', desc: '管理组织人员信息' },
  { label: '发布新闻', path: '/admin/news/new', desc: '发布组织新闻通报' },
  { label: '添加入库装备', path: '/admin/equipment/new', desc: '登记新装备物资' },
]

export default function CMSHome() {
  const [stats, setStats] = useState<Stats>({
    archives: 0, news: 0, equipment: 0, reviews: 0, reviewsVerified: 0, announcements: 0,
  })
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.cms.stats()
        setStats(data)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [])

  const statItems = [
    { key: 'archives', label: '档案总数', color: '#d4a373', link: '/admin/archives' },
    { key: 'news', label: '新闻通报', color: '#60a5fa', link: '/admin/news' },
    { key: 'equipment', label: '装备物资', color: '#4ade80', link: '/admin/equipment' },
    { key: 'personnel', label: '在编人员', color: '#f472b6', value: '-', link: '/admin/personnel' },
    { key: 'reviews', label: '用户评价', color: '#facc15', link: '/admin/reviews' },
    { key: 'announcements', label: '系统公告', color: '#a78bfa', link: '/admin/announcements' },
  ]

  return (
    <CMSLayout>
      {/* 终端头部 */}
      <div className="mb-8 border-b border-white/[0.04] pb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#e60012] animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: MONO, color: '#555' }}>
            SYSTEM CONTROL PANEL
          </span>
        </div>
        <h1 className="text-lg font-medium text-[#f0f0f0]">控制台</h1>
        <p className="text-xs mt-1" style={{ fontFamily: MONO, color: '#555' }}>
          {time.toISOString().replace('T', ' ').substring(0, 19)} UTC · 边际结构档案管理系统
        </p>
      </div>

      {/* 统计网格 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {statItems.map((item) => {
          const val = stats[item.key as keyof Stats]
          const display = item.value ?? (loading ? '--' : String(val ?? 0))
          return (
            <Link key={item.key} to={item.link || '#'}
              className="group border border-white/[0.04] bg-[#0c0c0c] p-4 hover:border-white/10 transition-all duration-200 relative overflow-hidden"
            >
              {/* 顶部装饰线 */}
              <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${item.color}44, transparent)` }} />
              <div className="relative">
                <div className="text-[10px] mb-2" style={{ fontFamily: MONO, color: '#555' }}>
                  {`> ${item.label}`}
                </div>
                {loading ? (
                  <div className="w-12 h-6 bg-white/5 animate-pulse rounded" />
                ) : (
                  <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: MONO, color: item.color }}>
                    {display}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <div className="border border-white/[0.04] bg-[#0c0c0c] p-5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, #d4a37344, transparent)' }} />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px]" style={{ fontFamily: MONO, color: '#d4a373' }}>$</span>
          <h2 className="text-xs font-medium" style={{ color: '#d4a373', fontFamily: MONO }}>
            QUICK_ACTIONS
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_LINKS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded border border-white/[0.03] hover:border-white/10 transition-all duration-200 group"
            >
              <span className="text-[10px] w-4" style={{ fontFamily: MONO, color: '#d4a373' }}>{'>'}</span>
              <div>
                <div className="text-xs text-[#aaa] group-hover:text-[#f0f0f0] transition-colors">{item.label}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 系统信息 */}
      <div className="border border-white/[0.03] bg-[#0a0a0a] p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px]" style={{ fontFamily: MONO, color: '#444' }}>
          <span>█ SYSTEM: THRESHOLD ARCHIVE CMS</span>
          <span>█ VERSION: 4.1</span>
          <span>█ STATUS: <span className="text-[#4ade80]">OPERATIONAL</span></span>
          <span>█ NODE: site-3001</span>
        </div>
      </div>
    </CMSLayout>
  )
}
