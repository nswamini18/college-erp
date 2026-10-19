import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ExamComparisonItem } from '../../data/studentAnalyticsData';
import { Award, Layers } from 'lucide-react';

interface ExamComparisonBarChartProps {
  data: ExamComparisonItem[];
  isLoading?: boolean;
}

export const ExamComparisonBarChart: React.FC<ExamComparisonBarChartProps> = ({
  data,
  isLoading = false
}) => {
  const [metricView, setMetricView] = useState<'percentage' | 'raw'>('percentage');

  if (isLoading) {
    return (
      <div className="erp-card p-6 h-[380px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#4D8DFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#718096]">Loading evaluation metrics...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="erp-card p-6 h-[380px] flex items-center justify-center">
        <p className="text-xs text-[#718096]">No examination records available.</p>
      </div>
    );
  }

  // Format data for chart depending on view
  const chartData = data.map(item => ({
    subjectCode: item.subjectCode,
    subjectName: item.subjectName,
    // Percentages (Normalized)
    internalPct: item.internalPct,
    midtermPct: item.midtermPct,
    practicalPct: item.practicalPct,
    // Raw marks
    internalMarks: item.internalMarks,
    internalMax: item.internalMax,
    midtermMarks: item.midtermMarks,
    midtermMax: item.midtermMax,
    practicalMarks: item.practicalMarks,
    practicalMax: item.practicalMax,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as ExamComparisonItem;
      return (
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-[0px_8px_24px_rgba(112,144,176,0.18)] border border-slate-100 text-xs min-w-[220px]">
          <div className="border-b border-slate-100 pb-2 mb-2">
            <span className="font-extrabold text-[#2C3E50]">{item.subjectCode}</span>
            <span className="text-[#718096] block text-[11px] truncate">{item.subjectName}</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4D8DFF]" />
                <span className="text-slate-600">Internal:</span>
              </div>
              <span className="font-bold text-[#2C3E50]">
                {item.internalMarks}/{item.internalMax} ({item.internalPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2ECC71]" />
                <span className="text-slate-600">Midterm:</span>
              </div>
              <span className="font-bold text-[#2C3E50]">
                {item.midtermMarks}/{item.midtermMax} ({item.midtermPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FF6B4A]" />
                <span className="text-slate-600">Practical:</span>
              </div>
              <span className="font-bold text-[#2C3E50]">
                {item.practicalMarks}/{item.practicalMax} ({item.practicalPct}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="erp-card p-6 bg-white shadow-bento">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] tracking-tight">
            Examination Marks Comparison by Subject
          </h3>
          <p className="text-xs text-[#718096]">
            Normalized evaluation across Internal, Midterm, and Practical assessments
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="inline-flex p-1 bg-[#E8F0FE]/70 rounded-full border border-blue-100/60 self-start sm:self-auto">
          <button
            onClick={() => setMetricView('percentage')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              metricView === 'percentage'
                ? 'bg-[#4D8DFF] text-white shadow-sm'
                : 'text-[#718096] hover:text-[#2C3E50]'
            }`}
          >
            Normalized (%)
          </button>
          <button
            onClick={() => setMetricView('raw')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              metricView === 'raw'
                ? 'bg-[#4D8DFF] text-white shadow-sm'
                : 'text-[#718096] hover:text-[#2C3E50]'
            }`}
          >
            Raw Marks
          </button>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-64 sm:h-72 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 12, left: -16, bottom: 4 }}
            barGap={4}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="subjectCode" 
              tick={{ fill: '#718096', fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis 
              domain={metricView === 'percentage' ? [60, 100] : [0, 50]}
              tick={{ fill: '#718096', fontSize: 11 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              tickFormatter={(v) => metricView === 'percentage' ? `${v}%` : `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontWeight: 600 }}
            />
            <Bar 
              dataKey={metricView === 'percentage' ? 'internalPct' : 'internalMarks'} 
              name="Internal Evaluation" 
              fill="#4D8DFF" 
              radius={[6, 6, 0, 0]} 
              isAnimationActive={true}
            />
            <Bar 
              dataKey={metricView === 'percentage' ? 'midtermPct' : 'midtermMarks'} 
              name="Midterm Examination" 
              fill="#2ECC71" 
              radius={[6, 6, 0, 0]} 
              isAnimationActive={true}
            />
            <Bar 
              dataKey={metricView === 'percentage' ? 'practicalPct' : 'practicalMarks'} 
              name="Practical Examination" 
              fill="#FF6B4A" 
              radius={[6, 6, 0, 0]} 
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-[#718096] gap-2">
        <span className="text-[11px]">
          Note: Marks are normalized to 100% to ensure fair cross-evaluation across differing maximum weightages (Internal: 40, Midterm: 50, Practical: 30-50).
        </span>
      </div>
    </div>
  );
};
