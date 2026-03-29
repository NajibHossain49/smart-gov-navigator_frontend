import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block leading-none">GovNavigator BD</span>
                <span className="text-xs text-slate-500">Smart Government Services</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Find and navigate government services in Bangladesh easily. 
              One platform for all your government service needs.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/services" className="hover:text-primary-600 transition-colors">All Services</Link></li>
              <li><Link href="/services?category=Identity+Services" className="hover:text-primary-600 transition-colors">Identity</Link></li>
              <li><Link href="/services?category=Business+Services" className="hover:text-primary-600 transition-colors">Business</Link></li>
              <li><Link href="/services?category=Land+Services" className="hover:text-primary-600 transition-colors">Land</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/offices" className="hover:text-primary-600 transition-colors">Find Offices</Link></li>
              <li><Link href="/login" className="hover:text-primary-600 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-primary-600 transition-colors">Register</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row
                        justify-between items-center gap-2">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} GovNavigator BD. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built to serve the citizens of Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  )
}
