-- =============================================================================
-- UNIVERSITY ERP — MODULE 8: ATTENDANCE MANAGEMENT
-- File: database/modules/attendance_management.sql
-- Tables: attendance_session, attendance_record
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Class Attendance Sessions
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

-- -----------------------------------------------------------------------------
-- 2. Student Attendance Records
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
