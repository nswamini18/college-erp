-- =============================================================================
-- UNIVERSITY ERP — MODULE 7: EXAMINATION & RESULT MANAGEMENT
-- File: database/modules/examination_result.sql
-- Tables: exam, exam_schedule, marks, result, exam_application
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Examinations Master Table
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

-- -----------------------------------------------------------------------------
-- 2. Examination Schedules
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. Student Marks Ledger
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. Semester Results Ledger (SGPA / CGPA)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Examination Applications & Petitions
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
