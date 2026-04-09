import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  FolderOpen,
  LogOut,
  Search,
  Download,
  Plus,
  Trash2,
  Eye,
  Pin,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  where,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { Application, Payment, SchoolDocument } from '../types';
import { cn } from '../lib/utils';

const AdminSidebar = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Documents', path: '/admin/documents', icon: FolderOpen },
    { name: 'Staff', path: '/admin/staff', icon: Users },
  ];

  return (
    <div className="w-64 bg-navy-900 text-white h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-navy-800 flex items-center gap-3">
        <img
          src="/Logo.jpg"
          alt="Logo"
          className="w-8 h-8 object-contain bg-white rounded-md p-1"
          referrerPolicy="no-referrer"
        />
        <span className="font-bold tracking-tight">Admin Portal</span>
      </div>

      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              location.pathname === item.path ? 'bg-white text-navy-900 shadow-lg' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold truncate">{user.displayName}</span>
            <span className="text-[10px] text-navy-400 truncate">{user.email}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({ apps: 0, payments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const apps = await getDocs(collection(db, 'applications'));
      const payments = await getDocs(query(collection(db, 'payments'), where('type', '==', 'Fee')));
      setStats({ apps: apps.size, payments: payments.size });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-navy-900">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-navy-900">{stats.apps}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Total Applications</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-navy-900">{stats.payments}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Fee Payments</div>
        </div>
      </div>
    </div>
  );
};

const ApplicationsManager = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    const fetchApps = async () => {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setApps(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Application)));
      setLoading(false);
    };
    fetchApps();
  }, []);

  const sortedApps = useMemo(() => {
    const sortableApps = [...apps];
    if (sortConfig.key !== null) {
      sortableApps.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'learner') {
          aValue = `${a.learnerInfo.firstName} ${a.learnerInfo.surname}`.toLowerCase();
          bValue = `${b.learnerInfo.firstName} ${b.learnerInfo.surname}`.toLowerCase();
        } else if (sortConfig.key === 'grade') {
          aValue = a.learnerInfo.grade;
          bValue = b.learnerInfo.grade;
        } else {
          aValue = (a as any)[sortConfig.key];
          bValue = (b as any)[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableApps;
  }, [apps, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-navy-900" /> : <ChevronDown className="w-3 h-3 ml-1 text-navy-900" />;
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'applications', id), { status });
    setApps(apps.map((a) => (a.id === id ? { ...a, status: status as any } : a)));
  };

  const exportCSV = () => {
    const headers = ['App Number', 'Student Name', 'Grade', 'Status', 'Parent Name', 'Parent Email', 'Parent Phone'];
    const rows = apps.map((a) => [
      a.applicationNumber,
      `${a.learnerInfo.firstName} ${a.learnerInfo.surname}`,
      a.learnerInfo.grade,
      a.status,
      a.parentInfo.guardianName,
      a.parentInfo.guardianEmail,
      a.parentInfo.guardianPhone,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-navy-900">Student Applications</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('applicationNumber')}>
                <div className="flex items-center">App Number {getSortIcon('applicationNumber')}</div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('learner')}>
                <div className="flex items-center">Learner {getSortIcon('learner')}</div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('grade')}>
                <div className="flex items-center">Grade {getSortIcon('grade')}</div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('status')}>
                <div className="flex items-center">Status {getSortIcon('status')}</div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('createdAt')}>
                <div className="flex items-center">Date {getSortIcon('createdAt')}</div>
              </th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedApps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-mono font-bold text-navy-900">{app.applicationNumber}</td>
                <td className="p-4">
                  <div className="text-sm font-bold text-navy-900">{app.learnerInfo.firstName} {app.learnerInfo.surname}</div>
                  <div className="text-xs text-gray-500">{app.parentInfo.guardianEmail}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{app.learnerInfo.grade}</td>
                <td className="p-4">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id!, e.target.value)}
                    className={cn(
                      'text-xs font-bold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-navy-900',
                      app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {['Received', 'In Review', 'Missing Docs', 'Accepted', 'Waitlisted', 'Rejected'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button className="p-2 text-gray-400 hover:text-navy-900 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentsManager = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    const fetchPayments = async () => {
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPayments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Payment)));
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments.filter((p) =>
      p.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [payments, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-navy-900" /> : <ChevronDown className="w-3 h-3 ml-1 text-navy-900" />;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-navy-900">Payment Management</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, number or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Transactions</span>
          <span className="text-xs text-gray-400">{filteredAndSortedPayments.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('invoiceNumber')}>
                  <div className="flex items-center">Invoice {getSortIcon('invoiceNumber')}</div>
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('learnerName')}>
                  <div className="flex items-center">Student {getSortIcon('learnerName')}</div>
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('type')}>
                  <div className="flex items-center">Type {getSortIcon('type')}</div>
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('amount')}>
                  <div className="flex items-center">Amount {getSortIcon('amount')}</div>
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('status')}>
                  <div className="flex items-center">Status {getSortIcon('status')}</div>
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('createdAt')}>
                  <div className="flex items-center">Date {getSortIcon('createdAt')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAndSortedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono font-bold text-navy-900">{payment.invoiceNumber}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-navy-900">{payment.learnerName}</div>
                    <div className="text-xs text-gray-500">{payment.studentNumber}</div>
                  </td>
                  <td className="p-4">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', payment.type === 'Fee' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-navy-900">R {payment.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', payment.status === 'Paid' ? 'bg-green-100 text-green-700' : payment.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredAndSortedPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 text-sm italic">No payments match your search criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DocumentsManager = () => {
  const [docs, setDocs] = useState<SchoolDocument[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState<Partial<SchoolDocument>>({
    title: '',
    category: 'Letters',
    visibility: 'Published',
    grades: ['All'],
    pinned: false,
  });

  useEffect(() => {
    const fetchDocs = async () => {
      const q = query(collection(db, 'documents'), orderBy('publishDate', 'desc'));
      const snapshot = await getDocs(q);
      setDocs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SchoolDocument)));
    };
    fetchDocs();
  }, []);

  const handleAdd = async () => {
    if (!newDoc.title || !newDoc.url) return;
    const docData = {
      ...newDoc,
      publishDate: new Date().toISOString().split('T')[0],
    };
    const ref = await addDoc(collection(db, 'documents'), docData);
    setDocs([{ id: ref.id, ...docData } as SchoolDocument, ...docs]);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDoc(doc(db, 'documents', id));
      setDocs(docs.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-navy-900">Documents Management</h1>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 transition-all">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-navy-100 space-y-4">
          <h3 className="font-bold text-navy-900">New Document</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Document Title"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200"
            />
            <input
              placeholder="Document URL (e.g. Google Drive link)"
              value={newDoc.url}
              onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200"
            />
            <select value={newDoc.category} onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200">
              {['Letters', 'Notices', 'Policies', 'Newsletters', 'Forms', 'Timetables', 'Vacancies'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newDoc.pinned} onChange={(e) => setNewDoc({ ...newDoc, pinned: e.target.checked })} />
                Pinned
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleAdd} className="px-6 py-2 bg-navy-900 text-white rounded-lg font-bold">
              Save
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {docs.map((docItem) => (
              <tr key={docItem.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="text-sm font-bold text-navy-900 flex items-center gap-2">
                    {docItem.pinned && <Pin className="w-3 h-3 text-navy-400 fill-current" />}
                    {docItem.title}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{docItem.category}</td>
                <td className="p-4 text-sm text-gray-600">{docItem.publishDate}</td>
                <td className="p-4 flex gap-2">
                  <a href={docItem.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-navy-900">
                    <Eye className="w-5 h-5" />
                  </a>
                  <button onClick={() => handleDelete(docItem.id!)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'pol2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-navy-900/10">
            <img src="/Logo.jpg" alt="Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-4">Admin Portal</h1>
          <p className="text-gray-500 mb-8">Enter the school passcode to access the management dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-lg font-bold tracking-widest focus:border-navy-900 focus:bg-white outline-none transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const mockUser = {
    displayName: 'School Admin',
    email: 'admin@powerofloveprimary.co.za',
    photoURL: 'https://ui-avatars.com/api/?name=School+Admin&background=0f172a&color=fff',
  } as any;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={mockUser} onLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationsManager />} />
          <Route path="/payments" element={<PaymentsManager />} />
          <Route path="/documents" element={<DocumentsManager />} />
          <Route path="*" element={<div className="p-8 text-gray-500">Module coming soon...</div>} />
        </Routes>
      </div>
    </div>
  );
}
