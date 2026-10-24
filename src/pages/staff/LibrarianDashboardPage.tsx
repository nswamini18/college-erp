import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, BookMarked, RotateCcw, AlertCircle, CheckCircle2,
  Plus, RefreshCw, ArrowRight, Search, Clock, Calendar, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';

export const LibrarianDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [booksList, setBooksList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Quick Issue Modal state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({
    roll_no: '',
    isbn: '',
    due_days: '14'
  });
  const [issuing, setIssuing] = useState(false);

  // Quick Return Modal state
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [returning, setReturning] = useState(false);

  // Quick Add Book Modal state
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    isbn: '',
    title: '',
    author_name: '',
    publisher_name: '',
    category_name: 'Computer Science',
    edition: '1st Edition',
    publication_year: new Date().getFullYear().toString(),
    total_copies: '5',
    shelf_location: 'Main Floor A-Wing',
    rack_no: 'CS-01'
  });
  const [addingBook, setAddingBook] = useState(false);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [dashRes, booksRes] = await Promise.all([
        api.getLibraryDashboard(),
        api.getLibraryBooks()
      ]);
      if (dashRes.success) setData(dashRes.data);
      if (booksRes.success) setBooksList(booksRes.data);
    } catch (err) {
      console.error('Failed to load library dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.roll_no || !issueForm.isbn) return;
    setIssuing(true);
    try {
      const res = await api.issueBook({
        roll_no: issueForm.roll_no.trim(),
        isbn: issueForm.isbn.trim(),
        due_days: parseInt(issueForm.due_days) || 14
      });
      if (res.success) {
        setIsIssueModalOpen(false);
        setIssueForm({ roll_no: '', isbn: '', due_days: '14' });
        setActionSuccess(res.message || 'Book issued successfully!');
        setTimeout(() => setActionSuccess(''), 4500);
        loadData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to issue book');
    } finally {
      setIssuing(false);
    }
  };

  const handleOpenReturnModal = (issue: any) => {
    setSelectedIssue(issue);
    setReturnCondition('Good');
    setReturnRemarks('');
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setReturning(true);
    try {
      const res = await api.returnBook(selectedIssue.issue_id, {
        condition_on_return: returnCondition,
        remarks: returnRemarks || undefined
      });
      if (res.success) {
        setIsReturnModalOpen(false);
        setSelectedIssue(null);
        setActionSuccess(res.message || 'Book returned successfully!');
        setTimeout(() => setActionSuccess(''), 4500);
        loadData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to return book');
    } finally {
      setReturning(false);
    }
  };

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.isbn || !bookForm.title) return;
    setAddingBook(true);
    try {
      const res = await api.addBook(bookForm);
      if (res.success) {
        setIsAddBookModalOpen(false);
        setBookForm({
          isbn: '',
          title: '',
          author_name: '',
          publisher_name: '',
          category_name: 'Computer Science',
          edition: '1st Edition',
          publication_year: new Date().getFullYear().toString(),
          total_copies: '5',
          shelf_location: 'Main Floor A-Wing',
          rack_no: 'CS-01'
        });
        setActionSuccess(res.message || 'New book added to catalog!');
        setTimeout(() => setActionSuccess(''), 4500);
        loadData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add book');
    } finally {
      setAddingBook(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-9 h-9 animate-spin text-[#E67E22]" />
        <p className="text-sm font-semibold text-slate-500">Loading library data...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentIssues = data?.recentIssues || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
              Central Library
            </span>
            <span className="text-xs text-slate-400 font-medium">Librarian Desk</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Library Dashboard
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 mt-0.5">
            Welcome back, <span className="font-semibold text-slate-700">{user?.name || 'Sunita Joshi'}</span>. Manage book catalog, lending operations, and overdue tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200/80 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </button>
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-95"
            style={{ background: 'linear-gradient(135deg, #E67E22, #D35400)', boxShadow: '0 4px 14px rgba(230,126,34,0.35)' }}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Issue Book
          </button>
        </div>
      </div>

      {/* Overdue Warning Alert if overdueCount > 0 */}
      {stats.overdueCount > 0 && (
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-red-900">
                {stats.overdueCount} {stats.overdueCount === 1 ? 'Book is' : 'Books are'} currently Overdue!
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Students with past due dates are accumulating ₹5.00/day late fees. Check and follow up for returns.
              </p>
            </div>
          </div>
          <Link
            to="/staff/overdue"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 transition-all flex-shrink-0"
          >
            View Overdue List
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Book Titles</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#E67E22] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.totalBooks ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Distinct catalog entries</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Copies</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#D35400] flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.totalCopies ?? 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Physical inventory items</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Available</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.availableCopies ?? 0}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Ready to issue</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Borrowed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.activeIssues ?? 0}</p>
          <p className="text-[11px] text-blue-600 mt-0.5 font-medium">Currently with students</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Overdue Books</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">{stats.overdueCount ?? 0}</p>
          <p className="text-[11px] text-rose-500 mt-0.5 font-medium">Exceeded loan period</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/staff/books"
          className="bg-white hover:bg-amber-50/40 p-4 rounded-2xl border border-slate-200/80 shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#E67E22] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Book Inventory</p>
              <p className="text-[11px] text-slate-500">Search, filter & manage catalog</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E67E22] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/staff/issues"
          className="bg-white hover:bg-blue-50/40 p-4 rounded-2xl border border-slate-200/80 shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Issue & Return Desk</p>
              <p className="text-[11px] text-slate-500">Record loan and returns</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/staff/overdue"
          className="bg-white hover:bg-rose-50/40 p-4 rounded-2xl border border-slate-200/80 shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Overdue & Fines</p>
              <p className="text-[11px] text-slate-500">Track defaulters & late fines</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Recent Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#E67E22]" />
              Recent Lending Activity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Most recent book issues and status changes</p>
          </div>
          <Link
            to="/staff/issues"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E67E22] hover:text-[#D35400] transition-colors"
          >
            View all issues
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Book Title & Accession</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentIssues.map((issue: any) => {
                const isOverdue = issue.issue_status === 'Overdue' || (issue.issue_status === 'Issued' && issue.days_overdue > 0);
                const isReturned = issue.issue_status === 'Returned';

                return (
                  <tr key={issue.issue_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{issue.student_name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{issue.roll_no}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-semibold text-slate-800 truncate" title={issue.title}>{issue.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Acc: {issue.accession_no || 'N/A'} • ISBN: {issue.isbn}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {issue.issue_date ? new Date(issue.issue_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                        {issue.due_date ? new Date(issue.due_date).toLocaleDateString() : 'N/A'}
                      </span>
                      {isOverdue && !isReturned && (
                        <span className="block text-[10px] text-red-500 font-bold">
                          {issue.days_overdue} days late (₹{issue.days_overdue * 5} fine)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Returned
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3" /> Issued
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isReturned ? (
                        <button
                          onClick={() => handleOpenReturnModal(issue)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200/80 transition-colors"
                        >
                          Process Return
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {recentIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No lending activity found. Use "Issue Book" to issue books to students.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Student"
        subtitle="Record a new book loan for a student"
      >
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2023CS001"
              value={issueForm.roll_no}
              onChange={e => setIssueForm(prev => ({ ...prev, roll_no: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">Enter the exact student roll number from the database.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Book *</label>
            <select
              required
              value={issueForm.isbn}
              onChange={e => setIssueForm(prev => ({ ...prev, isbn: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22] bg-white"
            >
              <option value="">-- Choose Book from Catalog --</option>
              {booksList.map((b: any) => (
                <option key={b.isbn} value={b.isbn} disabled={b.available_copies <= 0}>
                  {b.title} ({b.author_name || 'Author N/A'}) — Avail: {b.available_copies}/{b.total_copies} {b.available_copies <= 0 ? '(Out of Stock)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loan Period (Days)</label>
            <select
              value={issueForm.due_days}
              onChange={e => setIssueForm(prev => ({ ...prev, due_days: e.target.value }))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22] bg-white"
            >
              <option value="7">7 Days (Short term)</option>
              <option value="14">14 Days (Standard)</option>
              <option value="30">30 Days (Semester loan)</option>
            </select>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/60 text-[11px] text-amber-800">
            Note: System automatically allocates an available physical copy and marks it as issued. If late, fine calculates at ₹5.00/day.
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={issuing}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E67E22, #D35400)' }}
            >
              {issuing ? 'Issuing...' : 'Confirm Issue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Process Book Return"
        subtitle={selectedIssue ? `Return: ${selectedIssue.title} (${selectedIssue.student_name})` : ''}
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          {selectedIssue && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Student:</span>
                <span className="font-bold text-slate-800">{selectedIssue.student_name} ({selectedIssue.roll_no})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Accession No:</span>
                <span className="font-mono font-bold text-slate-700">{selectedIssue.accession_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Due Date:</span>
                <span className="font-semibold text-slate-700">{new Date(selectedIssue.due_date).toLocaleDateString()}</span>
              </div>
              {selectedIssue.days_overdue > 0 && (
                <div className="flex justify-between text-red-600 font-bold pt-1 border-t border-slate-200">
                  <span>Late by {selectedIssue.days_overdue} days:</span>
                  <span>Fine ₹{selectedIssue.days_overdue * 5}.00</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Book Condition on Return</label>
            <select
              value={returnCondition}
              onChange={e => setReturnCondition(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22] bg-white"
            >
              <option value="Good">Good (Restock to available)</option>
              <option value="Damaged">Damaged (Mark copy damaged)</option>
              <option value="Lost">Lost (Mark copy lost)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Remarks (Optional)</label>
            <textarea
              rows={2}
              value={returnRemarks}
              onChange={e => setReturnRemarks(e.target.value)}
              placeholder="e.g. Spine intact, no missing pages..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={returning}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E67E22, #D35400)' }}
            >
              {returning ? 'Processing...' : 'Accept Return'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Add Book Modal */}
      <Modal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        title="Add New Book to Library"
        subtitle="Create catalog entry and auto-generate physical copy records"
      >
        <form onSubmit={handleAddBookSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ISBN *</label>
              <input
                type="text"
                required
                placeholder="e.g. 978-0131103627"
                value={bookForm.isbn}
                onChange={e => setBookForm(prev => ({ ...prev, isbn: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. The C Programming Language"
                value={bookForm.title}
                onChange={e => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
              <input
                type="text"
                placeholder="e.g. Brian W. Kernighan"
                value={bookForm.author_name}
                onChange={e => setBookForm(prev => ({ ...prev, author_name: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Publisher</label>
              <input
                type="text"
                placeholder="e.g. Prentice Hall"
                value={bookForm.publisher_name}
                onChange={e => setBookForm(prev => ({ ...prev, publisher_name: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={bookForm.category_name}
                onChange={e => setBookForm(prev => ({ ...prev, category_name: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Edition</label>
              <input
                type="text"
                value={bookForm.edition}
                onChange={e => setBookForm(prev => ({ ...prev, edition: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Copies</label>
              <input
                type="number"
                min="1"
                max="50"
                value={bookForm.total_copies}
                onChange={e => setBookForm(prev => ({ ...prev, total_copies: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Location</label>
              <input
                type="text"
                value={bookForm.shelf_location}
                onChange={e => setBookForm(prev => ({ ...prev, shelf_location: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rack No</label>
              <input
                type="text"
                value={bookForm.rack_no}
                onChange={e => setBookForm(prev => ({ ...prev, rack_no: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddBookModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingBook}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #E67E22, #D35400)' }}
            >
              {addingBook ? 'Adding...' : 'Add Book to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LibrarianDashboardPage;
