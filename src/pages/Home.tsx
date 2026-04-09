import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Trophy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SCHOOL_INFO } from '../constants';

const HERO_IMAGES = [
  '/Hero/FB_IMG_1775476078612.jpg',
  '/Hero/FB_IMG_1775476115838.jpg',
  '/Hero/FB_IMG_1775476175024.jpg',
  '/Hero/FB_IMG_1775476221490.jpg',
  '/Hero/FB_IMG_1775476260293.jpg',
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-navy-950">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGES[currentImage]} alt="School Environment" className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial= opacity: 0, y: 30  animate= opacity: 1, y: 0  transition= duration: 0.8, ease: "easeOut"  className="max-w-4xl mx-auto">
            <motion.div initial= opacity: 0, scale: 0.8  animate= opacity: 1, scale: 1  transition= delay: 0.2, duration: 0.5  className="mb-10 inline-block">
              <div className="relative">
                <img src="/Logo.jpg" alt="Power of Love Logo" className="relative w-28 h-28 object-contain bg-white p-3 rounded-3xl shadow-xl" referrerPolicy="no-referrer" />
              </div>
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-8">
                Admissions Open for 2027
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                Power of Love <br />
                <span className="text-blue-400">Primary School</span>
              </h1>

              <p className="text-xl md:text-2xl text-navy-100 mb-12 leading-relaxed font-medium max-w-2xl mx-auto opacity-90">
                "{SCHOOL_INFO.motto}"
                <span className="block mt-4 text-lg font-normal text-navy-200 italic">Quality education and strong values.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/admissions" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl">
                  <span>Apply Online Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="px-10 py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Explore Our School
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900 mb-1">500+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900 mb-1">25+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900 mb-1">100%</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900 mb-1">15+</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Sports & Clubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">Why Choose Power of Love?</h2>
            <p className="text-gray-600">We provide a holistic learning experience that balances academic excellence with physical development and character building.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Academic Excellence</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our curriculum is designed to challenge and inspire students from Grade 1A to 7B, ensuring they are well-prepared for high school.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Sports & Culture</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From Rugby to Chess, we offer a wide range of extracurricular activities to help students discover their passions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Community Values</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We foster a culture of love, respect, and integrity, creating a safe and supportive environment for every learner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join our school family?</h2>
            <p className="text-navy-200 mb-8 text-lg">Start your child's journey today with our easy online application process.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admissions" className="px-8 py-4 bg-white text-navy-900 rounded-lg font-bold hover:bg-navy-50 transition-all text-center">Apply Now</Link>
              <Link to="/contact" className="px-8 py-4 bg-navy-800 border border-navy-700 text-white rounded-lg font-bold hover:bg-navy-700 transition-all text-center">Contact Admissions</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
