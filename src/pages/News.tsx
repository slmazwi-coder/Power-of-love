import { motion } from 'motion/react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

const NEWS = [
  { id: 1, title: '2027 Admissions Now Open', date: 'April 01, 2026', category: 'Admissions', excerpt: 'We are pleased to announce that online applications for the 2027 academic year are now open. Apply today to secure your child\'s future.' },
  { id: 2, title: 'Term 1 Sports Day Success', date: 'March 15, 2026', category: 'Sports', excerpt: 'Our annual Term 1 Sports Day was a massive success! Congratulations to all our athletes who participated and showed great sportsmanship.' },
  { id: 3, title: 'New Science Lab Inauguration', date: 'February 28, 2026', category: 'Academics', excerpt: 'We have officially opened our state-of-the-art science lab, providing our learners with better resources for practical learning.' },
];

export default function News() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Events</h1>
          <p className="text-xl text-navy-200 max-w-2xl mx-auto font-light">
            Stay updated with the latest happenings and upcoming events at Power of Love Primary School.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NEWS.map((item) => (
              <motion.article 
                key={item.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-navy-600 uppercase tracking-widest bg-navy-50 px-2 py-1 rounded">
                      <Tag className="w-3 h-3" /> {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {item.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-4 leading-tight">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {item.excerpt}
                  </p>
                  <button className="flex items-center gap-2 text-navy-900 font-bold hover:underline group">
                    Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Subscribe to our Newsletter</h2>
            <p className="text-gray-600 mb-8">Get the latest school news and event updates delivered directly to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
              />
              <button className="px-8 py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
