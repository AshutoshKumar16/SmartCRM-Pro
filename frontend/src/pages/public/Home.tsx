import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'
import {
  Kanban, Sparkles, BarChart3, Bell, ShieldCheck, FileText,
  ArrowRight, Phone, UserPlus, Send, TrendingUp, Mail
} from 'lucide-react'

const pipelineCards = [
  { col: 'New', items: [{ name: 'Aditi Rao', co: 'Loop Studio' }, { name: 'Karan Mehta', co: 'Byteworks' }] },
  { col: 'Contacted', items: [{ name: 'Sara Iyer', co: 'Pixel Forge' }] },
  { col: 'Won', items: [{ name: 'Dev Patel', co: 'Nimbus Labs' }] },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-white py-24 px-6 text-center border-b border-ink-100 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{ backgroundImage: 'radial-gradient(#dfe2e8 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            In active development
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-ink-950 leading-[1.08] mb-6 tracking-tight">
            The CRM built for<br />
            <span className="text-brand-600">small dev agencies</span>
          </h1>
          <p className="text-lg text-ink-500 mb-9 leading-relaxed max-w-xl mx-auto">
            Capture leads, assign them automatically, and track every deal from first contact to signed invoice — without the enterprise bloat.
          </p>
          <div className="flex gap-3 justify-center mb-16">
            <Link to="/contact" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3 rounded-lg transition flex items-center gap-2">
              Get a free quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="border border-ink-200 hover:border-brand-400 bg-white text-ink-700 font-semibold px-7 py-3 rounded-lg transition">
              View demo
            </Link>
          </div>

          {/* Product preview — signature element */}
          <div className="bg-white border border-ink-200 rounded-2xl shadow-[0_1px_2px_rgba(20,22,26,0.04),0_12px_32px_rgba(20,22,26,0.06)] overflow-hidden text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-ink-100 bg-ink-50">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-ink-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-ink-200"></span>
              <span className="ml-3 text-xs font-mono text-ink-400">pipeline — live view</span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {pipelineCards.map((col) => (
                <div key={col.col}>
                  <div className="flex items-center gap-1.5 mb-2.5 px-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.col === 'Won' ? 'bg-success-500' : col.col === 'Contacted' ? 'bg-amber-500' : 'bg-brand-500'}`}></span>
                    <span className="text-xs font-semibold text-ink-600">{col.col}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {col.items.map((c) => (
                      <div key={c.name} className="bg-ink-50 border border-ink-100 rounded-lg p-2.5">
                        <div className="text-xs font-medium text-ink-900">{c.name}</div>
                        <div className="text-[11px] text-ink-400 font-mono mt-0.5">{c.co}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-14 mt-16 pt-10 border-t border-ink-100">
            {[
              { val: '12+', lab: 'Core modules' },
              { val: '3', lab: 'User roles' },
              { val: 'AI', lab: 'Email assistant' },
              { val: 'v0.3', lab: 'Current build' },
            ].map((s) => (
              <div key={s.lab} className="text-center">
                <div className="text-2xl font-semibold text-ink-950 font-mono">{s.val}</div>
                <div className="text-sm text-ink-400 mt-1">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">How it works</div>
            <h2 className="text-3xl font-bold text-ink-950 tracking-tight">From first click to closed deal</h2>
          </div>
          <div className="relative grid grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-[22px] left-[8%] right-[8%] h-px bg-ink-200"></div>
            {[
              { icon: UserPlus, title: 'Capture', desc: 'A visitor submits your contact form. A lead record is created instantly — no manual entry.' },
              { icon: Send, title: 'Assign', desc: 'The lead is routed to the next available rep automatically, round-robin, and they\'re notified in real time.' },
              { icon: TrendingUp, title: 'Convert', desc: 'Your rep moves the deal through the pipeline and converts it to a customer with one click.' },
            ].map((s, i) => (
              <div key={s.title} className="relative">
                <div className="relative w-11 h-11 rounded-xl bg-white border border-ink-200 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-xs font-mono text-ink-400 mb-1">0{i + 1}</div>
                <div className="font-semibold text-ink-950 mb-2">{s.title}</div>
                <div className="text-sm text-ink-500 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 px-6 border-t border-ink-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-2">Features</div>
            <h2 className="text-3xl font-bold text-ink-950 tracking-tight">Everything your sales team needs</h2>
            <p className="text-ink-500 mt-2">Built as focused modules, not a bloated suite</p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { icon: Kanban, title: 'Kanban pipeline', desc: 'Drag and drop leads across stages with live sync across your team.' },
              { icon: Sparkles, title: 'AI email drafter', desc: 'Generate a personalized follow-up using lead context, in one click.' },
              { icon: BarChart3, title: 'Live analytics', desc: 'Track revenue, conversion rate, and monthly growth on a real-time dashboard.' },
              { icon: Bell, title: 'Real-time alerts', desc: 'Instant notifications for lead assignments, meetings, and overdue tasks.' },
              { icon: ShieldCheck, title: 'Role-based access', desc: 'Admin, manager, and sales-rep roles with fine-grained permissions.' },
              { icon: FileText, title: 'Invoice generator', desc: 'Generate a professional invoice for a converted customer in seconds.' },
            ].map((f) => (
              <div key={f.title} className="bg-ink-50 border border-ink-100 rounded-xl p-6 hover:border-brand-300 hover:bg-white hover:shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-white border border-ink-200 flex items-center justify-center mb-4">
                  <f.icon className="w-4.5 h-4.5 text-brand-600" />
                </div>
                <div className="font-semibold text-ink-950 mb-1.5">{f.title}</div>
                <div className="text-sm text-ink-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-ink-950 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Start closing more deals today</h2>
        <p className="text-ink-300 mb-9">Fill out the form — our team will get back to you within 24 hours.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/contact" className="bg-white text-ink-950 font-semibold px-7 py-3 rounded-lg hover:bg-ink-100 transition flex items-center gap-2">
            Get free quote <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:+919876500000" className="border border-ink-700 text-white font-semibold px-7 py-3 rounded-lg hover:bg-ink-900 transition flex items-center gap-2">
            <Phone className="w-4 h-4" /> +91 98765 00000
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}