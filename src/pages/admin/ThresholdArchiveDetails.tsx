import { MONO } from '../../utils/fonts'

interface Props {
  details: Record<string, unknown>
  onChange: (details: Record<string, unknown>) => void
}

interface ArrayItem {
  id: number
  data: Record<string, unknown>
}

// 字段定义 — 与后端 schema 保持一致
const SECTIONS: { key: string; label: string; fields: { key: string; label: string; type?: string }[] }[] = [
  {
    key: 'properties',
    label: '特性分析',
    fields: [
      { key: 'category', label: '类别' },
      { key: 'name', label: '名称' },
      { key: 'description', label: '描述' },
      { key: 'scope', label: '影响范围' },
    ],
  },
  {
    key: 'phases',
    label: '进程阶段',
    fields: [
      { key: 'name', label: '阶段名称' },
      { key: 'duration', label: '持续时间' },
      { key: 'mechanism', label: '机制' },
      { key: 'manifestation', label: '表现' },
      { key: 'target', label: '目标' },
      { key: 'keyIndicator', label: '关键指标' },
    ],
  },
  {
    key: 'protocols',
    label: '应对协议',
    fields: [
      { key: 'phase', label: '阶段' },
      { key: 'procedureName', label: '协议名称' },
      { key: 'measures', label: '措施描述', type: 'textarea' },
      { key: 'department', label: '负责部门' },
    ],
  },
  {
    key: 'accessRequirements',
    label: '访问要求',
    fields: [
      { key: 'allowed', label: '允许', type: 'boolean' },
      { key: 'text', label: '描述', type: 'textarea' },
    ],
  },
  {
    key: 'behaviorGuidelines',
    label: '行为准则',
    fields: [
      { key: 'allowed', label: '允许', type: 'boolean' },
      { key: 'text', label: '内容', type: 'textarea' },
    ],
  },
  {
    key: 'emergencyProcedures',
    label: '应急程序',
    fields: [
      { key: 'allowed', label: '允许', type: 'boolean' },
      { key: 'text', label: '步骤描述', type: 'textarea' },
    ],
  },
  {
    key: 'knownEntities',
    label: '已知实体',
    fields: [
      { key: 'name', label: '名称' },
      { key: 'type', label: '类型' },
      { key: 'behavior', label: '行为' },
      { key: 'mechanism', label: '机制', type: 'textarea' },
      { key: 'dangerLevel', label: '危险等级' },
      { key: 'contactRecord', label: '接触记录', type: 'textarea' },
    ],
  },
]

function toItems(arr: unknown): ArrayItem[] {
  if (!Array.isArray(arr)) return []
  return arr.map((item: any, i: number) => ({ id: i, data: { ...(item || {}) } }))
}

export default function ThresholdArchiveDetails({ details, onChange }: Props) {
  const handleSimpleChange = (key: string, value: string) => {
    onChange({ ...details, [key]: value })
  }

  const handleArrayChange = (sectionKey: string, items: ArrayItem[]) => {
    const arr = items.map(item => item.data)
    onChange({ ...details, [sectionKey]: arr })
  }

  const handleAdd = (sectionKey: string, fields: { key: string }[]) => {
    const items = toItems(details[sectionKey])
    const newItem: Record<string, unknown> = {}
    for (const f of fields) {
      newItem[f.key] = f.key === 'allowed' ? true : ''
    }
    items.push({ id: Date.now(), data: newItem })
    handleArrayChange(sectionKey, items)
  }

  const handleRemove = (sectionKey: string, idx: number) => {
    const items = toItems(details[sectionKey])
    items.splice(idx, 1)
    handleArrayChange(sectionKey, items)
  }

  const handleItemFieldChange = (sectionKey: string, idx: number, fieldKey: string, value: unknown) => {
    const items = toItems(details[sectionKey])
    items[idx].data[fieldKey] = value
    handleArrayChange(sectionKey, items)
  }

  return (
    <div className="space-y-6">
      {/* 简单文本字段 */}
      {['commonName', 'archiveNature', 'coreFeatures', 'discoveryLocation', 'anomalyReport', 'responseTeam'].map(key => (
        <div key={key}>
          <label className="block text-[10px] text-[#888888] mb-1 tracking-wider uppercase" style={{ fontFamily: MONO }}>
            {key === 'commonName' ? '通用名称' : key === 'archiveNature' ? '档案性质' : key === 'coreFeatures' ? '核心特征' : key === 'discoveryLocation' ? '发现地点' : key === 'anomalyReport' ? '异常报告' : '响应队伍'}
          </label>
          <input
            value={String(details[key] ?? '')}
            onChange={e => handleSimpleChange(key, e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60"
            placeholder={`输入${key}`}
          />
        </div>
      ))}

      {/* 数组字段 */}
      {SECTIONS.map(section => {
        const items = toItems(details[section.key])
        return (
          <div key={section.key} className="border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#d4a373]" style={{ fontFamily: MONO }}>{section.label}</span>
              <button
                type="button"
                onClick={() => handleAdd(section.key, section.fields)}
                className="text-[10px] px-2 py-1 border border-white/10 text-[#888888] hover:text-[#f0f0f0] transition-colors"
                style={{ fontFamily: MONO }}
              >
                + 添加
              </button>
            </div>

            {items.length === 0 && (
              <div className="text-[10px] text-[#555] py-2" style={{ fontFamily: MONO }}>暂无数据</div>
            )}

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="border border-white/[0.04] bg-black/20 p-3 relative">
                  <button
                    type="button"
                    onClick={() => handleRemove(section.key, idx)}
                    className="absolute top-2 right-2 text-[10px] text-[#e60012] hover:text-[#e60012]/80"
                    style={{ fontFamily: MONO }}
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-2 gap-2 pr-6">
                    {section.fields.map(field => (
                      <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                        <label className="block text-[9px] text-[#666] mb-0.5 uppercase tracking-wider" style={{ fontFamily: MONO }}>
                          {field.label}
                        </label>
                        {field.type === 'boolean' ? (
                          <select
                            value={item.data[field.key] === true ? 'true' : 'false'}
                            onChange={e => handleItemFieldChange(section.key, idx, field.key, e.target.value === 'true')}
                            className="w-full bg-black/40 border border-white/10 px-2 py-1.5 text-xs text-[#f0f0f0] outline-none"
                            style={{ fontFamily: MONO }}
                          >
                            <option value="true">允许 ✓</option>
                            <option value="false">禁止 ✗</option>
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={String(item.data[field.key] ?? '')}
                            onChange={e => handleItemFieldChange(section.key, idx, field.key, e.target.value)}
                            rows={2}
                            className="w-full bg-black/40 border border-white/10 px-2 py-1.5 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 resize-none"
                          />
                        ) : (
                          <input
                            value={String(item.data[field.key] ?? '')}
                            onChange={e => handleItemFieldChange(section.key, idx, field.key, e.target.value)}
                            className="w-full bg-black/40 border border-white/10 px-2 py-1.5 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
