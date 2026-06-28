import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Leads from './Leads'
import Pipeline from './Pipeline'
import Analytics from './Analytics'
import Customers from './Customers'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [dark, setDark] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const mainNav = ['Dashboard', 'Leads', 'Customers', 'Pipeline', 'Meetings', 'Tasks']
  const analyticsNav = ['Reports', 'Leaderboard', 'Audit Log']

  const metrics = [
    { label: 'Total Leads', value: '0', delta: '+0 today', icon: '👥', color: 'text-blue-500' },
    { label: 'Conversion Rate', value: '0%', delta: 'No data yet', icon: '🎯', color: 'text-emerald-500' },
    { label: 'Revenue (Month)', value: '₹0', delta: 'No data yet', icon: '💰', color: 'text-violet-500' },
    { label: 'Meetings Today', value: '0', delta: 'No meetings', icon: '📅', color: 'text-amber-500' },
  ]

  const d = dark

  return (
    <div className={`min-h-screen flex ${d ? 'bg-gray-950 text-white' : 'bg-[#f8f9fc] text-gray-900'}`}>

      {/* Sidebar */}
      <div className={`w-64 flex flex-col fixed h-full border-r ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>

        <div className="px-6 py-6">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-blue-500">Smart</span>
            <span className={d ? 'text-white' : 'text-gray-900'}>CRM Pro</span>
          </div>
        </div>

        <div className={`mx-4 mb-6 p-3 rounded-xl flex items-center gap-3 ${d ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className={`text-sm font-semibold truncate ${d ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
            <div className="text-xs text-blue-500 font-medium mt-0.5">{user.role}</div>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-auto">
          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-3 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Main</div>
          {mainNav.map((label) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm mb-1 font-medium transition-all ${
                activeNav === label
                  ? 'bg-blue-600 text-white'
                  : d
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}

          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-3 mt-6 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Analytics</div>
          {analyticsNav.map((label) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm mb-1 font-medium transition-all ${
                activeNav === label
                  ? 'bg-blue-600 text-white'
                  : d
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className={`px-4 py-5 border-t ${d ? 'border-gray-800' : 'border-gray-100'}`}>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Topbar */}
        <div className={`px-10 py-4 flex items-center justify-between sticky top-0 z-10 border-b ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div>
            <div className={`text-lg font-bold ${d ? 'text-white' : 'text-gray-900'}`}>
              {activeNav}
            </div>
            <div className={`text-xs mt-0.5 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!d)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition ${d ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {d ? '☀️' : '🌙'}
            </button>
            <button className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-lg transition ${d ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
              🔔
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {user.name?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-10">

          {activeNav === 'Dashboard' && (
            <>
              <div className="grid grid-cols-4 gap-5 mb-8">
                {metrics.map((m) => (
                  <div key={m.label} className={`rounded-2xl p-6 border ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm font-medium ${d ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</span>
                      <span className="text-2xl">{m.icon}</span>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${m.color}`}>{m.value}</div>
                    <div className={`text-xs font-medium ${d ? 'text-gray-600' : 'text-gray-400'}`}>{m.delta}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5 mb-5">
                <div className={`col-span-2 rounded-2xl border ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className={`px-7 py-5 border-b flex items-center justify-between ${d ? 'border-gray-800' : 'border-gray-100'}`}>
                    <span className={`font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Recent Leads</span>
                    <button onClick={() => setActiveNav('Leads')} className="text-sm text-blue-500 hover:underline font-medium">View all →</button>
                  </div>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 ${d ? 'bg-gray-800' : 'bg-gray-50'}`}>👥</div>
                    <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>No leads yet</div>
                    <div className={`text-xs max-w-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>Submit an enquiry from the website or add a lead manually.</div>
                  </div>
                </div>

                <div className={`rounded-2xl border ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className={`px-7 py-5 border-b ${d ? 'border-gray-800' : 'border-gray-100'}`}>
                    <span className={`font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Quick Actions</span>
                  </div>
                  <div className="p-5 flex flex-col gap-2.5">
                    {[
                      { label: '+ Add new lead', primary: true },
                      { label: 'Schedule meeting', primary: false },
                      { label: 'Create task', primary: false },
                      { label: 'Generate invoice', primary: false },
                      { label: 'View pipeline', primary: false },
                    ].map((a) => (
                      <button
                        key={a.label}
                        onClick={() => a.label.includes('lead') ? setActiveNav('Leads') : null}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                          a.primary
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : d
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[
                  { icon: '📋', title: 'Pipeline', sub: 'No active deals' },
                  { icon: '📅', title: 'Meetings', sub: 'No meetings scheduled' },
                  { icon: '✅', title: 'Tasks', sub: 'No pending tasks' },
                ].map((c) => (
                  <div key={c.title} className={`rounded-2xl border p-8 flex flex-col items-center justify-center text-center shadow-sm ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${d ? 'bg-gray-800' : 'bg-gray-50'}`}>{c.icon}</div>
                    <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-gray-800'}`}>{c.title}</div>
                    <div className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeNav === 'Leads' && <Leads dark={d} />}
{activeNav === 'Pipeline' && <Pipeline dark={d} />}
{activeNav === 'Reports' && <Analytics dark={d} />}
{activeNav === 'Customers' && <Customers dark={d} />}
        </div>
      </div>
    </div>
  )
}