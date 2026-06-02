import { type ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { MONO, BODY } from '../utils/fonts'

interface CMSLayoutProps {
  children: ReactNode
}

interface NavItem {
  path: string
  label: string
  children?: { path: string; label: string }[]
}

const ARCHIVE_CATEGORIES: { label: string; param: string }[] = [
  { label: '阈界档案', param: '阈界档案' },
  { label: '对象档案', param: '对象档案' },
  { label: '勘探记录', param: '勘探记录' },
  { label: '事件报告', param: '事件报告' },
  { label: '事件通信', param: '事件通信' },
  { label: '人事档案', param: '人事档案' },
  { label: '医疗报告', param: '医疗报告' },
  { label: '实验记录', param: '实验记录' },
  { label: '理论文件', param: '理论文件' },
  { label: '协议手册', param: '协议手册' },
]

const NAV_ITEMS: NavItem[] = [
  { path: '/admin', label: '控制台' },
  {
    path: '/admin/archives',
    label: '档案管理',
    children: ARCHIVE_CATEGORIES.map(c => ({
      path: `/admin/archives?category=${encodeURIComponent(c.param)}`,
      label: c.label,
    })),
  },
  { path: '/admin/personnel', label: '人事管理' },
  { path: '/admin/news', label: '新闻管理' },
  { path: '/admin/equipment', label: '装备管理' },
  { path: '/admin/reviews', label: '评价管理' },
  { path: '/admin/announcements', label: '系统公告' },
]

export default function CMSLayout({ children }: CMSLayoutProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')
  const [time, setTime] = useState(new Date())

  const [expandedArchives, setExpandedArchives] = useState(
    location.pathname.startsWith('/admin/archives')
  )

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toISOString().replace('T', ' ').substring(0, 19)

  return (
    <div className="fixed inset-0 flex bg-[#080808] text-[#f0f0f0]" style={{ fontFamily: BODY }}>
      {/* 终端扫描线装饰 */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* 侧边栏 */}
      <aside className="w-56 flex-shrink-0 border-r border-white/[0.04] bg-[#0a0a0a] flex flex-col">
        {/* 终端头部 */}
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e60012] animate-pulse" />
            <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: MONO, color: '#555' }}>
              CMS TERMINAL
            </span>
          </div>
          <div className="text-[9px] mt-1.5" style={{ fontFamily: MONO, color: '#444' }}>
            {formattedTime} UTC
          </div>
        </div>

        {/* 导航 */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path)

            if (item.children) {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => setExpandedArchives(!expandedArchives)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs transition-all duration-150"
                    style={{
                      fontFamily: MONO,
                      color: isActive ? '#f0f0f0' : '#555',
                      background: isActive ? 'rgba(212,163,115,0.08)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#aaa'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#555'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <span className="text-[10px] opacity-40" style={{ fontFamily: MONO }}>{'>'}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="text-[10px] opacity-30">{expandedArchives ? '−' : '+'}</span>
                  </button>
                  {expandedArchives && (
                    <div className="mt-0.5 space-y-0.5 ml-3 border-l border-white/[0.03] pl-2">
                      {item.children.map((child) => {
                        const childActive = currentCategory === decodeURIComponent(child.path.split('category=')[1])
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all duration-150"
                            style={{
                              fontFamily: MONO,
                              color: childActive ? '#d4a373' : '#444',
                              background: childActive ? 'rgba(212,163,115,0.06)' : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (!childActive) {
                                e.currentTarget.style.color = '#888'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!childActive) {
                                e.currentTarget.style.color = '#444'
                                e.currentTarget.style.background = 'transparent'
                              }
                            }}
                          >
                            <span className="text-[9px] opacity-30">▸</span>
                            <span>{child.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 rounded text-xs transition-all duration-150"
                style={{
                  fontFamily: MONO,
                  color: isActive ? '#f0f0f0' : '#555',
                  background: isActive ? 'rgba(212,163,115,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#aaa'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#555'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span className="text-[10px] opacity-40" style={{ fontFamily: MONO }}>{'>'}</span>
                <span>{item.label}</span>
                {location.pathname.startsWith(item.path) && item.path !== '/admin' && (
                  <span className="ml-auto text-[9px]" style={{ color: '#d4a373' }}>▸</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* 底部状态栏 */}
        <div className="border-t border-white/[0.04]">
          <div className="px-4 py-2.5">
            <Link
              to="/"
              target="_blank"
              className="text-[10px] tracking-wider hover:text-[#d4a373] transition-colors flex items-center gap-2"
              style={{ fontFamily: MONO, color: '#444' }}
            >
              <span className="text-[9px] opacity-40">◄</span>
              返回前台
            </Link>
          </div>
          <div className="px-4 py-2 border-t border-white/[0.03] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] opacity-60" />
            <span className="text-[9px]" style={{ fontFamily: MONO, color: '#444' }}>
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar relative">
        {/* 顶部状态条 */}
        <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-white/[0.03]">
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-3 text-[10px]" style={{ fontFamily: MONO, color: '#444' }}>
              <span>TMS::CMS</span>
              <span className="opacity-30">/</span>
              <span className="text-[#666]">
                {location.pathname === '/admin' ? '控制台' : location.pathname.replace('/admin/', '')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[9px]" style={{ fontFamily: MONO, color: '#333' }}>
              <span>UPTIME: 100%</span>
              <span className="w-1 h-1 rounded-full bg-[#4ade80] opacity-30" />
              <span>CONN: SECURE</span>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6" style={{ fontFamily: BODY }}>
          {children}
        </div>

        {/* 底部装饰 */}
        <div className="border-t border-white/[0.02] px-6 py-3 mt-8">
          <div className="flex items-center justify-between text-[9px]" style={{ fontFamily: MONO, color: '#333' }}>
            <span>THRESHOLD ARCHIVE MANAGEMENT SYSTEM v4.1</span>
            <span>TERMINAL MODE</span>
          </div>
        </div>
      </main>
    </div>
  )
}
