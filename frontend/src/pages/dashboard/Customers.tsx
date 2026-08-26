import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, Building2, X } from 'lucide-react'

interface Customer {
  id: string
  companyName: string
  projectName?: string
  totalValue: number
  healthScore: number
  createdAt: string
  lead: {
    name: string
    email: string
    phone?: string
  }
  payments: {
    id: string
    amount: number
    status: string
    dueDate?: string
  }[]
}

const healthColor = (score: number) => {
  if (score >= 70) return 'text-success-500'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
}

const healthLabel = (score: number) => {
  if (score >= 70) return '● Healthy'
  if (score >= 40) return '● At Risk'
  return '● Critical'
}

export default function Customers({ dark }: { dark: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [search, setSearch] = useState('')

  const d = dark

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.lead.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lead.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Customers</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{customers.length} total customers</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by company or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-full ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <Building2 className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>
            {customers.length === 0 ? 'No customers yet' : `No results for "${search}"`}
          </div>
          <div className="text-xs text-ink-400">
            {customers.length === 0 ? 'Convert a won lead to create a customer.' : 'Try a different search.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`rounded-2xl border p-5 cursor-pointer shadow-sm transition hover:border-brand-300 ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center text-sm font-bold">
                  {c.companyName.charAt(0)}
                </div>
                <span className={`text-xs font-semibold ${healthColor(c.healthScore)}`}>{healthLabel(c.healthScore)}</span>
              </div>
              <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-ink-900'}`}>{c.companyName}</div>
              <div className={`text-xs mb-3 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{c.lead.name} · {c.lead.email}</div>
              <div className={`text-xs font-medium ${d ? 'text-ink-400' : 'text-ink-500'}`}>Project: {c.projectName || '—'}</div>
              <div className={`flex items-center justify-between mt-3 pt-3 border-t ${d ? 'border-ink-800' : 'border-ink-100'}`}>
                <span className={`text-xs ${d ? 'text-ink-500' : 'text-ink-400'}`}>Total value</span>
                <span className="text-sm font-bold text-success-500 font-mono">₹{c.totalValue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>{selected.companyName}</h2>
              <button onClick={() => setSelected(null)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Contact', value: selected.lead.name },
                { label: 'Email', value: selected.lead.email },
                { label: 'Phone', value: selected.lead.phone || '—' },
                { label: 'Project', value: selected.projectName || '—' },
                { label: 'Total Value', value: `₹${selected.totalValue.toLocaleString()}` },
                { label: 'Health Score', value: `${selected.healthScore}/100` },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                  <div className={`text-xs mb-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{item.label}</div>
                  <div className={`text-sm font-semibold font-mono ${d ? 'text-white' : 'text-ink-900'}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className={`text-sm font-semibold mb-3 ${d ? 'text-white' : 'text-ink-900'}`}>Payments</div>
              {selected.payments.length === 0 ? (
                <div className="text-xs text-ink-400 text-center py-4">No payments yet</div>
              ) : (
                selected.payments.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl mb-2 ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                    <span className={`text-sm font-medium font-mono ${d ? 'text-white' : 'text-ink-900'}`}>₹{p.amount.toLocaleString()}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      p.status === 'PAID' ? 'bg-success-100 text-success-500' :
                      p.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{p.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}