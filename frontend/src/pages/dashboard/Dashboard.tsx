import Leaderboard from './Leaderboard'
import AuditLog from './AuditLog'
import { useEffect, useState, useRef } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '../../lib/socket'
import Employees from './Employees'
import { useNavigate } from 'react-router-dom'
import Leads from './Leads'
import Pipeline from './Pipeline'
import Analytics from './Analytics'
import Customers from './Customers'
import Tasks from './Tasks'
import Meetings from './Meetings'
import api from '../../lib/axios'
import {
  LayoutDashboard, Users, Building2, Kanban, Calendar, CheckSquare, UserCog,
  BarChart3, Trophy, ScrollText, Sun, Moon, Bell, LogOut,
  Target, IndianRupee, CalendarClock
} from 'lucide-react'

const navIcons: Record<string, any> = {
  Dashboard: LayoutDashboard,
  Leads: Users,
  Customers: Building2,
  Pipeline: Kanban,
  Meetings: Calendar,
  Tasks: CheckSquare,
  Employees: UserCog,
  Reports: BarChart3,
  Leaderboard: Trophy,
  'Audit Log': ScrollText,
}

interface DashboardStats {
  totalLeads: number
  conversionRate: number
  revenue: number
  meetingsToday: number
  recentLeads: any[]
  activeDeals: number
  upcomingMeetings: number
  pendingTasks: number
}

