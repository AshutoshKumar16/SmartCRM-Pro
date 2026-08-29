import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import { Search, User, Target, Calendar as CalendarIcon, CheckSquare, X } from 'lucide-react'

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
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-success-100 text-success-500',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-ink-100 text-ink-700',
  IN_PROGRESS: 'bg-brand-50 text-brand-700',
  DONE: 'bg-success-100 text-success-500',
}

export default function Tasks({ dark }: { dark: boolean }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
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

  const filtered = tasks
    .filter(t => statusFilter === 'ALL' || t.status === statusFilter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedTo?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (t.lead?.name.toLowerCase().includes(search.toLowerCase()) ?? false)
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Tasks</h1>
          <p className={`text-sm mt-1 ${d ? 'text-ink-400' : 'text-ink-500'}`}>{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          + Add task
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, assignee, or lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none w-72 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-white border-ink-200 text-ink-900'}`}
          />
        </div>
        {['ALL', 'PENDING', 'IN_PROGRESS', 'DONE'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-brand-600 text-white'
                : d ? 'bg-ink-800 text-ink-400 hover:bg-ink-700' : 'bg-white text-ink-500 border border-ink-200 hover:bg-ink-50'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-16 text-center ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <CheckSquare className={`w-10 h-10 mx-auto mb-3 ${d ? 'text-ink-600' : 'text-ink-300'}`} />
          <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>
            {tasks.length === 0 ? 'No tasks yet' : `No results for "${search}"`}
          </div>
          <div className="text-xs text-ink-400">
            {tasks.length === 0 ? 'Create a task to track follow-ups and activities.' : 'Try a different search or filter.'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(task => (
            <div key={task.id} className={`rounded-2xl border p-5 shadow-sm ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${priorityColors[task.priority]}`}>{task.priority}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${statusColors[task.status]}`}>{task.status}</span>
                  </div>
                  <div className={`font-semibold mb-1 ${d ? 'text-white' : 'text-ink-900'}`}>{task.title}</div>
                  {task.description && <div className={`text-sm ${d ? 'text-ink-400' : 'text-ink-500'}`}>{task.description}</div>}
                  <div className="flex items-center gap-4 mt-2">
                    {task.assignedTo && (
                      <span className={`text-xs flex items-center gap-1 ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                        <User className="w-3 h-3" /> {task.assignedTo.name}
                      </span>
                    )}
                    {task.lead && (
                      <span className={`text-xs flex items-center gap-1 ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                        <Target className="w-3 h-3" /> {task.lead.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs flex items-center gap-1 font-mono ${d ? 'text-ink-500' : 'text-ink-400'}`}>
                        <CalendarIcon className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
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
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${d ? 'bg-ink-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>Add new task</h2>
              <button onClick={() => setShowModal(false)} className="text-ink-400 hover:text-ink-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Title *</label>
                <input
                  type="text"
                  placeholder="Follow up call"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Description</label>
                <textarea
                  placeholder="Task details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${d ? 'text-ink-400' : 'text-ink-600'}`}>Due date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-brand-500 ${d ? 'bg-ink-800 border-ink-700 text-white' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-700'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
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