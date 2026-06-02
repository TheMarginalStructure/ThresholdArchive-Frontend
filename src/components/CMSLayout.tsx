import { type ReactNode, useState } from 'react'
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
  { path: '/admin/news', label: '新闻管理' },
  { path: '/admin/equipment', label: '装备管理' },
  { path: '/admin/reviews', label: '评价管理' },
  { path: '/admin/announcements', label: '系统公告' },
  { path: '/admin/personnel', label: '人事管理' },
]

export default function CMSLayout({ children }: CMSLayoutProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category')

  // Archives submenu: expanded by default if on an archives page
  const [expandedArchives, setExpandedArchives] = useState(
    location.pathname.startsWith('/admin/archives')
  )

  return (
    <div className="fixed inset-0 flex bg-[#0a0a0a] text-[#f0f0f0]" style={{ fontFamily: BODY }}>
      <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0c] flex flex-col">
        <Link to="/admin" className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <img src="/assets/favicon.png" alt="ThresholdArchive" className="w-7 h-7 rounded-sm" />
          <div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: MONO, color: '#f0f0f0' }}>
              CMS
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: MONO, color: '#555555' }}>
              管理后台
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path)

            if (item.children) {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => setExpandedArchives(!expandedArchives)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-xs transition-all duration-150"
                    style={{
                      fontFamily: MONO,
                      color: isActive ? '#f0f0f0' : '#666666',
                      background: isActive ? 'rgba(230,0,18,0.08)' : 'transparent',
                      borderLeft: isActive ? '2px solid #e60012' : '2px solid transparent',
                      marginLeft: isActive ? '0' : '2px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#aaaaaa'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#666666'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <span className="text-xs opacity-60">{item.label.slice(0, 1)}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${expandedArchives ? 'rotate-90' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  {expandedArchives && (
                    <div className="mt-0.5 space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = currentCategory === decodeURIComponent(child.path.split('category=')[1])
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-all duration-150"
                            style={{
                              fontFamily: MONO,
                              color: childActive ? '#d4a373' : '#555555',
                              background: childActive ? 'rgba(212,163,115,0.08)' : 'transparent',
                              paddingLeft: '2.25rem',
                            }}
                            onMouseEnter={(e) => {
                              if (!childActive) {
                                e.currentTarget.style.color = '#aaaaaa'
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!childActive) {
                                e.currentTarget.style.color = '#555555'
                                e.currentTarget.style.background = 'transparent'
                              }
                            }}
                          >
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
                className="flex items-center gap-3 px-3 py-2.5 rounded text-xs transition-all duration-150"
                style={{
                  fontFamily: MONO,
                  color: isActive ? '#f0f0f0' : '#666666',
                  background: isActive ? 'rgba(230,0,18,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #e60012' : '2px solid transparent',
                  marginLeft: isActive ? '0' : '2px',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#aaaaaa'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#666666'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span className="text-xs opacity-60">{item.label.slice(0, 1)}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/[0.06]">
          <Link
            to="/"
            target="_blank"
            className="text-[10px] tracking-widest uppercase hover:text-[#d4a373] transition-colors"
            style={{ fontFamily: MONO, color: '#555555' }}
          >
            返回前台
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 overflow-y-auto custom-scrollbar" style={{ fontFamily: BODY }}>
        {children}
      </main>
    </div>
  )
}