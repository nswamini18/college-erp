import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  Calendar, 
  CheckCircle2,
  Printer,
  FileText
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable, Column } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';

interface ExamApplication {
  app_id: string;
  type: string;
  semester: string;
  subject_code?: string;
  submission_date: string;
  fee_status: string;
  approval_status: string;
}

export const StudentExamPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'hallticket'>('applications');
  const [applications, setApplications] = useState<ExamApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Modals
  const [isApplyRegularOpen, setIsApplyRegularOpen] = useState(false);
  const [isApplyRevalOpen, setIsApplyRevalOpen] = useState(false);
  const [isApplyBacklogOpen, setIsApplyBacklogOpen] = useState(false);
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms state
  const [revalSubject, setRevalSubject] = useState('CS301 - Data Structures');
  const [backlogSubject, setBacklogSubject] = useState('CS202 - Digital Logic');

  const fetchApplications = () => {
    setIsLoading(true);
    api.getStudentExams()
      .then(res => {
        if (res && res.success && res.data) {
          setApplications(res.data.applications || []);
        }
      })
      .catch(err => {
        console.warn('Failed to load exam data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApplyRegular = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.applyStudentExam({
        type: 'Regular Semester Exam',
        semester: 'Semester 5 (Autumn 2026)'
      });
      if (res && res.data) {
        setApplications(prev => [res.data, ...prev]);
      } else {
        fetchApplications();
      }
      setIsApplyRegularOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit regular exam application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyRevaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.applyStudentExam({
        type: 'Paper Revaluation',
        semester: 'Semester 4 (Spring 2026)',
        subject_code: revalSubject
      });
      if (res && res.data) {
        setApplications(prev => [res.data, ...prev]);
      } else {
        fetchApplications();
      }
      setIsApplyRevalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit revaluation petition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyBacklog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.applyStudentExam({
        type: 'Backlog / ATKT',
        semester: 'Semester 4',
        subject_code: backlogSubject
      });
      if (res && res.data) {
        setApplications(prev => [res.data, ...prev]);
      } else {
        fetchApplications();
      }
      setIsApplyBacklogOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit backlog application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const appColumns: Column<ExamApplication>[] = [
    {
      header: "Application Ref",
      accessor: "app_id",
      render: (a) => <span className="font-mono font-bold text-navy-950">{a.app_id}</span>
    },
    {
      header: "Application Category",
      accessor: "type",
      render: (a) => (
        <div>
          <span className="font-semibold text-navy-900 block">{a.type}</span>
          {a.subject_code && <span className="text-[11px] text-slate-500">{a.subject_code}</span>}
        </div>
      )
    },
    { header: "Academic Semester", accessor: "semester" },
    { 
      header: "Filed Date", 
      accessor: "submission_date", 
      render: (a) => <span className="font-mono text-slate-500 text-xs">{a.submission_date ? String(a.submission_date).slice(0, 10) : 'N/A'}</span> 
    },
    {
      header: "Fee Clearance",
      accessor: "fee_status",
      render: (a) => <Badge variant="success">{a.fee_status || 'Paid'}</Badge>
    },
    {
      header: "Review Status",
      accessor: "approval_status",
      render: (a) => (
        <Badge variant={a.approval_status === 'Approved' ? 'success' : a.approval_status === 'Under Verification' ? 'warning' : 'info'}>
          {a.approval_status || 'Submitted'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-navy-800" />
            Examination Services & Hall Ticket
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Exam registration forms, paper revaluation applications, backlog requests, and official verified hall tickets.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'applications' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('hallticket')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'hallticket' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active Hall Ticket
          </button>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Action Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="erp-card p-5">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
                Regular Semester Exam
              </h4>
              <p className="text-xs text-slate-500 mb-3">Register for end-semester Autumn 2026 theoretical & practical papers.</p>
              <button
                onClick={() => setIsApplyRegularOpen(true)}
                className="w-full py-2 px-3 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Apply for Regular Exam
              </button>
            </div>

            <div className="erp-card p-5">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
                Paper Revaluation
              </h4>
              <p className="text-xs text-slate-500 mb-3">Request independent re-evaluation / totaling of evaluated answer scripts.</p>
              <button
                onClick={() => setIsApplyRevalOpen(true)}
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                Apply for Revaluation
              </button>
            </div>

            <div className="erp-card p-5">
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
                Backlog / ATKT Exam
              </h4>
              <p className="text-xs text-slate-500 mb-3">Register for supplementary exams to clear prior semester backlogs.</p>
              <button
                onClick={() => setIsApplyBacklogOpen(true)}
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all"
              >
                Apply for Backlog Exam
              </button>
            </div>
          </div>

          {applications.length > 0 ? (
            <DataTable
              columns={appColumns}
              data={applications}
              title="Submitted Examination Applications & Petitions"
              subtitle="Track status of registered exam sessions and official verifications"
            />
          ) : (
            <EmptyState
              title="No Exam Applications Found"
              description="You have not submitted any exam or revaluation applications yet."
            />
          )}
        </div>
      )}

      {activeTab === 'hallticket' && (
        <div className="erp-card p-6 bg-white border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-navy-950">END-SEMESTER EXAMINATION ADMIT CARD</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Session: Autumn 2026 • Controller of Examinations</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#4D8DFF] hover:bg-[#3A7AEB] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Hall Ticket
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Candidate Status</span>
              <span className="font-bold text-emerald-700">Eligible (Dues Cleared)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Examination Center</span>
              <span className="font-semibold text-navy-900">Academic Complex - Block A</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Reporting Time</span>
              <span className="font-semibold text-navy-900">08:45 AM Sharp</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Admit Seal</span>
              <span className="font-mono text-xs text-blue-700 font-bold">VERIFIED_2026</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
            <h5 className="font-bold text-navy-950">Candidate Examination Instructions:</h5>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 leading-relaxed">
              <li>Candidates must carry this printed admit card along with their valid institutional student identity card.</li>
              <li>Electronic gadgets, smartwatches, and programmable calculators are strictly prohibited in the examination hall.</li>
              <li>Entry into the examination room will not be permitted 15 minutes after the scheduled commencement time.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Revaluation Modal */}
      <Modal
        isOpen={isApplyRevalOpen}
        onClose={() => setIsApplyRevalOpen(false)}
        title="Apply for Paper Revaluation"
        subtitle="Independent re-checking and scrutiny of final theory answer book"
      >
        <form onSubmit={handleApplyRevaluation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Subject Course Paper *</label>
            <select
              value={revalSubject}
              onChange={e => setRevalSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="CS301 - Data Structures">CS301 - Data Structures</option>
              <option value="CS302 - Database Systems">CS302 - Database Systems</option>
              <option value="CS303 - Operating Systems">CS303 - Operating Systems</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Revaluation Fee</label>
            <input
              type="text"
              disabled
              value="₹500.00 (Standard University Tariff)"
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
            >
            </input>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyRevalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Revaluation Petition'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Backlog Modal */}
      <Modal
        isOpen={isApplyBacklogOpen}
        onClose={() => setIsApplyBacklogOpen(false)}
        title="Apply for Backlog / ATKT Examination"
        subtitle="Register for remedial attempt for uncleared papers"
      >
        <form onSubmit={handleApplyBacklog} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Backlog Course Paper *</label>
            <select
              value={backlogSubject}
              onChange={e => setBacklogSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="CS202 - Digital Logic Design">CS202 - Digital Logic Design (Semester 2)</option>
              <option value="MA201 - Engineering Mathematics II">MA201 - Engineering Mathematics II (Semester 2)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Examination Fee</label>
            <input
              type="text"
              disabled
              value="₹750.00 (Per Backlog Paper)"
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono"
            >
            </input>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyBacklogOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Backlog Registration'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Regular Exam Registration Modal */}
      <Modal
        isOpen={isApplyRegularOpen}
        onClose={() => setIsApplyRegularOpen(false)}
        title="Regular Semester Examination Registration"
        subtitle="Confirm admission to end-semester Autumn 2026 exam cycle"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            You are registering for regular examination papers in <strong>Autumn 2026 Exam Cycle</strong>.
            Please verify that your fee dues are cleared and your attendance is at least 75%.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold">
            ✓ Eligibility Verified: Tuition fee cleared & attendance requirements met.
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyRegularOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyRegular}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentExamPage;
