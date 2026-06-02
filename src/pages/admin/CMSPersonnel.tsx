import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import CMSLayout from '../../components/CMSLayout'
import { api, type ApiPersonnel } from '../../lib/api'
import { MONO } from '../../utils/fonts'

export default function CMSPersonnel() {
  const [personnel, setPersonnel] = useState<ApiPersonnel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.personnel.list({})
      .then(setPersonnel)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CMSLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg text-[#f0f0f0] font-bold">人事管理</h1>
            <p className="text-xs text-[#888888] mt-1">共 {personnel.length} 条记录</p>
          </div>
          <Link
            to="/admin/personnel/new"
            className="px-3 py-1.5 text-xs border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors"
            style={{ fontFamily: MONO }}
          >
            + 新增
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12 text-xs text-[#888888]" style={{ fontFamily: MONO }}>
            加载中...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-xs text-[#e60012]">
            加载失败：{error}
          </div>
        )}

        {!loading && !error && (
          <div className="border border-white/10 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#888888]" style={{ fontFamily: MONO }}>
                  <th className="text-left p-3 font-normal">人员编码</th>
                  <th className="text-left p-3 font-normal">姓名</th>
                  <th className="text-left p-3 font-normal">部门</th>
                  <th className="text-left p-3 font-normal">部门编码</th>
                  <th className="text-left p-3 font-normal">职位</th>
                  <th className="text-left p-3 font-normal">状态</th>
                  <th className="text-left p-3 font-normal">权限等级</th>
                  <th className="text-left p-3 font-normal">ESIG</th>
                  <th className="text-left p-3 font-normal w-20">操作</th>
                </tr>
              </thead>
              <tbody>
                {personnel.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-[#60a5fa]" style={{ fontFamily: MONO }}>{p.code}</td>
                    <td className="p-3 text-[#f0f0f0]">
                      {p.name}{p.nameEn ? ` (${p.nameEn})` : ''}
                    </td>
                    <td className="p-3 text-[#888888]">{p.department?.name || '-'}</td>
                    <td className="p-3 text-[#60a5fa]" style={{ fontFamily: MONO }}>{p.department?.code || '-'}</td>
                    <td className="p-3 text-[#888888]">{p.position || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] ${
                        p.status === '现役' ? 'text-[#4ade80] border border-[#4ade80]/40' :
                        p.status === '阵亡' ? 'text-[#e60012] border border-[#e60012]/40' :
                        'text-[#facc15] border border-[#facc15]/40'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#888888]" style={{ fontFamily: MONO }}>{p.clearanceLevel}</td>
                    <td className="p-3 text-[#888888]" style={{ fontFamily: MONO }}>{p.esigCode || '-'}</td>
                    <td className="p-3">
                      <Link
                        to={`/admin/personnel/${p.id}`}
                        className="text-[10px] text-[#60a5fa] hover:text-[#60a5fa]/80 transition-colors"
                        style={{ fontFamily: MONO }}
                      >
                        编辑
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CMSLayout>
  )
}
