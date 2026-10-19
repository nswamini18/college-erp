import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { SemesterTrendPoint } from '../../data/studentAnalyticsData';
import { GraduationCap, TrendingUp, Info } from 'lucide-react';

interface SemesterPerformanceChartProps {
  data: SemesterTrendPoint[];
  currentCgpa?: number;
  isLoading?: boolean;
}

export const SemesterPerformanceChart: React.FC<SemesterPerformanceChartProps> = ({
  data,
  currentCgpa = 9.15,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#4D8DFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#718096]">Loading performance trend...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <p className="text-xs text-[#718096]">No semester records available.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as SemesterTrendPoint;
      return (
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-[0px_6px_20px_rgba(112,144,176,0.18)] border border-slate-100 text-xs">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-[#2C3E50]">{item.semester}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              item.status === 'Completed' 
                ? 'bg-[#2ECC71]/10 text-[#2ECC71]' 
                : 'bg-[#4D8DFF]/10 text-[#4D8DFF]'
            }`}>
              {item.status}
            </span>
          </div>
          <p className="text-[11px] text-[#718096] mb-2">{item.academicYear}</p>
          <div className="space-y-1 font-mono text-xs">
            {item.sgpa !== null ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#718096]">SGPA:</span>
                  <span className="font-extrabold text-[#4D8DFF] text-sm">{item.sgpa.toFixed(2)}</span>
                </div>
                {item.cgpa !== null && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#718096]">Cumulative CGPA:</span>
                    <span className="font-bold text-[#2C3E50]">{item.cgpa.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 text-[11px]">
                  <span className="text-[#718096]">Credits:</span>
                  <span className="font-medium text-slate-700">{item.credits}</span>
                </div>
              </>
            ) : (
              <div className="text-[11px] text-[#4D8DFF] italic">
                Current Semester • Examinations in progress
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="erp-card p-6 flex flex-col justify-between h-full bg-white shadow-bento">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] tracking-tight">
            Academic Performance Trend
          </h3>
          <p className="text-xs text-[#718096]">
            Chronological SGPA trajectory across semesters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#718096] block">Cumulative CGPA</span>
            <span className="text-base font-extrabold text-[#2C3E50] font-mono leading-none">{currentCgpa.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="h-56 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="sgpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4D8DFF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4D8DFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="semester" 
              tick={{ fill: '#718096', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis 
              domain={[8.0, 10.0]} 
              ticks={[8.0, 8.5, 9.0, 9.5, 10.0]}
              tick={{ fill: '#718096', fontSize: 11 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sgpa"
              stroke="#4D8DFF"
              strokeWidth={3}
              fill="url(#sgpaGradient)"
              activeDot={{ r: 6, fill: '#4D8DFF', stroke: '#FFFFFF', strokeWidth: 2 }}
              dot={{ r: 4, fill: '#4D8DFF', stroke: '#FFFFFF', strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info Notice */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#718096]">
        <div className="flex items-center gap-1.5 text-[11px]">
          <TrendingUp className="w-3.5 h-3.5 text-[#2ECC71]" />
          <span>+0.20 SGPA growth from Sem 1 to Sem 2</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Info className="w-3 h-3 text-[#4D8DFF]" />
          <span>Sem 3 results awaiting End-Term evaluation</span>
        </div>
      </div>
    </div>
  );
};
