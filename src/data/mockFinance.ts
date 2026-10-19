import { FeeStructure, Scholarship, StudentFee, Payment, FinanceFine } from '../types';

export const mockFeeStructures: FeeStructure[] = [
  {
    fee_structure_id: 1,
    course_id: 1,
    semester_id: 3,
    fee_type: "Tuition",
    amount: 65000.00,
    course_name: "B.Tech Computer Science",
    semester_name: "Semester 3"
  },
  {
    fee_structure_id: 2,
    course_id: 1,
    semester_id: 3,
    fee_type: "Laboratory",
    amount: 12000.00,
    course_name: "B.Tech Computer Science",
    semester_name: "Semester 3"
  },
  {
    fee_structure_id: 3,
    course_id: 1,
    semester_id: 3,
    fee_type: "Exam",
    amount: 3500.00,
    course_name: "B.Tech Computer Science",
    semester_name: "Semester 3"
  },
  {
    fee_structure_id: 4,
    course_id: 1,
    semester_id: 3,
    fee_type: "Library",
    amount: 2500.00,
    course_name: "B.Tech Computer Science",
    semester_name: "Semester 3"
  }
];

export const mockScholarships: Scholarship[] = [
  {
    scholarship_id: 1,
    name: "Dean's Academic Merit Fellowship",
    type: "Merit",
    amount: 25000.00,
    start_date: "2026-08-01",
    end_date: "2027-05-31"
  },
  {
    scholarship_id: 2,
    name: "National Post-Matric State Scholarship",
    type: "Government",
    amount: 30000.00,
    start_date: "2026-08-01",
    end_date: "2027-05-31"
  }
];

export const mockStudentFees: StudentFee[] = [
  {
    student_fee_id: 1,
    student_id: 1,
    fee_structure_id: 1,
    scholarship_id: 1,
    amount_due: 40000.00,
    amount_paid: 40000.00,
    status: "Paid",
    student_name: "Aarav Sharma",
    roll_no: "CS2023001",
    fee_type: "Tuition Fee"
  },
  {
    student_fee_id: 2,
    student_id: 2,
    fee_structure_id: 1,
    scholarship_id: undefined,
    amount_due: 65000.00,
    amount_paid: 65000.00,
    status: "Paid",
    student_name: "Ananya Patel",
    roll_no: "CS2023002",
    fee_type: "Tuition Fee"
  },
  {
    student_fee_id: 3,
    student_id: 3,
    fee_structure_id: 1,
    scholarship_id: undefined,
    amount_due: 65000.00,
    amount_paid: 30000.00,
    status: "Partially Paid",
    student_name: "Rohan Verma",
    roll_no: "CS2023003",
    fee_type: "Tuition Fee"
  },
  {
    student_fee_id: 4,
    student_id: 4,
    fee_structure_id: 1,
    scholarship_id: undefined,
    amount_due: 65000.00,
    amount_paid: 0.00,
    status: "Unpaid",
    student_name: "Priya Iyer",
    roll_no: "EC2023001",
    fee_type: "Tuition Fee"
  }
];

export const mockPayments: Payment[] = [
  {
    payment_id: 1,
    student_fee_id: 1,
    amount: 40000.00,
    payment_date: "2026-08-14 11:25:00",
    payment_mode: "Online Gateway",
    student_name: "Aarav Sharma"
  },
  {
    payment_id: 2,
    student_fee_id: 2,
    amount: 65000.00,
    payment_date: "2026-08-16 14:10:00",
    payment_mode: "UPI",
    student_name: "Ananya Patel"
  },
  {
    payment_id: 3,
    student_fee_id: 3,
    amount: 30000.00,
    payment_date: "2026-08-20 09:45:00",
    payment_mode: "Demand Draft",
    student_name: "Rohan Verma"
  }
];

export const mockFinanceFines: FinanceFine[] = [
  {
    finance_fine_id: 1,
    student_id: 4,
    amount: 1500.00,
    reason: "Late semester tuition registration penalty",
    fine_date: "2026-09-01",
    payment_status: "Pending",
    student_name: "Priya Iyer"
  }
];
