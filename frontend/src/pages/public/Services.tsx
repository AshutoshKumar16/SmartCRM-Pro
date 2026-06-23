import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'

export default function About() {
  const stats = [
    { val: '500+', lab: 'Companies served' },
    { val: '₹200Cr+', lab: 'Revenue tracked' },
    { val: '12K+', lab: 'Leads managed' },
    { val: '99.9%', lab: 'Uptime SLA' },
  ]

  const team = [
    { name: 'Rahul Sharma', role: 'CEO & Co-founder', init: 'RS' },
    { name: 'Priya Mehta', role: 'CTO & Co-founder', init: 'PM' },
    { name: 'Amit Verma', role: 'Head of Product', init: 'AV' },
    { name: 'Sneha Joshi', role: 'Head of Sales', init: 'SJ' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-white py-20 px-6 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-3">About us</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Built for Indian sales teams</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            SmartCRM Pro was built to solve the real challenges faced by growing sales teams — scattered data, missed follow-ups, and zero visibility into pipeline health.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.lab} className="text-center">
              <div className="text-3xl font-bold text-white">{s.val}</div>
              <div className="text-blue-200 text-sm mt-1">{s.lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-3">Our mission</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Empowering every sales team with enterprise-grade tools</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We believe every growing business deserves access to the same powerful CRM tools used by Fortune 500 companies — without the complexity or the cost.
            </p>
            <p className="text-gray-500 leading-relaxed">
              SmartCRM Pro brings together lead management, AI-powered tools, real-time collaboration, and deep analytics in one platform that your team will actually use.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎯', title: 'Customer first', desc: 'Every feature is built around real sales workflows.' },
              { icon: '⚡', title: 'Speed matters', desc: 'Fast onboarding, faster results for your team.' },
              { icon: '🔒', title: 'Security first', desc: 'Enterprise-grade security with JWT and bcrypt.' },
              { icon: '📈', title: 'Data driven', desc: 'Every decision backed by real-time analytics.' },
            ].map((v) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-2xl mb-2">{v.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{v.title}</div>
                <div className="text-xs text-gray-500">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">Our team</div>
            <h2 className="text-3xl font-bold text-gray-900">The people behind SmartCRM</h2>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {t.init}
                </div>
                <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                <div className="text-xs text-gray-400 mt-1">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-6 text-center border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to transform your sales process?</h2>
        <p className="text-gray-500 mb-6">Join 500+ companies already using SmartCRM Pro.</p>
        <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition">
          Get started today →
        </Link>
      </section>

      <Footer />
    </div>
  )
}