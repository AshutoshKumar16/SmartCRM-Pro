import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useState } from 'react'
import api from '../../lib/axios'

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', budget: '', message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/leads/public', form)
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gray-50 flex-1 py-20 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">Contact us</div>
            <h1 className="text-4xl font-bold text-gray-900">Get a free quote</h1>
            <p className="text-gray-500 mt-3">Fill out the form below and our team will get back to you within 24 hours.</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Thank you!</h2>
              <p className="text-green-600">We've received your enquiry. Our team will contact you shortly.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Full name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Company name</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Your company"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Budget range</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select budget range</option>
                    <option>₹1L - ₹5L</option>
                    <option>₹5L - ₹10L</option>
                    <option>₹10L - ₹25L</option>
                    <option>₹25L+</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit enquiry →'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}