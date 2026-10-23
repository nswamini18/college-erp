-- =============================================================================
-- UNIVERSITY ERP — MODULE 6: ACADEMICS & COURSE MANAGEMENT
-- File: database/modules/academics_course_management.sql
-- Tables: academic_semester, course, section, subject, faculty_subject_assignment, student_subject_enrollment, timetable
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Academic Semesters Master Table
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

-- -----------------------------------------------------------------------------
-- 2. Degree Programs / Courses Master Table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `course_id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_code` VARCHAR(20) NOT NULL UNIQUE,
  `course_name` VARCHAR(150) NOT NULL,
  `department_id` INT NOT NULL,
  `course_type` VARCHAR(50) NOT NULL DEFAULT 'UG',
  `duration_years` TINYINT UNSIGNED NOT NULL DEFAULT 4,
  `total_credits` SMALLINT UNSIGNED NOT NULL DEFAULT 160,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Academic Sections & Divisions
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `section`;
CREATE TABLE `section` (
  `section_id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT NOT NULL,
  `branch` VARCHAR(20) NOT NULL,
  `division` VARCHAR(10) NOT NULL,
  `section_name` VARCHAR(50) NOT NULL,
  `batch_name` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_section_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Subjects & Curriculum Courses
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `subject_id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject_code` VARCHAR(20) NOT NULL UNIQUE,
  `subject_name` VARCHAR(100) NOT NULL,
  `course_id` INT NOT NULL,
  `semester_id` INT NOT NULL,
  `credits` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  `subject_type` ENUM('Theory', 'Practical', 'Elective', 'Seminar') NOT NULL DEFAULT 'Theory',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_subject_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_subject_semester` FOREIGN KEY (`semester_id`) REFERENCES `academic_semester` (`semester_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Faculty Subject Assignments
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

-- -----------------------------------------------------------------------------
-- 6. Student Subject Enrollments
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 7. Weekly Timetable Schedules
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
