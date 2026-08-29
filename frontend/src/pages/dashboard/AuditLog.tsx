import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, ScrollText } from 'lucide-react'

interface Log {
  id: string
  action: string
  entityType?: string
  createdAt: string
  user: {
    name: string
    role: string
  }
}

export default function AuditLog({ dark }: { dark: boolean }) {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const d = dark

  useEffect(() => {
    api.get('/activity-logs').then(res => setLogs(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filtered = logs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    (log.user?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    (log.entityType?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Audit Log</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{logs.length} recent activities</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by user, action, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-full ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <ScrollText className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>
            {logs.length === 0 ? 'No activity yet' : `No results for "${search}"`}
          </div>
          <div className="text-xs text-ink-400">
            {logs.length === 0 ? 'Actions taken in the CRM will appear here.' : 'Try a different search.'}
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${d ? 'border-ink-800 text-ink-400' : 'border-ink-100 text-ink-500'}`}>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Action</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className={`border-b last:border-0 ${d ? 'border-ink-800' : 'border-ink-50'}`}>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${d ? 'text-white' : 'text-ink-900'}`}>{log.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-ink-400">{log.user?.role}</div>
                  </td>
                  <td className={`px-6 py-4 ${d ? 'text-ink-300' : 'text-ink-600'}`}>{log.action}</td>
                  <td className="px-6 py-4">
                    {log.entityType && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-600'}`}>{log.entityType}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-xs font-mono ${d ? 'text-ink-400' : 'text-ink-500'}`}>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}