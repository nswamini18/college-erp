import { Attendance, AttendanceSummary } from '../types';

export const mockAttendanceRecords: Attendance[] = [
  {
    attendance_id: 1,
    student_id: 1,
    subject_id: 1,
    faculty_id: 3,
    section_id: 1,
    attendance_date: "2026-10-09",
    status: "Present",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Data Structures & Algorithms"
  },
  {
    attendance_id: 2,
    student_id: 2,
    subject_id: 1,
    faculty_id: 3,
    section_id: 1,
    attendance_date: "2026-10-09",
    status: "Present",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    subject_name: "Data Structures & Algorithms"
  },
  {
    attendance_id: 3,
    student_id: 3,
    subject_id: 1,
    faculty_id: 3,
    section_id: 1,
    attendance_date: "2026-10-09",
    status: "Absent",
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    subject_name: "Data Structures & Algorithms"
  },
  {
    attendance_id: 4,
    student_id: 1,
    subject_id: 2,
    faculty_id: 1,
    section_id: 1,
    attendance_date: "2026-10-09",
    status: "Present",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Database Management Systems"
  },
  {
    attendance_id: 5,
    student_id: 2,
    subject_id: 2,
    faculty_id: 1,
    section_id: 1,
    attendance_date: "2026-10-09",
    status: "Late",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    subject_name: "Database Management Systems"
  }
];

export const mockAttendanceSummaries: AttendanceSummary[] = [
  {
    attendance_summary_id: 1,
    student_id: 1,
    subject_id: 1,
    total_classes: 36,
    classes_attended: 33,
    classes_absent: 3,
    attendance_percentage: 91.67,
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Data Structures & Algorithms"
  },
  {
    attendance_summary_id: 2,
    student_id: 1,
    subject_id: 2,
    total_classes: 34,
    classes_attended: 30,
    classes_absent: 4,
    attendance_percentage: 88.24,
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Database Management Systems"
  },
  {
    attendance_summary_id: 3,
    student_id: 2,
    subject_id: 1,
    total_classes: 36,
    classes_attended: 34,
    classes_absent: 2,
    attendance_percentage: 94.44,
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    subject_name: "Data Structures & Algorithms"
  },
  {
    attendance_summary_id: 4,
    student_id: 3,
    subject_id: 1,
    total_classes: 36,
    classes_attended: 24,
    classes_absent: 12,
    attendance_percentage: 66.67,
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    subject_name: "Data Structures & Algorithms"
  }
];
