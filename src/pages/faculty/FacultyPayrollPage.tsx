import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Download, 
  Printer, 
  IndianRupee, 
  CheckCircle2, 
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable, Column } from '../../components/common/DataTable';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import { api } from '../../services/api';

interface FacultyPayslip {
  slip_id: string;
  month: string;
  year: number;
  basic_salary: number;
  da_allowance: number;
  hra_allowance: number;
  travel_allowance: number;
  academic_allowance: number;
  gross_salary: number;
  pf_deduction: number;
  income_tax: number;
  professional_tax: number;
  total_deductions: number;
  net_salary: number;
  disbursement_date: string;
  payment_mode: string;
  status: 'Paid';
}

export const FacultyPayrollPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payslips, setPayslips] = useState<FacultyPayslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<FacultyPayslip | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPayroll() {
      try {
        setLoading(true);
        const res = await api.getFacultyPayroll();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setPayslips(res.data);
        }
      } catch (err) {
        console.warn('Failed to load faculty payroll:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPayroll();
    return () => { isMounted = false; };
  }, []);

  const latestSlip = payslips[0] || {
    basic_salary: 0,
    gross_salary: 0,
    total_deductions: 0,
    net_salary: 0,
    disbursement_date: 'N/A'
  };

  const columns: Column<FacultyPayslip>[] = [
    {
      header: "Slip Ref No.",
      accessor: "slip_id",
      render: (p) => <span className="font-mono font-bold text-navy-950">{p.slip_id}</span>
    },
    {
      header: "Salary Term",
      render: (p) => (
        <span className="font-bold text-slate-800">
          {p.month} {p.year}
        </span>
      )
    },
    {
      header: "Gross Earnings",
      accessor: "gross_salary",
      render: (p) => <span className="font-mono text-slate-700">{formatINR(p.gross_salary)}</span>
    },
    {
      header: "Total Deductions",
      accessor: "total_deductions",
      render: (p) => <span className="font-mono text-rose-600">-{formatINR(p.total_deductions)}</span>
    },
    {
      header: "Net Take-Home",
      accessor: "net_salary",
      render: (p) => (
        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {formatINR(p.net_salary)}
        </span>
      )
    },
    {
      header: "Disbursement Date",
      accessor: "disbursement_date",
      render: (p) => <span className="font-mono text-slate-500">{p.disbursement_date ? new Date(p.disbursement_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Disbursed'}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (p) => <Badge variant="success">{p.status}</Badge>
    },
    {
      header: "Document",
      render: (p) => (
        <button
          onClick={() => setSelectedPayslip(p)}
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          View Slip
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Loader2 className="w-8 h-8 text-navy-800 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading payroll records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-navy-800" />
            Faculty Compensation & Payslips
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional payroll history, monthly salary disbursements, tax deductions, and verified pay vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy">Employee Code: {user?.codeOrRoll || 'FAC'}</Badge>
        </div>
      </div>

      {payslips.length === 0 ? (
        <EmptyState
          title="No Payslip Records Found"
          description="Institutional salary disbursements and payroll records for your faculty profile have not been generated yet."
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="erp-card p-5 bg-navy-950 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ice-300 block mb-1">
                Designated Basic Pay
              </span>
              <h3 className="text-2xl font-extrabold font-mono text-white">
                {formatINR(latestSlip.basic_salary)}
              </h3>
              <p className="text-xs text-ice-200 mt-1">7th Pay Commission Scale</p>
            </div>

            <div className="erp-card p-5 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Latest Gross Earnings
              </span>
              <h3 className="text-2xl font-extrabold font-mono text-navy-950">
                {formatINR(latestSlip.gross_salary)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Including DA, HRA & Grants</p>
            </div>

            <div className="erp-card p-5 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Statutory Deductions
              </span>
              <h3 className="text-2xl font-extrabold font-mono text-rose-600">
                {formatINR(latestSlip.total_deductions)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">PF, TDS & Profession Tax</p>
            </div>

            <div className="erp-card p-5 bg-emerald-50/50 border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Latest Net Disbursed
              </span>
              <h3 className="text-2xl font-extrabold font-mono text-emerald-800">
                {formatINR(latestSlip.net_salary)}
              </h3>
              <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed on {latestSlip.disbursement_date ? new Date(latestSlip.disbursement_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Scheduled'}
              </p>
            </div>
          </div>

          {/* Payslips Table */}
          <DataTable
            columns={columns}
            data={payslips}
            title="Official Monthly Salary Disbursals"
            subtitle="Audited financial statements generated by Bursar and Accounts Department"
          />
        </>
      )}

      {/* Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Official Faculty Salary Statement — ${selectedPayslip.month} ${selectedPayslip.year}`}
          subtitle={`Disbursement Ref: ${selectedPayslip.slip_id}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] text-slate-400 font-mono">Confidential Document • University Finance Office</span>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl"
              >
                Close Payslip
              </button>
            </div>
          }
        >
          <div className="border border-slate-300 p-6 rounded-2xl bg-white space-y-5 text-xs font-sans">
            {/* College Heading */}
            <div className="text-center border-b border-slate-200 pb-3">
              <h2 className="font-extrabold text-base text-navy-950">UNIVERSITY INSTITUTE OF TECHNOLOGY</h2>
              <p className="text-[11px] text-slate-500 uppercase">Human Resources & Payroll Department</p>
              <p className="text-[10px] font-mono font-bold text-navy-800 mt-1">
                SALARY SLIP FOR THE MONTH OF {selectedPayslip.month.toUpperCase()} {selectedPayslip.year}
              </p>
            </div>

            {/* Employee Particulars */}
            <div className="grid grid-cols-2 gap-3 text-slate-800 border-b border-slate-200 pb-3 text-[11px]">
              <div>Employee Name: <strong>{user?.name}</strong></div>
              <div>Employee Code: <strong className="font-mono">{user?.codeOrRoll}</strong></div>
              <div>Designation: <strong>{user?.programOrDesignation}</strong></div>
              <div>Department: <strong>{user?.department}</strong></div>
              <div>Disbursement Date: <span className="font-mono">{selectedPayslip.disbursement_date ? new Date(selectedPayslip.disbursement_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span></div>
              <div>Payment Mode: <span>{selectedPayslip.payment_mode}</span></div>
            </div>

            {/* Earnings & Deductions Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="space-y-1.5 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <h4 className="font-bold text-navy-950 text-xs border-b border-slate-200 pb-1">Earnings Component</h4>
                <div className="flex justify-between"><span>Basic Pay:</span> <span className="font-mono">{formatINR(selectedPayslip.basic_salary)}</span></div>
                <div className="flex justify-between"><span>Dearness Allowance (DA):</span> <span className="font-mono">{formatINR(selectedPayslip.da_allowance)}</span></div>
                <div className="flex justify-between"><span>House Rent Allowance (HRA):</span> <span className="font-mono">{formatINR(selectedPayslip.hra_allowance)}</span></div>
                <div className="flex justify-between"><span>Transport Allowance (TA):</span> <span className="font-mono">{formatINR(selectedPayslip.travel_allowance)}</span></div>
                <div className="flex justify-between"><span>Academic Research Grant:</span> <span className="font-mono">{formatINR(selectedPayslip.academic_allowance)}</span></div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-navy-950">
                  <span>Gross Earnings:</span>
                  <span className="font-mono">{formatINR(selectedPayslip.gross_salary)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-1.5 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <h4 className="font-bold text-navy-950 text-xs border-b border-slate-200 pb-1">Statutory Deductions</h4>
                <div className="flex justify-between"><span>Provident Fund (PF):</span> <span className="font-mono">{formatINR(selectedPayslip.pf_deduction)}</span></div>
                <div className="flex justify-between"><span>Income Tax (TDS):</span> <span className="font-mono">{formatINR(selectedPayslip.income_tax)}</span></div>
                <div className="flex justify-between"><span>Professional Tax:</span> <span className="font-mono">{formatINR(selectedPayslip.professional_tax)}</span></div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-rose-700">
                  <span>Total Deductions:</span>
                  <span className="font-mono">{formatINR(selectedPayslip.total_deductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Amount Banner */}
            <div className="p-3 bg-navy-950 text-white rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider">Net Amount Deposited to Bank:</span>
              <span className="font-mono font-extrabold text-lg text-ice-300">{formatINR(selectedPayslip.net_salary)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
