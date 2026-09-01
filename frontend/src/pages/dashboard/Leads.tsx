import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, Plus, X, Users, ChevronLeft, ChevronRight } from 'lucide-react'

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
  message?: string
  assignedTo?: { id: string; name: string }
}

const statusColors: Record<string, string> = {
  NEW: 'bg-brand-50 text-brand-700',
  CONTACTED: 'bg-amber-100 text-amber-700',
  MEETING: 'bg-violet-100 text-violet-700',
  PROPOSAL: 'bg-orange-100 text-orange-700',
  WON: 'bg-success-100 text-success-500',
  LOST: 'bg-red-100 text-red-700',
}

const PAGE_SIZE = 8

export default function Leads({ dark }: { dark: boolean }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', budget: '', source: 'MANUAL' })
  const [submitting, setSubmitting] = useState(false)
  const [convertModal, setConvertModal] = useState<Lead | null>(null)
  const [detailModal, setDetailModal] = useState<Lead | null>(null)
  const [convertForm, setConvertForm] = useState({ companyName: '', projectName: '', totalValue: '' })
  const [converting, setConverting] = useState(false)

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
  useEffect(() => { setPage(1) }, [search, statusFilter])

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

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!convertModal) return
    setConverting(true)
    try {
      await api.post('/customers/convert', {
        leadId: convertModal.id,
        companyName: convertForm.companyName,
        projectName: convertForm.projectName,
        totalValue: parseFloat(convertForm.totalValue) || 0
      })
      setConvertModal(null)
      fetchLeads()
    } catch {
      console.error('Failed to convert')
    } finally {
      setConverting(false)
    }
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const d = dark

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Leads</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{leads.length} total leads</p>
        </div>
        {user.role !== 'SALES_EXEC' && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add lead
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-64 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
          />
        </div>
        {['ALL', 'NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'].map(s => (
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

      <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
        {loading ? (
          <div className="py-20 text-center text-ink-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
            <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-800'}`}>
              {leads.length === 0 ? 'No leads found' : `No results for "${search}"`}
            </div>
            <div className="text-xs text-ink-400 mt-1">
              {leads.length === 0 ? 'Add a lead or submit an enquiry from the website.' : 'Try a different search or filter.'}
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className={`text-xs font-semibold uppercase tracking-wide border-b ${d ? 'bg-ink-800 border-ink-700 text-ink-400' : 'bg-ink-50 border-ink-100 text-ink-400'}`}>
                  <th className="text-left px-6 py-4">Name</th>
                  <th className="text-left px-6 py-4">Company</th>
                  <th className="text-left px-6 py-4">Budget</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Assigned to</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead) => (
                  <tr key={lead.id} onClick={() => setDetailModal(lead)} className={`border-b last:border-0 cursor-pointer ${d ? 'border-ink-800 hover:bg-ink-800' : 'border-ink-50 hover:bg-ink-50'}`}>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>{lead.name}</div>
                      <div className="text-xs text-ink-400">{lead.email}</div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${d ? 'text-ink-300' : 'text-ink-600'}`}>{lead.company || '—'}</td>
                    <td className={`px-6 py-4 text-sm ${d ? 'text-ink-300' : 'text-ink-600'}`}>{lead.budget || '—'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[lead.status]}`}
                      >
                        {['NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`px-6 py-4 text-sm ${d ? 'text-ink-300' : 'text-ink-600'}`}>
                      {lead.assignedTo?.name || <span className="text-ink-400">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {lead.status !== 'WON' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setConvertModal(lead)
                              setConvertForm({ companyName: lead.company || '', projectName: '', totalValue: '' })
                            }}
                            className="text-xs text-success-500 hover:opacity-80 font-medium transition"
                          >
                            Convert
                          </button>
                        )}
                        {user.role !== 'SALES_EXEC' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(lead.id)
                            }}
                            className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={`flex items-center justify-between px-6 py-4 border-t ${d ? 'border-ink-800' : 'border-ink-100'}`}>
              <span className={`text-xs ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${d ? 'bg-ink-800 hover:bg-ink-700 text-ink-300' : 'bg-ink-50 hover:bg-ink-100 text-ink-600'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={`text-xs font-mono px-2 ${d ? 'text-ink-400' : 'text-ink-500'}`}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${d ? 'bg-ink-800 hover:bg-ink-700 text-ink-300' : 'bg-ink-50 hover:bg-ink-100 text-ink-600'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Add new lead</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
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
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required={f.label.includes('*')}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {convertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Convert to Customer</h2>
              <button onClick={() => setConvertModal(null)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-sm mb-5 ${d ? 'text-ink-400' : 'text-ink-500'}`}>
              Converting <strong>{convertModal.name}</strong> to a customer.
            </p>
            <form onSubmit={handleConvert} className="space-y-4">
              {[
                { label: 'Company name *', key: 'companyName', placeholder: 'Company Pvt Ltd' },
                { label: 'Project name', key: 'projectName', placeholder: 'CRM Implementation' },
                { label: 'Total value (₹)', key: 'totalValue', placeholder: '500000' },
              ].map(f => (
                <div key={f.key}>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={(convertForm as any)[f.key]}
                    onChange={(e) => setConvertForm({ ...convertForm, [f.key]: e.target.value })}
                    required={f.label.includes('*')}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setConvertModal(null)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={converting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-success-500 text-white hover:opacity-90 disabled:opacity-50">
                  {converting ? 'Converting...' : 'Convert →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetailModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>{detailModal.name}</h2>
              <button onClick={() => setDetailModal(null)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Email', value: detailModal.email },
                { label: 'Phone', value: detailModal.phone || '—' },
                { label: 'Company', value: detailModal.company || '—' },
                { label: 'Budget', value: detailModal.budget || '—' },
                { label: 'Status', value: detailModal.status },
                { label: 'Assigned to', value: detailModal.assignedTo?.name || 'Unassigned' },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                  <div className={`text-xs mb-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{item.label}</div>
                  <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className={`text-xs font-semibold mb-1.5 ${d ? 'text-ink-400' : 'text-ink-500'}`}>Message</div>
              <div className={`p-3 rounded-xl text-sm ${d ? 'bg-ink-800 text-ink-200' : 'bg-ink-50 text-ink-700'}`}>
                {detailModal.message || 'No message provided.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}