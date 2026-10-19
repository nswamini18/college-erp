import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Building2, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  Award,
  Bell
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable, Column } from '../../components/common/DataTable';
import { mockCompanies } from '../../data/mockPlacement';

interface StudentJobOpportunity {
  drive_id: number;
  company_name: string;
  job_role: string;
  package: string;
  job_type: string;
  min_cgpa: number;
  drive_date: string;
  deadline: string;
  status: 'Open for Registration' | 'Closed';
}

interface StudentJobApplication {
  app_id: string;
  company_name: string;
  job_role: string;
  package: string;
  applied_date: string;
  status: 'Applied' | 'Shortlisted' | 'Technical Round' | 'Selected' | 'Offer Accepted' | 'Rejected';
  interview_date?: string;
  interview_venue?: string;
  offer_letter?: boolean;
}

export const StudentPlacementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open_jobs' | 'my_applications' | 'announcements'>('open_jobs');

  const [opportunities, setOpportunities] = useState<StudentJobOpportunity[]>([
    {
      drive_id: 1,
      company_name: "Microsoft Corporation",
      job_role: "Software Development Engineer (SDE-1)",
      package: "18.5 LPA",
      job_type: "Full-time",
      min_cgpa: 8.0,
      drive_date: "2026-10-24",
      deadline: "2026-10-15",
      status: "Open for Registration"
    },
    {
      drive_id: 2,
      company_name: "Google India",
      job_role: "Associate Cloud Solutions Architect",
      package: "22.0 LPA",
      job_type: "Internship + PPO",
      min_cgpa: 8.5,
      drive_date: "2026-10-28",
      deadline: "2026-10-18",
      status: "Open for Registration"
    },
    {
      drive_id: 3,
      company_name: "Tata Consultancy Services (TCS)",
      job_role: "Systems Engineer (Digital)",
      package: "7.5 LPA",
      job_type: "Full-time",
      min_cgpa: 7.0,
      drive_date: "2026-11-05",
      deadline: "2026-10-25",
      status: "Open for Registration"
    }
  ]);

  const [myApplications, setMyApplications] = useState<StudentJobApplication[]>([
    {
      app_id: "APP-MS-001",
      company_name: "Microsoft Corporation",
      job_role: "Software Development Engineer (SDE-1)",
      package: "18.5 LPA",
      applied_date: "2026-10-02",
      status: "Shortlisted",
      interview_date: "2026-10-24 10:00 AM",
      interview_venue: "Virtual Teams & Technical Assessment"
    },
    {
      app_id: "APP-AWS-009",
      company_name: "Amazon Web Services (AWS)",
      job_role: "Cloud Support Associate",
      package: "14.0 LPA",
      applied_date: "2026-09-18",
      status: "Offer Accepted",
      offer_letter: true
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<StudentJobOpportunity | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleApplyDrive = (job: StudentJobOpportunity) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleConfirmApplication = () => {
    if (!selectedJob) return;
    const newApp: StudentJobApplication = {
      app_id: `APP-${Date.now().toString().slice(-4)}`,
      company_name: selectedJob.company_name,
      job_role: selectedJob.job_role,
      package: selectedJob.package,
      applied_date: "2026-10-10",
      status: "Applied"
    };
    setMyApplications([newApp, ...myApplications]);
    setIsApplyModalOpen(false);
    setActiveTab('my_applications');
  };

  const jobColumns: Column<StudentJobOpportunity>[] = [
    {
      header: "Recruiting Company",
      accessor: "company_name",
      render: (j) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy-950 font-bold flex items-center justify-center text-xs">
            {j.company_name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-navy-950 block">{j.company_name}</span>
            <span className="text-[11px] text-slate-500">{j.job_type}</span>
          </div>
        </div>
      )
    },
    { header: "Designation", accessor: "job_role", render: (j) => <span className="font-semibold text-slate-800">{j.job_role}</span> },
    {
      header: "CTC Package",
      accessor: "package",
      sortable: true,
      render: (j) => (
        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {j.package}
        </span>
      )
    },
    {
      header: "Eligibility Criteria",
      accessor: "min_cgpa",
      render: (j) => <span className="font-mono text-xs">Min CGPA: <strong>{j.min_cgpa.toFixed(1)}</strong></span>
    },
    { header: "Drive Date", accessor: "drive_date", render: (j) => <span className="font-mono text-slate-600">{j.drive_date}</span> },
    {
      header: "Action",
      render: (j) => {
        const alreadyApplied = myApplications.some(a => a.company_name === j.company_name);
        return alreadyApplied ? (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Registered
          </span>
        ) : (
          <button
            onClick={() => handleApplyDrive(j)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl transition-all shadow-sm"
          >
            Apply & Confirm
          </button>
        );
      }
    }
  ];

  const appColumns: Column<StudentJobApplication>[] = [
    {
      header: "Application ID",
      accessor: "app_id",
      render: (a) => <span className="font-mono font-bold text-navy-950">{a.app_id}</span>
    },
    { header: "Company", accessor: "company_name", render: (a) => <span className="font-bold text-navy-950">{a.company_name}</span> },
    { header: "Designation", accessor: "job_role" },
    { header: "Package", accessor: "package", render: (a) => <span className="font-mono font-bold text-emerald-800">{a.package}</span> },
    { header: "Filed Date", accessor: "applied_date", render: (a) => <span className="font-mono text-slate-500">{a.applied_date}</span> },
    {
      header: "Recruitment Pipeline Status",
      accessor: "status",
      render: (a) => {
        const statusMap = {
          'Applied': 'info' as const,
          'Shortlisted': 'warning' as const,
          'Technical Round': 'warning' as const,
          'Selected': 'success' as const,
          'Offer Accepted': 'success' as const,
          'Rejected': 'danger' as const
        };
        return (
          <div className="space-y-1">
            <Badge variant={statusMap[a.status] || 'neutral'}>{a.status}</Badge>
            {a.interview_date && (
              <p className="text-[10px] text-slate-500 font-mono">
                Slot: {a.interview_date}
              </p>
            )}
          </div>
        );
      }
    },
    {
      header: "Offer Letter",
      render: (a) => (
        a.status === 'Offer Accepted' ? (
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> View Offer
          </button>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-navy-800" />
            Training & Placement (T&P) Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse campus recruitment drives, verify CGPA eligibility, apply to employers, track interview stages, and manage offers.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('open_jobs')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'open_jobs' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Eligible Drives ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('my_applications')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'my_applications' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Applications ({myApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'announcements' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            T&P Notices
          </button>
        </div>
      </div>

      {activeTab === 'open_jobs' && (
        <DataTable
          columns={jobColumns}
          data={opportunities}
          title="Active Corporate Campus Recruitment Drives"
          subtitle="Companies currently accepting student registrations for 2026-2027 placement season"
          searchPlaceholder="Search by company or role..."
        />
      )}

      {activeTab === 'my_applications' && (
        <DataTable
          columns={appColumns}
          data={myApplications}
          title="My Job Applications & Interview Progress Tracker"
          subtitle="Track active recruitment rounds from submission to final offer acceptance"
        />
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="erp-card p-6 space-y-4">
            <h3 className="text-base font-bold text-navy-950">Training & Placement Cell Circulars</h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-[#FAFCFD]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-navy-950">Microsoft Technical Assessment Guidelines</span>
                  <span className="font-mono text-slate-500">Oct 07, 2026</span>
                </div>
                <p className="text-slate-600">
                  Online coding assessment will be conducted on Oct 24 on Codility platform.
                  Please ensure your webcams and microphones are tested before the test window.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-[#FAFCFD]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-navy-950">Resume Verification Mandatory Deadline</span>
                  <span className="font-mono text-slate-500">Oct 05, 2026</span>
                </div>
                <p className="text-slate-600">
                  All 7th and 8th semester scholars must have their updated one-page resume stamped by department placement coordinators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Confirm Application: ${selectedJob.company_name}`}
          subtitle={`Role: ${selectedJob.job_role} • Package: ${selectedJob.package}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApplication}
                className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl"
              >
                Confirm & Submit Profile
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              By confirming, your verified student credentials (CGPA: <strong>9.15</strong>, Department: <strong>CSE</strong>, active backlogs: <strong>0</strong>) will be forwarded to the corporate recruitment team.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-slate-700">
              <div>Drive Date: {selectedJob.drive_date}</div>
              <div>Registration Deadline: {selectedJob.deadline}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Offer Letter Modal */}
      {isOfferModalOpen && (
        <Modal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          title="Official Placement Offer Letter"
          subtitle="Amazon Web Services (AWS) • Cloud Support Associate"
          maxWidth="md"
          footer={
            <button
              onClick={() => setIsOfferModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl"
            >
              Close Document
            </button>
          }
        >
          <div className="border border-slate-200 p-5 rounded-xl bg-slate-50 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-navy-950 text-sm">AMAZON WEB SERVICES</span>
              <Badge variant="success">OFFER ACCEPTED</Badge>
            </div>
            <p className="text-slate-700">
              Dear <strong>Aarav Sharma</strong>, we are pleased to confirm your appointment as <strong>Cloud Support Associate</strong> with an annual compensation package of <strong>14.0 LPA</strong>.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Tentative Joining Date: July 2027 • Location: Hyderabad, India
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
