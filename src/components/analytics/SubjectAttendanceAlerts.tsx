import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  CalendarCheck2,
  ExternalLink 
} from 'lucide-react';
import { SubjectAttendanceAlert } from '../../data/studentAnalyticsData';

interface SubjectAttendanceAlertsProps {
  alerts: SubjectAttendanceAlert[];
}

export const SubjectAttendanceAlerts: React.FC<SubjectAttendanceAlertsProps> = ({ alerts }) => {
  const lowAttendanceCount = alerts.filter(a => a.severity === 'red').length;
  const borderlineCount = alerts.filter(a => a.severity === 'amber').length;

  return (
    <div className="erp-card p-6 bg-white shadow-bento space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] tracking-tight flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-[#4D8DFF]" />
              Subject-Wise Attendance Roll & Alerts
            </h3>
            {lowAttendanceCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20">
                {lowAttendanceCount} Shortage Warning
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2ECC71]/10 text-[#2ECC71]">
                All Requirements Met
              </span>
            )}
          </div>
          <p className="text-xs text-[#718096] mt-0.5">
            Institutional Regulation: Minimum 75% aggregate required to be eligible for End-Semester examinations.
          </p>
        </div>

        <Link
          to="/student/attendance"
          className="text-xs font-bold text-[#4D8DFF] hover:text-[#3A7AEB] flex items-center gap-1.5 self-start sm:self-auto py-1 px-3 rounded-full hover:bg-[#E8F0FE] transition-colors"
        >
          <span>Open Full Timetable</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alerts.map((sub) => {
          const isRed = sub.severity === 'red';
          const isAmber = sub.severity === 'amber';
          const isGreen = sub.severity === 'green';

          return (
            <div 
              key={sub.code} 
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                isRed 
                  ? 'bg-rose-50/40 border-rose-200 shadow-[0px_4px_14px_rgba(255,107,74,0.08)]' 
                  : isAmber 
                    ? 'bg-amber-50/40 border-amber-200' 
                    : 'bg-[#F9FBFC] border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2C3E50]">{sub.code}</span>
                    <span className="text-xs font-semibold text-slate-800 truncate">{sub.name}</span>
                  </div>
                  <p className="text-[11px] text-[#718096] mt-0.5">{sub.faculty}</p>
                </div>

                {/* Severity Badge */}
                <div className="flex-shrink-0">
                  {isRed && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF6B4A]/15 text-[#FF6B4A] border border-[#FF6B4A]/30">
                      <AlertCircle className="w-3 h-3" />
                      Critical Shortage
                    </span>
                  )}
                  {isAmber && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      <AlertTriangle className="w-3 h-3" />
                      Approaching Limit
                    </span>
                  )}
                  {isGreen && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Compliant
                    </span>
                  )}
                </div>
              </div>

              {/* Attendance Progress bar & Metrics */}
              <div className="space-y-1.5 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#718096] font-mono">
                    Conducted: <strong className="text-slate-800">{sub.attended}/{sub.total}</strong>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-[#718096]">Threshold: {sub.threshold}%</span>
                    <span className={`font-extrabold text-sm ${
                      isRed ? 'text-[#FF6B4A]' : isAmber ? 'text-amber-700' : 'text-[#2ECC71]'
                    }`}>
                      {sub.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isRed ? 'bg-[#FF6B4A]' : isAmber ? 'bg-amber-500' : 'bg-[#2ECC71]'
                    }`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Actionable Recovery Advice or Success Note */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                {isRed ? (
                  <div className="flex items-center gap-1.5 text-[#FF6B4A] font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Must attend next <strong>{sub.classesNeededToRecover} consecutive classes</strong> to reach 75%.</span>
                  </div>
                ) : isAmber ? (
                  <span className="text-amber-800 font-medium">
                    Attendance is near minimum threshold. Do not miss upcoming sessions.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attendance comfortably above threshold.
                  </span>
                )}

                <Link
                  to="/student/attendance"
                  className="text-[#4D8DFF] hover:underline font-semibold flex items-center gap-0.5 flex-shrink-0 ml-2"
                  title="View detailed subject log"
                >
                  Details <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