interface Notification {
  id: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [dark, setDark] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user.id) {
      connectSocket(user.id)
    }
  }, [])

  const fetchNotifications = () => {
    api.get('/notifications').then(res => {
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.unreadCount)
    }).catch(console.error)
  }

  useEffect(() => {
    if (user.id) {
      fetchNotifications()
    }
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket?.on('notification', () => {
      fetchNotifications()
    })
    return () => {
      getSocket()?.off('notification')
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = async () => {
    await api.patch('/notifications/read-all')
    fetchNotifications()
  }

  const handleNotifClick = async (id: string) => {
    await api.patch(`/notifications/${id}/read`)
    fetchNotifications()
    setShowNotifDropdown(false)
setActiveNav('Leads')
  }

  useEffect(() => {
    if (activeNav === 'Dashboard') {
      setStatsLoading(true)
      api.get('/dashboard').then(res => setStats(res.data)).catch(console.error).finally(() => setStatsLoading(false))
    }
  }, [activeNav])

  const handleLogout = () => {
    disconnectSocket()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const mainNav = ['Dashboard', 'Leads', 'Customers', 'Pipeline', 'Meetings', 'Tasks', 'Employees']
  const analyticsNav = ['Reports', 'Leaderboard', 'Audit Log']

  const metrics = [
    { label: 'Total Leads', value: stats?.totalLeads ?? 0, delta: `${stats?.activeDeals ?? 0} active deals`, icon: Users, accent: 'text-brand-600' },
    { label: 'Conversion Rate', value: `${stats?.conversionRate ?? 0}%`, delta: 'Leads won', icon: Target, accent: 'text-success-500' },
    { label: 'Revenue', value: `₹${(stats?.revenue ?? 0).toLocaleString()}`, delta: 'From won deals', icon: IndianRupee, accent: 'text-violet-600' },
    { label: 'Meetings Today', value: stats?.meetingsToday ?? 0, delta: `${stats?.upcomingMeetings ?? 0} upcoming`, icon: CalendarClock, accent: 'text-amber-600' },
  ]

  const d = dark

  return (
    <div className={`min-h-screen flex ${d ? 'bg-ink-950 text-white' : 'bg-ink-50 text-ink-900'}`}>

      {/* Sidebar */}
      <div className={`w-64 flex flex-col fixed h-full border-r ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'} shadow-sm`}>

        <div className="px-6 py-6">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-brand-600">Smart</span>
            <span className={d ? 'text-white' : 'text-ink-900'}>CRM Pro</span>
          </div>
        </div>

        <div className={`mx-4 mb-6 p-3 rounded-xl flex items-center gap-3 ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className={`text-sm font-semibold truncate ${d ? 'text-white' : 'text-ink-900'}`}>{user.name}</div>
            <div className="text-xs text-brand-600 font-medium mt-0.5">{user.role}</div>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-auto">
          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-3 ${d ? 'text-ink-500' : 'text-ink-400'}`}>Main</div>
          {mainNav.map((label) => {
            const Icon = navIcons[label]
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm mb-1 font-medium transition-all ${
                  activeNav === label
                    ? 'bg-brand-600 text-white'
                    : d
                    ? 'text-ink-400 hover:bg-ink-800 hover:text-white'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            )
          })}

          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-3 mt-6 ${d ? 'text-ink-500' : 'text-ink-400'}`}>Analytics</div>
          {analyticsNav.map((label) => {
            const Icon = navIcons[label]
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm mb-1 font-medium transition-all ${
                  activeNav === label
                    ? 'bg-brand-600 text-white'
                    : d
                    ? 'text-ink-400 hover:bg-ink-800 hover:text-white'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className={`px-4 py-5 border-t ${d ? 'border-ink-800' : 'border-ink-100'}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Topbar */}
        <div className={`px-10 py-4 flex items-center justify-between sticky top-0 z-10 border-b ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
          <div>
            <div className={`text-lg font-bold ${d ? 'text-white' : 'text-ink-900'}`}>
              {activeNav}
            </div>
            <div className={`text-xs mt-0.5 ${d ? 'text-ink-500' : 'text-ink-400'}`}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!d)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${d ? 'bg-ink-800 hover:bg-ink-700 text-ink-300' : 'bg-ink-100 hover:bg-ink-200 text-ink-600'}`}
            >
              {d ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition ${d ? 'bg-ink-800 hover:bg-ink-700 text-ink-300' : 'bg-ink-100 hover:bg-ink-200 text-ink-600'}`}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-lg z-30 ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-200'}`}>
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${d ? 'border-ink-800' : 'border-ink-100'}`}>
                    <span className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-brand-600 hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-xs text-ink-400">No notifications yet</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && handleNotifClick(n.id)}
                          className={`px-4 py-3 border-b last:border-0 cursor-pointer transition ${d ? 'border-ink-800 hover:bg-ink-800' : 'border-ink-50 hover:bg-ink-50'} ${!n.isRead ? (d ? 'bg-ink-800/50' : 'bg-brand-50/50') : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 flex-shrink-0"></span>}
                            <div className="flex-1">
                              <div className={`text-xs ${d ? 'text-ink-200' : 'text-ink-700'}`}>{n.message}</div>
                              <div className="text-[10px] text-ink-400 mt-1 font-mono">
                                {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
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
                  <div key={m.label} className={`rounded-2xl p-6 border ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm font-medium ${d ? 'text-ink-400' : 'text-ink-500'}`}>{m.label}</span>
                      <m.icon className={`w-5 h-5 ${m.accent}`} />
                    </div>
                    <div className={`text-4xl font-bold mb-2 font-mono ${d ? 'text-white' : 'text-ink-900'}`}>
                      {statsLoading ? '—' : m.value}
                    </div>
                    <div className={`text-xs font-medium ${d ? 'text-ink-600' : 'text-ink-400'}`}>{m.delta}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5 mb-5">
                <div className={`col-span-2 rounded-2xl border ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'} shadow-sm`}>
                  <div className={`px-7 py-5 border-b flex items-center justify-between ${d ? 'border-ink-800' : 'border-ink-100'}`}>
                    <span className={`font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>Recent Leads</span>
                    <button onClick={() => setActiveNav('Leads')} className="text-sm text-brand-600 hover:underline font-medium">View all →</button>
                  </div>

                  {statsLoading ? (
                    <div className="py-16 text-center text-ink-400 text-sm">Loading...</div>
                  ) : !stats?.recentLeads?.length ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                        <Users className={`w-6 h-6 ${d ? 'text-ink-500' : 'text-ink-400'}`} />
                      </div>
                      <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>No leads yet</div>
                      <div className={`text-xs max-w-xs ${d ? 'text-ink-500' : 'text-ink-400'}`}>Submit an enquiry from the website or add a lead manually.</div>
                    </div>
                  ) : (
                    <div className="divide-y divide-ink-100">
                      {stats.recentLeads.map((lead) => (
                        <div key={lead.id} className={`px-7 py-4 flex items-center justify-between ${d ? 'divide-ink-800' : ''}`}>
                          <div>
                            <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>{lead.name}</div>
                            <div className="text-xs text-ink-400">{lead.assignedTo?.name || 'Unassigned'}</div>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            lead.status === 'WON' ? 'bg-success-100 text-success-500' :
                            lead.status === 'LOST' ? 'bg-red-100 text-red-700' :
                            d ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-600'
                          }`}>{lead.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`rounded-2xl border ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'} shadow-sm`}>
                  <div className={`px-7 py-5 border-b ${d ? 'border-ink-800' : 'border-ink-100'}`}>
                    <span className={`font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>Quick Actions</span>
                  </div>
                  <div className="p-5 flex flex-col gap-2.5">
                    {[
                      { label: 'Add new lead', primary: true, roles: ['ADMIN', 'MANAGER'], nav: 'Leads' },
                      { label: 'Schedule meeting', primary: false, roles: ['ADMIN', 'MANAGER', 'SALES_EXEC'], nav: 'Meetings' },
                      { label: 'Create task', primary: false, roles: ['ADMIN', 'MANAGER', 'SALES_EXEC'], nav: 'Tasks' },
                      { label: 'Generate invoice', primary: false, roles: ['ADMIN', 'MANAGER'], nav: 'Customers' },
                      { label: 'View pipeline', primary: false, roles: ['ADMIN', 'MANAGER', 'SALES_EXEC'], nav: 'Pipeline' },
                    ].filter((a) => a.roles.includes(user.role)).map((a) => (
                      <button
                        key={a.label}
                        onClick={() => setActiveNav(a.nav)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                          a.primary
                            ? 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800'
                            : d
                            ? 'bg-ink-800 text-ink-300 hover:bg-ink-700 hover:text-white active:bg-brand-600 active:text-white'
                            : 'bg-ink-50 text-ink-700 hover:bg-ink-100 hover:text-ink-900 active:bg-brand-100 active:text-brand-700'
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
                  { icon: Kanban, title: 'Pipeline', sub: `${stats?.activeDeals ?? 0} active deals`, nav: 'Pipeline' },
                  { icon: Calendar, title: 'Meetings', sub: `${stats?.upcomingMeetings ?? 0} scheduled`, nav: 'Meetings' },
                  { icon: CheckSquare, title: 'Tasks', sub: `${stats?.pendingTasks ?? 0} pending`, nav: 'Tasks' },
                ].map((c) => (
                  <div
                    key={c.title}
                    onClick={() => setActiveNav(c.nav)}
                    className={`rounded-2xl border p-8 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:border-brand-300 transition ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                      <c.icon className={`w-5 h-5 ${d ? 'text-ink-400' : 'text-ink-500'}`} />
                    </div>
                    <div className={`text-sm font-semibold mb-1 ${d ? 'text-white' : 'text-ink-800'}`}>{c.title}</div>
                    <div className={`text-xs ${d ? 'text-ink-500' : 'text-ink-400'}`}>{statsLoading ? '...' : c.sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeNav === 'Leads' && <Leads dark={d} />}
          {activeNav === 'Pipeline' && <Pipeline dark={d} />}
          {activeNav === 'Reports' && <Analytics dark={d} />}
          {activeNav === 'Customers' && <Customers dark={d} />}
          {activeNav === 'Tasks' && <Tasks dark={d} />}
          {activeNav === 'Meetings' && <Meetings dark={d} />}
          {activeNav === 'Employees' && <Employees dark={d} />}
          {activeNav === 'Audit Log' && <AuditLog dark={d} />}
          {activeNav === 'Leaderboard' && <Leaderboard dark={d} />}
        </div>
      </div>
    </div>
  )
}