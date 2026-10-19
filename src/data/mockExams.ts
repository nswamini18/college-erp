import { Exam, ExamSchedule, Marks, Result } from '../types';

export const mockExams: Exam[] = [
  {
    exam_id: 1,
    exam_name: "Mid-Semester Examinations Autumn 2026",
    exam_type: "Mid-Semester",
    academic_year: "2026-2027",
    semester_id: 3,
    semester_name: "Semester 3"
  },
  {
    exam_id: 2,
    exam_name: "End-Semester Examinations Autumn 2026",
    exam_type: "End-Semester",
    academic_year: "2026-2027",
    semester_id: 3,
    semester_name: "Semester 3"
  }
];

export const mockExamSchedules: ExamSchedule[] = [
  {
    schedule_id: 1,
    exam_id: 1,
    subject_id: 1,
    exam_date: "2026-10-18",
    start_time: "10:00 AM",
    end_time: "12:00 PM",
    room_no: "Exam Hall A-101",
    max_marks: 50,
    subject_name: "Data Structures & Algorithms"
  },
  {
    schedule_id: 2,
    exam_id: 1,
    subject_id: 2,
    exam_date: "2026-10-20",
    start_time: "10:00 AM",
    end_time: "12:00 PM",
    room_no: "Exam Hall A-102",
    max_marks: 50,
    subject_name: "Database Management Systems"
  },
  {
    schedule_id: 3,
    exam_id: 1,
    subject_id: 3,
    exam_date: "2026-10-22",
    start_time: "10:00 AM",
    end_time: "12:00 PM",
    room_no: "Exam Hall A-101",
    max_marks: 50,
    subject_name: "Operating Systems"
  }
];

export const mockMarks: Marks[] = [
  {
    mark_id: 1,
    schedule_id: 1,
    student_id: 1,
    marks_obtained: 46.5,
    grade_letter: "A+",
    grade_point: 9.5,
    status: "Present",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Data Structures & Algorithms",
    max_marks: 50
  },
  {
    mark_id: 2,
    schedule_id: 1,
    student_id: 2,
    marks_obtained: 48.0,
    grade_letter: "O",
    grade_point: 10.0,
    status: "Present",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    subject_name: "Data Structures & Algorithms",
    max_marks: 50
  },
  {
    mark_id: 3,
    schedule_id: 1,
    student_id: 3,
    marks_obtained: 38.0,
    grade_letter: "B+",
    grade_point: 7.5,
    status: "Present",
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    subject_name: "Data Structures & Algorithms",
    max_marks: 50
  },
  {
    mark_id: 4,
    schedule_id: 2,
    student_id: 1,
    marks_obtained: 44.0,
    grade_letter: "A",
    grade_point: 9.0,
    status: "Present",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    subject_name: "Database Management Systems",
    max_marks: 50
  }
];

export const mockResults: Result[] = [
  {
    result_id: 1,
    student_id: 1,
    exam_id: 1,
    result_date: "2026-11-05",
    sgpa: 9.25,
    cgpa: 9.12,
    overall_status: "Pass",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    exam_name: "Mid-Semester Examinations Autumn 2026"
  },
  {
    result_id: 2,
    student_id: 2,
    exam_id: 1,
    result_date: "2026-11-05",
    sgpa: 9.75,
    cgpa: 9.68,
    overall_status: "Pass",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    exam_name: "Mid-Semester Examinations Autumn 2026"
  },
  {
    result_id: 3,
    student_id: 3,
    exam_id: 1,
    result_date: "2026-11-05",
    sgpa: 7.60,
    cgpa: 7.85,
    overall_status: "Pass",
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    exam_name: "Mid-Semester Examinations Autumn 2026"
  }
];
