import { useState, useEffect } from 'react'
import api from '../../lib/axios'

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
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function Meetings({ dark }: { dark: boolean }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Meetings</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{meetings.length} total meetings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Schedule meeting
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : meetings.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="text-4xl mb-3">📅</div>
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No meetings yet</div>
          <div className="text-xs text-gray-400">Schedule a meeting with a lead or customer.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {meetings.map(meeting => (
            <div key={meeting.id} className={`rounded-2xl border p-5 shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusColors[meeting.status]}`}>{meeting.status}</span>
                  </div>
                  <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-gray-900'}`}>{meeting.title}</div>
                  {meeting.notes && <div className={`text-sm mb-2 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{meeting.notes}</div>}
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                      📅 {new Date(meeting.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    {meeting.lead && <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>🎯 {meeting.lead.name}</span>}
                    {meeting.customer && <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>🏢 {meeting.customer.companyName}</span>}
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
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Schedule meeting</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Title *</label>
                <input
                  type="text"
                  placeholder="Product demo call"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Notes</label>
                <textarea
                  placeholder="Meeting agenda..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
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