import { useState, useEffect } from 'react'
import api from '../../lib/axios'

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

  const d = dark

  useEffect(() => {
    api.get('/activity-logs').then(res => setLogs(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Audit Log</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{logs.length} recent activities</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : logs.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="text-4xl mb-3">📋</div>
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No activity yet</div>
          <div className="text-xs text-gray-400">Actions taken in the CRM will appear here.</div>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${d ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Action</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className={`border-b last:border-0 ${d ? 'border-gray-800' : 'border-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${d ? 'text-white' : 'text-gray-900'}`}>{log.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{log.user?.role}</div>
                  </td>
                  <td className={`px-6 py-4 ${d ? 'text-gray-300' : 'text-gray-600'}`}>{log.action}</td>
                  <td className="px-6 py-4">
                    {log.entityType && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${d ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{log.entityType}</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-xs ${d ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}