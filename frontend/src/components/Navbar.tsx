import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">Smart</span>CRM Pro
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">Home</Link>
          <Link to="/services" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">Services</Link>
          <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">About</Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-blue-600 font-medium hover:underline">Login</Link>
          <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Get free quote
          </Link>
        </div>

      </div>
    </nav>
  )
}