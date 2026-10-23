-- =============================================================================
-- UNIVERSITY ERP DATABASE SCHEMA (MySQL 8.0)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- Normalized Schema for 8 Core Modules + Authentication & Audit Logging
-- Safe to review and execute manually in MySQL Workbench.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `college_erp`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- MODULE 1 & 2 MASTER TABLES: Departments & Designations
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `department_id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_name` VARCHAR(100) NOT NULL UNIQUE,
  `branch_code` VARCHAR(10) NULL,
  `hod_name` VARCHAR(100) NULL,
  `location` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `designation`;
CREATE TABLE `designation` (
  `designation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `designation_name` VARCHAR(100) NOT NULL UNIQUE,
  `category` ENUM('Teaching', 'Non-Teaching') NOT NULL DEFAULT 'Teaching',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 2: Faculty & Staff Management
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE `faculty` (
  `faculty_id` INT AUTO_INCREMENT PRIMARY KEY,
  `faculty_name` VARCHAR(100) NOT NULL,
  `faculty_code` VARCHAR(30) NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone_no` VARCHAR(20) NULL,
  `department_id` INT NOT NULL,
  `designation_id` INT NOT NULL,
  `qualification` VARCHAR(100) NULL,
  `joining_date` DATE NOT NULL,
  `status` ENUM('Active', 'On Leave', 'Resigned', 'Retired') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_faculty_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_faculty_designation` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`designation_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `staff_id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `middle_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone_no` VARCHAR(20) NULL,
  `department_id` INT NOT NULL,
  `designation_id` INT NOT NULL,
  `joining_date` DATE NOT NULL,
  `status` ENUM('Active', 'On Leave', 'Resigned', 'Retired') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_staff_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_staff_designation` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`designation_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 3 & 8: Academic Structure, Courses, Semesters, Subjects & Sections
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `academic_semester`;
CREATE TABLE `academic_semester` (
  `semester_id` INT AUTO_INCREMENT PRIMARY KEY,
  `semester_number` TINYINT UNSIGNED NOT NULL,
  `semester_name` VARCHAR(50) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Upcoming', 'Ongoing', 'Completed') NOT NULL DEFAULT 'Ongoing',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `course_id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_code` VARCHAR(20) NOT NULL UNIQUE,
  `course_name` VARCHAR(150) NOT NULL,
  `department_id` INT NOT NULL,
  `course_type` VARCHAR(50) NOT NULL DEFAULT 'UG',
  `duration_years` TINYINT UNSIGNED NOT NULL DEFAULT 4,
  `total_credits` SMALLINT UNSIGNED NOT NULL DEFAULT 160,
  `status` ENUM('Active', 'Discontinued') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `section`;
CREATE TABLE `section` (
  `section_id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT NOT NULL,
  `branch` VARCHAR(20) NOT NULL,
  `division` VARCHAR(10) NOT NULL,
  `section_name` VARCHAR(50) NOT NULL,
  `batch_name` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_section_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `subject_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_code` VARCHAR(20) NOT NULL UNIQUE,
  `subject_name` VARCHAR(150) NOT NULL,
  `course_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `credits` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  `subject_type` VARCHAR(50) NOT NULL DEFAULT 'Theory',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_subject_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_subject_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 1: Student Management & Master Identity
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `student_id` INT AUTO_INCREMENT PRIMARY KEY,
  `prn` VARCHAR(30) NOT NULL UNIQUE,
  `roll_no` VARCHAR(30) NOT NULL UNIQUE,
  `student_name` VARCHAR(120) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `middle_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NULL,
  `branch` VARCHAR(20) NOT NULL,
  `department_id` INT NOT NULL,
  `section_id` INT NULL,
  `division` VARCHAR(10) NULL,
  `batch_year` YEAR NOT NULL,
  `current_year` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `current_semester` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `dob` DATE NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `category` VARCHAR(30) NULL,
  `admission_year` YEAR NOT NULL,
  `admission_status` ENUM('Active', 'Passout', 'Suspended', 'Detained', 'Left') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_student_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_student_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_student_roll` (`roll_no`),
  INDEX `idx_student_prn` (`prn`),
  INDEX `idx_student_email` (`email`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `student_address`;
CREATE TABLE `student_address` (
  `address_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `address_type` ENUM('Permanent', 'Current', 'Local') NOT NULL DEFAULT 'Permanent',
  `street_address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_address_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `student_contact`;
CREATE TABLE `student_contact` (
  `contact_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `mobile_number` VARCHAR(20) NOT NULL,
  `alternate_mobile` VARCHAR(20) NULL,
  `personal_email` VARCHAR(100) NULL,
  `institute_email` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_contact_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `guardian_details`;
CREATE TABLE `guardian_details` (
  `guardian_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `guardian_name` VARCHAR(100) NOT NULL,
  `relation` VARCHAR(30) NOT NULL,
  `occupation` VARCHAR(50) NULL,
  `contact_number` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_guardian_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `academic_history`;
CREATE TABLE `academic_history` (
  `history_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `qualification_level` VARCHAR(50) NOT NULL,
  `institute_name` VARCHAR(150) NOT NULL,
  `board_university` VARCHAR(100) NOT NULL,
  `passing_year` YEAR NOT NULL,
  `percentage_gpa` DECIMAL(5, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_history_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 8: Faculty-Subject Assignment & Timetable
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `faculty_subject_assignment`;
CREATE TABLE `faculty_subject_assignment` (
  `assignment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `faculty_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `section_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fsa_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_fsa_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_fsa_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_fsa_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `student_subject_enrollment`;
CREATE TABLE `student_subject_enrollment` (
  `enrollment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `status` ENUM('Enrolled', 'Completed', 'Dropped') NOT NULL DEFAULT 'Enrolled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sse_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sse_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sse_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE,
  UNIQUE KEY `uk_student_subject` (`student_id`, `subject_id`, `semester_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `timetable`;
CREATE TABLE `timetable` (
  `timetable_id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `faculty_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `room_no` VARCHAR(30) NOT NULL,
  `timetable_type` ENUM('Lecture', 'Lab', 'Tutorial') NOT NULL DEFAULT 'Lecture',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tt_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tt_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tt_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tt_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 4: Attendance Management
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `attendance_session`;
CREATE TABLE `attendance_session` (
  `session_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_id` INT NOT NULL,
  `faculty_id` INT NOT NULL,
  `section_id` INT NOT NULL,
  `session_date` DATE NOT NULL,
  `period` VARCHAR(50) NOT NULL,
  `topic_covered` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_att_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_att_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_att_section` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `attendance_record`;
CREATE TABLE `attendance_record` (
  `record_id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
  `remarks` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rec_session` FOREIGN KEY (`session_id`) REFERENCES `attendance_session` (`session_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rec_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_session_student` (`session_id`, `student_id`),
  INDEX `idx_rec_student` (`student_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 5: Examinations & Results Management
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam` (
  `exam_id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_name` VARCHAR(100) NOT NULL,
  `exam_type` VARCHAR(50) NOT NULL DEFAULT 'Midterm',
  `academic_year` VARCHAR(20) NOT NULL,
  `semester_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_exam_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `exam_schedule`;
CREATE TABLE `exam_schedule` (
  `schedule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `exam_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `room_no` VARCHAR(30) NOT NULL,
  `max_marks` SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sched_exam` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sched_subject` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `marks`;
CREATE TABLE `marks` (
  `mark_id` INT AUTO_INCREMENT PRIMARY KEY,
  `schedule_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `marks_obtained` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `max_marks` SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  `grade_letter` VARCHAR(5) NULL,
  `grade_point` DECIMAL(3, 1) NULL,
  `status` ENUM('Present', 'Absent', 'Malpractice') NOT NULL DEFAULT 'Present',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_marks_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `exam_schedule` (`schedule_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_schedule_student` (`schedule_id`, `student_id`),
  INDEX `idx_marks_student` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `result`;
CREATE TABLE `result` (
  `result_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `sgpa` DECIMAL(4, 2) NOT NULL,
  `cgpa` DECIMAL(4, 2) NOT NULL,
  `overall_status` ENUM('Pass', 'Fail', 'Withheld', 'ATKT') NOT NULL DEFAULT 'Pass',
  `result_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_res_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_res_exam` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`) ON UPDATE CASCADE,
  UNIQUE KEY `uk_student_exam` (`student_id`, `exam_id`),
  INDEX `idx_result_student` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `exam_application`;
CREATE TABLE `exam_application` (
  `application_id` INT AUTO_INCREMENT PRIMARY KEY,
  `app_code` VARCHAR(50) NOT NULL UNIQUE,
  `student_id` INT NOT NULL,
  `type` ENUM('Regular Semester Exam', 'Paper Revaluation', 'Backlog / ATKT') NOT NULL,
  `semester_label` VARCHAR(100) NOT NULL,
  `subject_code` VARCHAR(20) NULL,
  `submission_date` DATE NOT NULL,
  `fee_status` ENUM('Paid', 'Exempted', 'Pending') NOT NULL DEFAULT 'Paid',
  `approval_status` ENUM('Approved', 'Under Verification', 'Submitted', 'Rejected') NOT NULL DEFAULT 'Submitted',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_exapp_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 6: Library Management
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `author`;
CREATE TABLE `author` (
  `author_id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(100) NOT NULL,
  `nationality` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `publisher`;
CREATE TABLE `publisher` (
  `publisher_id` INT AUTO_INCREMENT PRIMARY KEY,
  `publisher_name` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `isbn` VARCHAR(30) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `author_id` INT NULL,
  `publisher_id` INT NULL,
  `category_id` INT NOT NULL,
  `edition` VARCHAR(20) NULL,
  `publication_year` YEAR NULL,
  `language` VARCHAR(30) NOT NULL DEFAULT 'English',
  `total_copies` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `available_copies` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `shelf_location` VARCHAR(50) NULL,
  `rack_no` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_book_author` FOREIGN KEY (`author_id`) REFERENCES `author` (`author_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_book_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`publisher_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_book_category` FOREIGN KEY (`category_id`) REFERENCES `book_category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `book_copy`;
CREATE TABLE `book_copy` (
  `copy_id` INT AUTO_INCREMENT PRIMARY KEY,
  `isbn` VARCHAR(30) NOT NULL,
  `accession_no` VARCHAR(50) NOT NULL UNIQUE,
  `purchase_date` DATE NOT NULL,
  `status` ENUM('Available', 'Issued', 'Lost', 'Damaged') NOT NULL DEFAULT 'Available',
  `condition_status` ENUM('New', 'Good', 'Fair', 'Poor') NOT NULL DEFAULT 'Good',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_copy_book` FOREIGN KEY (`isbn`) REFERENCES `book` (`isbn`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `librarian`;
CREATE TABLE `librarian` (
  `librarian_id` INT AUTO_INCREMENT PRIMARY KEY,
  `staff_id` INT NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lib_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `book_issue`;
CREATE TABLE `book_issue` (
  `issue_id` INT AUTO_INCREMENT PRIMARY KEY,
  `copy_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `librarian_id` INT NOT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `status` ENUM('Issued', 'Returned', 'Overdue', 'Lost') NOT NULL DEFAULT 'Issued',
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_bi_copy` FOREIGN KEY (`copy_id`) REFERENCES `book_copy` (`copy_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_bi_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bi_librarian` FOREIGN KEY (`librarian_id`) REFERENCES `librarian` (`librarian_id`) ON UPDATE CASCADE,
  INDEX `idx_bi_student` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `book_return`;
CREATE TABLE `book_return` (
  `return_id` INT AUTO_INCREMENT PRIMARY KEY,
  `issue_id` INT NOT NULL UNIQUE,
  `return_date` DATE NOT NULL,
  `condition_on_return` ENUM('Good', 'Damaged', 'Lost') NOT NULL DEFAULT 'Good',
  `days_late` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_br_issue` FOREIGN KEY (`issue_id`) REFERENCES `book_issue` (`issue_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `fine`;
CREATE TABLE `fine` (
  `fine_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `return_id` INT NULL,
  `fine_type` ENUM('Late Return', 'Damage', 'Lost Book') NOT NULL,
  `fine_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `fine_date` DATE NOT NULL,
  `paid_date` DATE NULL,
  `payment_status` ENUM('Unpaid', 'Paid', 'Waived') NOT NULL DEFAULT 'Unpaid',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fine_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fine_return` FOREIGN KEY (`return_id`) REFERENCES `book_return` (`return_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_fine_student` (`student_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 7: Fees & Finance Management
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `scholarship`;
CREATE TABLE `scholarship` (
  `scholarship_id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `fee_structure`;
CREATE TABLE `fee_structure` (
  `fee_structure_id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `fee_type` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `due_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fs_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_fs_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `student_fee`;
CREATE TABLE `student_fee` (
  `student_fee_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `fee_structure_id` INT NOT NULL,
  `scholarship_id` INT NULL,
  `amount_due` DECIMAL(10, 2) NOT NULL,
  `amount_paid` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `due_date` DATE NOT NULL,
  `status` ENUM('Unpaid', 'Partially Paid', 'Paid') NOT NULL DEFAULT 'Unpaid',
  `invoice_no` VARCHAR(50) NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sf_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sf_structure` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structure` (`fee_structure_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sf_scholarship` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarship` (`scholarship_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_sf_student` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_fee_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_date` DATE NOT NULL,
  `payment_mode` VARCHAR(50) NOT NULL,
  `transaction_reference` VARCHAR(100) NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Success',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pay_fee` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fee` (`student_fee_id`) ON UPDATE CASCADE,
  INDEX `idx_pay_fee` (`student_fee_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `finance_fine`;
CREATE TABLE `finance_fine` (
  `finance_fine_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `fine_date` DATE NOT NULL,
  `payment_status` ENUM('Pending', 'Paid', 'Waived') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ff_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  INDEX `idx_ff_student` (`student_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- MODULE 7: Training & Placement (TNP)
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(150) NOT NULL UNIQUE,
  `industry_type` VARCHAR(100) NULL,
  `location` VARCHAR(100) NULL,
  `website` VARCHAR(150) NULL,
  `contact_email` VARCHAR(100) NULL,
  `contact_phone` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `job_drive`;
CREATE TABLE `job_drive` (
  `drive_id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT NOT NULL,
  `job_role` VARCHAR(150) NOT NULL,
  `job_type` VARCHAR(50) NOT NULL DEFAULT 'Full-time',
  `package` VARCHAR(50) NOT NULL,
  `drive_date` DATE NOT NULL,
  `registration_deadline` DATE NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('Open for Registration', 'In Progress', 'Completed', 'Closed') NOT NULL DEFAULT 'Open for Registration',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_jd_company` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `eligibility`;
CREATE TABLE `eligibility` (
  `eligibility_id` INT AUTO_INCREMENT PRIMARY KEY,
  `drive_id` INT NOT NULL,
  `minimum_cgpa` DECIMAL(3, 2) NOT NULL DEFAULT 6.00,
  `backlog_allowed` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `allowed_branch` VARCHAR(255) NULL,
  `other_criteria` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_elig_drive` FOREIGN KEY (`drive_id`) REFERENCES `job_drive` (`drive_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `application_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `drive_id` INT NOT NULL,
  `application_date` DATE NOT NULL,
  `status` ENUM('Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Selected', 'Offer Accepted', 'Rejected') NOT NULL DEFAULT 'Applied',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_app_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_drive` FOREIGN KEY (`drive_id`) REFERENCES `job_drive` (`drive_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_student_drive` (`student_id`, `drive_id`),
  INDEX `idx_app_student` (`student_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `interview`;
CREATE TABLE `interview` (
  `interview_id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL,
  `round_no` TINYINT UNSIGNED NOT NULL,
  `round_type` VARCHAR(50) NOT NULL,
  `interview_date` DATE NOT NULL,
  `venue` VARCHAR(100) NULL,
  `status` ENUM('Scheduled', 'Cleared', 'Not Cleared', 'Absent') NOT NULL DEFAULT 'Scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_int_application` FOREIGN KEY (`application_id`) REFERENCES `application` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `placement`;
CREATE TABLE `placement` (
  `placement_id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_id` INT NOT NULL UNIQUE,
  `job_role` VARCHAR(150) NOT NULL,
  `package` VARCHAR(50) NOT NULL,
  `offer_date` DATE NULL,
  `joining_date` DATE NULL,
  `status` ENUM('Offered', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Offered',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_place_application` FOREIGN KEY (`application_id`) REFERENCES `application` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `training`;
CREATE TABLE `training` (
  `training_id` INT AUTO_INCREMENT PRIMARY KEY,
  `training_name` VARCHAR(150) NOT NULL,
  `provider` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `training_enrollment`;
CREATE TABLE `training_enrollment` (
  `enrollment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `training_id` INT NOT NULL,
  `enrollment_date` DATE NOT NULL,
  `status` ENUM('Enrolled', 'Completed', 'Dropped') NOT NULL DEFAULT 'Enrolled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_te_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_te_training` FOREIGN KEY (`training_id`) REFERENCES `training` (`training_id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_student_training` (`student_id`, `training_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement` (
  `announcement_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('Urgent', 'Academic', 'Placement', 'General') NOT NULL DEFAULT 'General',
  `posted_by` VARCHAR(100) NOT NULL,
  `announcement_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- FACULTY WORKSPACE SPECIFIC TABLES: Leave & Payroll
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `faculty_leave`;
CREATE TABLE `faculty_leave` (
  `leave_id` INT AUTO_INCREMENT PRIMARY KEY,
  `leave_code` VARCHAR(50) NOT NULL UNIQUE,
  `faculty_id` INT NOT NULL,
  `leave_type` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `days_count` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `reason` TEXT NOT NULL,
  `cover_faculty_name` VARCHAR(100) NULL,
  `status` ENUM('Approved', 'Pending Dean Review', 'Cancelled', 'Rejected') NOT NULL DEFAULT 'Pending Dean Review',
  `applied_on` DATE NOT NULL,
  `approver_comments` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_leave_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  INDEX `idx_leave_faculty` (`faculty_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `faculty_payroll`;
CREATE TABLE `faculty_payroll` (
  `payroll_id` INT AUTO_INCREMENT PRIMARY KEY,
  `slip_id` VARCHAR(50) NOT NULL UNIQUE,
  `faculty_id` INT NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` YEAR NOT NULL,
  `basic_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `da_allowance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `hra_allowance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `travel_allowance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `academic_allowance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `gross_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `pf_deduction` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `income_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `professional_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `disbursement_date` DATE NOT NULL,
  `payment_mode` VARCHAR(100) NOT NULL DEFAULT 'Bank Transfer',
  `status` ENUM('Pending', 'Paid', 'Failed') NOT NULL DEFAULT 'Paid',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payroll_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  INDEX `idx_payroll_faculty` (`faculty_id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- AUTHENTICATION, RBAC & AUDIT LOGGING
-- -----------------------------------------------------------------------------

DROP TABLE IF EXISTS `user_account`;
CREATE TABLE `user_account` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `identifier` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'FACULTY', 'STUDENT', 'STAFF') NOT NULL DEFAULT 'STUDENT',
  `student_id` INT NULL UNIQUE,
  `faculty_id` INT NULL UNIQUE,
  `staff_id` INT NULL UNIQUE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_user_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE,
  INDEX `idx_user_identifier` (`identifier`),
  INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `log_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_role` VARCHAR(20) NULL,
  `action` VARCHAR(50) NOT NULL,
  `entity` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NULL,
  `ip_address` VARCHAR(45) NULL,
  `details` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE SET NULL,
  INDEX `idx_audit_action` (`action`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
