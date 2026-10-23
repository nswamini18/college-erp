-- =============================================================================
-- UNIVERSITY ERP — MODULE 2: FACULTY & STAFF MANAGEMENT
-- File: database/modules/faculty_management.sql
-- Tables: department, designation, faculty, staff, faculty_leave, faculty_payroll
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Departments Master Table
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

-- -----------------------------------------------------------------------------
-- 2. Designations Master Table
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `designation`;
CREATE TABLE `designation` (
  `designation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `designation_name` VARCHAR(100) NOT NULL UNIQUE,
  `category` ENUM('Teaching', 'Non-Teaching') NOT NULL DEFAULT 'Teaching',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Faculty Members Master Table
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

-- -----------------------------------------------------------------------------
-- 4. Non-Teaching Staff Master Table
-- -----------------------------------------------------------------------------
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
-- 5. Faculty Leaves
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

-- -----------------------------------------------------------------------------
-- 6. Faculty Payroll & Payslips
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
