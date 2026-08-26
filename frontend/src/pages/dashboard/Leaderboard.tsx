import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Trophy, Target, Users } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  email: string
  totalLeads: number
  wonLeads: number
  conversionRate: number
}

const rankStyles = [
  { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  { bg: 'bg-ink-100', text: 'text-ink-500', border: 'border-ink-200' },
  { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
]

export default function Leaderboard({ dark }: { dark: boolean }) {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const d = dark

  useEffect(() => {
    api.get('/users/leaderboard').then((res: any) => setData(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Leaderboard</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>Sales performance ranking</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : data.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <Trophy className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>No data yet</div>
          <div className="text-xs text-ink-400">Rankings will appear once leads are assigned.</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data.map((entry, i) => (
            <div
              key={entry.id}
              className={`rounded-2xl border p-5 shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-mono border ${
                      i < 3 ? `${rankStyles[i].bg} ${rankStyles[i].text} ${rankStyles[i].border}` : `${d ? 'bg-ink-800 text-ink-400 border-ink-700' : 'bg-ink-50 text-ink-400 border-ink-200'}`
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>{entry.name}</div>
                    <div className="text-xs text-ink-400">{entry.email}</div>
                  </div>
                </div>
                {i === 0 && <Trophy className="w-5 h-5 text-amber-500" />}
              </div>

              <div className={`grid grid-cols-3 gap-2 pt-4 border-t ${d ? 'border-ink-800' : 'border-ink-100'}`}>
                <div>
                  <div className="flex items-center gap-1 text-ink-400 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Leads</span>
                  </div>
                  <div className={`text-lg font-semibold font-mono ${d ? 'text-white' : 'text-ink-900'}`}>{entry.totalLeads}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-ink-400 mb-1">
                    <Trophy className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Won</span>
                  </div>
                  <div className="text-lg font-semibold font-mono text-success-500">{entry.wonLeads}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-ink-400 mb-1">
                    <Target className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Rate</span>
                  </div>
                  <div className={`text-lg font-semibold font-mono ${d ? 'text-white' : 'text-ink-900'}`}>{entry.conversionRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}