import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import api from '../../lib/axios'

interface Lead {
  status: string
  createdAt: string
}

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#f97316', '#10b981', '#ef4444']

export default function Analytics({ dark }: { dark: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const d = dark

  useEffect(() => {
    api.get('/leads').then(res => setLeads(res.data)).catch(console.error)
  }, [])

  // Status distribution
  const statusData = ['NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'].map(s => ({
    name: s,
    value: leads.filter(l => l.status === s).length
  })).filter(s => s.value > 0)

  // Monthly leads
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleString('default', { month: 'short' })
    const count = leads.filter(l => {
      const ld = new Date(l.createdAt)
      return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear()
    }).length
    return { month, leads: count }
  })

  const totalLeads = leads.length
  const wonLeads = leads.filter(l => l.status === 'WON').length
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

  const axisColor = d ? '#4b5563' : '#d1d5db'
  const textColor = d ? '#9ca3af' : '#6b7280'
  const gridColor = d ? '#1f2937' : '#f3f4f6'

  return (
    <div>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
        <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>Sales performance overview</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Leads', value: totalLeads, icon: '👥', color: 'text-blue-500' },
          { label: 'Won Deals', value: wonLeads, icon: '🏆', color: 'text-green-500' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: '🎯', color: 'text-violet-500' },
          { label: 'Lost Deals', value: leads.filter(l => l.status === 'LOST').length, icon: '❌', color: 'text-red-500' },
        ].map(m => (
          <div key={m.label} className={`rounded-2xl p-6 border shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${d ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</span>
              <span className="text-2xl">{m.icon}</span>
            </div>
            <div className={`text-4xl font-bold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Monthly Leads Bar Chart */}
        <div className={`rounded-2xl border p-6 shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-semibold mb-5 ${d ? 'text-white' : 'text-gray-900'}`}>Monthly Leads</h3>
          {totalLeads === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
                <Tooltip
                  contentStyle={{ background: d ? '#1f2937' : '#fff', border: 'none', borderRadius: 12, color: d ? '#fff' : '#111' }}
                />
                <Bar dataKey="leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Status Pie */}
        <div className={`rounded-2xl border p-6 shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-semibold mb-5 ${d ? 'text-white' : 'text-gray-900'}`}>Lead Status Distribution</h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: d ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                    <span className={`text-xs ${d ? 'text-gray-400' : 'text-gray-500'}`}>{s.name}</span>
                    <span className={`text-xs font-bold ${d ? 'text-white' : 'text-gray-900'}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className={`rounded-2xl border p-6 shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-sm font-semibold mb-5 ${d ? 'text-white' : 'text-gray-900'}`}>Lead Trend (Last 6 Months)</h3>
        {totalLeads === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
              <Tooltip contentStyle={{ background: d ? '#1f2937' : '#fff', border: 'none', borderRadius: 12, color: d ? '#fff' : '#111' }} />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}