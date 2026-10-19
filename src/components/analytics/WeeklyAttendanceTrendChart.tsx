import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { WeeklyAttendancePoint } from '../../data/studentAnalyticsData';
import { Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

interface WeeklyAttendanceTrendChartProps {
  data: WeeklyAttendancePoint[];
  threshold?: number;
  isLoading?: boolean;
}

export const WeeklyAttendanceTrendChart: React.FC<WeeklyAttendanceTrendChartProps> = ({
  data,
  threshold = 75,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#4D8DFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#718096]">Loading weekly trend...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="erp-card p-6 h-[340px] flex items-center justify-center">
        <p className="text-xs text-[#718096]">No weekly attendance records available.</p>
      </div>
    );
  }

  // Determine trend direction comparing last 2 weeks
  const lastWeek = data[data.length - 1];
  const prevWeek = data[data.length - 2];
  const isImproving = lastWeek && prevWeek ? lastWeek.percentage >= prevWeek.percentage : true;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as WeeklyAttendancePoint;
      const isAboveReq = item.percentage >= threshold;
      return (
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-[0px_6px_20px_rgba(112,144,176,0.18)] border border-slate-100 text-xs">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-[#2C3E50]">{item.week} ({item.dateRange})</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAboveReq 
                ? 'bg-[#2ECC71]/10 text-[#2ECC71]' 
                : 'bg-[#FF6B4A]/10 text-[#FF6B4A]'
            }`}>
              {item.percentage}%
            </span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono mt-1">
            <span>Attended: <strong>{item.attended}</strong> of <strong>{item.total}</strong> conducted classes</span>
          </div>
          {item.percentage < threshold && (
            <p className="text-[10px] text-[#FF6B4A] mt-1 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Dip below mandatory threshold
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="erp-card p-6 bg-white shadow-bento">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] tracking-tight">
            Weekly Attendance Trend
          </h3>
          <p className="text-xs text-[#718096]">
            Week-by-week presence pattern against 75% institutional requirement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F0FE] text-[#4D8DFF]">
            <TrendingUp className="w-3.5 h-3.5 text-[#2ECC71]" />
            {isImproving ? 'Improving Trend' : 'Declining Trend'} ({lastWeek?.percentage}%)
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-56 sm:h-64 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis 
              dataKey="week" 
              tick={{ fill: '#718096', fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis 
              domain={[60, 105]} 
              ticks={[60, 70, 75, 80, 90, 100]}
              tick={{ fill: '#718096', fontSize: 11 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line for 75% threshold */}
            <ReferenceLine 
              y={threshold} 
              stroke="#FF6B4A" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              label={{ 
                value: `Min Req (${threshold}%)`, 
                fill: '#FF6B4A', 
                position: 'right', 
                fontSize: 10,
                fontWeight: 600
              }} 
            />

            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#4D8DFF"
              strokeWidth={3}
              activeDot={{ r: 6, fill: '#4D8DFF', stroke: '#FFFFFF', strokeWidth: 2 }}
              dot={{ r: 4, fill: '#4D8DFF', stroke: '#FFFFFF', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#718096]">
        <span className="text-[11px]">
          Target: Maintain consistent presence above the dashed <strong className="text-[#FF6B4A]">75% line</strong> to prevent exam debarment.
        </span>
        <span className="text-[11px] font-mono font-semibold text-[#2C3E50] hidden sm:inline">
          Latest Week: {lastWeek?.percentage}% ({lastWeek?.attended}/{lastWeek?.total} classes)
        </span>
      </div>
    </div>
  );
};
