import React, { useState } from 'react';
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

interface ExamApplication {
  app_id: string;
  type: 'Regular Semester Exam' | 'Paper Revaluation' | 'Backlog / ATKT';
  semester: string;
  subject_code?: string;
  submission_date: string;
  fee_status: 'Paid' | 'Exempted';
  approval_status: 'Approved' | 'Under Verification' | 'Submitted';
}

export const StudentExamPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'hallticket'>('applications');
  
  // Applications
  const [applications, setApplications] = useState<ExamApplication[]>([
    {
      app_id: "EX-APP-2026-01",
      type: "Regular Semester Exam",
      semester: "Semester 3 (Autumn 2026)",
      submission_date: "2026-09-28",
      fee_status: "Paid",
      approval_status: "Approved"
    },
    {
      app_id: "REV-2026-04",
      type: "Paper Revaluation",
      semester: "Semester 2 (Spring 2026)",
      subject_code: "CS201 - Discrete Math",
      submission_date: "2026-08-10",
      fee_status: "Paid",
      approval_status: "Approved"
    }
  ]);

  // Form Modals
  const [isApplyRegularOpen, setIsApplyRegularOpen] = useState(false);
  const [isApplyRevalOpen, setIsApplyRevalOpen] = useState(false);
  const [isApplyBacklogOpen, setIsApplyBacklogOpen] = useState(false);
  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);

  // Forms state
  const [revalSubject, setRevalSubject] = useState('CS301 - Data Structures');
  const [backlogSubject, setBacklogSubject] = useState('CS202 - Digital Logic');

  const handleApplyRevaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: ExamApplication = {
      app_id: `REV-2026-${Math.floor(10 + Math.random() * 90)}`,
      type: "Paper Revaluation",
      semester: "Semester 3",
      subject_code: revalSubject,
      submission_date: "2026-10-10",
      fee_status: "Paid",
      approval_status: "Under Verification"
    };
    setApplications([newApp, ...applications]);
    setIsApplyRevalOpen(false);
  };

  const handleApplyBacklog = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: ExamApplication = {
      app_id: `BKG-2026-${Math.floor(10 + Math.random() * 90)}`,
      type: "Backlog / ATKT",
      semester: "Semester 2",
      subject_code: backlogSubject,
      submission_date: "2026-10-10",
      fee_status: "Paid",
      approval_status: "Submitted"
    };
    setApplications([newApp, ...applications]);
    setIsApplyBacklogOpen(false);
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
    { header: "Filed Date", accessor: "submission_date", render: (a) => <span className="font-mono text-slate-500">{a.submission_date}</span> },
    {
      header: "Fee Clearance",
      accessor: "fee_status",
      render: (a) => <Badge variant="success">{a.fee_status}</Badge>
    },
    {
      header: "Review Status",
      accessor: "approval_status",
      render: (a) => (
        <Badge variant={a.approval_status === 'Approved' ? 'success' : a.approval_status === 'Under Verification' ? 'warning' : 'info'}>
          {a.approval_status}
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

          {/* Table */}
          <DataTable
            columns={appColumns}
            data={applications}
            title="Filed Examination Petitions & Forms"
            subtitle="Real-time status tracking from Controller of Examinations"
          />
        </div>
      )}

      {activeTab === 'hallticket' && (
        <div className="erp-card p-6 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wide">
                Verified & Clearance Granted
              </span>
              <h3 className="text-lg font-extrabold text-navy-950 mt-2">
                Mid-Semester Examination Hall Ticket — Autumn 2026
              </h3>
              <p className="text-xs text-slate-500 font-mono">Exam Cycle: OCT-2026 • Seating Hall A-101</p>
            </div>

            <button
              onClick={() => setIsHallTicketModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              View & Print Official Pass
            </button>
          </div>

          {/* Timetable of exam papers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Allocated Exam Papers & Dates:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Paper Date</th>
                    <th className="p-3">Subject Code & Title</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Assigned Hall</th>
                    <th className="p-3">Reporting Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  <tr>
                    <td className="p-3 font-bold text-navy-950">2026-10-18</td>
                    <td className="p-3 font-sans font-semibold">CS301 - Data Structures & Algorithms</td>
                    <td className="p-3">10:00 AM - 12:00 PM</td>
                    <td className="p-3 font-bold text-navy-900">Hall A-101</td>
                    <td className="p-3 text-emerald-700">09:30 AM</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-navy-950">2026-10-20</td>
                    <td className="p-3 font-sans font-semibold">CS302 - Database Management Systems</td>
                    <td className="p-3">10:00 AM - 12:00 PM</td>
                    <td className="p-3 font-bold text-navy-900">Hall A-102</td>
                    <td className="p-3 text-emerald-700">09:30 AM</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-navy-950">2026-10-22</td>
                    <td className="p-3 font-sans font-semibold">CS303 - Operating Systems</td>
                    <td className="p-3">10:00 AM - 12:00 PM</td>
                    <td className="p-3 font-bold text-navy-900">Hall A-101</td>
                    <td className="p-3 text-emerald-700">09:30 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hall Ticket Printable Modal */}
      {isHallTicketModalOpen && (
        <Modal
          isOpen={isHallTicketModalOpen}
          onClose={() => setIsHallTicketModalOpen(false)}
          title="Official University Hall Ticket"
          subtitle="Examination Authority Entry Card"
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] text-slate-400">Digitally Verified Document • Controller of Exams</span>
              <button
                onClick={() => setIsHallTicketModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl"
              >
                Close Pass
              </button>
            </div>
          }
        >
          <div className="border-2 border-navy-950 p-6 rounded-2xl bg-white space-y-4 text-xs font-sans">
            <div className="text-center border-b-2 border-navy-950 pb-3">
              <h3 className="font-extrabold text-base text-navy-950 tracking-wider">UNIVERSITY INSTITUTE OF TECHNOLOGY</h3>
              <p className="text-[11px] text-slate-600 uppercase font-semibold">Office of the Controller of Examinations</p>
              <p className="text-[10px] font-bold text-navy-800 mt-1 uppercase bg-slate-100 py-0.5 rounded">
                ADMIT CARD / HALL TICKET • AUTUMN SEMESTER 2026
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-800 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Candidate Name:</span>
                <span className="font-bold text-navy-950">Aarav Kumar Sharma</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Roll No / PRN:</span>
                <span className="font-mono font-bold text-navy-950">CS2023001 • PRN2023CSE0101</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Degree & Branch:</span>
                <span>B.Tech Computer Science (Sem 3)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Examination Centre:</span>
                <span className="font-bold">Main Academic Block, Campus 1</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              Instructions: Candidate must present this admit card alongside university photo ID card. Electronic devices and calculators not permitted unless specifically authorized.
            </p>
          </div>
        </Modal>
      )}

      {/* Revaluation Modal */}
      <Modal
        isOpen={isApplyRevalOpen}
        onClose={() => setIsApplyRevalOpen(false)}
        title="Apply for Paper Revaluation"
        subtitle="Request verified re-checking of evaluated answer book"
      >
        <form onSubmit={handleApplyRevaluation} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Course Subject *</label>
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
            />
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
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm"
            >
              Confirm Revaluation Petition
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
            />
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
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm"
            >
              Submit Backlog Registration
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
            You are registering for regular examination papers in <strong>Semester 3 • B.Tech CSE</strong>.
            Please verify that your fee dues are cleared and your attendance is at least 75%.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold">
            ✓ Eligibility Verified: Tuition fee cleared & overall attendance 85.4%.
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
              onClick={() => {
                setIsApplyRegularOpen(false);
                alert("Regular examination form submitted successfully!");
              }}
              className="px-4 py-2 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
