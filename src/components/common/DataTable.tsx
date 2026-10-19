import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchField?: (item: T) => string;
  filterField?: (item: T) => string;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  onAddClick?: () => void;
  addLabel?: string;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchField,
  filterField,
  filterOptions,
  filterLabel = "All Categories",
  onAddClick,
  addLabel = "Add Record",
  title,
  subtitle,
  isLoading = false
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Search and Filter
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        if (searchField) {
          return searchField(item).toLowerCase().includes(q);
        }
        return Object.values(item).some(val => 
          val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        );
      });
    }

    if (filterField && selectedFilter !== "ALL") {
      result = result.filter(item => filterField(item) === selectedFilter);
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc' ? 1 : -1;
      });
    }

    return result;
  }, [data, searchQuery, selectedFilter, sortColumn, sortDirection, searchField, filterField]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !col.accessor) return;
    if (sortColumn === col.accessor) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
      }
    } else {
      setSortColumn(col.accessor);
      setSortDirection('asc');
    }
  };

  return (
    <div className="erp-card overflow-hidden bg-white">
      {/* Header Bar */}
      {(title || onAddClick || searchPlaceholder) && (
        <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-bold text-navy-950 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 focus:bg-white text-navy-950 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter */}
            {filterOptions && filterOptions.length > 0 && (
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => {
                    setSelectedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800 text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="ALL">{filterLabel}</option>
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {/* Add Button */}
            {onAddClick && (
              <button
                type="button"
                onClick={onAddClick}
                className="px-3.5 py-1.5 text-xs font-bold bg-navy-950 hover:bg-navy-900 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>+</span> {addLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
            Loading records...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No records found"
              description={searchQuery ? "No entries match your search query." : "No records currently available in this dataset."}
              actionLabel={onAddClick ? addLabel : undefined}
              onAction={onAddClick}
            />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(col)}
                    className={`py-3 px-4 text-[11px] font-bold text-slate-600 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer select-none hover:bg-slate-100' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {sortColumn === col.accessor ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-navy-800" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-navy-800" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 text-slate-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedData.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3 px-4 text-slate-800 ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String(row[col.accessor] ?? '—')
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200/80 bg-[#FAFBFD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-0.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
            >
              <option value={5}>5 per page</option>
              <option value={6}>6 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
