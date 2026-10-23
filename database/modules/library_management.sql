-- =============================================================================
-- UNIVERSITY ERP — MODULE 3: LIBRARY MANAGEMENT
-- File: database/modules/library_management.sql
-- Tables: author, publisher, book_category, book, book_copy, librarian, book_issue, book_return, fine
-- =============================================================================

USE `college_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Authors
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `author`;
CREATE TABLE `author` (
  `author_id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(100) NOT NULL,
  `nationality` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Publishers
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `publisher`;
CREATE TABLE `publisher` (
  `publisher_id` INT AUTO_INCREMENT PRIMARY KEY,
  `publisher_name` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Book Categories
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Books Master Catalog
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Physical Book Copies
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 6. Librarian Master
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 7. Book Issues (Circulation)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 8. Book Returns
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 9. Library Fines
-- -----------------------------------------------------------------------------
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

SET FOREIGN_KEY_CHECKS = 1;
