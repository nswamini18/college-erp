-- =============================================================================
-- UNIVERSITY ERP SEED DATA SCRIPT (MySQL 8.0)
-- Development prototype accounts & sample records aligned with frontend.
-- Passwords:
--   Student: aarav.sharma@college.edu / CS2023001 -> 'Student@2026'
--   Faculty: arvind.sharma@college.edu / FAC-CSE-001 -> 'Faculty@2026'
--   Admin:   admin@college.edu -> 'Admin@2026'
-- Safe and idempotent (uses INSERT IGNORE).
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Base Department & Designation Master Records
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `department` (`department_id`, `department_name`, `branch_code`, `hod_name`, `location`) VALUES
(1, 'Computer Science & Engineering', 'CSE', 'Dr. Arvind Sharma', 'Academic Block A - 3rd Floor'),
(2, 'Information Technology', 'IT', 'Dr. Radhika Rao', 'Academic Block A - 2nd Floor'),
(3, 'Electronics & Telecommunication', 'ETC', 'Dr. Vikram Seth', 'Academic Block B - 1st Floor'),
(4, 'Mechanical Engineering', 'MECH', 'Dr. Suresh Patel', 'Mechanical Workshop Complex'),
(5, 'Civil Engineering', 'CIVIL', 'Dr. Mohan Joshi', 'Civil Engineering Block');

INSERT IGNORE INTO `designation` (`designation_id`, `designation_name`, `category`) VALUES
(1, 'Professor & Head of Department', 'Teaching'),
(2, 'Associate Professor', 'Teaching'),
(3, 'Assistant Professor', 'Teaching'),
(4, 'Visiting Faculty', 'Teaching'),
(5, 'Senior Librarian', 'Non-Teaching'),
(6, 'Administrative Officer', 'Non-Teaching');

-- -----------------------------------------------------------------------------
-- 2. Faculty Seed Record
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `faculty` (`faculty_id`, `faculty_name`, `faculty_code`, `email`, `phone_no`, `department_id`, `designation_id`, `qualification`, `joining_date`, `status`) VALUES
(1, 'Dr. Arvind Sharma', 'FAC-CSE-001', 'arvind.sharma@college.edu', '9820011223', 1, 1, 'Ph.D. Computer Science (IIT Bombay)', '2016-07-01', 'Active'),
(2, 'Prof. Sunita Rao', 'FAC-CSE-002', 'sunita.rao@college.edu', '9820011224', 1, 2, 'M.Tech Computer Engineering', '2018-08-15', 'Active'),
(3, 'Prof. Kunal Joshi', 'FAC-CSE-003', 'kunal.joshi@college.edu', '9820011225', 1, 3, 'M.Tech Software Engineering', '2020-01-10', 'Active');

-- -----------------------------------------------------------------------------
-- 3. Academic Structure Seed
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `academic_semester` (`semester_id`, `semester_number`, `semester_name`, `academic_year`, `start_date`, `end_date`, `status`) VALUES
(1, 1, 'Semester 1 (Autumn 2025)', '2025-2026', '2025-08-01', '2025-12-15', 'Completed'),
(2, 2, 'Semester 2 (Spring 2026)', '2025-2026', '2026-01-05', '2026-05-20', 'Completed'),
(3, 3, 'Semester 3 (Autumn 2026)', '2026-2027', '2026-08-01', '2026-12-15', 'Ongoing');

INSERT IGNORE INTO `course` (`course_id`, `course_code`, `course_name`, `department_id`, `course_type`, `duration_years`, `total_credits`, `status`) VALUES
(1, 'BTECH-CSE', 'B.Tech Computer Science & Engineering', 1, 'UG', 4, 160, 'Active');

INSERT IGNORE INTO `section` (`section_id`, `department_id`, `branch`, `division`, `section_name`, `batch_name`) VALUES
(1, 1, 'CSE', 'A', 'CS-A', 'Batch 2023-2027');

