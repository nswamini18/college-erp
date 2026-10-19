import React, { useState } from 'react';
import { 
  CreditCard, 
  Receipt, 
  CheckCircle2, 
  Calendar, 
  ArrowDownCircle, 
  FileText,
  DollarSign
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { DataTable, Column } from '../../components/common/DataTable';
import { formatINR } from '../../utils/currency';

interface FeeBill {
  id: string;
  semester: string;
  category: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  status: 'Paid' | 'Partially Paid' | 'Unpaid';
}

interface PaymentTransaction {
  receipt_no: string;
  date: string;
  amount: number;
  fee_type: string;
  mode: string;
  status: 'Success';
}

export const StudentFeesPage: React.FC = () => {
  const [feeBills, setFeeBills] = useState<FeeBill[]>([
    {
      id: "INV-2026-0301",
      semester: "Semester 3 (Autumn 2026)",
      category: "Tuition & Academic Facilities",
      total_amount: 40000,
      paid_amount: 40000,
      due_amount: 0,
      due_date: "2026-08-15",
      status: "Paid"
    },
    {
      id: "INV-2026-0302",
      semester: "Semester 3 (Autumn 2026)",
      category: "Laboratory & Computing Fee",
      total_amount: 12000,
      paid_amount: 12000,
      due_amount: 0,
      due_date: "2026-08-15",
      status: "Paid"
    },
    {
      id: "INV-2026-0303",
      semester: "Semester 3 (Autumn 2026)",
      category: "University Examination Fee",
      total_amount: 3500,
      paid_amount: 3500,
      due_amount: 0,
      due_date: "2026-10-01",
      status: "Paid"
    }
  ]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    { receipt_no: "RCP-2026-9812", date: "2026-08-14 11:25 AM", amount: 40000, fee_type: "Tuition Fee", mode: "Online Gateway (HDFC NetBanking)", status: "Success" },
    { receipt_no: "RCP-2026-9813", date: "2026-08-14 11:28 AM", amount: 12000, fee_type: "Laboratory Fee", mode: "Online Gateway (UPI)", status: "Success" },
    { receipt_no: "RCP-2026-9941", date: "2026-09-28 02:40 PM", amount: 3500, fee_type: "Examination Fee", mode: "UPI (Google Pay)", status: "Success" }
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  const billColumns: Column<FeeBill>[] = [
    {
      header: "Invoice No.",
      accessor: "id",
      render: (b) => <span className="font-mono font-bold text-navy-950">{b.id}</span>
    },
    {
      header: "Fee Head & Term",
      render: (b) => (
        <div>
          <span className="font-semibold text-navy-900 block">{b.category}</span>
          <span className="text-[11px] text-slate-500">{b.semester}</span>
        </div>
      )
    },
    {
      header: "Total Billed",
      accessor: "total_amount",
      render: (b) => <span className="font-mono text-slate-700">{formatINR(b.total_amount)}</span>
    },
    {
      header: "Amount Paid",
      accessor: "paid_amount",
      render: (b) => <span className="font-mono font-bold text-emerald-700">{formatINR(b.paid_amount)}</span>
    },
    {
      header: "Outstanding Due",
      accessor: "due_amount",
      render: (b) => (
        <span className={`font-mono font-bold ${b.due_amount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
          {formatINR(b.due_amount)}
        </span>
      )
    },
    {
      header: "Due Deadline",
      accessor: "due_date",
      render: (b) => <span className="font-mono text-slate-500">{b.due_date}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (b) => <Badge variant="success">{b.status}</Badge>
    }
  ];

  const transactionColumns: Column<PaymentTransaction>[] = [
    {
      header: "Receipt Reference",
      accessor: "receipt_no",
      render: (t) => <span className="font-mono font-bold text-navy-950">{t.receipt_no}</span>
    },
    { header: "Payment Purpose", accessor: "fee_type", render: (t) => <span className="font-semibold text-slate-800">{t.fee_type}</span> },
    {
      header: "Paid Amount",
      accessor: "amount",
      render: (t) => <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{formatINR(t.amount)}</span>
    },
    { header: "Disbursement Mode", accessor: "mode", render: (t) => <span className="text-slate-600 text-xs">{t.mode}</span> },
    { header: "Timestamp", accessor: "date", render: (t) => <span className="font-mono text-slate-500 text-[11px]">{t.date}</span> },
    {
      header: "Action",
      render: (t) => (
        <button
          onClick={() => setSelectedReceipt(t)}
          className="px-2.5 py-1 text-xs font-semibold text-navy-800 bg-ice-50 hover:bg-ice-100 border border-ice-200 rounded-lg transition-colors flex items-center gap-1"
        >
          <Receipt className="w-3.5 h-3.5" />
          View Receipt
        </button>
      )
    }
  ];

  const totalBilled = feeBills.reduce((acc, curr) => acc + curr.total_amount, 0);
  const totalPaid = feeBills.reduce((acc, curr) => acc + curr.paid_amount, 0);
  const totalDue = feeBills.reduce((acc, curr) => acc + curr.due_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-navy-800" />
          Fees & Financial Accounts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Semester tuition invoices, payments summary, payment receipts, and balance dues.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="erp-card p-5 bg-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Total Semester Billed
          </p>
          <h3 className="text-2xl font-extrabold text-navy-950 font-mono">
            {formatINR(totalBilled)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Semester 3 Standard Tariff</p>
        </div>

        <div className="erp-card p-5 bg-emerald-50/50 border-emerald-200/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Total Amount Credited
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-800 font-mono">
            {formatINR(totalPaid)}
          </h3>
          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Cleared via Online Portal
          </p>
        </div>

        <div className="erp-card p-5 bg-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Outstanding Due Balance
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatINR(totalDue)}
          </h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">No pending institutional holds</p>
        </div>
      </div>

      {/* Invoices List */}
      <DataTable
        columns={billColumns}
        data={feeBills}
        title="Semester Invoices & Breakdown"
        subtitle="Individual fee components billed for academic term"
      />

      {/* Payment History */}
      <DataTable
        columns={transactionColumns}
        data={transactions}
        title="Payment Receipts & Transaction Log"
        subtitle="Verified bank transfer and payment gateway settlements"
      />

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Official Fee Payment Receipt"
          subtitle={`University Financial Services • Ref: ${selectedReceipt.receipt_no}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] text-slate-400 font-mono">Digitally Generated Document</span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl"
              >
                Close Receipt
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs border border-dashed border-slate-300 p-4 rounded-xl bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-navy-950 text-sm">COLLEGE OF ENGINEERING & TECH</h4>
                <p className="text-[10px] text-slate-500">Student Accounts & Bursar's Office</p>
              </div>
              <Badge variant="success">PAID</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">Receipt No:</span>
                <span className="font-mono font-bold text-navy-950">{selectedReceipt.receipt_no}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Date & Time:</span>
                <span className="font-mono">{selectedReceipt.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Payment Head:</span>
                <span className="font-semibold">{selectedReceipt.fee_type}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Payment Mode:</span>
                <span>{selectedReceipt.mode}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
              <span className="font-bold text-navy-950">Amount Paid:</span>
              <span className="font-mono font-extrabold text-emerald-800">{formatINR(selectedReceipt.amount)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
