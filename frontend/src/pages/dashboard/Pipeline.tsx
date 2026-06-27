import { useState, useEffect } from 'react'
import api from '../../lib/axios'

const STAGES = ['NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST']

const stageColors: Record<string, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  MEETING: 'bg-purple-500',
  PROPOSAL: 'bg-orange-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
}

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  budget?: string
  status: string
  assignedTo?: { name: string }
}

export default function Pipeline({ dark }: { dark: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const d = dark

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

  const handleDragStart = (id: string) => setDragging(id)

  const handleDrop = async (stage: string) => {
    if (!dragging) return
    try {
      await api.patch(`/leads/${dragging}/status`, { status: stage })
      setLeads(prev => prev.map(l => l.id === dragging ? { ...l, status: stage } : l))
    } catch {
      console.error('Failed to update status')
    }
    setDragging(null)
    setDragOver(null)
  }

  const leadsInStage = (stage: string) => leads.filter(l => l.status === stage)

  if (loading) return <div className="text-center py-20 text-gray-400 text-sm">Loading pipeline...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Pipeline</h1>
          <p className={`text-sm mt-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{leads.length} total leads — drag to move stages</p>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 overflow-x-auto">
        {STAGES.map(stage => (
          <div
            key={stage}
            onDragOver={(e) => { e.preventDefault(); setDragOver(stage) }}
            onDrop={() => handleDrop(stage)}
            onDragLeave={() => setDragOver(null)}
            className={`min-h-96 rounded-2xl p-3 border transition ${
              dragOver === stage
                ? 'border-blue-500 bg-blue-500/10'
                : d ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
            }`}
          >
            {/* Stage header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stageColors[stage]}`}></div>
                <span className={`text-xs font-bold uppercase tracking-wide ${d ? 'text-gray-400' : 'text-gray-500'}`}>{stage}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                {leadsInStage(stage).length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {leadsInStage(stage).map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead.id)}
                  className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing shadow-sm transition ${
                    dragging === lead.id
                      ? 'opacity-50'
                      : d ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-900'}`}>{lead.name}</div>
                  {lead.company && <div className={`text-xs mb-1 ${d ? 'text-gray-400' : 'text-gray-500'}`}>{lead.company}</div>}
                  {lead.budget && (
                    <div className={`text-xs font-medium ${d ? 'text-emerald-400' : 'text-emerald-600'}`}>{lead.budget}</div>
                  )}
                  {lead.assignedTo && (
                    <div className={`text-xs mt-2 pt-2 border-t ${d ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                      {lead.assignedTo.name}
                    </div>
                  )}
                </div>
              ))}

              {leadsInStage(stage).length === 0 && (
                <div className={`text-xs text-center py-6 ${d ? 'text-gray-600' : 'text-gray-400'}`}>
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}