import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { SCHOOL_INFO } from '../constants';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto font-light">
            We are here to help. Reach out to us for any enquiries regarding admissions, fees, or general school information.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-8">Get in Touch</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 mb-1">Our Location</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{SCHOOL_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 mb-1">Phone Number</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{SCHOOL_INFO.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 mb-1">Email Address</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{SCHOOL_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 mb-1">Office Hours</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">Mon - Thu: 07:30 - 14:30<br />Fri: 07:30 - 13:30</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-64 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 relative">
                <iframe 
                  src="https://maps.google.com/maps?q=24%20Main%20Street%20Kokstad&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-navy-900 mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Contact</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all bg-white">
                    <option>Admissions</option>
                    <option>Fees & Payments</option>
                    <option>Uniform Shop</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all" />
                </div>
                <button className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-3">
                  <Send className="w-5 h-5" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
