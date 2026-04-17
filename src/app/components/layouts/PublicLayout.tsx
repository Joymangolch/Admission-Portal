import { Outlet, Link } from 'react-router';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-[#1E3A8A] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <GraduationCap className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold">Manipur Technical University</h1>
                <p className="text-sm text-blue-200">Admission Portal 2026</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
              <Link to="/courses" className="hover:text-blue-200 transition-colors">
                Courses
              </Link>
              <Link to="/fees" className="hover:text-blue-200 transition-colors">
                Fee Structure
              </Link>
              <Link to="/login" className="bg-white text-[#1E3A8A] px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">About MTU</h3>
              <p className="text-sm">
                Manipur Technical University is committed to providing quality technical education
                and fostering innovation in the Northeast region.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses Offered</Link></li>
                <li><Link to="/admission" className="hover:text-white transition-colors">Admission Guidelines</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 385 244 1111</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>admission@mtu.edu.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>Takyelpat, Imphal, Manipur - 795004</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Manipur Technical University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
