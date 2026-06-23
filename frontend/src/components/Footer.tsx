import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-14">

        <div className="grid grid-cols-4 gap-10 mb-12">
          <div>
            <div className="text-xl font-bold text-white mb-3">
              <span className="text-blue-400">Smart</span>CRM Pro
            </div>
            <p className="text-sm leading-relaxed">
              India's leading enterprise CRM platform. Manage your entire sales lifecycle — from lead capture to revenue collection.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-widest">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm hover:text-white transition">Features</Link>
              <Link to="/" className="text-sm hover:text-white transition">Pricing</Link>
              <Link to="/" className="text-sm hover:text-white transition">Integrations</Link>
              <Link to="/" className="text-sm hover:text-white transition">Changelog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="text-sm hover:text-white transition">About us</Link>
              <Link to="/contact" className="text-sm hover:text-white transition">Contact</Link>
              <Link to="/" className="text-sm hover:text-white transition">Blog</Link>
              <Link to="/" className="text-sm hover:text-white transition">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold mb-4 uppercase tracking-widest">Support</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm hover:text-white transition">Documentation</Link>
              <Link to="/" className="text-sm hover:text-white transition">API Reference</Link>
              <Link to="/" className="text-sm hover:text-white transition">Privacy Policy</Link>
              <Link to="/" className="text-sm hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex items-center justify-between">
          <p className="text-sm">© 2026 SmartCRM Pro. All rights reserved. Made with ♥ in India.</p>
          <div className="flex gap-2">
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">SOC 2</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">GDPR</span>
            <span className="text-xs bg-gray-800 px-2 py-1 rounded">ISO 27001</span>
          </div>
        </div>

      </div>
    </footer>
  )
}