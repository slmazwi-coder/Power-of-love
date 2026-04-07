import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Search, Filter, Calendar, Pin } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { SchoolDocument } from '../types';
import { cn } from '../lib/utils';
import { GRADES } from '../constants';

const CATEGORIES = ['All', 'Letters', 'Notices', 'Policies', 'Newsletters', 'Forms', 'Timetables', 'Vacancies'];

export default function Documents() {
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'All', grade: 'All', search: '' });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const q = query(
          collection(db, 'documents'),
          where('visibility', '==', 'Published'),
          orderBy('pinned', 'desc'),
          orderBy('publishDate', 'desc')
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SchoolDocument));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = filter.category === 'All' || doc.category === filter.category;
    const matchesGrade = filter.grade === 'All' || doc.grades.includes(filter.grade) || doc.grades.includes('All');
    const matchesSearch = doc.title.toLowerCase().includes(filter.search.toLowerCase());
    return matchesCategory && matchesGrade && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Document Centre</h1>
          <p className="text-gray-600">Access and download important school letters, policies, and forms.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents by title..." 
                value={filter.search}
                onChange={e => setFilter({...filter, search: e.target.value})}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={filter.category}
                onChange={e => setFilter({...filter, category: e.target.value})}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all bg-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select 
                value={filter.grade}
                onChange={e => setFilter({...filter, grade: e.target.value})}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all bg-white"
              >
                <option value="All">All Grades</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <motion.div 
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative"
              >
                {doc.pinned && (
                  <div className="absolute top-4 right-4 text-navy-400">
                    <Pin className="w-4 h-4 fill-current" />
                  </div>
                )}
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-navy-900 transition-colors">
                  <FileText className="w-6 h-6 text-navy-900 group-hover:text-white transition-colors" />
                </div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-navy-600 uppercase tracking-widest bg-navy-50 px-2 py-1 rounded">
                    {doc.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2 leading-tight">{doc.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.publishDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    {doc.grades.includes('All') ? 'All Grades' : doc.grades.join(', ')}
                  </div>
                </div>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gray-50 text-navy-900 rounded-xl font-bold hover:bg-navy-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
