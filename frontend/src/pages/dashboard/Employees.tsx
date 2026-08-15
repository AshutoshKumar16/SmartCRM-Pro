import { useState, useEffect } from 'react'
import api from '../../lib/axios'

interface Employee {
  id: string
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
  if (role === 'ADMIN') return 'bg-purple-100 text-purple-700'
  if (role === 'MANAGER') return 'bg-blue-100 text-blue-700'
  return 'bg-emerald-100 text-emerald-700'
}

export default function Employees({ dark }: { dark: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Employees</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{employees.length} total employees</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : employees.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="text-4xl mb-3">👥</div>
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No employees yet</div>
          <div className="text-xs text-gray-400">Add your first team member.</div>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${d ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Leads</th>
                <th className="text-left px-6 py-3 font-semibold text-xs uppercase tracking-wider">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className={`border-b last:border-0 ${d ? 'border-gray-800' : 'border-gray-50'}`}>
                  <td className={`px-6 py-4 font-medium ${d ? 'text-white' : 'text-gray-900'}`}>{emp.name}</td>
                  <td className={`px-6 py-4 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${roleColor(emp.role)}`}>{emp.role}</span>
                  </td>
                  <td className={`px-6 py-4 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{emp._count.leads}</td>
                  <td className={`px-6 py-4 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{emp._count.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Add Employee</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
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
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-blue-500 ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-blue-500 ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <input
                placeholder="Temporary password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-blue-500 ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={`px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-blue-500 ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                <option value="SALES_EXEC">Sales Executive</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
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