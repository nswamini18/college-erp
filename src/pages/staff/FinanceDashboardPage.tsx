import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, CreditCard, FileText, AlertCircle, TrendingUp,
  ArrowRight, Plus, RefreshCw, CheckCircle2, Building, Receipt, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';

export const FinanceDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Quick Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [searchedStudents, setSearchedStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentRef, setPaymentRef] = useState('');
  const [submittingPay, setSubmittingPay] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.getFinanceDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load finance dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchStudents = async () => {
    if (!studentSearch.trim()) return;
    try {
      const res = await api.getStudentsWithFees({ search: studentSearch.trim() });
      if (res.success) setSearchedStudents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectStudent = async (stu: any) => {
    setSelectedStudent(stu);
    try {
      const res = await api.getStudentFeeDetails(stu.student_id);
      if (res.success) {
        const unpaidFees = (res.data.fees || []).filter((f: any) => f.status !== 'Paid');
        setStudentFees(unpaidFees);
        if (unpaidFees.length > 0) {
          setSelectedFeeId(String(unpaidFees[0].student_fee_id));
          const balance = unpaidFees[0].amount_due - unpaidFees[0].amount_paid;
          setPaymentAmount(String(balance > 0 ? balance : ''));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeId || !paymentAmount) return;
    setSubmittingPay(true);
    try {
      const res = await api.recordPayment(Number(selectedFeeId), {
        amount: parseFloat(paymentAmount),
        payment_mode: paymentMode,
        transaction_reference: paymentRef || `REC-${Date.now().toString().slice(-6)}`
      });
      if (res.success) {
        setIsPayModalOpen(false);
        setActionNotice(res.message || 'Payment recorded successfully.');
        setTimeout(() => setActionNotice(''), 4000);
        setSelectedStudent(null);
        setStudentFees([]);
        setStudentSearch('');
        loadData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setSubmittingPay(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#9B59B6] mb-2" />
        <p className="text-sm font-semibold text-slate-500">Loading Finance Portal...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalDue: 0,
    totalCollected: 0,
    pendingFees: 0,
    overdueCount: 0
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[24px] p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-800 to-[#311b38] text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#9B59B6] animate-pulse" />
            <span>Finance & Accounts Office • Fee Collection & Disbursal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.name || 'Finance Officer'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-mono">
            {user?.codeOrRoll || 'FINANCE-01'} • Senior Finance Officer • Central Treasury
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9B59B6] hover:bg-[#8e44ad] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Student Payment</span>
            </button>
            <Link
              to="/staff/fees"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Manage Student Fees</span>
            </Link>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#9B59B6]/15 blur-3xl pointer-events-none" />
      </div>

      {actionNotice && (
        <div className="flex items-center gap-2 p-4 bg-purple-50 border border-purple-200 text-purple-800 rounded-2xl text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/staff/payments"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#9B59B6] group-hover:scale-105 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#9B59B6] transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            ₹{(stats.totalCollected / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Fee Collected</p>
        </Link>

        <Link
          to="/staff/fees"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            ₹{(stats.totalDue / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Outstanding Balance</p>
        </Link>

        <Link
          to="/staff/fees"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.pendingFees}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pending Invoices</p>
        </Link>

        <Link
          to="/staff/fees"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.overdueCount}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Overdue Records</p>
        </Link>
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Dues & Collection */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#9B59B6]">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Department Fee Breakdown</h2>
                  <p className="text-[11px] text-slate-400">Collections vs remaining balance by department</p>
                </div>
              </div>
              <Link to="/staff/fees" className="text-xs font-bold text-[#9B59B6] hover:underline flex items-center gap-1">
                View Dues <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {(data?.deptBreakdown || []).map((dept: any, idx: number) => {
                const total = (parseFloat(dept.due) || 0);
                const paid = (parseFloat(dept.paid) || 0);
                const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 100;

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">{dept.department_name}</span>
                      <span className="text-xs font-extrabold text-purple-700">{pct}% collected</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#9B59B6] to-[#8e44ad] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                      <span>Paid: ₹{(paid / 100000).toFixed(1)}L</span>
                      <span>Balance: ₹{((total - paid) / 100000).toFixed(1)}L</span>
                      <span>Records: {dept.fee_records}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Payment Transactions */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#9B59B6]">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Recent Payment Receipts</h2>
                  <p className="text-[11px] text-slate-400">Latest successful student fee transactions</p>
                </div>
              </div>
              <Link to="/staff/payments" className="text-xs font-bold text-[#9B59B6] hover:underline flex items-center gap-1">
                All Receipts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentPayments || []).map((p: any) => (
                <div
                  key={p.payment_id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.student_name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {p.roll_no} • <span className="font-semibold text-slate-700">{p.payment_mode}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {p.transaction_reference || `INV-${p.payment_id}`} • {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl block">
                      ₹{parseFloat(p.amount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-emerald-600 uppercase font-bold block mt-1">
                      {p.status || 'Success'}
                    </span>
                  </div>
                </div>
              ))}
              {(!data?.recentPayments?.length) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No payment records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => { setIsPayModalOpen(false); setSelectedStudent(null); }}
        title="Record Student Fee Payment"
        subtitle="Collect student dues via counter, UPI, or bank transfer"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          {!selectedStudent ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Student *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter student name or roll number..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearchStudents(); } }}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                />
                <button
                  type="button"
                  onClick={handleSearchStudents}
                  className="px-4 py-2 bg-[#9B59B6] text-white text-xs font-bold rounded-xl"
                >
                  Search
                </button>
              </div>

              {searchedStudents.length > 0 && (
                <div className="mt-3 max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                  {searchedStudents.map(s => (
                    <div
                      key={s.student_id}
                      onClick={() => handleSelectStudent(s)}
                      className="p-2.5 hover:bg-purple-50 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{s.student_name}</p>
                        <p className="text-[10px] text-slate-400">{s.roll_no} • {s.branch}</p>
                      </div>
                      <span className="font-extrabold text-purple-700">Due: ₹{parseFloat(s.balance).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-900">{selectedStudent.student_name}</p>
                  <p className="text-[10px] text-purple-600 font-mono">{selectedStudent.roll_no} • {selectedStudent.branch}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs font-bold text-purple-700 underline"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Fee Item *</label>
                <select
                  value={selectedFeeId}
                  onChange={e => {
                    setSelectedFeeId(e.target.value);
                    const fee = studentFees.find(f => String(f.student_fee_id) === e.target.value);
                    if (fee) {
                      const bal = fee.amount_due - fee.amount_paid;
                      setPaymentAmount(String(bal > 0 ? bal : ''));
                    }
                  }}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                >
                  {studentFees.map(f => (
                    <option key={f.student_fee_id} value={f.student_fee_id}>
                      {f.fee_type || 'Tuition Fee'} (Due: ₹{(f.amount_due - f.amount_paid).toLocaleString('en-IN')})
                    </option>
                  ))}
                  {studentFees.length === 0 && <option value="">No pending fees found</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount to Pay (₹) *</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                  >
                    <option value="Cash">Cash (Counter)</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Reference / Receipt No</label>
                <input
                  type="text"
                  placeholder="Optional reference / receipt code"
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9B59B6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPay || !selectedFeeId}
                  className="px-4 py-2 rounded-xl bg-[#9B59B6] hover:bg-[#8e44ad] text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submittingPay ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default FinanceDashboardPage;
