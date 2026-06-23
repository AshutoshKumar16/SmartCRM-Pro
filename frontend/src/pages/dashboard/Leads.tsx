import { useState, useEffect } from 'react'
import api from '../../lib/axios'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  status: string
  source: string
  score: number
  createdAt: string
  assignedTo?: { id: string; name: string }
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  MEETING: 'bg-purple-100 text-purple-700',
  PROPOSAL: 'bg-orange-100 text-orange-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
}

export default function Leads({ dark }: { dark: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', budget: '', source: 'MANUAL' })
  const [submitting, setSubmitting] = useState(false)

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads')
      setLeads(res.data)
    } catch {
      console.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/leads', form)
      setShowModal(false)
      setForm({ name: '', email: '', phone: '', company: '', budget: '', source: 'MANUAL' })
      fetchLeads()
    } catch {
      console.error('Failed to create lead')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    await api.delete(`/leads/${id}`)
    fetchLeads()
  }

  const handleStatusChange = async (id: string, status: string) => {
    await api.patch(`/leads/${id}/status`, { status })
    fetchLeads()
  }

  const filtered = leads
    .filter(l => statusFilter === 'ALL' || l.status === statusFilter)
    .filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )

  const d = dark

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Leads</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Add lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`px-4 py-2.5 rounded-xl text-sm border outline-none w-64 ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'}`}
        />
        {['ALL', 'NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : d ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">👥</div>
            <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-gray-800'}`}>No leads found</div>
            <div className="text-xs text-gray-400 mt-1">Add a lead or submit an enquiry from the website.</div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`text-xs font-semibold uppercase tracking-wide border-b ${d ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Company</th>
                <th className="text-left px-6 py-4">Budget</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Assigned to</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className={`border-b last:border-0 ${d ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>{lead.name}</div>
                    <div className="text-xs text-gray-400">{lead.email}</div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${d ? 'text-gray-300' : 'text-gray-600'}`}>{lead.company || '—'}</td>
                  <td className={`px-6 py-4 text-sm ${d ? 'text-gray-300' : 'text-gray-600'}`}>{lead.budget || '—'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[lead.status]}`}
                    >
                      {['NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`px-6 py-4 text-sm ${d ? 'text-gray-300' : 'text-gray-600'}`}>
                    {lead.assignedTo?.name || <span className="text-gray-400">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Add new lead</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: 'Full name *', key: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email *', key: 'email', type: 'email', placeholder: 'john@company.com' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                { label: 'Company', key: 'company', type: 'text', placeholder: 'Company name' },
                { label: 'Budget', key: 'budget', type: 'text', placeholder: '₹5L - ₹10L' },
              ].map((f) => (
                <div key={f.key}>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.label.includes('*')}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}