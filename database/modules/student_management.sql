-- =============================================================================
-- UNIVERSITY ERP — MODULE 1: STUDENT MANAGEMENT
-- File: database/modules/student_management.sql
-- Tables: student, student_address, student_contact, guardian_details, academic_history
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Student Core Master
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

-- -----------------------------------------------------------------------------
-- 2. Student Address Demographics
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. Student Contact Details
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. Guardian Details
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Prior Academic History
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
