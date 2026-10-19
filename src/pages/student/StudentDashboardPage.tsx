import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck2, 
  CreditCard, 
  BookOpen, 
  FileCheck2, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Sparkles,
  Award,
  Layers,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

// Visual Analytics Components
import { AttendanceDonutChart } from '../../components/analytics/AttendanceDonutChart';
import { SemesterPerformanceChart } from '../../components/analytics/SemesterPerformanceChart';
import { ExamComparisonBarChart } from '../../components/analytics/ExamComparisonBarChart';
import { WeeklyAttendanceTrendChart } from '../../components/analytics/WeeklyAttendanceTrendChart';
import { SubjectAttendanceAlerts } from '../../components/analytics/SubjectAttendanceAlerts';

// Analytics Data Service
import { 
  getStudentAcademicKPIs,
  getAttendanceDistribution,
  getSemesterPerformanceTrend,
  getExaminationComparisonData,
  getWeeklyAttendanceTrend,
  getSubjectAttendanceAlerts,
  INSTITUTION_ATTENDANCE_THRESHOLD
} from '../../data/studentAnalyticsData';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Load calculated academic analytics
  const kpis = getStudentAcademicKPIs();
  const attendanceDist = getAttendanceDistribution();
  const semesterTrend = getSemesterPerformanceTrend();
  const examComparison = getExaminationComparisonData();
  const weeklyAttendance = getWeeklyAttendanceTrend();
  const attendanceAlerts = getSubjectAttendanceAlerts();

  const todayClasses = [
    { time: "09:00 AM - 10:00 AM", subject: "Data Structures & Algorithms (CS301)", faculty: "Prof. Sunita Rao", room: "AB-301", type: "Lecture" },
    { time: "10:15 AM - 11:15 AM", subject: "Database Management Systems (CS302)", faculty: "Dr. Arvind Sharma", room: "AB-301", type: "Lecture" },
    { time: "02:00 PM - 04:00 PM", subject: "Database Systems Lab (CS302P)", faculty: "Prof. Kunal Joshi", room: "DBMS Lab 304", type: "Lab" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Message & Current Semester Information Banner */}
      <div className="erp-card p-6 sm:p-7 bg-white relative overflow-hidden border border-white/90 shadow-bento">
        {/* Soft decorative background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E8F0FE] via-[#F4F7FC]/50 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#EBF0F9]/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FE] text-[#4D8DFF] text-xs font-bold mb-3 border border-[#4D8DFF]/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
            <span>Autumn Semester 2026 • Academic Year 2026-2027</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2C3E50]">
            Welcome back, {user?.name || "Student"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#718096] leading-relaxed font-sans">
            <span className="font-mono font-semibold text-[#2C3E50]">{user?.codeOrRoll}</span> • {user?.programOrDesignation} • Semester {user?.semester || 3} ({user?.section || 'Section A'})
          </p>

          {/* Quick Notice Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="flex items-center gap-1.5 bg-[#F4F7FC] px-3 py-1.5 rounded-full border border-slate-200/60 text-[#2C3E50] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#4D8DFF]" />
              Next Lecture: <strong className="font-semibold">CS301 at 09:00 AM (Room AB-301)</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 text-[#2ECC71] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aggregate Attendance: <strong>{kpis.overallAttendance.percentage}%</strong>
            </span>
          </div>
        </div>

        {/* Ambient graduation icon */}
        <div className="absolute -bottom-8 -right-6 text-[#E8F0FE]/60 pointer-events-none hidden sm:block">
          <GraduationCap className="w-56 h-56" />
        </div>
      </div>

      {/* 2. Four Compact Academic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 — Current SGPA */}
        <StatCard
          title="Current SGPA"
          value={kpis.currentSgpa.value.toFixed(2)}
          subtitle={kpis.currentSgpa.semester}
          change={`+${kpis.currentSgpa.change} vs Sem 1 (${kpis.currentSgpa.previousSgpa.toFixed(2)})`}
          trend="up"
          iconName="Award"
          badge={
            <span className="text-[10px] font-bold text-[#4D8DFF] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
              CGPA {kpis.currentSgpa.cgpa.toFixed(2)}
            </span>
          }
        />

        {/* Card 2 — Overall Attendance */}
        <StatCard
          title="Overall Attendance"
          value={`${kpis.overallAttendance.percentage}%`}
          subtitle={`${kpis.overallAttendance.attendedClasses} / ${kpis.overallAttendance.totalClasses} classes attended`}
          change={
            kpis.overallAttendance.isMeetingRequirement 
              ? `Meets ≥${kpis.overallAttendance.requiredThreshold}% threshold` 
              : `Below ${kpis.overallAttendance.requiredThreshold}% requirement`
          }
          trend={kpis.overallAttendance.isMeetingRequirement ? "up" : "warning"}
          iconName="CalendarCheck2"
          badge={
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              kpis.overallAttendance.isMeetingRequirement 
                ? 'bg-[#2ECC71]/10 text-[#2ECC71]' 
                : 'bg-[#FF6B4A]/10 text-[#FF6B4A]'
            }`}>
              {kpis.overallAttendance.isMeetingRequirement ? 'Eligible' : 'Warning'}
            </span>
          }
        />

        {/* Card 3 — Upcoming Examinations */}
        <StatCard
          title="Upcoming Examinations"
          value={kpis.upcomingExams.nextExamDate}
          subtitle={kpis.upcomingExams.nextExamName}
          change={`${kpis.upcomingExams.totalUpcoming} scheduled papers in Autumn term`}
          trend="neutral"
          iconName="FileCheck2"
          badge={
            <span className="text-[10px] font-bold text-[#4D8DFF] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
              Mid-Semester
            </span>
          }
        />

        {/* Card 4 — Pending Examination Applications */}
        <StatCard
          title="Exam Applications"
          value={`${kpis.pendingApplications.pendingCount} In Review`}
          subtitle={kpis.pendingApplications.statusSummary}
          change="Revaluation petition under verification"
          trend="warning"
          iconName="Layers"
          badge={
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Active
            </span>
          }
        />
      </div>

      {/* 3. Visual Analytics Bento Grid: Attendance Donut Chart alongside Semester SGPA Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceDonutChart
          data={attendanceDist.items}
          overallPercentage={attendanceDist.overallPct}
          totalClasses={attendanceDist.totalClasses}
          attendedClasses={attendanceDist.attendedClasses}
          missedClasses={attendanceDist.missedClasses}
          requiredThreshold={INSTITUTION_ATTENDANCE_THRESHOLD}
        />

        <SemesterPerformanceChart
          data={semesterTrend}
          currentCgpa={kpis.currentSgpa.cgpa}
        />
      </div>

      {/* 4. Examination Comparison Bar Chart */}
      <div>
        <ExamComparisonBarChart
          data={examComparison}
        />
      </div>

      {/* 5. Weekly Attendance Trend Line Chart */}
      <div>
        <WeeklyAttendanceTrendChart
          data={weeklyAttendance}
          threshold={INSTITUTION_ATTENDANCE_THRESHOLD}
        />
      </div>

      {/* 6. Subject-Wise Attendance Alerts */}
      <div>
        <SubjectAttendanceAlerts
          alerts={attendanceAlerts}
        />
      </div>

      {/* 7. Existing Upcoming Examinations, Today's Schedule & Relevant Academic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Timetable */}
        <div className="lg:col-span-2">
          <div className="erp-card p-6 bg-white shadow-bento h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4D8DFF]" />
                  Today's Class Schedule
                </h3>
                <p className="text-xs text-[#718096]">Live lecture and lab timetable for your batch</p>
              </div>
              <Link 
                to="/student/attendance" 
                className="text-xs font-bold text-[#4D8DFF] hover:text-[#3A7AEB] flex items-center gap-1 px-3 py-1 rounded-full hover:bg-[#E8F0FE] transition-colors"
              >
                View Full Week <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl border border-slate-100 bg-[#F9FBFC] hover:bg-white hover:shadow-sm transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8F0FE] text-[#4D8DFF] font-extrabold flex items-center justify-center text-xs shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2C3E50]">{item.subject}</h4>
                      <p className="text-[11px] text-[#718096] mt-0.5">{item.faculty} • Room {item.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#2C3E50] block">{item.time}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      item.type === 'Lab' 
                        ? 'bg-[#E8F0FE] text-[#4D8DFF]' 
                        : 'bg-slate-100 text-[#718096]'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Cards & Academic Broadcasts */}
        <div className="space-y-4">
          {/* Library Book Due Reminder */}
          <div className="erp-card p-5 bg-white shadow-bento border-l-4 border-l-[#FF6B4A]">
            <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#FF6B4A]" />
              Library Book Return Alert
            </h4>
            <div className="bg-[#FF6B4A]/5 p-3 rounded-2xl border border-[#FF6B4A]/20 text-xs">
              <p className="font-bold text-[#2C3E50]">Introduction to Algorithms (CLRS)</p>
              <p className="text-[#718096] text-[11px] mt-0.5 font-mono">Barcode: LIB-CLRS-002</p>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#FF6B4A] font-semibold">Due: Oct 12, 2026</span>
                <span className="text-slate-500 font-mono">2 Days Left</span>
              </div>
            </div>
            <Link 
              to="/student/library" 
              className="mt-3 block text-center text-xs font-bold text-[#4D8DFF] hover:underline"
            >
              View All Borrowed Books →
            </Link>
          </div>

          {/* Exam Registration Quick Link */}
          <div className="erp-card p-5 bg-white shadow-bento">
            <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#4D8DFF]" />
              Upcoming Examination
            </h4>
            <p className="text-xs font-bold text-[#2C3E50]">Mid-Semester Exam Autumn 2026</p>
            <p className="text-[11px] text-[#718096] mt-1">
              Your hall ticket has been verified. Download your entry pass before Oct 15.
            </p>
            <Link
              to="/student/examination"
              className="mt-3 inline-flex items-center justify-center w-full py-2.5 bg-[#4D8DFF] hover:bg-[#3A7AEB] text-white rounded-full text-xs font-bold transition-all shadow-[0px_4px_14px_rgba(77,141,255,0.35)]"
            >
              Download Hall Ticket
            </Link>
          </div>

          {/* Campus Placement Broadcast */}
          <div className="erp-card p-5 bg-white shadow-bento">
            <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#4D8DFF]" />
              T&P Campus Drive
            </h4>
            <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C3E50]">Microsoft Corporation</span>
                <Badge variant="success">18.5 LPA</Badge>
              </div>
              <p className="text-[11px] text-[#718096] mt-1">Role: SDE-1 • Eligible CGPA: ≥ 8.0</p>
            </div>
            <Link
              to="/student/placement"
              className="mt-3 block text-center text-xs font-bold text-[#4D8DFF] hover:underline"
            >
              Apply via Placement Desk →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
