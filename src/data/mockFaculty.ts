import { Department, Designation, Faculty, Staff, Salary } from '../types';

export const mockDepartments: Department[] = [
  {
    department_id: 1,
    department_name: "Computer Science & Engineering",
    location: "Aryabhata Block - 3rd Floor",
    hod_faculty_id: 1,
    hod_name: "Dr. Arvind Sharma",
    faculty_count: 36,
    student_count: 780
  },
  {
    department_id: 2,
    department_name: "Electronics & Communication",
    location: "Sir CV Raman Wing - 2nd Floor",
    hod_faculty_id: 2,
    hod_name: "Dr. Meenakshi Sundaram",
    faculty_count: 28,
    student_count: 560
  },
  {
    department_id: 3,
    department_name: "Mechanical Engineering",
    location: "Visvesvaraya Workshop Block",
    hod_faculty_id: 4,
    hod_name: "Dr. Rajeshwar Rao",
    faculty_count: 24,
    student_count: 490
  },
  {
    department_id: 4,
    department_name: "Civil Engineering",
    location: "C.V. Raman Annex",
    hod_faculty_id: 5,
    hod_name: "Dr. Kavita Deshmukh",
    faculty_count: 20,
    student_count: 420
  },
  {
    department_id: 5,
    department_name: "Business Administration",
    location: "Management Bhavan",
    hod_faculty_id: 6,
    hod_name: "Dr. Sanjay Bhatt",
    faculty_count: 26,
    student_count: 595
  }
];

export const mockDesignations: Designation[] = [
  { designation_id: 1, designation_name: "Professor & HOD", category: "Teaching" },
  { designation_id: 2, designation_name: "Professor", category: "Teaching" },
  { designation_id: 3, designation_name: "Associate Professor", category: "Teaching" },
  { designation_id: 4, designation_name: "Assistant Professor", category: "Teaching" },
  { designation_id: 5, designation_name: "Registrar", category: "Non-Teaching" },
  { designation_id: 6, designation_name: "Head Librarian", category: "Non-Teaching" },
  { designation_id: 7, designation_name: "Senior Accountant", category: "Non-Teaching" },
  { designation_id: 8, designation_name: "System Administrator", category: "Non-Teaching" }
];

export const mockFaculty: Faculty[] = [
  {
    faculty_id: 1,
    faculty_code: "FAC-CSE-001",
    first_name: "Arvind",
    middle_name: "Nath",
    last_name: "Sharma",
    email: "arvind.sharma@college.edu",
    phone_no: "+91 9411223344",
    department_id: 1,
    designation_id: 1,
    joining_date: "2015-06-15",
    qualification: "Ph.D. in Computer Science (IIT Bombay)",
    status: "Active",
    department_name: "Computer Science & Engineering",
    designation_name: "Professor & HOD"
  },
  {
    faculty_id: 2,
    faculty_code: "FAC-ECE-002",
    first_name: "Meenakshi",
    middle_name: "R.",
    last_name: "Sundaram",
    email: "meenakshi.s@college.edu",
    phone_no: "+91 9422334455",
    department_id: 2,
    designation_id: 1,
    joining_date: "2016-08-01",
    qualification: "Ph.D. in VLSI Systems (IISc Bangalore)",
    status: "Active",
    department_name: "Electronics & Communication",
    designation_name: "Professor & HOD"
  },
  {
    faculty_id: 3,
    faculty_code: "FAC-CSE-003",
    first_name: "Sunita",
    middle_name: "Devi",
    last_name: "Rao",
    email: "sunita.rao@college.edu",
    phone_no: "+91 9433445566",
    department_id: 1,
    designation_id: 3,
    joining_date: "2018-01-10",
    qualification: "M.Tech in Software Systems (BITS Pilani)",
    status: "Active",
    department_name: "Computer Science & Engineering",
    designation_name: "Associate Professor"
  },
  {
    faculty_id: 4,
    faculty_code: "FAC-MEC-004",
    first_name: "Rajeshwar",
    middle_name: "K.",
    last_name: "Rao",
    email: "rajeshwar.rao@college.edu",
    phone_no: "+91 9444556677",
    department_id: 3,
    designation_id: 1,
    joining_date: "2014-04-12",
    qualification: "Ph.D. in Thermal Engineering",
    status: "Active",
    department_name: "Mechanical Engineering",
    designation_name: "Professor & HOD"
  },
  {
    faculty_id: 5,
    faculty_code: "FAC-CSE-005",
    first_name: "Kunal",
    middle_name: "P.",
    last_name: "Joshi",
    email: "kunal.joshi@college.edu",
    phone_no: "+91 9455667788",
    department_id: 1,
    designation_id: 4,
    joining_date: "2021-09-01",
    qualification: "M.Tech in Artificial Intelligence",
    status: "Active",
    department_name: "Computer Science & Engineering",
    designation_name: "Assistant Professor"
  }
];

export const mockStaff: Staff[] = [
  {
    staff_id: 1,
    first_name: "Gopal",
    middle_name: "Krishna",
    last_name: "Pandey",
    email: "gopal.pandey@college.edu",
    phone_no: "+91 9711223344",
    department_id: 1,
    designation_id: 6,
    joining_date: "2017-03-20",
    status: "Active",
    department_name: "Central Administration",
    designation_name: "Head Librarian"
  },
  {
    staff_id: 2,
    first_name: "Anita",
    middle_name: "M.",
    last_name: "Desai",
    email: "anita.desai@college.edu",
    phone_no: "+91 9722334455",
    department_id: 5,
    designation_id: 7,
    joining_date: "2018-07-15",
    status: "Active",
    department_name: "Finance & Accounts",
    designation_name: "Senior Accountant"
  },
  {
    staff_id: 3,
    first_name: "Sachin",
    middle_name: "V.",
    last_name: "Kadam",
    email: "sachin.kadam@college.edu",
    phone_no: "+91 9733445566",
    department_id: 1,
    designation_id: 8,
    joining_date: "2020-02-01",
    status: "Active",
    department_name: "Computer Science & Engineering",
    designation_name: "System Administrator"
  }
];

export const mockSalaries: Salary[] = [
  {
    payroll_id: 1,
    employee_type: "Faculty",
    employee_id: 1,
    employee_name: "Dr. Arvind Sharma",
    basic_salary: 110000,
    allowance: 35000,
    deduction: 18000,
    net_salary: 127000,
    payment_date: "2026-10-01",
    payment_status: "Paid",
    payment_mode: "Bank Transfer"
  },
  {
    payroll_id: 2,
    employee_type: "Faculty",
    employee_id: 3,
    employee_name: "Prof. Sunita Rao",
    basic_salary: 75000,
    allowance: 22000,
    deduction: 11000,
    net_salary: 86000,
    payment_date: "2026-10-01",
    payment_status: "Paid",
    payment_mode: "Bank Transfer"
  },
  {
    payroll_id: 3,
    employee_type: "Staff",
    employee_id: 1,
    employee_name: "Gopal Krishna Pandey (Librarian)",
    basic_salary: 55000,
    allowance: 14000,
    deduction: 7000,
    net_salary: 62000,
    payment_date: "2026-10-01",
    payment_status: "Paid",
    payment_mode: "Bank Transfer"
  }
];
