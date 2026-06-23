import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            ⚡ Trusted by 500+ companies across India
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            The CRM that closes deals<br />
            <span className="text-blue-600">faster than ever</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            SmartCRM Pro gives your sales team everything they need — from lead capture to revenue collection — in one powerful platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition">
              Get a free quote →
            </Link>
            <Link to="/login" className="border border-gray-200 hover:border-blue-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition">
              View demo
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16 pt-10 border-t border-gray-100">
            {[
              { val: '500+', lab: 'Companies' },
              { val: '₹200Cr+', lab: 'Revenue tracked' },
              { val: '12K+', lab: 'Leads managed' },
              { val: '4.9★', lab: 'Average rating' },
            ].map((s) => (
              <div key={s.lab} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{s.val}</div>
                <div className="text-sm text-gray-400 mt-1">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">Features</div>
            <h2 className="text-3xl font-bold text-gray-900">Everything your sales team needs</h2>
            <p className="text-gray-500 mt-2">12 powerful modules in one platform</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Kanban Pipeline', desc: 'Drag and drop leads across stages with real-time sync across your entire team.' },
              { icon: '🤖', title: 'AI Email Drafter', desc: 'Generate personalized outreach emails instantly using lead context and OpenAI.' },
              { icon: '📊', title: 'Live Analytics', desc: 'Track revenue, conversion rates, and MoM growth across real-time dashboards.' },
              { icon: '🔔', title: 'Real-time Notifications', desc: 'Instant alerts via Socket.io for lead assignments, meetings, and overdue tasks.' },
              { icon: '🛡️', title: 'Role-based Access', desc: 'Admin, Manager, and Sales Executive roles with fine-grained data permissions.' },
              { icon: '📄', title: 'PDF Invoice Generator', desc: 'Generate professional GST-compliant invoices with one click using PDFKit.' },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="font-semibold text-gray-900 mb-2">{f.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">Testimonials</div>
            <h2 className="text-3xl font-bold text-gray-900">Trusted by industry leaders</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { text: '"SmartCRM improved our lead conversion rate by 40%. The AI email feature alone saves our team 2 hours every day."', name: 'Arjun Kapoor', role: 'CEO, TechCorp India', init: 'AK' },
              { text: '"We replaced spreadsheets with SmartCRM. Now our entire team\'s performance is visible in one dashboard."', name: 'Riya Singh', role: 'Sales Head, GrowthCo', init: 'RS' },
              { text: '"Real-time notifications reduced our response time from 3 hours to under 15 minutes. A complete game changer."', name: 'Vikram Mehta', role: 'Director, InnovateLabs', init: 'VM' },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">{t.init}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Start closing more deals today</h2>
        <p className="text-blue-100 mb-8">Fill out the form — our team will get back to you within 24 hours.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/contact" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition">
            Get free quote →
          </Link>
          <a href="tel:+919876500000" className="border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            +91 98765 00000
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}