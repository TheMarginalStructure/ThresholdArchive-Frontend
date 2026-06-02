import { useState, useEffect } from 'react'
import { api, type ApiPersonnel } from '../../lib/api'
import { MONO, BODY } from '../../utils/fonts'

const RESEARCH_STATS_BASE = [
  { label: '归档档案', value: 2847, unit: '份' },
  { label: '活跃研究', value: 63, unit: '项' },
  { label: '阈界记录', value: 156, unit: '个' },
  { label: '待审档案', value: 12, unit: '份' },
]

const ACTIVE_PROJECTS = [
  { id: 'PRJ-2026-041', name: '阈界TMS-L0234稳定性分析', leadId: '林知远', status: '进行中', priority: '高' },
  { id: 'PRJ-2026-038', name: '认知污染防护协议修订', leadId: '陈维华', status: '进行中', priority: '高' },
  { id: 'PRJ-2026-035', name: '异常实体分类标准v3.2', leadId: '林知远', status: '审核中', priority: '中' },
  { id: 'PRJ-2026-029', name: '阈界TMS-O0881空间结构测绘', leadId: '安雅', status: '进行中', priority: '中' },
  { id: 'PRJ-2026-024', name: '时间异常事件关联性研究', leadId: '安娜', status: '暂停', priority: '低' },
  { id: 'PRJ-2026-019', name: '新型缓解装备效能评估', leadId: '艾德里安', status: '进行中', priority: '中' },
]

const RECENT_ARCHIVES = [
  { code: 'TMS-O2847', title: '存在性否定实体', threat: '黑色-O', date: '2026-05-25', authorId: '林知远' },
  { code: 'TMS-O0881', title: '万花筒殿', threat: '琥珀色-C', date: '2026-05-23', authorId: '安雅' },
  { code: 'TMS-L0234', title: '明知山', threat: '琥珀色-C', date: '2026-05-21', authorId: '林知远' },
  { code: 'TMS-T0112', title: '静默车站', threat: '黄色-T', date: '2026-05-19', authorId: '安娜' },
]

const THREAT_DISTRIBUTION = [
  { level: '白色', count: 12, color: '#ffffff' },
  { level: '蓝色', count: 89, color: '#60a5fa' },
  { level: '绿色', count: 156, color: '#4ade80' },
  { level: '黄色', count: 423, color: '#facc15' },
  { level: '琥珀色', count: 312, color: '#fb923c' },
  { level: '红色', count: 87, color: '#e60012' },
  { level: '黑色', count: 4, color: '#000000' },
]