INSERT IGNORE INTO `subject` (`subject_id`, `subject_code`, `subject_name`, `course_id`, `semester_id`, `credits`, `subject_type`) VALUES
(1, 'CS301', 'Data Structures & Algorithms', 1, 3, 4, 'Theory'),
(2, 'CS302', 'Database Management Systems', 1, 3, 4, 'Theory'),
(3, 'CS302P', 'Database Systems Lab', 1, 3, 2, 'Practical'),
(4, 'CS303', 'Operating Systems', 1, 3, 4, 'Theory'),
(5, 'CS304', 'Computer Networks', 1, 3, 3, 'Theory');

-- -----------------------------------------------------------------------------
-- 4. Prototype Student Records
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `student` (`student_id`, `prn`, `roll_no`, `student_name`, `first_name`, `middle_name`, `last_name`, `email`, `phone`, `branch`, `department_id`, `section_id`, `division`, `batch_year`, `current_year`, `current_semester`, `dob`, `gender`, `category`, `admission_year`, `admission_status`) VALUES
(1, 'PRN2023001', 'CS2023001', 'Aarav Sharma', 'Aarav', 'Mukesh', 'Sharma', 'aarav.sharma@college.edu', '9876543210', 'CSE', 1, 1, 'A', 2023, 2, 3, '2005-04-15', 'Male', 'General', 2023, 'Active'),
(2, 'F24CE001', '31001', 'Kavya Mohan Kulkarni', 'Kavya', 'Mohan', 'Kulkarni', 'f24ce001@student.example.edu', '9864872458', 'CS', 1, 1, '1', 2024, 3, 5, '2006-07-22', 'Female', 'OPEN', 2024, 'Active'),
(3, 'F24CE002', '31002', 'Siddharth Eknath Nale', 'Siddharth', 'Eknath', 'Nale', 'f24ce002@student.example.edu', '9511093504', 'CS', 1, 1, '1', 2024, 3, 5, '2006-08-21', 'Male', 'OBC', 2024, 'Active');

INSERT IGNORE INTO `student_address` (`address_id`, `student_id`, `address_type`, `street_address`, `city`, `state`, `pincode`) VALUES
(1, 1, 'Permanent', '402 Sunrise Heights, MG Road', 'Mumbai', 'Maharashtra', '400001'),
(2, 2, 'Permanent', '12 Lake View Residency', 'Pune', 'Maharashtra', '411004'),
(3, 3, 'Permanent', '88 Shivaji Nagar', 'Nagpur', 'Maharashtra', '440010');

INSERT IGNORE INTO `student_contact` (`contact_id`, `student_id`, `mobile_number`, `alternate_mobile`, `personal_email`, `institute_email`) VALUES
(1, 1, '9876543210', '9876543211', 'aarav.personal@example.com', 'aarav.sharma@college.edu'),
(2, 2, '9864872458', '9864872459', 'kavya.personal@example.com', 'f24ce001@student.example.edu'),
(3, 3, '9511093504', '9511093505', 'siddharth.personal@example.com', 'f24ce002@student.example.edu');

