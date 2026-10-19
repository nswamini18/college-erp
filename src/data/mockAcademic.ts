import { Course, Subject, Semester, CourseSubject, Section, Timetable, FacultySubject } from '../types';

export const mockCourses: Course[] = [
  {
    course_id: 1,
    course_code: "BTECH-CSE",
    course_name: "B.Tech Computer Science & Engineering",
    course_type: "UG",
    duration_years: 4,
    total_credits: 160,
    department_id: 1,
    status: "Active",
    department_name: "Computer Science & Engineering"
  },
  {
    course_id: 2,
    course_code: "BTECH-ECE",
    course_name: "B.Tech Electronics & Communication",
    course_type: "UG",
    duration_years: 4,
    total_credits: 160,
    department_id: 2,
    status: "Active",
    department_name: "Electronics & Communication"
  },
  {
    course_id: 3,
    course_code: "BTECH-ME",
    course_name: "B.Tech Mechanical Engineering",
    course_type: "UG",
    duration_years: 4,
    total_credits: 160,
    department_id: 3,
    status: "Active",
    department_name: "Mechanical Engineering"
  },
  {
    course_id: 4,
    course_code: "MTECH-AI",
    course_name: "M.Tech Artificial Intelligence",
    course_type: "PG",
    duration_years: 2,
    total_credits: 72,
    department_id: 1,
    status: "Active",
    department_name: "Computer Science & Engineering"
  },
  {
    course_id: 5,
    course_code: "MBA-GEN",
    course_name: "Master of Business Administration",
    course_type: "PG",
    duration_years: 2,
    total_credits: 80,
    department_id: 5,
    status: "Active",
    department_name: "Business Administration"
  }
];

export const mockSubjects: Subject[] = [
  {
    subject_id: 1,
    subject_code: "CS301",
    subject_name: "Data Structures & Algorithms",
    subject_type: "Theory",
    credits: 4,
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 2,
    status: "Active"
  },
  {
    subject_id: 2,
    subject_code: "CS302",
    subject_name: "Database Management Systems",
    subject_type: "Theory",
    credits: 4,
    lecture_hours: 3,
    tutorial_hours: 0,
    practical_hours: 2,
    status: "Active"
  },
  {
    subject_id: 3,
    subject_code: "CS303",
    subject_name: "Operating Systems",
    subject_type: "Theory",
    credits: 4,
    lecture_hours: 3,
    tutorial_hours: 1,
    practical_hours: 0,
    status: "Active"
  },
  {
    subject_id: 4,
    subject_code: "CS304",
    subject_name: "Computer Networks",
    subject_type: "Theory",
    credits: 3,
    lecture_hours: 3,
    tutorial_hours: 0,
    practical_hours: 2,
    status: "Active"
  },
  {
    subject_id: 5,
    subject_code: "CS305E",
    subject_name: "Cloud Computing Fundamentals",
    subject_type: "Elective",
    credits: 3,
    lecture_hours: 3,
    tutorial_hours: 0,
    practical_hours: 0,
    status: "Active"
  }
];

export const mockSemesters: Semester[] = [
  {
    semester_id: 1,
    semester_number: 1,
    semester_name: "Semester 1 (Autumn 2026)",
    academic_year: "2026-2027",
    start_date: "2026-08-01",
    end_date: "2026-12-15",
    status: "Ongoing"
  },
  {
    semester_id: 3,
    semester_number: 3,
    semester_name: "Semester 3 (Autumn 2026)",
    academic_year: "2026-2027",
    start_date: "2026-08-01",
    end_date: "2026-12-15",
    status: "Ongoing"
  },
  {
    semester_id: 5,
    semester_number: 5,
    semester_name: "Semester 5 (Autumn 2026)",
    academic_year: "2026-2027",
    start_date: "2026-08-01",
    end_date: "2026-12-15",
    status: "Ongoing"
  },
  {
    semester_id: 7,
    semester_number: 7,
    semester_name: "Semester 7 (Autumn 2026)",
    academic_year: "2026-2027",
    start_date: "2026-08-01",
    end_date: "2026-12-15",
    status: "Ongoing"
  }
];

