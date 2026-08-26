import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, Plus, X, Users } from 'lucide-react'

interface Employee {
  id: string
    employeeCode: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: {
    leads: number
    tasks: number
  }
}

const roleColor = (role: string) => {
  if (role === 'ADMIN') return 'bg-violet-50 text-violet-700'
  if (role === 'MANAGER') return 'bg-brand-50 text-brand-700'
  return 'bg-success-100 text-success-500'
}

export default function Employees({ dark }: { dark: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES_EXEC' })
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const d = dark

  const fetchEmployees = () => {
    setLoading(true)
    api.get('/users').then(res => setEmployees(res.data)).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleSubmit = async () => {
    setErrors([])
    setSubmitting(true)
    try {
      await api.post('/auth/register', form)
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'SALES_EXEC' })
      fetchEmployees()
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors || [err?.response?.data?.message || 'Something went wrong']
      setErrors(apiErrors)
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = employees
    .filter(e => roleFilter === 'ALL' || e.role === roleFilter)
    .filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Employees</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{employees.length} total employees</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-72 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
          />
        </div>
        {['ALL', 'ADMIN', 'MANAGER', 'SALES_EXEC'].map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              roleFilter === r
                ? 'bg-brand-600 text-white'
                : d ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' : 'bg-white text-ink-500 border border-ink-200 hover:bg-ink-50'
            }`}
          >
            {r === 'ALL' ? 'All' : r.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <Users className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>
            {employees.length === 0 ? 'No employees yet' : `No results for "${search}"`}
          </div>
          <div className="text-xs text-ink-400">
            {employees.length === 0 ? 'Add your first team member.' : 'Try a different name or filter.'}
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${d ? 'border-ink-800 text-ink-400' : 'border-ink-100 text-ink-500'}`}>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Leads</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className={`border-b last:border-0 ${d ? 'border-ink-800' : 'border-ink-50'}`}>
                  <td className={`px-6 py-4 font-mono text-xs ${d ? 'text-ink-500' : 'text-ink-400'}`}>{emp.employeeCode}</td>
                  <td className={`px-6 py-4 font-medium ${d ? 'text-white' : 'text-ink-900'}`}>{emp.name}</td>
                  <td className={`px-6 py-4 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${roleColor(emp.role)}`}>{emp.role}</span>
                  </td>
                  <td className={`px-6 py-4 font-mono ${d ? 'text-ink-400' : 'text-ink-500'}`}>{emp._count.leads}</td>
                  <td className={`px-6 py-4 font-mono ${d ? 'text-ink-400' : 'text-ink-500'}`}>{emp._count.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Add Employee</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errors.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
                {errors.map((e, i) => (
                  <div key={i} className="text-xs text-red-600">{e}</div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <input
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
              />
              <input
                placeholder="Temporary password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
              />
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
              >
                <option value="SALES_EXEC">Sales Executive</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}