-- -----------------------------------------------------------------------------
-- 5. User Authentication Accounts (Bcrypt Hashes, Cost 10)
-- -----------------------------------------------------------------------------
-- Hash for 'Student@2026': $2a$10$Yjr1.09MV39ZxBLJ2CMyMOqAEHRPbzwnduBAzPufZLn3/EC/MFeI6
-- Hash for 'Faculty@2026': $2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e
-- Hash for 'Admin@2026':   $2a$10$5o8kUfk7E8D82fXm1fK49Ou4K1KZZJgD6c1N3k0A/Y4K0G6jJ6Gma
INSERT IGNORE INTO `user_account` (`user_id`, `identifier`, `email`, `password_hash`, `role`, `student_id`, `faculty_id`, `is_active`) VALUES
(1, 'CS2023001', 'aarav.sharma@college.edu', '$2a$10$Yjr1.09MV39ZxBLJ2CMyMOqAEHRPbzwnduBAzPufZLn3/EC/MFeI6', 'STUDENT', 1, NULL, TRUE),
(2, '31001', 'f24ce001@student.example.edu', '$2a$10$Yjr1.09MV39ZxBLJ2CMyMOqAEHRPbzwnduBAzPufZLn3/EC/MFeI6', 'STUDENT', 2, NULL, TRUE),
(3, '31002', 'f24ce002@student.example.edu', '$2a$10$Yjr1.09MV39ZxBLJ2CMyMOqAEHRPbzwnduBAzPufZLn3/EC/MFeI6', 'STUDENT', 3, NULL, TRUE),
(4, 'FAC-CSE-001', 'arvind.sharma@college.edu', '$2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e', 'FACULTY', NULL, 1, TRUE),
(5, 'FAC-CSE-002', 'sunita.rao@college.edu', '$2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e', 'FACULTY', NULL, 2, TRUE),
(6, 'faculty1@example.edu', 'faculty1@example.edu', '$2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e', 'FACULTY', NULL, 1, TRUE),
(7, 'ADMIN-001', 'admin@college.edu', '$2a$10$cRhUL9dF1xc8I7kYza3lGe7n9rDFpb8WUa7Oa06znap/cipLPJn8e', 'ADMIN', NULL, NULL, TRUE);

-- -----------------------------------------------------------------------------
-- 6. Faculty Workspace Data (Leave & Payroll for Arvind Sharma)
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `faculty_leave` (`leave_id`, `leave_code`, `faculty_id`, `leave_type`, `start_date`, `end_date`, `days_count`, `reason`, `cover_faculty_name`, `status`, `applied_on`, `approver_comments`) VALUES
(1, 'LV-2026-042', 1, 'Casual Leave (CL)', '2026-10-24', '2026-10-25', 2, 'Attending IEEE International Conference on Cloud & AI', 'Prof. Sunita Rao (Associate Professor)', 'Approved', '2026-10-04', 'Duty leave sanctioned for technical conference presentation.'),
(2, 'LV-2026-021', 1, 'Sick Leave (SL)', '2026-09-12', '2026-09-13', 2, 'Viral fever and recovery', 'Prof. Kunal Joshi (Assistant Professor)', 'Approved', '2026-09-11', 'Medical certificate verified by university dispensary.');

INSERT IGNORE INTO `faculty_payroll` (`payroll_id`, `slip_id`, `faculty_id`, `month`, `year`, `basic_salary`, `da_allowance`, `hra_allowance`, `travel_allowance`, `academic_allowance`, `gross_salary`, `pf_deduction`, `income_tax`, `professional_tax`, `total_deductions`, `net_salary`, `disbursement_date`, `payment_mode`, `status`) VALUES
(1, 'PAY-2026-10', 1, 'October', 2026, 110000.00, 15000.00, 12000.00, 4000.00, 4000.00, 145000.00, 9000.00, 8500.00, 500.00, 18000.00, 127000.00, '2026-10-01', 'Electronic Direct Deposit (HDFC Bank)', 'Paid'),
(2, 'PAY-2026-09', 1, 'September', 2026, 110000.00, 15000.00, 12000.00, 4000.00, 4000.00, 145000.00, 9000.00, 8500.00, 500.00, 18000.00, 127000.00, '2026-09-01', 'Electronic Direct Deposit (HDFC Bank)', 'Paid');

-- -----------------------------------------------------------------------------
-- 7. Exam Applications for Student
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO `exam_application` (`application_id`, `app_code`, `student_id`, `type`, `semester_label`, `subject_code`, `submission_date`, `fee_status`, `approval_status`) VALUES
(1, 'EX-APP-2026-01', 1, 'Regular Semester Exam', 'Semester 3 (Autumn 2026)', NULL, '2026-09-28', 'Paid', 'Approved'),
(2, 'REV-2026-04', 1, 'Paper Revaluation', 'Semester 2 (Spring 2026)', 'CS201 - Discrete Math', '2026-08-10', 'Paid', 'Approved');

SET FOREIGN_KEY_CHECKS = 1;
