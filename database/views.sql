-- =============================================================================
-- UNIVERSITY ERP DATABASE VIEWS (MySQL 8.0)
-- Standard Relational Views for Reporting, Analytics & Aggregation
-- =============================================================================

USE `college_erp`;

-- 1. Student Attendance Summary View
-- Computes real-time subject-wise session count, attendance turnout, and percentage.
CREATE OR REPLACE VIEW `v_student_attendance_summary` AS
SELECT 
  s.student_id,
  s.roll_no,
  s.student_name,
  d.department_name,
  sec.section_name,
  sub.subject_id,
  sub.subject_code,
  sub.subject_name,
  COUNT(ar.record_id) AS total_sessions,
  SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) AS attended_sessions,
  SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) AS absent_sessions,
  ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / NULLIF(COUNT(ar.record_id), 0)) * 100, 2) AS attendance_pct
FROM student s
JOIN department d ON s.department_id = d.department_id
JOIN section sec ON s.section_id = sec.section_id
JOIN attendance_record ar ON s.student_id = ar.student_id
JOIN attendance_session ses ON ar.session_id = ses.session_id
JOIN subject sub ON ses.subject_id = sub.subject_id
GROUP BY s.student_id, s.roll_no, s.student_name, d.department_name, sec.section_name, sub.subject_id, sub.subject_code, sub.subject_name;

-- 2. Student Fee Ledger & Outstanding Balance View
-- Computes total invoices billed, payments received, and pending balances in INR.
CREATE OR REPLACE VIEW `v_student_fee_balance` AS
SELECT 
  s.student_id,
  s.roll_no,
  s.student_name,
  d.department_name,
  COALESCE(SUM(sf.amount_due), 0) AS total_invoiced,
  COALESCE(SUM(sf.amount_paid), 0) AS total_paid,
  COALESCE(SUM(sf.amount_due - sf.amount_paid), 0) AS outstanding_balance,
  CASE 
    WHEN SUM(sf.amount_due - sf.amount_paid) <= 0 THEN 'Clear'
    WHEN SUM(sf.amount_paid) > 0 THEN 'Partial'
    ELSE 'Due'
  END AS payment_standing
FROM student s
JOIN department d ON s.department_id = d.department_id
LEFT JOIN student_fee sf ON s.student_id = sf.student_id
GROUP BY s.student_id, s.roll_no, s.student_name, d.department_name;

-- 3. Faculty Teaching Workload View
-- Summarizes allocated sections, distinct subjects taught, and total weekly teaching slots.
CREATE OR REPLACE VIEW `v_faculty_workload` AS
SELECT 
  f.faculty_id,
  f.faculty_code,
  f.faculty_name,
  d.department_name,
  des.designation_name,
  COUNT(DISTINCT t.section_id) AS sections_count,
  COUNT(DISTINCT t.subject_id) AS subjects_taught,
  COUNT(t.timetable_id) AS weekly_lectures_count
FROM faculty f
JOIN department d ON f.department_id = d.department_id
JOIN designation des ON f.designation_id = des.designation_id
LEFT JOIN timetable t ON f.faculty_id = t.faculty_id
GROUP BY f.faculty_id, f.faculty_code, f.faculty_name, d.department_name, des.designation_name;

-- 4. Department Academic Performance View
-- Summarizes enrollment count, mark distributions, averages, and pass counts.
CREATE OR REPLACE VIEW `v_department_performance` AS
SELECT 
  d.department_id,
  d.department_name,
  d.branch_code,
  COUNT(DISTINCT s.student_id) AS total_enrolled_students,
  ROUND(AVG(m.marks_obtained), 2) AS average_marks_obtained,
  MAX(m.marks_obtained) AS highest_marks_obtained,
  MIN(m.marks_obtained) AS lowest_marks_obtained,
  SUM(CASE WHEN m.status = 'Pass' OR m.grade_letter NOT IN ('F', 'Fail') THEN 1 ELSE 0 END) AS total_passes
FROM department d
JOIN student s ON d.department_id = s.department_id
LEFT JOIN marks m ON s.student_id = m.student_id
GROUP BY d.department_id, d.department_name, d.branch_code;

-- 5. Library Overdue Books View
-- Identifies unreturned book loans past due date with daily fine accrual calculation.
CREATE OR REPLACE VIEW `v_library_overdue_books` AS
SELECT 
  bi.issue_id,
  s.student_id,
  s.roll_no,
  s.student_name,
  s.email AS student_email,
  b.title AS book_title,
  b.isbn,
  bi.issue_date,
  bi.due_date,
  DATEDIFF(CURDATE(), bi.due_date) AS days_overdue,
  GREATEST(0, DATEDIFF(CURDATE(), bi.due_date) * 5) AS estimated_fine_inr
FROM book_issue bi
JOIN book_copy bc ON bi.copy_id = bc.copy_id
JOIN book b ON bc.isbn = b.isbn
JOIN student s ON bi.student_id = s.student_id
WHERE bi.status = 'Issued' AND bi.due_date < CURDATE();
