import React, { useState, useEffect } from 'react';
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
import { EmptyState } from '../../components/common/EmptyState';
import { formatINR } from '../../utils/currency';
import { api } from '../../services/api';

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
  const [feeBills, setFeeBills] = useState<FeeBill[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getStudentFees()
      .then(res => {
        if (isMounted && res && res.success && res.data) {
          setFeeBills(res.data.bills || []);
          setTransactions(res.data.payments || []);
        }
      })
      .catch(err => {
        console.warn('Failed to load fees from backend:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

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
      render: (b) => <span className="font-mono text-emerald-800 font-semibold">{formatINR(b.paid_amount)}</span>
    },
    {
      header: "Balance Due",
      accessor: "due_amount",
      render: (b) => (
        <span className={`font-mono font-bold ${b.due_amount > 0 ? 'text-[#FF6B4A]' : 'text-slate-500'}`}>
          {formatINR(b.due_amount)}
        </span>
      )
    },
    {
      header: "Due Date",
      accessor: "due_date",
      render: (b) => <span className="text-slate-600 font-mono text-xs">{b.due_date ? String(b.due_date).slice(0, 10) : 'N/A'}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (b) => {
        if (b.status === 'Paid') return <Badge variant="success">Paid</Badge>;
        if (b.status === 'Partially Paid') return <Badge variant="warning">Partial</Badge>;
        return <Badge variant="danger">Unpaid</Badge>;
      }
    }
  ];

  const transactionColumns: Column<PaymentTransaction>[] = [
    {
      header: "Receipt Reference",
      accessor: "receipt_no",
      render: (t) => <span className="font-mono font-bold text-navy-950">{t.receipt_no}</span>
    },
    {
      header: "Payment Date",
      accessor: "date",
      render: (t) => <span className="text-slate-600 text-xs font-mono">{t.date ? String(t.date).slice(0, 10) : 'N/A'}</span>
    },
    {
      header: "Category",
      accessor: "fee_type"
    },
    {
      header: "Mode of Transfer",
      accessor: "mode",
      render: (t) => <span className="text-slate-700 text-xs">{t.mode}</span>
    },
    {
      header: "Settled Amount",
      accessor: "amount",
      render: (t) => <span className="font-mono font-bold text-emerald-800">{formatINR(t.amount)}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: () => <Badge variant="success">Cleared</Badge>
    },
    {
      header: "Receipt",
      render: (t) => (
        <button
          onClick={() => setSelectedReceipt(t)}
          className="text-xs text-[#4D8DFF] hover:underline font-bold flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          View
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
          Semester tuition invoices, payments summary, payment receipts, and balance dues displayed in Indian Rupees (₹).
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
          <p className="text-xs text-slate-400 mt-1">Academic Year 2026-2027</p>
        </div>

        <div className="erp-card p-5 bg-emerald-50/50 border-emerald-200/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
            Total Amount Credited
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-800 font-mono">
            {formatINR(totalPaid)}
          </h3>
          <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared Payments Record
          </p>
        </div>

        <div className="erp-card p-5 bg-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Outstanding Due Balance
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatINR(totalDue)}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {totalDue > 0 ? 'Pending payment required' : 'No outstanding institutional dues'}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      {feeBills.length > 0 ? (
        <DataTable
          columns={billColumns}
          data={feeBills}
          title="Semester Invoices & Breakdown"
          subtitle="Individual fee components billed for academic term"
        />
      ) : (
        <EmptyState
          title="No Fee Invoices Found"
          description="There are currently no fee invoices generated for your student account."
        />
      )}

      {/* Payment History */}
      {transactions.length > 0 ? (
        <DataTable
          columns={transactionColumns}
          data={transactions}
          title="Payment Receipts & Transaction Log"
          subtitle="Verified payment gateway settlements and bank credits"
        />
      ) : (
        <EmptyState
          title="No Payment History"
          description="No fee payment transactions have been recorded yet."
        />
      )}

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
              <span className="text-[10px] text-slate-400 font-mono">Digitally Verified Document</span>
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
                <h4 className="font-extrabold text-navy-950 text-sm">CAMPUS ERP ACCOUNTS DESK</h4>
                <p className="text-[10px] text-slate-500">Student Accounts & Bursar's Office</p>
              </div>
              <Badge variant="success">CLEARED</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">Receipt No:</span>
                <span className="font-mono font-bold text-navy-950">{selectedReceipt.receipt_no}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Date & Time:</span>
                <span className="font-mono">{selectedReceipt.date ? String(selectedReceipt.date).slice(0, 10) : ''}</span>
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

export default StudentFeesPage;