export const mockCourseSubjects: CourseSubject[] = [
  {
    course_subject_id: 1,
    course_id: 1,
    subject_id: 1,
    semester_id: 3,
    subject_order: 1,
    is_elective: false,
    academic_year: "2026-2027",
    status: "Active",
    subject_name: "Data Structures & Algorithms",
    subject_code: "CS301",
    course_name: "B.Tech Computer Science"
  },
  {
    course_subject_id: 2,
    course_id: 1,
    subject_id: 2,
    semester_id: 3,
    subject_order: 2,
    is_elective: false,
    academic_year: "2026-2027",
    status: "Active",
    subject_name: "Database Management Systems",
    subject_code: "CS302",
    course_name: "B.Tech Computer Science"
  },
  {
    course_subject_id: 3,
    course_id: 1,
    subject_id: 3,
    semester_id: 3,
    subject_order: 3,
    is_elective: false,
    academic_year: "2026-2027",
    status: "Active",
    subject_name: "Operating Systems",
    subject_code: "CS303",
    course_name: "B.Tech Computer Science"
  }
];

export const mockSections: Section[] = [
  {
    section_id: 1,
    section_name: "Section A",
    batch_name: "Batch 2023-2027",
    course_id: 1,
    semester_id: 3,
    academic_year: "2026-2027",
    room_no: "AB-301",
    capacity: 65,
    status: "Active",
    course_name: "B.Tech Computer Science"
  },
  {
    section_id: 2,
    section_name: "Section B",
    batch_name: "Batch 2023-2027",
    course_id: 1,
    semester_id: 3,
    academic_year: "2026-2027",
    room_no: "AB-302",
    capacity: 65,
    status: "Active",
    course_name: "B.Tech Computer Science"
  },
  {
    section_id: 3,
    section_name: "Section A",
    batch_name: "Batch 2023-2027",
    course_id: 2,
    semester_id: 3,
    academic_year: "2026-2027",
    room_no: "CVR-204",
    capacity: 60,
    status: "Active",
    course_name: "B.Tech Electronics"
  }
];

export const mockTimetables: Timetable[] = [
  {
    timetable_id: 1,
    section_id: 1,
    subject_id: 1,
    faculty_id: 3,
    semester_id: 3,
    day_of_week: "Monday",
    start_time: "09:00 AM",
    end_time: "10:00 AM",
    room_no: "AB-301",
    timetable_type: "Lecture",
    subject_name: "Data Structures & Algorithms",
    faculty_name: "Prof. Sunita Rao",
    section_name: "CS-A"
  },
  {
    timetable_id: 2,
    section_id: 1,
    subject_id: 2,
    faculty_id: 1,
    semester_id: 3,
    day_of_week: "Monday",
    start_time: "10:15 AM",
    end_time: "11:15 AM",
    room_no: "AB-301",
    timetable_type: "Lecture",
    subject_name: "Database Management Systems",
    faculty_name: "Dr. Arvind Sharma",
    section_name: "CS-A"
  },
  {
    timetable_id: 3,
    section_id: 1,
    subject_id: 2,
    faculty_id: 5,
    semester_id: 3,
    day_of_week: "Tuesday",
    start_time: "02:00 PM",
    end_time: "04:00 PM",
    room_no: "DBMS Lab - 304",
    timetable_type: "Lab",
    subject_name: "Database Systems Lab",
    faculty_name: "Prof. Kunal Joshi",
    section_name: "CS-A"
  }
];

export const mockFacultySubjects: FacultySubject[] = [
  {
    faculty_subject_id: 1,
    faculty_id: 1,
    subject_id: 2,
    section_id: 1,
    semester_id: 3,
    teaching_role: "Primary",
    assigned_date: "2026-07-20",
    status: "Active",
    faculty_name: "Dr. Arvind Sharma",
    subject_name: "Database Management Systems"
  },
  {
    faculty_subject_id: 2,
    faculty_id: 3,
    subject_id: 1,
    section_id: 1,
    semester_id: 3,
    teaching_role: "Primary",
    assigned_date: "2026-07-20",
    status: "Active",
    faculty_name: "Prof. Sunita Rao",
    subject_name: "Data Structures & Algorithms"
  }
];
