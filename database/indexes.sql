-- =============================================================================
-- UNIVERSITY ERP DATABASE INDEXES (MySQL 8.0)
-- Performance Optimization & Fast B-Tree Key Lookups
-- =============================================================================

USE `college_erp`;

-- Indexes on Attendance module for high-throughput queries
CREATE INDEX `idx_att_sess_filter` ON `attendance_session` (`section_id`, `subject_id`, `session_date`);
CREATE INDEX `idx_att_sess_faculty` ON `attendance_session` (`faculty_id`, `session_date`);
CREATE INDEX `idx_att_rec_student_status` ON `attendance_record` (`student_id`, `status`);

-- Indexes on Timetable module for fast conflict detection & student schedule views
CREATE INDEX `idx_tt_sec_day_time` ON `timetable` (`section_id`, `day_of_week`, `start_time`);
CREATE INDEX `idx_tt_fac_day_time` ON `timetable` (`faculty_id`, `day_of_week`, `start_time`);
CREATE INDEX `idx_tt_room_day_time` ON `timetable` (`room_no`, `day_of_week`, `start_time`);

-- Indexes on Examination & Marks
CREATE INDEX `idx_marks_student` ON `marks` (`student_id`, `schedule_id`);
CREATE INDEX `idx_marks_status` ON `marks` (`status`);

-- Indexes on Finance & Fees
CREATE INDEX `idx_student_fee_lookup` ON `student_fee` (`student_id`, `status`);
CREATE INDEX `idx_payment_fee_id` ON `payment` (`student_fee_id`, `payment_date`);

-- Indexes on Library Management
CREATE INDEX `idx_issue_student` ON `book_issue` (`student_id`, `status`);
CREATE INDEX `idx_issue_due_date` ON `book_issue` (`due_date`, `status`);

-- Indexes on User Authentication
CREATE INDEX `idx_user_auth_lookup` ON `user_account` (`identifier`, `is_active`);
CREATE INDEX `idx_user_email_lookup` ON `user_account` (`email`, `is_active`);
