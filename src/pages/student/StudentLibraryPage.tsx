import React, { useState } from 'react';
import { 
  BookOpen, 
  RotateCcw, 
  AlertCircle, 
  Clock, 
  Search, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { DataTable, Column } from '../../components/common/DataTable';
import { mockBooks } from '../../data/mockLibrary';

interface BorrowedBook {
  issue_id: string;
  title: string;
  author: string;
  isbn: string;
  accession_no: string;
  issue_date: string;
  due_date: string;
  status: 'Issued' | 'Overdue';
  fine_amount: number;
}

interface ReturnedBook {
  return_id: string;
  title: string;
  isbn: string;
  returned_date: string;
  condition: string;
  fine_paid: number;
}

export const StudentLibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'catalog'>('current');

  const currentLoans: BorrowedBook[] = [
    {
      issue_id: "ISS-2026-001",
      title: "Introduction to Algorithms (CLRS)",
      author: "Thomas H. Cormen et al.",
      isbn: "978-0262033848",
      accession_no: "LIB-CLRS-002",
      issue_date: "2026-09-28",
      due_date: "2026-10-12",
      status: "Issued",
      fine_amount: 0.00
    },
    {
      issue_id: "ISS-2026-004",
      title: "Computer Networks: A Systems Approach",
      author: "Larry L. Peterson",
      isbn: "978-0123850591",
      accession_no: "LIB-CN-004",
      issue_date: "2026-09-15",
      due_date: "2026-09-29",
      status: "Overdue",
      fine_amount: 22.00 // Overdue fine!
    }
  ];

  const returnHistory: ReturnedBook[] = [
    {
      return_id: "RET-2026-081",
      title: "Database System Concepts (7th Edition)",
      isbn: "978-0078022159",
      returned_date: "2026-09-14",
      condition: "Good",
      fine_paid: 0.00
    },
    {
      return_id: "RET-2026-042",
      title: "Discrete Mathematics and Its Applications",
      isbn: "978-0073383095",
      returned_date: "2026-08-20",
      condition: "Good",
      fine_paid: 10.00
    }
  ];

  const loanColumns: Column<BorrowedBook>[] = [
    {
      header: "Book Title",
      accessor: "title",
      render: (b) => (
        <div>
          <span className="font-bold text-navy-950 block">{b.title}</span>
          <span className="text-[11px] text-slate-500">{b.author}</span>
        </div>
      )
    },
    {
      header: "Accession Barcode",
      accessor: "accession_no",
      render: (b) => <span className="font-mono text-xs text-navy-800">{b.accession_no}</span>
    },
    {
      header: "Borrowed Date",
      accessor: "issue_date",
      render: (b) => <span className="font-mono text-slate-500">{b.issue_date}</span>
    },
    {
      header: "Return Due Deadline",
      accessor: "due_date",
      render: (b) => (
        <span className={`font-mono font-bold ${b.status === 'Overdue' ? 'text-rose-600' : 'text-slate-800'}`}>
          {b.due_date}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (b) => <Badge variant={b.status === 'Issued' ? 'info' : 'danger'}>{b.status}</Badge>
    },
    {
      header: "Accrued Fine",
      accessor: "fine_amount",
      render: (b) => (
        b.fine_amount > 0 ? (
          <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            ₹{b.fine_amount.toFixed(2)}
          </span>
        ) : (
          <span className="font-mono text-slate-400">₹0.00</span>
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
            <BookOpen className="w-6 h-6 text-navy-800" />
            Library Circulation & Book Loans
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active borrowed books, due dates, past return history, overdue penalties, and library catalog.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'current' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Currently Borrowed ({currentLoans.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Borrowing History
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'catalog' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Search Book Catalog
          </button>
        </div>
      </div>

      {activeTab === 'current' && (
        <div className="space-y-4">
          {/* Overdue alert if any */}
          {currentLoans.some(b => b.status === 'Overdue') && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 leading-relaxed">
                <strong>Attention — Overdue Loan Penalty:</strong> You have an overdue book loan: <em>Computer Networks: A Systems Approach</em>.
                An overdue fine of ₹2.00 per day is accruing. Please return the book to the Central Circulation Desk immediately.
              </div>
            </div>
          )}

          <DataTable
            columns={loanColumns}
            data={currentLoans}
            title="Active Borrowed Books"
            subtitle="Books currently in your possession from Central Library"
          />
        </div>
      )}

      {activeTab === 'history' && (
        <DataTable
          columns={[
            { header: "Book Title", accessor: "title", render: (r) => <span className="font-bold text-navy-950">{r.title}</span> },
            { header: "ISBN", accessor: "isbn", render: (r) => <span className="font-mono text-slate-500">{r.isbn}</span> },
            { header: "Returned On", accessor: "returned_date", render: (r) => <span className="font-mono">{r.returned_date}</span> },
            { header: "Physical Condition", accessor: "condition", render: (r) => <Badge variant="neutral">{r.condition}</Badge> },
            {
              header: "Fine Cleared",
              accessor: "fine_paid",
              render: (r) => <span className="font-mono">₹{r.fine_paid.toFixed(2)}</span>
            }
          ]}
          data={returnHistory}
          title="Past Circulation Return Archive"
          subtitle="All returned books previously checked out by your student card"
        />
      )}

      {activeTab === 'catalog' && (
        <DataTable
          columns={[
            {
              header: "Title & Authors",
              render: (b) => (
                <div>
                  <span className="font-bold text-navy-950 block">{b.title}</span>
                  <span className="text-[11px] text-slate-500">{b.author_names}</span>
                </div>
              )
            },
            { header: "Category", accessor: "category_name", render: (b) => <Badge variant="ice">{b.category_name}</Badge> },
            {
              header: "Location",
              render: (b) => <span className="font-mono text-xs text-slate-600">Shelf {b.shelf_no} • Rack {b.rack_no}</span>
            },
            {
              header: "Available In Stock",
              render: (b) => (
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${b.available_copies > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {b.available_copies} / {b.total_copies} Copies
                </span>
              )
            }
          ]}
          data={mockBooks}
          title="Central Library Catalog Search"
          subtitle="Locate physical shelf coordinates across university stacks"
          searchPlaceholder="Search titles, authors, or categories..."
        />
      )}
    </div>
  );
};
