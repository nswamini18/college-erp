import { Student, StudentAddress, StudentContact, Guardian, AcademicHistory } from '../types';

export const mockStudents: Student[] = [
  {
    student_id: 1,
    roll_no: "CS2023001",
    prn: "PRN2023CSE0101",
    first_name: "Aarav",
    middle_name: "Kumar",
    last_name: "Sharma",
    gender: "Male",
    dob: "2005-04-15",
    category: "General",
    admission_year: 2023,
    current_year: 2,
    current_semester: 3,
    admission_status: "Active",
    phone: "+91 9876543210",
    email: "aarav.sharma@college.edu",
    department_id: 1,
    course_id: 1,
    section_id: 1,
    department_name: "Computer Science & Engineering",
    course_name: "B.Tech Computer Science",
    section_name: "CS-A"
  },
  {
    student_id: 2,
    roll_no: "CS2023002",
    prn: "PRN2023CSE0102",
    first_name: "Ananya",
    middle_name: "Devi",
    last_name: "Patel",
    gender: "Female",
    dob: "2005-08-22",
    category: "OBC",
    admission_year: 2023,
    current_year: 2,
    current_semester: 3,
    admission_status: "Active",
    phone: "+91 9876543211",
    email: "ananya.patel@college.edu",
    department_id: 1,
    course_id: 1,
    section_id: 1,
    department_name: "Computer Science & Engineering",
    course_name: "B.Tech Computer Science",
    section_name: "CS-A"
  },
  {
    student_id: 3,
    roll_no: "CS2023003",
    prn: "PRN2023CSE0103",
    first_name: "Rohan",
    middle_name: "Suresh",
    last_name: "Verma",
    gender: "Male",
    dob: "2004-11-10",
    category: "General",
    admission_year: 2023,
    current_year: 2,
    current_semester: 3,
    admission_status: "Active",
    phone: "+91 9876543212",
    email: "rohan.verma@college.edu",
    department_id: 1,
    course_id: 1,
    section_id: 2,
    department_name: "Computer Science & Engineering",
    course_name: "B.Tech Computer Science",
    section_name: "CS-B"
  },
  {
    student_id: 4,
    roll_no: "EC2023001",
    prn: "PRN2023ECE0201",
    first_name: "Priya",
    middle_name: "Ramesh",
    last_name: "Iyer",
    gender: "Female",
    dob: "2005-02-18",
    category: "General",
    admission_year: 2023,
    current_year: 2,
    current_semester: 3,
    admission_status: "Active",
    phone: "+91 9876543213",
    email: "priya.iyer@college.edu",
    department_id: 2,
    course_id: 2,
    section_id: 3,
    department_name: "Electronics & Communication",
    course_name: "B.Tech Electronics",
    section_name: "EC-A"
  },
  {
    student_id: 5,
    roll_no: "ME2022001",
    prn: "PRN2022MEC0301",
    first_name: "Vikram",
    middle_name: "Pratap",
    last_name: "Singh",
    gender: "Male",
    dob: "2004-06-30",
    category: "SC",
    admission_year: 2022,
    current_year: 3,
    current_semester: 5,
    admission_status: "Active",
    phone: "+91 9876543214",
    email: "vikram.singh@college.edu",
    department_id: 3,
    course_id: 3,
    section_id: 4,
    department_name: "Mechanical Engineering",
    course_name: "B.Tech Mechanical",
    section_name: "ME-A"
  },
  {
    student_id: 6,
    roll_no: "MBA202401",
    prn: "PRN2024MBA0401",
    first_name: "Sneha",
    middle_name: "Rajesh",
    last_name: "Kulkarni",
    gender: "Female",
    dob: "2002-09-14",
    category: "General",
    admission_year: 2024,
    current_year: 1,
    current_semester: 1,
    admission_status: "Active",
    phone: "+91 9876543215",
    email: "sneha.kulkarni@college.edu",
    department_id: 5,
    course_id: 5,
    section_id: 5,
    department_name: "Business Administration",
    course_name: "Master of Business Admin",
    section_name: "MBA-A"
  }
];

export const mockAddresses: StudentAddress[] = [
  {
    student_address_id: 1,
    student_id: 1,
    address_type: "Permanent",
    street_address: "Flat 402, Green Valley Heights, MG Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001"
  },
  {
    student_address_id: 2,
    student_id: 2,
    address_type: "Permanent",
    street_address: "12, Shanti Niketan Society",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015"
  }
];

export const mockContacts: StudentContact[] = [
  {
    contact_id: 1,
    student_id: 1,
    mobile_number: "+91 9876543210",
    alternate_mobile: "+91 9822334455",
    personal_email: "aarav.personal@gmail.com",
    institute_email: "aarav.sharma@college.edu"
  }
];

export const mockGuardians: Guardian[] = [
  {
    guardian_id: 1,
    student_id: 1,
    guardian_name: "Ramesh Sharma",
    relation: "Father",
    occupation: "Senior Software Architect",
    contact_number: "+91 9822110099",
    email: "ramesh.sharma@corp.com"
  }
];

export const mockAcademicHistories: AcademicHistory[] = [
  {
    academic_history_id: 1,
    student_id: 1,
    qualification_level: "12th / HSC",
    institute_name: "Delhi Public School",
    board_university: "CBSE",
    percentage_gpa: 94.6,
    passing_year: 2023
  },
  {
    academic_history_id: 2,
    student_id: 1,
    qualification_level: "10th / SSC",
    institute_name: "Delhi Public School",
    board_university: "CBSE",
    percentage_gpa: 96.2,
    passing_year: 2021
  }
];
