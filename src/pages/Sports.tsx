import { motion } from 'motion/react';
import { SPORTS } from '../constants';
import { Trophy, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sports() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Sports & Athletics</h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto font-light">
            Building teamwork, discipline, and physical excellence on and off the field.
          </p>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPORTS.map((sport, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="h-48 bg-navy-50 flex items-center justify-center relative overflow-hidden">
                  <Trophy className="w-16 h-16 text-navy-100 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-navy-900 mb-3">{sport.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {sport.description}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kit Requirements</h4>
                        <p className="text-xs text-gray-600 italic">{sport.kit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Info */}
      <section className="py-24 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Training & Match Days</h2>
              <p className="text-navy-200 mb-8 leading-relaxed">
                Sports training takes place after school hours. Match schedules are published in the Document Centre and sent via the school newsletter.
              </p>
              <div className="space-y-4">
                {[
                  { day: "Mon & Wed", time: "14:45 - 16:00", sports: "Rugby, Soccer, Athletics" },
                  { day: "Tue & Thu", time: "14:45 - 16:00", sports: "Netball, Cricket" },
                ].map((schedule, i) => (
                  <div key={i} className="p-6 bg-navy-800 rounded-2xl border border-navy-700 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{schedule.day}</h4>
                      <p className="text-sm text-navy-300">{schedule.sports}</p>
                    </div>
                    <div className="text-navy-400 font-mono text-sm">{schedule.time}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-navy-800 rounded-3xl border border-navy-700 flex items-center justify-center">
                <Users className="w-24 h-24 text-navy-700" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
