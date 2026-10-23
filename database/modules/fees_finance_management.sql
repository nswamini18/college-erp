-- =============================================================================
-- UNIVERSITY ERP — MODULE 4: FEES & FINANCE MANAGEMENT
-- File: database/modules/fees_finance_management.sql
-- Tables: scholarship, fee_structure, student_fee, payment, finance_fine
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Scholarships Master Table
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

-- -----------------------------------------------------------------------------
-- 2. Fee Structure Master Table
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. Student Invoices (Student Fee)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. Payment Receipts & Transactions
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Finance Fines & Penalties
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
