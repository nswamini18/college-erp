import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { AttendanceDistributionItem } from '../../data/studentAnalyticsData';
import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface AttendanceDonutChartProps {
  data: AttendanceDistributionItem[];
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  requiredThreshold?: number;
  isLoading?: boolean;
}

export const AttendanceDonutChart: React.FC<AttendanceDonutChartProps> = ({
  data,
  overallPercentage,
  totalClasses,
  attendedClasses,
  missedClasses,
  requiredThreshold = 75,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#4D8DFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#718096]">Loading attendance records...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0 || totalClasses === 0) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <p className="text-xs text-[#718096]">No attendance data recorded for this semester.</p>
      </div>
    );
  }

  const isMeetingThreshold = overallPercentage >= requiredThreshold;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as AttendanceDistributionItem;
      return (
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-[0px_6px_20px_rgba(112,144,176,0.18)] border border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="font-bold text-[#2C3E50]">{item.name}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-4 text-slate-600 font-mono text-[11px]">
            <span>Count: <strong>{item.count} classes</strong></span>
            <span>Share: <strong>{item.percentage}%</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="erp-card p-6 flex flex-col justify-between h-full bg-white shadow-bento">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] tracking-tight">
            Attendance Distribution
          </h3>
          <p className="text-xs text-[#718096]">
            Cumulative semester roll breakdown
          </p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
          isMeetingThreshold 
            ? 'bg-[#2ECC71]/10 text-[#2ECC71]' 
            : 'bg-[#FF6B4A]/10 text-[#FF6B4A]'
        }`}>
          {isMeetingThreshold ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Above Req. ({requiredThreshold}%)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Below Req. ({requiredThreshold}%)</span>
            </>
          )}
        </span>
      </div>

      {/* Donut Chart Container with Center Badge */}
      <div className="relative h-52 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={4}
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="transition-all duration-200 hover:opacity-85"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2C3E50] tracking-tight font-sans">
            {overallPercentage}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#718096]">
            Aggregate
          </span>
        </div>
      </div>

      {/* Summary Legend Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] text-[#718096] font-medium block">Total Conducted</span>
          <span className="text-sm font-extrabold text-[#2C3E50] font-mono">{totalClasses}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#2ECC71]/5 border border-[#2ECC71]/15">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
            <span className="text-[10px] text-[#2ECC71] font-bold">Attended</span>
          </div>
          <span className="text-sm font-extrabold text-[#2ECC71] font-mono">{attendedClasses}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#FF6B4A]/5 border border-[#FF6B4A]/15">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
            <span className="text-[10px] text-[#FF6B4A] font-bold">Missed</span>
          </div>
          <span className="text-sm font-extrabold text-[#FF6B4A] font-mono">{missedClasses}</span>
        </div>
      </div>
    </div>
  );
};
