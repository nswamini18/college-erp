import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  MapPin,
  UserCheck
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { DataTable, Column } from '../../components/common/DataTable';
import { mockTimetables } from '../../data/mockAcademic';
import { api } from '../../services/api';

import { useAuth } from '../../context/AuthContext';

interface SubjectAttendance {
  subject_code: string;
  subject_name: string;
  faculty_name: string;
  total_classes: number;
  classes_attended: number;
  classes_absent: number;
  attendance_percentage: number;
}

export const StudentAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'attendance' | 'timetable'>('attendance');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<SubjectAttendance[]>([]);
  const [timetableData, setTimetableData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getStudentAttendance()
      .then(res => {
        if (isMounted && res?.data?.subjectAttendance) {
          setAttendanceData(res.data.subjectAttendance);
        }
        if (isMounted && res?.data?.timetable) {
          setTimetableData(res.data.timetable);
        }
      })
      .catch((err) => {
        console.warn('Failed to load student attendance:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const columns: Column<SubjectAttendance>[] = [
    {
      header: "Subject Code",
      accessor: "subject_code",
      sortable: true,
      render: (s) => <span className="font-mono font-bold text-navy-950">{s.subject_code}</span>
    },
    {
      header: "Subject Title",
      accessor: "subject_name",
      render: (s) => (
        <div>
          <span className="font-semibold text-navy-950 block">{s.subject_name}</span>
          <span className="text-[11px] text-slate-500">{s.faculty_name}</span>
        </div>
      )
    },
    {
      header: "Conducted",
      accessor: "total_classes",
      render: (s) => <span className="font-mono text-slate-700">{s.total_classes}</span>
    },
    {
      header: "Attended / Absent",
      render: (s) => (
        <span className="font-mono text-xs">
          <span className="font-bold text-emerald-700">{s.classes_attended}</span> /{' '}
          <span className="font-bold text-rose-600">{s.classes_absent}</span>
        </span>
      )
    },
    {
      header: "Percentage",
      accessor: "attendance_percentage",
      sortable: true,
      render: (s) => {
        const pct = Number(s.attendance_percentage || 0);
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
              />
            </div>
            <span className={`font-mono font-bold text-xs ${pct >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {pct.toFixed(1)}%
            </span>
          </div>
        );
      }
    },
    {
      header: "University Exam Eligibility",
      render: (s) => {
        const pct = Number(s.attendance_percentage || 0);
        return pct >= 75 ? (
          <Badge variant="success">Eligible</Badge>
        ) : (
          <Badge variant="danger">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Under 75% Rule
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-navy-800" />
            My Attendance & Academic Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Subject-wise lecture participation metrics, minimum 75% compliance tracking, and weekly class schedule.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'attendance' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Attendance Record
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'timetable' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Weekly Timetable
          </button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Statutory Threshold Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="block font-bold mb-0.5">Mandatory Attendance Policy (Regulation 14.2):</strong>
              Students must maintain a minimum of 75% attendance in every course to qualify for end-semester examinations.
              If your attendance falls below 75%, please consult your respective faculty instructor or HOD immediately.
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={attendanceData}
            title="Current Term Subject Attendance Breakdown"
            subtitle={`Semester ${user?.semester || 5} • ${user?.department || 'Computer Science & Engineering'} (${user?.section || 'Section A'})`}
            searchPlaceholder="Search subjects..."
          />
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="erp-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-navy-950">Weekly Class Timetable</h3>
              <p className="text-xs text-slate-500">Scheduled classroom lectures and laboratory sessions</p>
            </div>
            <Badge variant="navy">{user?.section || timetableData[0]?.section_name || 'Class Schedule'}</Badge>
          </div>

          {timetableData.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200">
              <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-sm text-navy-950">No Timetable Scheduled</p>
              <p className="text-xs text-slate-500">Class timetable slots are being updated by the department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timetableData.map((slot: any) => (
                <div key={slot.timetable_id || `${slot.day_of_week}-${slot.time}`} className="p-4 rounded-xl border border-slate-200 bg-[#FAFCFD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950">{slot.day_of_week}</span>
                    <Badge variant={slot.timetable_type === 'Lab' || slot.type === 'Lab' ? 'ice' : 'neutral'}>
                      {slot.timetable_type || slot.type || 'Lecture'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-navy-900">{slot.subject_name}</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1.5 font-mono text-[11px] text-navy-800">
                      <Clock className="w-3.5 h-3.5 text-navy-600" />
                      {slot.time || `${slot.start_time} - ${slot.end_time}`}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {slot.faculty_name}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Venue: {slot.room_no || 'Campus Classroom'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
