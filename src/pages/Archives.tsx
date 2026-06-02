import { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import PageLayout from '../components/PageLayout'
import CustomSelect from '../components/CustomSelect'
import { api, type ApiArchive, type ApiCategory } from '../lib/api'
import { MONO } from '../utils/fonts'

const SORT_OPTIONS = [
  { label: '威胁等级 ↑', value: 'level-desc' },
  { label: '威胁等级 ↓', value: 'level-asc' },
  { label: '归档日期 ↓', value: 'date-desc' },
  { label: '档案编号 ↑', value: 'code-asc' },
]

const LEVEL_ORDER = ['黑色', '红色', '琥珀色', '黄色', '绿色', '蓝色', '白色']

const CATEGORY_COLORS: Record<string, string> = {
  '阈界档案': '#e60012',
  '对象档案': '#e60012',
  '勘探记录': '#d4a373',
  '事件报告': '#ff6b6b',
  '事件通信': '#ff6b6b',
  '人事档案': '#4ade80',
  '医疗报告': '#60a5fa',
  '实验记录': '#a78bfa',
  '理论文件': '#f472b6',
  '协议手册': '#888888',
}


export default function Archives() {
  const { category: urlCategory } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('level-desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [archives, setArchives] = useState<ApiArchive[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ApiCategory[]>([])

  // 从后端获取类别列表
  useEffect(() => {
    api.archives.categories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  const activeCategory = useMemo(() => {
    if (!urlCategory) return '全部'
    const matched = categories.find(
      (c) => c.code.toLowerCase() === urlCategory.toLowerCase()
    )
    return matched ? matched.category : '全部'
  }, [urlCategory, categories])

  // 获取档案列表（AbortController 防止竞态：旧请求后返回时不覆盖新数据）
  useEffect(() => {
    const abort = new AbortController()
    setLoading(true)
    setError(null)
    const params: Record<string, string> = { limit: '1000', page: '1' }
    if (activeCategory !== '全部') {
      params.category = activeCategory
    }
    if (searchQuery.trim()) {
      params.search = searchQuery.trim()
    }
    api.archives.list(params)
      .then((res) => {
        if (abort.signal.aborted) return
        setArchives(res.data)
        setTotal(res.meta.total)
      })
      .catch((err) => {
        if (abort.signal.aborted) return
        setError(err.message || '加载失败')
      })
      .finally(() => {
        if (abort.signal.aborted) return
        setLoading(false)
      })
    return () => abort.abort()
  }, [activeCategory, searchQuery])

  const filteredArchives = useMemo(() => {
    const result = [...archives]

    result.sort((a, b) => {
      switch (sortBy) {
        case 'level-desc':
          return (
            LEVEL_ORDER.indexOf(a.threatLevelColor || '') -
            LEVEL_ORDER.indexOf(b.threatLevelColor || '')
          )
        case 'level-asc':
          return (
            LEVEL_ORDER.indexOf(b.threatLevelColor || '') -
            LEVEL_ORDER.indexOf(a.threatLevelColor || '')
          )
        case 'date-desc':
          return (b.archiveDate || '').localeCompare(a.archiveDate || '')
        case 'code-asc':
          return a.code.localeCompare(b.code)
        default:
          return 0
      }
    })

    return result
  }, [archives, sortBy])

  return (
    <PageLayout
      breadcrumbs={[{ label: '档案库' }]}
      title="档案库 / Archive Database"
      subtitle={`所有已归档的阈界异常现象与组织文件。共计 ${total} 条记录。`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-white/10">
          <button
            onClick={() => navigate('/archives')}
            className={`text-xs px-3 py-1.5 border transition-colors ${activeCategory === '全部'
                ? 'border-[#d4a373] text-[#d4a373]'
                : 'border-white/10 text-[#888888] hover:border-white/30 hover:text-[#f0f0f0]'
              }`}
            data-cursor-hover
          >
            全部 {categories.reduce((s, c) => s + c.count, 0)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => navigate(`/archives/${cat.code}`)}
              className={`text-xs px-3 py-1.5 border transition-colors ${activeCategory === cat.category
                  ? 'border-[#d4a373] text-[#d4a373]'
                  : 'border-white/10 text-[#888888] hover:border-white/30 hover:text-[#f0f0f0]'
                }`}
              data-cursor-hover
            >
              {cat.category} {cat.count}
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索档案编号、标题或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/10 px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#666666] outline-none focus:border-[#d4a373]"
              data-cursor-hover
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#888888]">
            <span>排序</span>
            <CustomSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
              className="w-32"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-24 text-[#888888]">
            <div className="text-xs text-[#d4a373] tracking-widest uppercase mb-4 animate-pulse" style={{ fontFamily: MONO }}>
              LOADING ARCHIVE DATA...
            </div>
            <div className="w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
              <div className="h-full bg-[#d4a373] animate-[loadingSlide_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-[#e60012]">
            <div className="text-4xl mb-4">!</div>
            <p>数据加载失败：{error}</p>
          </div>
        )}

        {/* Archive Grid */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredArchives.map((archive) => (
              <ArchiveListItem key={archive.id} archive={archive} />
            ))}
          </div>
        )}

        {!loading && !error && filteredArchives.length === 0 && (
          <div className="text-center py-24 text-[#888888]">
            <div className="text-4xl mb-4">∅</div>
            <p>未找到匹配的档案记录</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

function ArchiveListItem({ archive }: { archive: ApiArchive }) {
  const categoryColor = CATEGORY_COLORS[archive.category] || '#888888'

  return (
    <Link
      to={`/archive/${archive.id}`}
      className="block border border-white/10 hover:border-[#d4a373]/40 transition-all duration-300 group"
      style={{ background: 'rgba(17, 17, 17, 0.6)' }}
      data-cursor-hover
    >
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail Image */}
        {archive.imagePath && (
          <div className="md:w-48 flex-shrink-0 h-32 md:h-48 overflow-hidden relative">
            <img
              src={archive.imagePath}
              alt={archive.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ filter: 'grayscale(50%) contrast(110%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]/80 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 to-transparent md:hidden" />
          </div>
        )}

        {/* Category Badge (when no image) */}
        {!archive.imagePath && (
          <div
            className="md:w-2 flex-shrink-0"
            style={{ backgroundColor: `${categoryColor}30` }}
          />
        )}

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-lg text-[#f0f0f0] font-medium">
                {archive.title}
                {archive.category === '协议手册' && (archive.details as any)?.version && (
                  <span className="ml-2 text-[10px] text-[#888888] align-middle" style={{ fontFamily: 'monospace' }}>
                    v{(archive.details as any).version}
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2 py-0.5"
                style={{
                  color: categoryColor,
                  border: `1px solid ${categoryColor}40`,
                  opacity: 0.7,
                }}
              >
                {archive.category}
              </span>
              <span
                className="text-xs text-[#888888]"
                style={{
                  fontFamily: MONO,
                }}
              >
                {archive.code}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#888888]">
            <span>
              <span className="text-[#666666]">来源</span>{' '}
              <span className="text-[#d4a373]">{archive.sourceDepartment?.name || '未知'}</span>
            </span>
            <span>
              <span className="text-[#666666]">归档</span>{' '}
              {archive.archiveDate ? new Date(archive.archiveDate).toLocaleDateString('zh-CN') : '-'}
            </span>
            <span>
              <span className="text-[#666666]">更新</span>{' '}
              {archive.lastUpdate ? new Date(archive.lastUpdate).toLocaleDateString('zh-CN') : '-'}
            </span>
            <span>
              <span className="text-[#666666]">权限</span>{' '}
              <span className="text-[#f0f0f0]">{archive.accessLevel || '-'}</span>
            </span>
            {archive.threatLevel !== null && (
              <span>
                <span className="text-[#666666]">威胁等级</span>{' '}
                <span className="text-[#f0f0f0]" style={{ color: archive.threatLevel === null ? '#666666' : '#f0f0f0' }}>  {archive.threatLevel || '不适用'}</span>
              </span>
            )}
            <span className="ml-auto text-[#d4a373] flex items-center gap-1">
              查看完整档案 ↗
            </span>

          </div>
        </div>
      </div>
    </Link>
  )
}
