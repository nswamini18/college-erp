-- =============================================================================
-- UNIVERSITY ERP DBMS REPORT QUERIES (MySQL 8.0)
-- Demonstrating Core Relational Concepts: Joins, Aggregation, Subqueries, HAVING
-- =============================================================================

USE `college_erp`;

-- -----------------------------------------------------------------------------
-- REPORT 1: Debarment Alert Report (Students with Attendance < 75%)
-- Demonstrates: INNER JOIN, GROUP BY, HAVING, Aggregate Functions (COUNT, SUM, ROUND)
-- -----------------------------------------------------------------------------
SELECT 
    s.roll_no,
    s.student_name,
    d.department_name,
    sec.section_name,
    sub.subject_code,
    sub.subject_name,
    COUNT(ar.record_id) AS total_conducted_sessions,
    SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) AS attended_sessions,
    SUM(CASE WHEN ar.status = 'Absent' THEN 1 ELSE 0 END) AS absent_sessions,
    ROUND((SUM(CASE WHEN ar.status = 'Present' THEN 1 ELSE 0 END) / COUNT(ar.record_id)) * 100, 2) AS attendance_percentage
FROM student s
JOIN department d ON s.department_id = d.department_id
JOIN section sec ON s.section_id = sec.section_id
JOIN attendance_record ar ON s.student_id = ar.student_id
JOIN attendance_session ses ON ar.session_id = ses.session_id
JOIN subject sub ON ses.subject_id = sub.subject_id
GROUP BY s.student_id, s.roll_no, s.student_name, d.department_name, sec.section_name, sub.subject_id, sub.subject_code, sub.subject_name
HAVING attendance_percentage < 75.00
ORDER BY attendance_percentage ASC, s.roll_no ASC;

-- -----------------------------------------------------------------------------
-- REPORT 2: High Achievers Above Departmental Average Marks
-- Demonstrates: Correlated Subquery, INNER JOIN, AVG, Subquery Comparison
-- -----------------------------------------------------------------------------
SELECT 
    s.roll_no,
    s.student_name,
    d.department_name,
    ROUND(AVG(m.marks_obtained), 2) AS student_avg_marks,
    (
        SELECT ROUND(AVG(m2.marks_obtained), 2)
        FROM marks m2
        JOIN student s2 ON m2.student_id = s2.student_id
        WHERE s2.department_id = s.department_id
    ) AS department_overall_avg
FROM student s
JOIN department d ON s.department_id = d.department_id
JOIN marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.roll_no, s.student_name, d.department_name, s.department_id
HAVING student_avg_marks > department_overall_avg
ORDER BY student_avg_marks DESC;

-- -----------------------------------------------------------------------------
-- REPORT 3: Institutional Fee Collection & Outstanding Dues by Department
-- Demonstrates: Multi-table JOIN, SUM, COALESCE, Financial Aggregation
-- -----------------------------------------------------------------------------
SELECT 
    d.department_name,
    COUNT(DISTINCT s.student_id) AS enrolled_students,
    COALESCE(SUM(sf.amount_due), 0) AS total_tuition_billed,
    COALESCE(SUM(sf.amount_paid), 0) AS total_tuition_collected,
    COALESCE(SUM(sf.amount_due - sf.amount_paid), 0) AS total_outstanding_dues,
    ROUND((COALESCE(SUM(sf.amount_paid), 0) / NULLIF(SUM(sf.amount_due), 0)) * 100, 2) AS collection_efficiency_pct
FROM department d
JOIN student s ON d.department_id = s.department_id
LEFT JOIN student_fee sf ON s.student_id = sf.student_id
GROUP BY d.department_id, d.department_name
ORDER BY total_outstanding_dues DESC;

-- -----------------------------------------------------------------------------
-- REPORT 4: Faculty Lecture Distribution & Weekly Hours
-- Demonstrates: LEFT JOIN, COUNT DISTINCT, Nested Subquery, Grouping
-- -----------------------------------------------------------------------------
SELECT 
    f.faculty_code,
    f.faculty_name,
    d.department_name,
    des.designation_name,
    COUNT(DISTINCT t.section_id) AS assigned_sections_count,
    COUNT(t.timetable_id) AS weekly_teaching_slots
FROM faculty f
JOIN department d ON f.department_id = d.department_id
JOIN designation des ON f.designation_id = des.designation_id
LEFT JOIN timetable t ON f.faculty_id = t.faculty_id
GROUP BY f.faculty_id, f.faculty_code, f.faculty_name, d.department_name, des.designation_name
ORDER BY weekly_teaching_slots DESC, f.faculty_name ASC;

-- -----------------------------------------------------------------------------
-- REPORT 5: Training & Placement Drive Conversion Funnel
-- Demonstrates: Three-way JOIN, COUNT DISTINCT, Status Filtering
-- -----------------------------------------------------------------------------
SELECT 
    c.company_name,
    jd.job_title,
    jd.package_lpa,
    COUNT(DISTINCT a.student_id) AS applicants_count,
    SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) AS selected_students_count,
    ROUND((SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT a.student_id), 0)) * 100, 2) AS selection_rate_pct
FROM job_drive jd
JOIN company c ON jd.company_id = c.company_id
LEFT JOIN application a ON jd.drive_id = a.drive_id
GROUP BY jd.drive_id, c.company_name, jd.job_title, jd.package_lpa
ORDER BY jd.package_lpa DESC;
