-- =============================================================================
-- UNIVERSITY ERP — MODULE 5: TRAINING & PLACEMENT (T&P) MANAGEMENT
-- File: database/modules/training_placement.sql
-- Tables: company, job_drive, eligibility, application, interview, placement, training, training_enrollment, announcement
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Recruiting Companies Master
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

-- -----------------------------------------------------------------------------
-- 2. Campus Job Drives
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. Job Drive Eligibility Criteria
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. Student Drive Applications
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Interview Rounds
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 6. Final Job Offers & Placements
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 7. Skills & Training Programs
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 8. Training Enrollments
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 9. Announcements & Bulletins
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
