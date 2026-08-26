import { useState } from 'react'
import api from '../../lib/axios'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: 'radial-gradient(#dfe2e8 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative bg-white rounded-2xl border border-ink-100 shadow-[0_1px_2px_rgba(20,22,26,0.04),0_16px_40px_rgba(20,22,26,0.08)] w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-ink-950 tracking-tight">
            <span className="text-brand-600">Smart</span>CRM Pro
          </Link>
          <p className="text-ink-400 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-600 block mb-1.5 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@smartcrm.in"
                className="w-full border border-ink-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-600 block mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-ink-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs text-ink-400 mt-7 font-mono">
          Secured with JWT + bcrypt
        </p>
      </div>
    </div>
  )
}