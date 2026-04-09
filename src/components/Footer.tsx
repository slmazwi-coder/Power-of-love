import { Link } from 'react-router-dom';
import { SCHOOL_INFO } from '../constants';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/Logo.jpg"
                alt="Power of Love Logo"
                className="w-12 h-12 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight uppercase tracking-tight">
                  Power of Love
                </span>
                <span className="text-navy-300 text-xs font-medium uppercase tracking-widest">
                  Primary School
                </span>
              </div>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed">
              "{SCHOOL_INFO.motto}" - Providing excellence in education and character building for the future leaders of Kokstad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-navy-200 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link to="/fees" className="hover:text-white transition-colors">School Fees</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Uniform Shop</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-navy-200 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-navy-400 shrink-0" />
                <span>{SCHOOL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-navy-400 shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-navy-400 shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">School Hours</h3>
            <ul className="space-y-4 text-navy-200 text-sm">
              <li className="flex justify-between">
                <span>Mon - Thu:</span>
                <span>07:30 - 14:30</span>
              </li>
              <li className="flex justify-between">
                <span>Friday:</span>
                <span>07:30 - 13:30</span>
              </li>
              <li className="flex justify-between">
                <span>Weekends:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-navy-400 text-xs">
          <p>© {new Date().getFullYear()} Power of Love Primary School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/admin" className="hover:text-white">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
