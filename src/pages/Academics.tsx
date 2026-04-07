import { motion } from 'motion/react';
import { ACADEMICS } from '../constants';
import { BookOpen, Award, Lightbulb, Users } from 'lucide-react';

export default function Academics() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Academics & Clubs</h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto font-light">
            Excellence in learning and a wide range of extracurricular activities to challenge young minds.
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="/FB_IMG_1775476078612.jpg" 
                alt="Students Learning" 
                className="rounded-3xl shadow-2xl relative z-10"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Academic Approach</h2>
              <p className="text-gray-600 leading-relaxed">
                At Power of Love Primary School, we follow the CAPS curriculum, enhanced with innovative teaching methods that encourage critical thinking and creativity. Our small class sizes allow for individual attention, ensuring no learner is left behind.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Foundation Phase (Grade 1A - 3B)", desc: "Building strong foundations in literacy, numeracy, and life skills." },
                  { title: "Intermediate Phase (Grade 4A - 6B)", desc: "Developing independent learning and analytical skills." },
                  { title: "Senior Phase (Grade 7A - 7B)", desc: "Preparing for the transition to high school with academic rigour." },
                ].map((phase, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900">{phase.title}</h4>
                      <p className="text-sm text-gray-500">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clubs & Activities */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Extracurricular Academic Activities</h2>
            <p className="text-gray-600">We offer various clubs that foster intellectual growth and competition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ACADEMICS.map((club, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6">
                  {i === 0 ? <Users className="w-6 h-6 text-navy-900" /> : i === 1 ? <Award className="w-6 h-6 text-navy-900" /> : <Lightbulb className="w-6 h-6 text-navy-900" />}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{club.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {club.description}
                </p>
                <div className="pt-6 border-t border-gray-50">
                  <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-2">How to Participate</h4>
                  <p className="text-xs text-gray-500 italic">{club.participation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
