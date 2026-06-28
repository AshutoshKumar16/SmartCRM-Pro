import { useState, useEffect } from 'react'
import api from '../../lib/axios'

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
  if (score >= 70) return 'text-green-500'
  if (score >= 40) return 'text-yellow-500'
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

  const d = dark

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Customers</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{customers.length} total customers</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : customers.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="text-4xl mb-3">🏢</div>
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No customers yet</div>
          <div className="text-xs text-gray-400">Convert a won lead to create a customer.</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {customers.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`rounded-2xl border p-5 cursor-pointer shadow-sm transition hover:border-blue-400 ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold`}>
                  {c.companyName.charAt(0)}
                </div>
                <span className={`text-xs font-semibold ${healthColor(c.healthScore)}`}>{healthLabel(c.healthScore)}</span>
              </div>
              <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-gray-900'}`}>{c.companyName}</div>
              <div className={`text-xs mb-3 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{c.lead.name} · {c.lead.email}</div>
              <div className={`text-xs font-medium ${d ? 'text-gray-400' : 'text-gray-500'}`}>Project: {c.projectName || '—'}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>Total value</span>
                <span className={`text-sm font-bold text-emerald-500`}>₹{c.totalValue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-xl ${d ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>{selected.companyName}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
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
                <div key={item.label} className={`p-3 rounded-xl ${d ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className={`text-xs mb-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</div>
                  <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className={`text-sm font-semibold mb-3 ${d ? 'text-white' : 'text-gray-900'}`}>Payments</div>
              {selected.payments.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">No payments yet</div>
              ) : (
                selected.payments.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl mb-2 ${d ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <span className={`text-sm font-medium ${d ? 'text-white' : 'text-gray-900'}`}>₹{p.amount.toLocaleString()}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      p.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      p.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
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