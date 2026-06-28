import { useState, useEffect } from 'react'
import api from '../../lib/axios'

interface Task {
  id: string
  title: string
  description?: string
  priority: string
  status: string
  dueDate?: string
  assignedTo?: { name: string }
  lead?: { name: string }
}

const priorityColors: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

export default function Tasks({ dark }: { dark: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
  const [submitting, setSubmitting] = useState(false)

  const d = dark

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch {
      console.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/tasks', form)
      setShowModal(false)
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
      fetchTasks()
    } catch {
      console.error('Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    await api.patch(`/tasks/${id}`, { status })
    fetchTasks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Tasks</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Add task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="text-4xl mb-3">✅</div>
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No tasks yet</div>
          <div className="text-xs text-gray-400">Create a task to track follow-ups and activities.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div key={task.id} className={`rounded-2xl border p-5 shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${priorityColors[task.priority]}`}>{task.priority}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusColors[task.status]}`}>{task.status}</span>
                  </div>
                  <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                  {task.description && <div className={`text-sm ${d ? 'text-gray-400' : 'text-gray-500'}`}>{task.description}</div>}
                  <div className="flex items-center gap-4 mt-2">
                    {task.assignedTo && <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>👤 {task.assignedTo.name}</span>}
                    {task.lead && <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>🎯 {task.lead.name}</span>}
                    {task.dueDate && <span className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[task.status]}`}
                  >
                    {['PENDING', 'IN_PROGRESS', 'DONE'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(task.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
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
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Add new task</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Title *</label>
                <input
                  type="text"
                  placeholder="Follow up call"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Description</label>
                <textarea
                  placeholder="Task details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-gray-400' : 'text-gray-600'}`}>Due date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${d ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}