export default function ResearchArchives() {
  const [personnel, setPersonnel] = useState<ApiPersonnel[]>([])
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // 档案与研究部 (DEPT-10, id=2)
    api.personnel.list({ departmentId: 2 })
      .then(setPersonnel)
      .catch(() => {})
  }, [])

  const totalThreats = THREAT_DISTRIBUTION.reduce((sum, t) => sum + t.count, 0)
  const researchers = personnel.length || 8

  const RESEARCH_STATS = [
    { label: '归档档案', value: 2847, unit: '份' },
    { label: '活跃研究', value: 63, unit: '项' },
    { label: '研究人员', value: researchers, unit: '人' },
    { label: '待审档案', value: 12, unit: '份' },
  ]

  const findPerson = (keyword: string) =>
    personnel.find(p => p.name.includes(keyword) || (p.nameEn && p.nameEn.toLowerCase().includes(keyword.toLowerCase())))

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a]" style={{ fontFamily: BODY }}>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-16 md:py-24 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#60a5fa] text-xs tracking-widest" style={{ fontFamily: MONO }}>
                [DEPT-30]
              </span>
              <span className="text-[#666666]">/</span>
              <span className="text-[#888888] text-xs" style={{ fontFamily: MONO }}>
                {time.toISOString().replace('T', ' ').substring(0, 19)} UTC
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl text-[#f0f0f0] font-bold mb-4 tracking-tight">
              档案与研究部
            </h1>
            <p className="text-lg text-[#888888] max-w-2xl mb-8">
              RESEARCH & ARCHIVES DEPARTMENT
            </p>
            <p className="text-sm text-[#888888] max-w-2xl leading-relaxed">
              负责所有阈界档案的归档、分类、研究及分析工作。下辖多个专业研究组，
              是边际结构的知识中枢与决策支持核心。
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RESEARCH_STATS.map((stat) => (
                <div key={stat.label} className="border border-white/10 p-4">
                  <div className="text-xs text-[#888888] mb-2" style={{ fontFamily: MONO }}>
                    {stat.label}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl text-[#f0f0f0] font-bold" style={{ fontFamily: MONO }}>
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#888888]">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Threat Distribution */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">威胁等级分布</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                TOTAL: {totalThreats}
              </span>
            </div>

            <div className="space-y-3">
              {THREAT_DISTRIBUTION.map((t) => {
                const percentage = (t.count / totalThreats) * 100
                return (
                  <div key={t.level} className="flex items-center gap-4">
                    <span className="text-xs text-[#888888] w-12" style={{ fontFamily: MONO }}>
                      {t.level}
                    </span>
                    <div className="flex-1 h-6 bg-white/5 relative overflow-hidden">
                      <div
                        className="h-full absolute left-0 top-0 transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: t.color, opacity: t.level === '黑色' ? 0.8 : 1 }}
                      />
                      <span className="absolute inset-0 flex items-center px-2 text-xs" style={{ fontFamily: MONO }}>
                        {t.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Active Projects */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-[#f0f0f0] font-bold">活跃研究项目</h2>
              <span className="text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                STATUS: ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIVE_PROJECTS.map((proj) => {
                const lead = findPerson(proj.leadId)
                const leadName = lead
                  ? `${lead.name}${lead.title ? ` ${lead.title}` : ''}`
                  : proj.leadId
                return (
                  <div key={proj.id} className="border border-white/10 p-4 hover:border-[#60a5fa]/40 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-[#60a5fa]" style={{ fontFamily: MONO }}>
                        {proj.id}
                      </span>
                      <span className={`text-xs px-2 py-0.5 border ${
                        proj.priority === '高'
                          ? 'text-[#e60012] border-[#e60012]/40'
                          : proj.priority === '中'
                          ? 'text-[#facc15] border-[#facc15]/40'
                          : 'text-[#888888] border-white/20'
                      }`}>
                        {proj.priority}优先级
                      </span>
                    </div>
                    <h3 className="text-sm text-[#f0f0f0] font-medium mb-2 leading-relaxed">{proj.name}</h3>
                    <p className="text-xs text-[#888888] mb-3">负责人: {leadName}</p>
                    <span className={`text-xs ${
                      proj.status === '进行中' ? 'text-[#4ade80]' : proj.status === '审核中' ? 'text-[#facc15]' : 'text-[#888888]'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recent Archives */}
        <section className="px-6 py-12 border-b border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl text-[#f0f0f0] font-bold mb-8">最新归档</h2>

            <div className="border border-white/10">
              <div className="grid grid-cols-5 gap-4 p-3 border-b border-white/10 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
                <span>编码</span>
                <span>标题</span>
                <span>威胁等级</span>
                <span>归档日期</span>
                <span>研究员</span>
              </div>
              {RECENT_ARCHIVES.map((arc, i) => {
                const author = findPerson(arc.authorId)
                const authorName = author
                  ? `${author.name}${author.title ? ` ${author.title}` : ''}`
                  : arc.authorId
                return (
                  <div key={i} className="grid grid-cols-5 gap-4 p-3 border-b border-white/5 text-xs hover:bg-white/5 transition-colors">
                    <span className="text-[#60a5fa]" style={{ fontFamily: MONO }}>{arc.code}</span>
                    <span className="text-[#f0f0f0]">{arc.title}</span>
                    <span className={arc.threat.includes('红色') || arc.threat.includes('黑色') ? 'text-[#e60012]' : arc.threat.includes('琥珀色') ? 'text-[#fb923c]' : 'text-[#facc15]'}>
                      {arc.threat}
                    </span>
                    <span className="text-[#888888]" style={{ fontFamily: MONO }}>{arc.date}</span>
                    <span className="text-[#888888]">{authorName}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Department Info */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">部门领导</h3>
                <div className="space-y-3">
                  {[
                    { role: '部长', id: '陈维华' },
                    { role: '副部长', id: '艾德里安' },
                    { role: '首席研究员', id: '林知远' },
                    { role: '首席档案员', id: '安雅' },
                    { role: '数据主管', id: '马克西姆' },
                  ].map(({ role, id }) => {
                    const p = findPerson(id)
                    const label = p
                      ? `${p.name}${p.nameEn ? ` (${p.nameEn})` : ''}${p.title ? ` ${p.title}` : ''}`
                      : id
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <span className="text-xs text-[#60a5fa]" style={{ fontFamily: MONO }}>[{role}]</span>
                        <span className="text-sm text-[#f0f0f0]">{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg text-[#f0f0f0] font-bold mb-4">联系方式</h3>
                <div className="space-y-2 text-sm text-[#888888]">
                  <p>内部频道: DEPT-30-COM</p>
                  <p>档案查询: 3000-30-0024</p>
                  <p>研究中心: Site-3001 / 档案与研究部总部</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
