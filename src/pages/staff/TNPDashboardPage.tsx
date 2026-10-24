import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Briefcase, Users, Award, TrendingUp, Calendar,
  ArrowRight, Plus, RefreshCw, CheckCircle2, Clock, MapPin, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';

export const TNPDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Quick Add Drive Modal
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [newDrive, setNewDrive] = useState({
    company_id: '',
    job_role: '',
    job_type: 'Full-Time',
    package: '',
    drive_date: '',
    registration_deadline: '',
    description: '',
    status: 'Open for Registration'
  });
  const [submittingDrive, setSubmittingDrive] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [res, compRes] = await Promise.all([
        api.getTNPDashboard(),
        api.getTNPCompanies()
      ]);
      if (res.success) {
        setData(res.data);
      }
      if (compRes.success) {
        setCompanies(compRes.data);
        if (compRes.data.length > 0 && !newDrive.company_id) {
          setNewDrive(prev => ({ ...prev, company_id: String(compRes.data[0].company_id) }));
        }
      }
    } catch (err) {
      console.error('Failed to load TNP dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrive.company_id || !newDrive.job_role) return;
    setSubmittingDrive(true);
    try {
      const res = await api.addDrive(newDrive);
      if (res.success) {
        setIsDriveModalOpen(false);
        setActionSuccess('Job drive posted successfully!');
        setTimeout(() => setActionSuccess(''), 4000);
        loadData(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create drive');
    } finally {
      setSubmittingDrive(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#2ECC71] mb-2" />
        <p className="text-sm font-semibold text-slate-500">Loading TNP Cell Dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalCompanies: 0,
    activeDrives: 0,
    totalApplications: 0,
    studentsPlaced: 0
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-[24px] p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e3a2f] text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
            <span>Training & Placement Cell • Corporate Relations Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.name || 'TNP Cell Head'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-mono">
            {user?.codeOrRoll || 'TNP-HEAD'} • Training & Placement Cell Head • Campus Placement Office
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2ECC71] hover:bg-[#27ae60] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job Drive</span>
            </button>
            <Link
              to="/staff/companies"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Manage Companies</span>
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
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#2ECC71]/10 blur-3xl pointer-events-none" />
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/staff/companies"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#2ECC71] group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#2ECC71] transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.totalCompanies}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Partner Companies</p>
        </Link>

        <Link
          to="/staff/drives"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.activeDrives}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Job Drives</p>
        </Link>

        <Link
          to="/staff/applications"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.totalApplications}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Applications</p>
        </Link>

        <Link
          to="/staff/placements"
          className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.studentsPlaced}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Students Placed</p>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Drives */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#2ECC71]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Recent Campus Drives</h2>
                  <p className="text-[11px] text-slate-400">Scheduled and upcoming placement sessions</p>
                </div>
              </div>
              <Link to="/staff/drives" className="text-xs font-bold text-[#2ECC71] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentDrives || []).map((d: any) => (
                <div
                  key={d.drive_id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{d.company_name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border text-slate-600 font-semibold truncate">
                        {d.industry_type || 'Technology'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {d.job_role} • Package: <span className="font-bold text-emerald-700">{d.package || '6.00 LPA'}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                      <Clock className="w-3 h-3" /> Drive Date: {d.drive_date ? new Date(d.drive_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    d.status === 'Open for Registration' ? 'bg-emerald-100 text-emerald-800' :
                    d.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    d.status === 'Completed' ? 'bg-slate-200 text-slate-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
              {(!data?.recentDrives?.length) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No drives scheduled yet. Click "Post New Job Drive" to begin.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Placements */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Latest Placement Offers</h2>
                  <p className="text-[11px] text-slate-400">Students who accepted campus job offers</p>
                </div>
              </div>
              <Link to="/staff/placements" className="text-xs font-bold text-[#2ECC71] hover:underline flex items-center gap-1">
                View Records <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentPlacements || []).map((p: any) => (
                <div
                  key={p.placement_id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.student_name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {p.roll_no} • <span className="font-semibold text-slate-700">{p.company_name}</span> ({p.job_role})
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Offer: {p.offer_date ? new Date(p.offer_date).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl block">
                      {p.package || '6.00 LPA'}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block mt-1">{p.status}</span>
                  </div>
                </div>
              ))}
              {(!data?.recentPlacements?.length) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No student placements recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Drive Modal */}
      <Modal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        title="Post New Job Drive"
        subtitle="Schedule a recruitment drive for campus students"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDrive} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company *</label>
            <select
              value={newDrive.company_id}
              onChange={e => setNewDrive({ ...newDrive, company_id: e.target.value })}
              required
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
            >
              <option value="">Select Company</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name} ({c.location || 'India'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Role *</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={newDrive.job_role}
                onChange={e => setNewDrive({ ...newDrive, job_role: e.target.value })}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Package CTC</label>
              <input
                type="text"
                placeholder="e.g. 8.5 LPA"
                value={newDrive.package}
                onChange={e => setNewDrive({ ...newDrive, package: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Drive Date</label>
              <input
                type="date"
                value={newDrive.drive_date}
                onChange={e => setNewDrive({ ...newDrive, drive_date: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
              <input
                type="date"
                value={newDrive.registration_deadline}
                onChange={e => setNewDrive({ ...newDrive, registration_deadline: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Eligibility</label>
            <textarea
              rows={3}
              placeholder="Minimum CGPA 7.0, all CS/IT/ENTC branches eligible..."
              value={newDrive.description}
              onChange={e => setNewDrive({ ...newDrive, description: e.target.value })}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDriveModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingDrive}
              className="px-4 py-2 rounded-xl bg-[#2ECC71] hover:bg-[#27ae60] text-white text-xs font-bold shadow-md disabled:opacity-50"
            >
              {submittingDrive ? 'Posting...' : 'Post Drive'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TNPDashboardPage;
