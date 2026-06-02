import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, type ApiDepartment } from '../../lib/api'
import { MONO } from '../../utils/fonts'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1'

export default function CMSPersonnelForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [departments, setDepartments] = useState<ApiDepartment[]>([])
  const [form, setForm] = useState({
    code: '',
    name: '',
    nameEn: '',
    title: '',
    codename: '',
    departmentId: '',
    position: '',
    status: '现役',
    specialty: '',
    clearanceLevel: '1',
    esigCode: '',
  })

  useEffect(() => {
    api.departments.list().then(setDepartments).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/cms/personnel/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setForm({
          code: data.code || '',
          name: data.name || '',
          nameEn: data.nameEn || '',
          title: data.title || '',
          codename: data.codename || '',
          departmentId: data.departmentId ? String(data.departmentId) : '',
          position: data.position || '',
          status: data.status || '现役',
          specialty: data.specialty || '',
          clearanceLevel: String(data.clearanceLevel ?? 1),
          esigCode: data.esigCode || '',
        })
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    load()
  }, [id, isEdit])

  const handleChange = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!form.code || !form.name) return
    setSaving(true)
    try {
      const body = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        clearanceLevel: Number(form.clearanceLevel),
        nameEn: form.nameEn || null,
        title: form.title || null,
        codename: form.codename || null,
        position: form.position || null,
        specialty: form.specialty || null,
        esigCode: form.esigCode || null,
      }
      const url = isEdit
        ? `${API_BASE}/cms/personnel/${id}`
        : `${API_BASE}/cms/personnel`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) navigate('/admin/personnel')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!isEdit) return
    if (!confirm('确认删除此人？')) return
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/cms/personnel/${id}`, { method: 'DELETE' })
      if (res.ok) navigate('/admin/personnel')
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  if (loading) {
    return (
      <CMSLayout>
        <div className="p-6 text-center py-12 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
          加载中...
        </div>
      </CMSLayout>
    )
  }

  return (
    <CMSLayout>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg text-[#f0f0f0] font-bold">
            {isEdit ? '编辑人员' : '新增人员'}
          </h1>
          <div className="flex items-center gap-3">
            {isEdit && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs border border-[#e60012]/40 text-[#e60012] hover:bg-[#e60012]/10 transition-colors"
                style={{ fontFamily: MONO }}
              >
                删除
              </button>
            )}
            <button
              onClick={() => navigate('/admin/personnel')}
              className="px-3 py-1.5 text-xs border border-white/10 text-[#888888] hover:text-[#f0f0f0] transition-colors"
              style={{ fontFamily: MONO }}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.code || !form.name}
              className="px-3 py-1.5 text-xs border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors disabled:opacity-30"
              style={{ fontFamily: MONO }}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        <div className="border border-white/10 p-6 space-y-5">
          {/* 行1: 编码 + 状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>人员编码 *</label>
              <input
                value={form.code}
                onChange={e => handleChange('code', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: HR-40002"
                style={{ fontFamily: MONO }}
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>状态</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                style={{ fontFamily: MONO }}
              >
                <option value="现役">现役</option>
                <option value="阵亡">阵亡</option>
                <option value="MIA">MIA</option>
              </select>
            </div>
          </div>

          {/* 行2: 姓名 + 英文名 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>姓名 *</label>
              <input
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: 戴维·卡特"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>英文名</label>
              <input
                value={form.nameEn}
                onChange={e => handleChange('nameEn', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: David Carter"
              />
            </div>
          </div>

          {/* 行3: 头衔 + 代号 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>头衔</label>
              <input
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: 博士"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>代号</label>
              <input
                value={form.codename}
                onChange={e => handleChange('codename', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: 铁墙"
              />
            </div>
          </div>

          {/* 行4: 部门 + 职位 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>部门</label>
              <select
                value={form.departmentId}
                onChange={e => handleChange('departmentId', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                style={{ fontFamily: MONO }}
              >
                <option value="">无</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>职位</label>
              <input
                value={form.position}
                onChange={e => handleChange('position', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: 医疗与心理部部长"
              />
            </div>
          </div>

          {/* 行5: 专长 + 权限等级 + ESIG */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>专长</label>
              <input
                value={form.specialty}
                onChange={e => handleChange('specialty', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: 神经心理学"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>权限等级</label>
              <select
                value={form.clearanceLevel}
                onChange={e => handleChange('clearanceLevel', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                style={{ fontFamily: MONO }}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#888888] mb-1.5" style={{ fontFamily: MONO }}>ESIG 签名码</label>
              <input
                value={form.esigCode}
                onChange={e => handleChange('esigCode', e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-xs text-[#f0f0f0] outline-none focus:border-[#d4a373]/60 transition-colors"
                placeholder="例: ESIG-DC"
                style={{ fontFamily: MONO }}
              />
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}
