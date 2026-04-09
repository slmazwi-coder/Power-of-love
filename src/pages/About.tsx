import { SCHOOL_INFO } from '../constants';
import { Users, Target, Eye, Quote } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Our School</h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto font-light">
            Discover the history, mission, and the dedicated team behind Power of Love Primary School.
          </p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-navy-900 rounded-full" /> Our History
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Founded with a vision to provide quality education in Kokstad, Power of Love Primary School has grown from a small community initiative into a leading primary institution. Our journey has been defined by a commitment to excellence and a deep love for our learners.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-navy-50 rounded-2xl border border-navy-100">
                  <Target className="w-8 h-8 text-navy-900 mb-4" />
                  <h3 className="font-bold text-navy-900 mb-2">Our Mission</h3>
                  <p className="text-sm text-gray-600">To provide a holistic education that empowers learners to reach their full potential academically, socially, and spiritually.</p>
                </div>
                <div className="p-6 bg-navy-50 rounded-2xl border border-navy-100">
                  <Eye className="w-8 h-8 text-navy-900 mb-4" />
                  <h3 className="font-bold text-navy-900 mb-2">Our Vision</h3>
                  <p className="text-sm text-gray-600">To be a beacon of excellence in Kokstad, producing well-rounded citizens who contribute positively to society.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/Hero/FB_IMG_1775476115838.jpg"
                alt="School Activities"
                className="rounded-3xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src="/About/Principal/FB_IMG_1775476078612.jpg"
                alt="Principal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-12 flex flex-col justify-center">
              <Quote className="w-12 h-12 text-navy-100 mb-6" />
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Message from the Principal</h2>
              <p className="text-gray-600 text-lg italic leading-relaxed mb-8">
                "Welcome to Power of Love Primary School. We believe that every child is a unique gift with immense potential. Our role is to nurture that potential through love, discipline, and academic rigour. We are moving you higher, one step at a time."
              </p>
              <div>
                <div className="font-bold text-navy-900 text-xl">Mr Mtilwa</div>
                <div className="text-navy-500 font-medium">School Principal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Our Dedicated Educators</h2>
            <p className="text-gray-600">Meet the passionate team that makes Power of Love a special place to learn.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B", "7A", "7B"].map(grade => (
              <div key={grade} className="text-center group">
                <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors" />
                  <Users className="w-12 h-12 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="font-bold text-navy-900 text-sm">Teacher Name</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Grade {grade} Educator</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
