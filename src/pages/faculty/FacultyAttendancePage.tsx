import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { mockStudents } from '../../data/mockStudents';
import { mockTimetables } from '../../data/mockAcademic';

interface StudentAttendanceRow {
  student_id: number;
  roll_no: string;
  name: string;
  status: 'Present' | 'Absent';
}

interface SavedSessionLog {
  id: string;
  date: string;
  division: string;
  subject: string;
  period: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  saved_at: string;
  can_edit: boolean;
}

export const FacultyAttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mark' | 'saved_logs' | 'my_attendance' | 'my_timetable'>('mark');

  // Filter selection state for marking attendance
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-10');
  const [selectedDivision, setSelectedDivision] = useState<string>('B.Tech CSE - Section A');
  const [selectedSubject, setSelectedSubject] = useState<string>('CS302 - Database Management Systems');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Period 2 (10:15 AM - 11:15 AM)');

  // Filter students for the selected class/division from mockStudents
  const sectionAStudents = mockStudents.filter(s => s.department_id === 1 && (s.section_name === 'CS-A' || s.section_id === 1));

  // Initialize student attendance roster
  const [roster, setRoster] = useState<StudentAttendanceRow[]>(() => {
    return sectionAStudents.map(s => ({
      student_id: s.student_id,
      roll_no: s.roll_no,
      name: `${s.first_name} ${s.last_name}`,
      status: 'Present'
    }));
  });

  // Saved attendance session history
  const [savedLogs, setSavedLogs] = useState<SavedSessionLog[]>([
    {
      id: "ATT-2026-1009-P1",
      date: "2026-10-09",
      division: "B.Tech CSE - Section A",
      subject: "CS302 - Database Management Systems",
      period: "Period 2 (10:15 AM - 11:15 AM)",
      total_students: 2,
      present_count: 2,
      absent_count: 0,
      saved_at: "2026-10-09 11:20 AM",
      can_edit: true
    }
  ]);

  // Modals & Feedback
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toggle single student attendance
  const handleToggleStatus = (student_id: number) => {
    setRoster(prev => prev.map(s => {
      if (s.student_id === student_id) {
        return {
          ...s,
          status: s.status === 'Present' ? 'Absent' : 'Present'
        };
      }
      return s;
    }));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    setRoster(prev => prev.map(s => ({ ...s, status: 'Present' })));
  };

  // Check duplicate before confirmation
  const handleInitiateSave = () => {
    setFeedbackMessage(null);
    const isDuplicate = savedLogs.some(
      log => log.date === selectedDate &&
             log.division === selectedDivision &&
             log.subject === selectedSubject &&
             log.period === selectedPeriod
    );

    if (isDuplicate) {
      setFeedbackMessage({
        type: 'error',
        text: `Duplicate Record Prevented: Attendance for ${selectedSubject} (${selectedPeriod}) on ${selectedDate} has already been recorded.`
      });
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // Final submission handler
  const handleConfirmSave = () => {
    const presentCount = roster.filter(s => s.status === 'Present').length;
    const absentCount = roster.length - presentCount;

    const newLog: SavedSessionLog = {
      id: `ATT-${selectedDate.replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      date: selectedDate,
      division: selectedDivision,
      subject: selectedSubject,
      period: selectedPeriod,
      total_students: roster.length,
      present_count: presentCount,
      absent_count: absentCount,
      saved_at: "2026-10-10 11:18 AM",
      can_edit: true
    };

    setSavedLogs([newLog, ...savedLogs]);
    setIsConfirmModalOpen(false);
    setFeedbackMessage({
      type: 'success',
      text: `Attendance successfully saved! Recorded ${presentCount} Present and ${absentCount} Absent.`
    });
  };

  // Faculty's personal biometric records
  const facultyOwnAttendance = [
    { date: "2026-10-10", in_time: "08:45 AM", out_time: "04:30 PM", hours: "7.75 hrs", status: "Present" },
    { date: "2026-10-09", in_time: "08:50 AM", out_time: "04:40 PM", hours: "7.83 hrs", status: "Present" },
    { date: "2026-10-08", in_time: "08:40 AM", out_time: "04:35 PM", hours: "7.91 hrs", status: "Present" },
    { date: "2026-10-07", in_time: "08:55 AM", out_time: "04:30 PM", hours: "7.58 hrs", status: "Present" },
    { date: "2026-10-06", in_time: "08:48 AM", out_time: "04:30 PM", hours: "7.70 hrs", status: "Present" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-navy-800" />
            Attendance Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct daily lecture attendance roll, prevent duplicate submissions, review saved logs, and track personal faculty biometric logs.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('mark')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'mark' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Mark Class Attendance
          </button>
          <button
            onClick={() => setActiveTab('saved_logs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'saved_logs' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Saved Logs ({savedLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('my_attendance')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'my_attendance' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Biometric Attendance
          </button>
          <button
            onClick={() => setActiveTab('my_timetable')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'my_timetable' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            My Teaching Timetable
          </button>
        </div>
      </div>

      {activeTab === 'mark' && (
        <div className="space-y-6">
          {/* Notification Alert */}
          {feedbackMessage && (
            <div className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              feedbackMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Workflow Step 1, 2, 3: Filters Card */}
          <div className="erp-card p-6 bg-white space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
                Session Parameter Selection
              </h3>
              <p className="text-xs text-slate-500">Select date, class cohort, subject and period before taking attendance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-semibold text-navy-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class / Division *</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-navy-950"
                >
                  <option value="B.Tech CSE - Section A">B.Tech CSE - Section A (3rd Sem)</option>
                  <option value="B.Tech CSE - Section B">B.Tech CSE - Section B (3rd Sem)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Subject *</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-navy-950"
                >
                  <option value="CS302 - Database Management Systems">CS302 - Database Management Systems</option>
                  <option value="CS301 - Data Structures & Algorithms">CS301 - Data Structures & Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lecture Period *</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-navy-950"
                >
                  <option value="Period 1 (09:00 AM - 10:00 AM)">Period 1 (09:00 AM - 10:00 AM)</option>
                  <option value="Period 2 (10:15 AM - 11:15 AM)">Period 2 (10:15 AM - 11:15 AM)</option>
                  <option value="Period 3 (02:00 PM - 04:00 PM)">Period 3 (02:00 PM - 04:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workflow Step 4, 5, 6, 7: Student Roster Table */}
          <div className="erp-card p-6 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  Assigned Student Roster ({roster.length} Enrolled Scholars)
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDivision} • {selectedSubject} • {selectedDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark All Present
                </button>

                <button
                  type="button"
                  onClick={handleInitiateSave}
                  className="px-4 py-1.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save & Confirm Attendance
                </button>
              </div>
            </div>

            {/* Roster List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <th className="p-3 w-16">#</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center">Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.map((student, idx) => (
                    <tr key={student.student_id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-navy-950">{student.roll_no}</td>
                      <td className="p-3 font-semibold text-slate-800">{student.name}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                          <button
                            type="button"
                            onClick={() => {
                              if (student.status !== 'Present') handleToggleStatus(student.student_id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              student.status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Check className="w-3 h-3" /> Present
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (student.status !== 'Absent') handleToggleStatus(student.student_id);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              student.status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <X className="w-3 h-3" /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saved_logs' && (
        <div className="erp-card p-6 bg-white space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-navy-950">Recorded Lecture Attendance Sessions</h3>
            <p className="text-xs text-slate-500">Official logs stored in university attendance ledger</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="p-3">Session ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Class & Subject</th>
                  <th className="p-3">Period</th>
                  <th className="p-3 text-center">Turnout</th>
                  <th className="p-3">Recorded At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {savedLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-navy-950">{log.id}</td>
                    <td className="p-3 font-mono text-slate-700">{log.date}</td>
                    <td className="p-3">
                      <span className="font-semibold text-navy-900 block">{log.subject}</span>
                      <span className="text-[11px] text-slate-500">{log.division}</span>
                    </td>
                    <td className="p-3 text-slate-600">{log.period}</td>
                    <td className="p-3 text-center font-mono">
                      <span className="font-bold text-emerald-700">{log.present_count} P</span> /{' '}
                      <span className="font-bold text-rose-600">{log.absent_count} A</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 text-[11px]">{log.saved_at}</td>
                    <td className="p-3 text-right">
                      <Badge variant="navy">Locked</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'my_attendance' && (
        <div className="erp-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-navy-950">Faculty Biometric Attendance & Service Log</h3>
              <p className="text-xs text-slate-500">Automated gate RFID & biometric punch recordings</p>
            </div>
            <Badge variant="success">100% Present This Month</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="p-3">Working Date</th>
                  <th className="p-3">Check-In Punch</th>
                  <th className="p-3">Check-Out Punch</th>
                  <th className="p-3">Total Working Hours</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {facultyOwnAttendance.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-navy-950">{row.date}</td>
                    <td className="p-3 text-emerald-800">{row.in_time}</td>
                    <td className="p-3 text-slate-600">{row.out_time}</td>
                    <td className="p-3 font-bold text-navy-900">{row.hours}</td>
                    <td className="p-3 text-center">
                      <Badge variant="success">{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'my_timetable' && (
        <div className="erp-card p-6 bg-white space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-navy-950">Faculty Assigned Teaching Schedule</h3>
            <p className="text-xs text-slate-500">Weekly allocated curriculum lectures, labs, and office consultation hours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTimetables.filter(t => t.faculty_id === 1 || t.faculty_name?.includes('Arvind')).concat([
              {
                timetable_id: 11,
                section_id: 1,
                subject_id: 2,
                faculty_id: 1,
                semester_id: 3,
                day_of_week: "Wednesday",
                start_time: "10:15 AM",
                end_time: "11:15 AM",
                room_no: "AB-301",
                timetable_type: "Lecture",
                subject_name: "Database Management Systems",
                faculty_name: "Dr. Arvind Sharma",
                section_name: "CS-A"
              },
              {
                timetable_id: 12,
                section_id: 1,
                subject_id: 2,
                faculty_id: 1,
                semester_id: 3,
                day_of_week: "Friday",
                start_time: "02:00 PM",
                end_time: "04:00 PM",
                room_no: "DBMS Lab 304",
                timetable_type: "Lab",
                subject_name: "Database Systems Lab",
                faculty_name: "Dr. Arvind Sharma",
                section_name: "CS-A"
              }
            ]).map(slot => (
              <div key={slot.timetable_id} className="p-4 rounded-xl border border-slate-200 bg-[#FAFCFD] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-950">{slot.day_of_week}</span>
                  <Badge variant={slot.timetable_type === 'Lab' ? 'ice' : 'navy'}>{slot.timetable_type}</Badge>
                </div>
                <h4 className="font-bold text-navy-900">{slot.subject_name}</h4>
                <p className="text-slate-600 font-mono text-[11px]">{slot.start_time} - {slot.end_time}</p>
                <p className="text-slate-500 font-mono text-[11px]">Room / Lab: {slot.room_no}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Attendance Submission"
          subtitle="Finalize session record before writing to database"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-4 py-2 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-xl shadow-sm"
              >
                Confirm & Submit Attendance
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-700">
              You are about to submit the attendance register for:
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-slate-800">
              <div>Date: <strong>{selectedDate}</strong></div>
              <div>Class: <strong>{selectedDivision}</strong></div>
              <div>Subject: <strong>{selectedSubject}</strong></div>
              <div>Period: <strong>{selectedPeriod}</strong></div>
              <div className="border-t border-slate-200 pt-1 text-emerald-800 font-bold">
                Present: {roster.filter(s => s.status === 'Present').length} | Absent: {roster.filter(s => s.status === 'Absent').length}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Once submitted, attendance is locked to avoid duplicate entries.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
