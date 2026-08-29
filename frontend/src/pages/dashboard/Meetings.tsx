import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, Calendar, Target, Building2, X } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  scheduledAt: string
  notes?: string
  status: string
  lead?: { name: string }
  customer?: { companyName: string }
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-brand-50 text-brand-700',
  COMPLETED: 'bg-success-100 text-success-500',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function Meetings({ dark }: { dark: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', scheduledAt: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const d = dark

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings')
      setMeetings(res.data)
    } catch {
      console.error('Failed to fetch meetings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMeetings() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/meetings', form)
      setShowModal(false)
      setForm({ title: '', scheduledAt: '', notes: '' })
      fetchMeetings()
    } catch {
      console.error('Failed to create meeting')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    await api.patch(`/meetings/${id}`, { status })
    fetchMeetings()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this meeting?')) return
    await api.delete(`/meetings/${id}`)
    fetchMeetings()
  }

  const filtered = meetings
    .filter(m => statusFilter === 'ALL' || m.status === statusFilter)
    .filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.lead?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (m.customer?.companyName.toLowerCase().includes(search.toLowerCase()) ?? false)
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Meetings</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{meetings.length} total meetings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Schedule meeting
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, lead, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-72 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
          />
        </div>
        {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-brand-600 text-white'
                : d ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' : 'bg-white text-ink-500 border border-ink-200 hover:bg-ink-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <Calendar className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>
            {meetings.length === 0 ? 'No meetings yet' : `No results for "${search}"`}
          </div>
          <div className="text-xs text-ink-400">
            {meetings.length === 0 ? 'Schedule a meeting with a lead or customer.' : 'Try a different search or filter.'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(meeting => (
            <div key={meeting.id} className={`rounded-2xl border p-5 shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusColors[meeting.status]}`}>{meeting.status}</span>
                  </div>
                  <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-ink-900'}`}>{meeting.title}</div>
                  {meeting.notes && <div className={`text-sm mb-2 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{meeting.notes}</div>}
                  <div className="flex items-center gap-4">
                    <span className={`text-xs flex items-center gap-1 font-mono ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                      <Calendar className="w-3 h-3" /> {new Date(meeting.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    {meeting.lead && (
                      <span className={`text-xs flex items-center gap-1 ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                        <Target className="w-3 h-3" /> {meeting.lead.name}
                      </span>
                    )}
                    {meeting.customer && (
                      <span className={`text-xs flex items-center gap-1 ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                        <Building2 className="w-3 h-3" /> {meeting.customer.companyName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={meeting.status}
                    onChange={(e) => handleStatusChange(meeting.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[meeting.status]}`}
                  >
                    {['SCHEDULED', 'COMPLETED', 'CANCELLED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(meeting.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Schedule meeting</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Title *</label>
                <input
                  type="text"
                  placeholder="Product demo call"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Notes</label>
                <textarea
                  placeholder="Meeting agenda..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
                  {submitting ? 'Scheduling...' : 'Schedule →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}