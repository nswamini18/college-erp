# CAMPUS ERP: MULTI-TIER UNIVERSITY ENTERPRISE RESOURCE PLANNING & DATABASE MANAGEMENT SYSTEM

**Course:** Database Management Systems Laboratory (DBMS)  
**Academic Year:** 2025 – 2026  
**Document Type:** Comprehensive Technical Project Report & Academic Evaluation Dossier  

---

## Candidate & Institutional Submission Details

| Field | Submission Details / Candidate Placeholder |
| :--- | :--- |
| **Project Title** | Campus ERP: Relational Database System & Academic Management Portal |
| **Course Code & Title** | CS-302: Database Management Systems Laboratory |
| **Academic Department** | Department of Computer Science & Engineering |
| **Institution Name** | [College / University Name Placeholder] |
| **Affiliated University** | [State Technical University / Autonomous Institute] |
| **Student Candidate 1** | [Student 1 Full Name] • USN: [USN Placeholder 1] • Branch: [Branch] |
| **Student Candidate 2** | [Student 2 Full Name] • USN: [USN Placeholder 2] • Branch: [Branch] |
| **Student Candidate 3** | [Student 3 Full Name] • USN: [USN Placeholder 3] • Branch: [Branch] |
| **Student Candidate 4** | [Student 4 Full Name] • USN: [USN Placeholder 4] • Branch: [Branch] |
| **Project Supervisor / Guide** | [Faculty Guide Name], [Designation], Department of CSE |
| **Evaluation Panel** | Internal Examiner: _________________ &nbsp;&nbsp;&nbsp;&nbsp; External Examiner: _________________ |

---

## Table of Contents

1. [Executive Abstract, Problem Statement & Objectives](#1-executive-abstract-problem-statement--objectives)
2. [Technology Stack & System Architecture](#2-technology-stack--system-architecture)
3. [Comprehensive Analysis of the Eight ERP Modules](#3-comprehensive-analysis-of-the-eight-erp-modules)
4. [Relational Database Design & Data Dictionary](#4-relational-database-design--data-dictionary)
5. [Entity-Relationship (ER) Modeling & Structural Integrity](#5-entity-relationship-er-modeling--structural-integrity)
6. [Normalization Analysis (1NF, 2NF, 3NF)](#6-normalization-analysis-1nf-2nf-3nf)
7. [Advanced DBMS Concepts Demonstrated](#7-advanced-dbms-concepts-demonstrated)
8. [Important SQL Queries with Execution Analysis](#8-important-sql-queries-with-execution-analysis)
9. [API Architecture & Real-Time Data Flow](#9-api-architecture--real-time-data-flow)
10. [Security, Authentication & IDOR Isolation](#10-security-authentication--idor-isolation)
11. [Verification Test Suite & Empirical Results](#11-verification-test-suite--empirical-results)
12. [Installation, Configuration & Execution Manual](#12-installation-configuration--execution-manual)
13. [Current Limitations & Future Enhancements](#13-current-limitations--future-enhancements)
14. [Conclusion & Project File Manifest](#14-conclusion--project-file-manifest)
15. [Comprehensive DBMS Viva Voce Preparation (25 Questions & Answers)](#15-comprehensive-dbms-viva-voce-preparation-25-questions--answers)

---

## 1. Executive Abstract, Problem Statement & Objectives

### 1.1 Executive Abstract
Modern collegiate environments require robust, highly concurrent, and strictly normalized database management systems to orchestrate academic schedules, student attendance rolls, curricular examinations, library circulation, financial accounting, and recruitment placements. Traditional educational management software frequently suffers from data fragmentation, race conditions during high-volume attendance logging, insecure direct object references (IDOR), and unsynchronized client caches.

This project delivers **Campus ERP**, an enterprise-grade relational database management system built upon **MySQL 8.0 (InnoDB engine)**, coordinated by a high-throughput **Node.js/Express RESTful backend**, and rendered through a responsive **React 18 Single-Page Application (SPA)**. The relational database schema is normalized to **Third Normal Form (3NF)** across 50 interrelated entities covering 1,000 enrolled students and 60 faculty members across five engineering branches. A multi-row ACID transactional workflow with concurrency locking (`SELECT ... FOR UPDATE`) guarantees idempotent attendance logging and instant cross-portal propagation without accidental duplicate records. Furthermore, a three-way conflict detection engine prevents timetable scheduling collisions across cohort divisions, instructors, and physical classroom facilities.

### 1.2 Problem Statement & Motivation
Prior to this implementation, academic record-keeping in institutional environments suffered from several critical database deficiencies:
- **Duplicate Attendance Anomalies:** Repeated attendance submissions or network re-tries for the same class hour created duplicate session entries in the database, distorting statutory attendance metrics.
- **Unsynchronized Client States:** Changes committed by faculty members (such as marking an absent student or rescheduling a lecture) failed to propagate to student dashboards without manual server restarts or hardcoded mock fallbacks.
- **Identity Mapping & Authorization Vulnerabilities:** Insecure parameter designs allowed unauthorized users to query other students' sensitive academic or financial records simply by tampering with URL query strings (`?student_id=X`).
- **Scheduling Clashes:** Lack of relational constraints allowed duplicate room allocations and faculty double-booking for overlapping time intervals.

### 1.3 Project Objectives
1. **Relational Normalization:** Engineer a production-grade relational database schema normalized to 3NF, eliminating insertion, update, and deletion anomalies.
2. **ACID Transaction Management:** Implement atomic multi-row transactions with automatic rollback (`START TRANSACTION`, `COMMIT`, `ROLLBACK`) for attendance marking and fee collections.
3. **Idempotency & Duplicate Prevention:** Guarantee that repeated submissions for the same cohort, date, and time period update existing records rather than producing redundant rows.
4. **Three-Way Conflict Detection:** Develop an automated scheduling engine that detects and rejects room, faculty, and section timetable clashes using relational boundary comparisons.
5. **Role-Based Security & IDOR Elimination:** Enforce strict cryptographic JSON Web Token (JWT) identity extraction at the database query layer, ensuring total data isolation between students.
6. **Advanced SQL Analytics:** Implement database views, composite B-Tree indexes, multi-table joins, aggregates, and correlated subqueries for academic audit reporting.

### 1.4 Scope & Institutional Boundaries
The system models an engineering institution comprising five academic departments:
- Computer Science & Engineering (CS)
- Electronics & Telecommunication Engineering (ENTC)
- Information Technology (IT)
- Artificial Intelligence & Data Science (AIDS)
- Electronics & Computer Engineering (ENCE)

The database models exactly **1,000 active students** (200 per department distributed across 20 distinct section divisions: `CS-1..4`, `ENTC-1..4`, `IT-1..4`, `AIDS-1..4`, `ENCE-1..4`) and **60 active faculty members** (12 per department).

---

## 2. Technology Stack & System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION TIER                              │
│         React 18 SPA • TypeScript • Tailwind CSS • Vite (Port 3000)      │
│   [Student Dashboard]    [Faculty Portal]    [Admin / Preview Tools]     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ HTTPS / RESTful JSON APIs
                                     │ Bearer JWT Authentication
┌────────────────────────────────────▼─────────────────────────────────────┐
│                           APPLICATION TIER                               │
│              Node.js v24.7.0 • Express.js Framework (Port 5000)          │
│   ├── AuthController: Identity Verification & Bcrypt Hashing             │
│   ├── StudentController: Isolated Querying & Academic Views              │
│   ├── FacultyController: ACID Transactions & Conflict Engine             │
│   └── Middleware: RBAC, CORS Policies, Error Handler                     │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ mysql2/promise Connection Pool
                                     │ Parameterized Prepared Statements
┌────────────────────────────────────▼─────────────────────────────────────┐
│                            DATA TIER (DBMS)                              │
│                      MySQL 8.0 Database (college_erp)                    │
│   ├── 50 Normalized 3NF Relational Tables (InnoDB Engine)                │
│   ├── 5 Analytical Views (v_student_attendance_summary, etc.)            │
│   ├── Composite B-Tree Indexes for Sub-Millisecond Lookups               │
│   └── Declarative Integrity: Foreign Keys, Unique Keys, Check Constraints│
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Multi-Tier Architecture Breakdown
- **Presentation Tier (Client):** Developed using React 18 with Vite. Features strict role separation between the Student Desk and the Faculty Portal. Employs modular components, dynamic charts, and zero hardcoded data.
- **Application Logic Tier (Server):** Powered by Node.js and Express. Handles route authorization, request sanitation, bcrypt password validation, parameter binding, and connection pooling.
- **Data Persistence Tier (DBMS):** Powered exclusively by MySQL 8.0 on InnoDB. InnoDB was selected for its full support of ACID compliance, row-level locking, foreign key referential integrity, and crash-recovery journaling.

---

## 3. Comprehensive Analysis of the Eight ERP Modules

### Module 1: Student Management
- **Primary Entities:** `student`, `student_address`, `student_contact`, `guardian_details`, `academic_history`.
- **Functionality:** Manages admissions, PRN allocations, roll numbers, semester progressions, and demographic details.
- **Database Integrity:** Primary key `student_id` (Auto-increment); unique constraints on `roll_no`, `prn`, and `email`. One-to-one mapping with `user_account`.

### Module 2: Faculty Management
- **Primary Entities:** `faculty`, `designation`, `faculty_leave`, `faculty_payroll`.
- **Functionality:** Stores instructor credentials, designations (Professor, Associate Professor, Assistant Professor), leave tracking, and payroll disbursements.
- **Database Integrity:** Foreign keys to `department` and `designation`. Unique constraint on `faculty_code` and `email`.

### Module 3: Attendance Management (Highest Priority ACID Engine)
- **Primary Entities:** `attendance_session`, `attendance_record`.
- **Functionality:** Daily lecture turnout logging, subject-wise percentage calculations, debarment alerts (< 75%).
- **Database Integrity:** Composite unique key `uk_session_student (session_id, student_id)` on `attendance_record`. Multi-row transactions execute atomically; repeated submissions trigger idempotent updates rather than duplicates.

### Module 4: Academics and Course Management
- **Primary Entities:** `department`, `course`, `subject`, `academic_semester`, `section`, `timetable`, `student_subject_enrollment`.
- **Functionality:** Curriculum structuring, weekly schedule allocations, and clash-free timetable publication.
- **Database Integrity:** Timetable conflict engine executes three boundary checks (`section`, `faculty`, `room`) before committing inserts.

### Module 5: Examination and Result Management
- **Primary Entities:** `exam`, `exam_schedule`, `exam_application`, `marks`, `result`.
- **Functionality:** Mid-term and end-term exam scheduling, hall-ticket generation, mark uploads by authorized faculty, and SGPA computation.
- **Database Integrity:** Foreign keys link marks directly to `student_id` and `schedule_id`. Unique constraints prevent multiple grade entries for the same student assessment.

### Module 6: Library Management
- **Primary Entities:** `book`, `author`, `publisher`, `book_category`, `book_copy`, `book_issue`, `book_return`, `fine`.
- **Functionality:** Book cataloging, accession number inventory tracking, loan issuances, returns, and automated overdue fine calculation.
- **Database Integrity:** `book_copy` maintains status (`Available`, `Issued`, `Lost`); returns calculate overdue days against `due_date`.

### Module 7: Training and Placement (TNP) Cell
- **Primary Entities:** `company`, `job_drive`, `eligibility`, `application`, `interview`, `placement`.
- **Functionality:** Corporate recruiter registrations, job drive listings with minimum SGPA criteria, student applications, and offer records.
- **Database Integrity:** Composite primary key on applications `(drive_id, student_id)` prevents duplicate applications to the same recruitment drive.

### Module 8: Fees and Finance Management
- **Primary Entities:** `fee_structure`, `student_fee`, `payment`, `finance_fine`, `scholarship`.
- **Functionality:** Semester tuition invoicing, payment receipts, fee balance computation, and reconciliation in Indian Rupees (₹).
- **Database Integrity:** Payment transactions link directly to invoice `student_fee_id` with financial amount integrity.

### Implementation Status Matrix
| Module | Module Name | Primary Database Tables | Status | Verification Status |
| :---: | :--- | :--- | :---: | :---: |
| **1** | Student Management | `student`, `student_address`, `student_contact` | Implemented | Verified (Live DB) |
| **2** | Faculty Management | `faculty`, `designation`, `faculty_payroll` | Implemented | Verified (Live DB) |
| **3** | Attendance Management | `attendance_session`, `attendance_record` | Implemented | Verified (ACID Live) |
| **4** | Academics & Timetable | `subject`, `section`, `timetable` | Implemented | Verified (Conflict Engine) |
| **5** | Examination & Results | `exam`, `exam_schedule`, `marks`, `result` | Implemented | Verified (Live DB) |
| **6** | Library Management | `book`, `book_copy`, `book_issue`, `fine` | Implemented | Verified (Live DB) |
| **7** | Training & Placement | `company`, `job_drive`, `application` | Implemented | Verified (Live DB) |
| **8** | Fees & Finance | `fee_structure`, `student_fee`, `payment` | Implemented | Verified (Live DB) |

---

## 4. Relational Database Design & Data Dictionary

The `college_erp` database encompasses 50 normalized relational tables. Below is the data dictionary for the core architectural tables.

### Table: `student` (Master Student Profiles)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | INT | NO | PK | AUTO_INCREMENT | Unique surrogate student key |
| `prn` | VARCHAR(20) | NO | UNI | NOT NULL | Permanent Registration Number |
| `roll_no` | VARCHAR(20) | NO | UNI | NOT NULL | Departmental class roll number |
| `student_name` | VARCHAR(100) | NO | - | NOT NULL | Full institutional student name |
| `email` | VARCHAR(100) | NO | UNI | NOT NULL | Official university email |
| `department_id`| INT | NO | FK | REFERENCES `department(department_id)` | Enrolled academic department |
| `section_id` | INT | YES | FK | REFERENCES `section(section_id)` | Cohort class division |
| `current_year` | TINYINT UNSIGNED| NO | - | DEFAULT 3 | Academic study year (1–4) |
| `current_semester`| TINYINT UNSIGNED| NO | - | DEFAULT 5 | Active semester index (1–8) |
| `branch` | VARCHAR(50) | NO | - | NOT NULL | Engineering discipline name |

### Table: `faculty` (Master Faculty Profiles)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `faculty_id` | INT | NO | PK | AUTO_INCREMENT | Unique surrogate faculty key |
| `faculty_code` | VARCHAR(30) | NO | UNI | NOT NULL | Employee code (e.g. `FAC-001`) |
| `faculty_name` | VARCHAR(100) | NO | - | NOT NULL | Instructor full name |
| `email` | VARCHAR(100) | NO | UNI | NOT NULL | Institutional faculty email |
| `department_id`| INT | NO | FK | REFERENCES `department(department_id)` | Appointed academic department |
| `designation_id`| INT | NO | FK | REFERENCES `designation(designation_id)`| Academic post title |
| `status` | ENUM | NO | - | DEFAULT 'Active' | Service status |

### Table: `attendance_session` (Curricular Session Registry)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `session_id` | INT | NO | PK | AUTO_INCREMENT | Unique attendance session key |
| `subject_id` | INT | NO | FK | REFERENCES `subject(subject_id)` | Subject conducted |
| `faculty_id` | INT | NO | FK | REFERENCES `faculty(faculty_id)` | Instructor conducting class |
| `section_id` | INT | NO | FK | REFERENCES `section(section_id)` | Student class section |
| `session_date` | DATE | NO | - | NOT NULL | Date of session delivery |
| `period` | VARCHAR(50) | NO | - | NOT NULL | Timetable period descriptor |
| `topic_covered`| VARCHAR(255) | YES| - | NULL | Syllabus lecture topic |

### Table: `attendance_record` (Individual Student Attendance Status)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `record_id` | INT | NO | PK | AUTO_INCREMENT | Unique attendance entry key |
| `session_id` | INT | NO | FK | REFERENCES `attendance_session` | Parent session reference |
| `student_id` | INT | NO | FK | REFERENCES `student(student_id)` | Marked student reference |
| `status` | ENUM | NO | - | ENUM('Present','Absent','Late','Excused') | Roll status |
| **Constraint** | UNIQUE | - | UNI | `uk_session_student (session_id, student_id)` | Prevents duplicate mark per student |

### Table: `timetable` (Scheduled Academic Allocations)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `timetable_id` | INT | NO | PK | AUTO_INCREMENT | Unique timetable entry key |
| `section_id` | INT | NO | FK | REFERENCES `section(section_id)` | Scheduled section division |
| `subject_id` | INT | NO | FK | REFERENCES `subject(subject_id)` | Assigned curriculum subject |
| `faculty_id` | INT | NO | FK | REFERENCES `faculty(faculty_id)` | Assigned faculty instructor |
| `semester_id` | INT | NO | FK | REFERENCES `academic_semester` | Semester term reference |
| `day_of_week` | ENUM | NO | - | ENUM('Monday'..'Saturday') | Day of lecture |
| `start_time` | TIME | NO | - | NOT NULL | Slot commencement time |
| `end_time` | TIME | NO | - | NOT NULL | Slot conclusion time |
| `room_no` | VARCHAR(30) | NO | - | NOT NULL | Classroom / Lab number |
| `timetable_type`| ENUM | NO | - | ENUM('Lecture','Lab','Tutorial') | Pedagogical mode |

### Table: `user_account` (Unified Authentication Registry)
| Attribute | Data Type | Nullable | Key | Constraints & Defaults | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `user_id` | INT | NO | PK | AUTO_INCREMENT | System user identifier |
| `identifier` | VARCHAR(100) | NO | UNI | NOT NULL | Unique login handle (Roll / Code) |
| `email` | VARCHAR(100) | NO | UNI | NOT NULL | Unique login email |
| `password_hash`| VARCHAR(255) | NO | - | NOT NULL (Bcrypt 10 rounds) | Secure password digest |
| `role` | ENUM | NO | - | ENUM('ADMIN','FACULTY','STUDENT') | Authorization boundary role |
| `student_id` | INT | YES | FK/UNI| REFERENCES `student(student_id)` | 1:1 Link to student |
| `faculty_id` | INT | YES | FK/UNI| REFERENCES `faculty(faculty_id)` | 1:1 Link to faculty |
| `is_active` | TINYINT(1) | NO | - | DEFAULT 1 | Account enablement flag |

---

## 5. Entity-Relationship (ER) Modeling & Structural Integrity

```
┌──────────────┐         1:N         ┌───────────────┐
│  DEPARTMENT  ├────────────────────►│    FACULTY    │
└──────┬───────┘                     └───────┬───────┘
       │ 1:N                                 │ 1:N
       ▼                                     ▼
┌──────────────┐         1:N         ┌───────────────┐
│    SECTION   ├────────────────────►│   TIMETABLE   │
└──────┬───────┘                     └───────▲───────┘
       │ 1:N                                 │
       ▼                                     │ 1:N
┌──────────────┐         1:N                 │
│   STUDENT    ├─────────────────┐           │
└──────┬───────┘                 │           │
       │ 1:1                     ▼           │
       │                   ┌───────────┐     │
       ├──────────────────►│USER_ACCNT │     │
       │                   └───────────┘     │
       │ 1:N                                 │
       ▼                                     │
┌──────────────┐         1:N                 │
│ ATT_RECORD   │◄────────────────────────────┤
└──────▲───────┘                             │
       │ N:1                                 │
┌──────┴───────┐                             │
│ ATT_SESSION  │◄────────────────────────────┘
└──────▲───────┘
       │ N:1
┌──────┴───────┐
│   SUBJECT    │
└──────────────┘
```

### Referential Integrity Constraints
1. **Cascade Updates (`ON UPDATE CASCADE`):** When a department ID or course code is modified, all dependent faculty, student, and subject foreign keys cascade automatically without dangling pointer anomalies.
2. **Restrict Deletes (`ON DELETE RESTRICT`):** Deleting a department or faculty member that has active student enrollments, timetable slots, or recorded attendance sessions is rejected by the DBMS engine, preventing catastrophic record loss.
3. **Composite Primary & Unique Keys:**
   - `attendance_record (session_id, student_id)`: Guarantees that no student is logged more than once per lecture session.
   - `student_subject_enrollment (student_id, subject_id, semester_id)`: Prevents duplicate course registrations.
   - `application (drive_id, student_id)`: Ensures one application per campus recruitment drive.

---

## 6. Normalization Analysis (1NF, 2NF, 3NF)

To ensure academic and structural rigor, the schema was engineered to satisfy the Third Normal Form (3NF).

### 6.1 First Normal Form (1NF) Compliance
- **Criterion:** Every column contains atomic (indivisible) values; no repeating groups or composite comma-separated values exist.
- **Project Application:**
  - Phone numbers and contact methods are decomposed into normalized auxiliary tables (`student_contact`, `student_address`).
  - Student attendance is stored as discrete relational records in `attendance_record` with single-value status fields rather than multi-valued strings or JSON arrays.
  - Every table possesses an unambiguous, uniquely identifying Primary Key (`student_id`, `faculty_id`, `session_id`).

### 6.2 Second Normal Form (2NF) Compliance
- **Criterion:** Table must be in 1NF and every non-key attribute must be fully functionally dependent on the entire Primary Key (no partial key dependencies).
- **Project Application:**
  - In `attendance_record (session_id, student_id)`, the status attribute (`status`) is dependent on both the session and the student.
  - Lecture metadata (date, period, topic, faculty, section) is placed in `attendance_session`, dependent solely on `session_id`.
  - Student attributes (name, branch, current semester) are strictly in `student`, not duplicated within junction tables.

### 6.3 Third Normal Form (3NF) Compliance
- **Criterion:** Table must be in 2NF and no non-key attribute is transitively dependent on the primary key ($X \rightarrow Y$ and $Y \rightarrow Z$).
- **Project Application:**
  - In `student`, department details are referenced via `department_id`. Attributes such as `department_name`, `hod_name`, and `location` are stored solely in `department`. Including them in `student` would create a transitive dependency: `student_id -> department_id -> hod_name`.
  - In `faculty`, job titles are referenced via `designation_id`. Salary bands and category classifications reside exclusively in `designation`.
  - In `student_fee`, the invoice points to `fee_structure_id`. The breakdown components (Tuition, Lab Fee, Library Fee) reside in `fee_structure`, eliminating redundant recalculations.

---

## 7. Advanced DBMS Concepts Demonstrated

### 7.1 Relational Database Views
Five production views were designed to aggregate multi-table metrics for instant reporting without application-level overhead:

1. **`v_student_attendance_summary`**:
   Combines `student`, `department`, `section`, `attendance_record`, and `attendance_session`. Calculates total lectures, attended count, absent count, and attendance percentage using `COUNT`, `SUM(CASE WHEN...)`, and `ROUND`.
2. **`v_student_fee_balance`**:
   Joins `student` with `student_fee` to compute total billed amount, total payments deposited, outstanding balance, and standing status (`Clear`, `Partial`, `Due`).
3. **`v_faculty_workload`**:
   Aggregates distinct assigned sections, distinct subjects taught, and total weekly teaching slots per instructor from `timetable`.
4. **`v_department_performance`**:
   Computes student enrollment totals, average exam marks, highest scores, lowest scores, and passing turnout grouped by department.
5. **`v_library_overdue_books`**:
   Evaluates unreturned loans in `book_issue` past `due_date`, computing elapsed overdue days via `DATEDIFF()` and accruing statutory late fines.

### 7.2 Performance B-Tree Indexes
To ensure sub-millisecond query execution during concurrent faculty roll taking:
- `idx_att_sess_filter` on `attendance_session(section_id, subject_id, session_date)`
- `idx_tt_sec_day_time` on `timetable(section_id, day_of_week, start_time)`
- `idx_tt_fac_day_time` on `timetable(faculty_id, day_of_week, start_time)`
- `idx_tt_room_day_time` on `timetable(room_no, day_of_week, start_time)`
- `idx_user_auth_lookup` on `user_account(identifier, is_active)`

### 7.3 ACID Transaction Management & Row-Level Locking
During attendance submissions, multiple student rows are evaluated and written together. A multi-step transaction is executed:
```
conn = await pool.getConnection();
await conn.beginTransaction();
// 1. Concurrency-safe check with row lock
SELECT session_id FROM attendance_session WHERE ... FOR UPDATE;
// 2. Insert or update session metadata
// 3. Multi-row upsert into attendance_record
// 4. Commit or rollback on error
await conn.commit();
```
If an invalid student ID or network failure occurs midway, `conn.rollback()` executes, guaranteeing that zero orphan or corrupt session records persist in MySQL.

---

## 8. Important SQL Queries with Execution Analysis

### Query 1: Debarment Alert Identification (< 75% Statutory Attendance)
**DBMS Concept:** `INNER JOIN`, Aggregate Functions (`COUNT`, `SUM`, `ROUND`), `GROUP BY`, `HAVING` clause.
```sql
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
```
*Explanation:* Scans student records across all conducted sessions, groups by subject and cohort, calculates attendance turnout percentage, and filters rows below the statutory 75% threshold via the `HAVING` clause.

### Query 2: High Academic Achievers Exceeding Departmental Average
**DBMS Concept:** Correlated Subquery, Table Aliasing, Group Aggregation (`AVG`).
```sql
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
```
*Explanation:* The correlated subquery calculates the dynamic average examination score for the student's department. The outer query compares each student's score and isolates top performers.

### Query 3: Three-Way Timetable Conflict Detection Engine
**DBMS Concept:** Interval Overlap Logic (`NOT (end_time <= ? OR start_time >= ?)`), Relational Integrity.
```sql
-- Check if room is already occupied during requested interval
SELECT t.timetable_id, s.subject_name, sec.section_name, t.start_time, t.end_time
FROM timetable t
JOIN subject s ON t.subject_id = s.subject_id
JOIN section sec ON t.section_id = sec.section_id
WHERE t.room_no = ? AND t.day_of_week = ?
  AND NOT (t.end_time <= ? OR t.start_time >= ?);
```
*Explanation:* Mathematically validates whether an existing class interval overlaps with the proposed start and end times in the specified classroom on that day.

---

## 9. API Architecture & Real-Time Data Flow

### 9.1 RESTful Endpoint Specification
| Method | Endpoint Route | Authorized Roles | Description | Persisted MySQL Table(s) |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns signed JWT | `user_account` (`last_login`) |
| `GET` | `/api/students/profile` | STUDENT | Fetches student profile, addresses, guardians | `student`, `student_address` |
| `GET` | `/api/students/attendance`| STUDENT | Fetches subject attendance and weekly timetable | `v_student_attendance_summary` |
| `GET` | `/api/students/fees` | STUDENT | Fetches billing ledger and receipts | `student_fee`, `payment` |
| `GET` | `/api/faculty/dashboard`| FACULTY, ADMIN | Retrieves today's schedule and recent logs | `timetable`, `attendance_session` |
| `POST` | `/api/faculty/attendance`| FACULTY, ADMIN | Multi-row ACID attendance upsert | `attendance_session`, `attendance_record` |
| `POST` | `/api/faculty/timetable` | FACULTY, ADMIN | Validates conflicts and inserts slot | `timetable` |
| `GET` | `/api/faculty/preview-student/:id`| FACULTY, ADMIN | Read-only demo preview of student view | `student`, `views` |

### 9.2 End-to-End Workflow: Attendance Propagation
```
[1. Faculty Portal] ──> [2. REST API Request] ──> [3. Express Backend]
   Marks student           POST /api/faculty/        Validates body, begins
   turnout roll            attendance with JWT       ACID transaction
                                                           │
                                                           ▼
[6. Student Dashboard] ◄─ [5. MySQL Commit] ◄── [4. Row-Level Upsert]
   Refetches via             Saves session,           ON DUPLICATE KEY UPDATE
   /api/students/            commits to InnoDB,       status = VALUES(status)
   attendance                releases lock
```

---

## 10. Security, Authentication & IDOR Isolation

### 10.1 Insecure Direct Object Reference (IDOR) Defense
In vulnerable systems, a student can alter query strings (e.g. `GET /api/students/attendance?student_id=6`) to snoop on peers. In this project:
- The backend middleware verifies the JWT signature and extracts `req.user.student_id`.
- The database query is strictly parameterized using `req.user.student_id`:
  ```sql
  SELECT * FROM v_student_attendance_summary WHERE student_id = ?
  ```
- Any client-submitted query parameter attempting to override `student_id` is discarded by the controller.

### 10.2 Password Storage & Hashing
- Passwords are encrypted using **Bcrypt with 10 salt rounds**. Plaintext passwords are never committed, seeded, or returned via API responses.
- The dedicated **Faculty Student Preview Mode** allows professors to demonstrate the student interface for any student ID in their department in read-only mode, without exposing student passwords or credentials.

---

## 11. Verification Test Suite & Empirical Results

The test suite (`scripts/verify_dbms_evaluation.cjs`) executes 15 end-to-end integration tests directly against the live backend and MySQL:

| # | Evaluation Scenario | Tested Condition | Result |
| :---: | :--- | :--- | :---: |
| **1** | Multi-Student Authentication | 10 students/dept across all 5 branches (50 accounts) | **PASS (50/50)** |
| **2** | Multi-Faculty Authentication | 3 faculty/dept across all 5 branches (15 accounts) | **PASS (15/15)** |
| **3** | Student Data Isolation | Student A (`31001`, CS) vs Student B (`34001`, AIDS) retrieve distinct records | **PASS** |
| **4** | IDOR Parameter Tampering | Tampering query parameters (`?student_id=6`) is safely ignored | **PASS** |
| **5** | Role-Based Access Control | Student token accessing `/api/faculty/attendance` returns HTTP 403 Forbidden | **PASS** |
| **6** | Attendance Persistence | Faculty session submission persists to MySQL `attendance_session` | **PASS** |
| **7** | Student Propagation | Student queries `/api/students/attendance` and receives updated counts immediately | **PASS** |
| **8** | Timetable Conflict Engine | Overlapping section, faculty, or room schedules trigger HTTP 409 Conflict | **PASS** |
| **9** | Idempotent Attendance | Repeated submissions update existing session without duplicate session creation | **PASS** |
| **10**| ACID Transaction Rollback | Foreign key violation triggers full rollback (0 orphan rows created) | **PASS** |
| **11**| 8 ERP Modules Live Coverage | Student, Faculty, Attendance, Timetable, Exams, Library, TNP, Fees | **PASS (8/8)** |
| **12**| Database Views Integrity | Queries `v_student_attendance_summary`, `v_student_fee_balance`, etc. | **PASS** |
| **13**| Admin Login & Preview Mode | `admin` / `Admin@2026` login + read-only student preview modal active | **PASS** |
| **14**| Credential Rejection | Invalid passwords return HTTP 401 Unauthorized | **PASS** |
| **15**| SQL Injection Immunity | Malicious payload `' OR '1'='1` safely rejected via prepared statements | **PASS** |

---

## 12. Installation, Configuration & Execution Manual

### Prerequisites
- Node.js (v18+ or v24.7.0 LTS)
- MySQL 8.0 Community Server running on port 3306
- Microsoft Edge / Chrome (for PDF documentation compilation)

### Step 1: Clone Repository & Install Dependencies
```bash
cd college-erp
npm install
cd server && npm install && cd ..
```

### Step 2: Database Setup & Seed
```bash
# Execute schema, views, and indexes in MySQL
mysql -u root -p college_erp < database/schema.sql
mysql -u root -p college_erp < database/views.sql
mysql -u root -p college_erp < database/indexes.sql

# Seed 1,000 students and 60 faculty with hashed accounts
node database/seed_test_accounts.cjs
```

### Step 3: Start Services
```bash
# Terminal 1: Launch Backend API (Port 5000)
node server/index.js

# Terminal 2: Launch Frontend Single-Page App (Port 3000)
npm run dev
```

### Step 4: Run DBMS Verification Test Suite
```bash
node scripts/verify_dbms_evaluation.cjs
```

---

## 13. Current Limitations & Future Enhancements

### 13.1 Current Limitations
- **Biometric Device Polling:** Biometric attendance data is simulated via relational logs rather than physical RS-485 / TCP-IP hardware clock-in gates.
- **Payment Gateway Sandboxing:** Tuition payments use transaction tokens and reference IDs without live UPI / Razorpay webhooks.

### 13.2 Future Roadmap
- Integration of physical biometric thumbprint readers with automated socket broadcasting.
- Implementation of stored procedures for semester SGPA calculation triggers.
- Native mobile application for student push notifications regarding room changes and exam hall tickets.

---

## 14. Conclusion & Project File Manifest

The Campus ERP project successfully illustrates core principles of relational database management systems. By enforcing Third Normal Form normalization, ACID transactional boundaries, row-level concurrency locking, composite B-Tree indexes, and cryptographic JWT identity mapping, the application eliminates data corruption and provides real-time cross-dashboard synchronization.

### File Manifest
- Master Relational Schema: `database/schema.sql`
- Relational Database Views: `database/views.sql`
- Database Performance Indexes: `database/indexes.sql`
- Advanced DBMS Report Queries: `database/reports.sql`
- Seeding & Verification Script: `database/seed_test_accounts.cjs`
- Automated Test Suite: `scripts/verify_dbms_evaluation.cjs`
- Test Credentials Directory: `docs/TEST_ACCOUNTS.md`
- Master Student Directory: `docs/STUDENT_CREDENTIALS.csv`
- Master Faculty Directory: `docs/FACULTY_CREDENTIALS.csv`
- PDF Project Report: `docs/project-report/College_ERP_DBMS_Project_Report.pdf`

---

## 15. Comprehensive DBMS Viva Voce Preparation (25 Questions & Answers)

**Q1: What storage engine is utilized in this project and why?**  
**A:** MySQL's **InnoDB** storage engine is used. InnoDB provides full support for ACID transactions, row-level locking, foreign key referential integrity constraints, and write-ahead redo logging for crash recovery.

**Q2: What normal form is the Campus ERP database schema in?**  
**A:** The schema is normalized to **Third Normal Form (3NF)**. Every table has atomic values (1NF), lacks partial functional dependencies (2NF), and eliminates transitive dependencies (3NF) by isolating related master entities (`department`, `designation`, `fee_structure`) into discrete tables.

**Q3: How does the system prevent duplicate attendance records when a faculty member resubmits?**  
**A:** The database enforces a composite unique constraint `uk_session_student (session_id, student_id)` on `attendance_record`. In `saveAttendance`, the backend queries `attendance_session` with `FOR UPDATE` to reuse existing session IDs and uses `ON DUPLICATE KEY UPDATE status = VALUES(status)` within an atomic transaction.

**Q4: Explain how ACID properties are guaranteed during attendance marking.**  
**A:**
- **Atomicity:** Wrapped in `START TRANSACTION` and `COMMIT`. Any constraint violation executes `conn.rollback()`.
- **Consistency:** Foreign key constraints guarantee only enrolled students are recorded.
- **Isolation:** Row-level locks (`SELECT ... FOR UPDATE`) prevent concurrent race conditions.
- **Durability:** InnoDB's write-ahead log ensures committed records survive server crashes.

**Q5: What is the purpose of the views defined in `database/views.sql`?**  
**A:** Views like `v_student_attendance_summary` and `v_student_fee_balance` encapsulate complex multi-table joins and calculations inside the database, improving query maintainability, performance, and application security.

**Q6: What is IDOR and how is it mitigated in this project?**  
**A:** Insecure Direct Object Reference occurs when an API trusts user-supplied record IDs. The system mitigates IDOR by extracting `student_id` strictly from the cryptographically signed JWT token (`req.user.student_id`), completely ignoring query string overrides.

**Q7: How does the timetable conflict engine work?**  
**A:** The API runs a relational interval check: `NOT (end_time <= ? OR start_time >= ?)`. If an overlap is found for the same section, instructor, or classroom, MySQL returns an HTTP 409 Conflict.

**Q8: Why are composite indexes used on `timetable` and `attendance_session`?**  
**A:** Composite B-Tree indexes on `(section_id, day_of_week, start_time)` and `(section_id, subject_id, session_date)` allow MySQL to locate records without full table scans.

**Q9: What is the difference between `WHERE` and `HAVING` in the report queries?**  
**A:** `WHERE` filters rows before aggregation. `HAVING` filters aggregated grouped results, such as filtering students whose calculated attendance percentage is `< 75.00`.

**Q10: What is a correlated subquery and where is it used?**  
**A:** A correlated subquery depends on values from the outer query. It is demonstrated in `database/reports.sql` to calculate the overall average marks of the specific department to which each student belongs.

**Q11: Why are password hashes stored instead of plaintext passwords?**  
**A:** Storing plaintext passwords exposes user credentials in the event of database leaks. The system uses **Bcrypt** with 10 salt rounds to generate irreversible cryptographic hashes.

**Q12: What referential actions are configured on foreign keys?**  
**A:** `ON UPDATE CASCADE` ensures primary key updates propagate to foreign references. `ON DELETE RESTRICT` prevents accidental deletion of departments or instructors that have dependent student or course records.

**Q13: How does the faculty preview mode work without compromising student passwords?**  
**A:** The endpoint `/api/faculty/preview-student/:id` queries read-only profile, attendance, and timetable data for authorized faculty members. It never queries or returns password hashes.

**Q14: What is connection pooling in `mysql2/promise`?**  
**A:** Connection pooling maintains a set of reusable database connections (`connectionLimit: 10`), avoiding the latency of creating a new TCP socket connection for every incoming HTTP request.

**Q15: How does the system defend against SQL Injection?**  
**A:** All queries utilize **parameterized prepared statements** (`query('SELECT ... WHERE roll_no = ?', [val])`), ensuring user inputs are treated strictly as data literals rather than executable SQL commands.

**Q16: What is the role of surrogate keys vs natural keys in the schema?**  
**A:** Natural keys (`roll_no`, `prn`, `email`) uniquely identify real-world students, while surrogate keys (`student_id INT AUTO_INCREMENT`) serve as compact, immutable, high-performance primary keys for joins.

**Q17: What is the cardinality between `student` and `user_account`?**  
**A:** Exactly **one-to-one (1:1)**, enforced by a `UNIQUE` foreign key constraint on `user_account(student_id)`.

**Q18: What is the difference between `COUNT(*)` and `COUNT(column)`?**  
**A:** `COUNT(*)` counts all rows in the group, including NULLs. `COUNT(column)` counts only rows where the specified column contains non-NULL values.

**Q19: How are overdue library fines calculated in the database?**  
**A:** Using MySQL's built-in date arithmetic: `GREATEST(0, DATEDIFF(CURDATE(), due_date) * 5)` inside `v_library_overdue_books`.

**Q20: What is a foreign key constraint violation and what error code does MySQL produce?**  
**A:** It occurs when an insert or update references a non-existent parent key. MySQL rejects the operation with error `ER_NO_REFERENCED_ROW_2` (1452).

**Q21: Why are financial amounts stored as `DECIMAL(10,2)` instead of `FLOAT`?**  
**A:** `FLOAT` and `DOUBLE` use binary floating-point representation, which causes rounding errors. `DECIMAL(10,2)` is an exact numeric type that preserves currency precision.

**Q22: How does the application handle database disconnection errors?**  
**A:** The pool uses `enableKeepAlive: true` and `/api/health` probes the database with `connection.ping()`. The frontend displays clear connection diagnostics if the backend is temporarily offline.

**Q23: How does `ON DUPLICATE KEY UPDATE` operate internally?**  
**A:** When an insert violates a `PRIMARY KEY` or `UNIQUE` constraint, MySQL converts the insert into an update statement on the conflicting row, preventing duplicate insertion errors.

**Q24: What is the role of database normalization in write performance?**  
**A:** Normalization minimizes data duplication, meaning an update (such as a department name change) touches only a single row in one table, eliminating update anomalies and reducing lock contention.

**Q25: What is the significance of the 15/15 automated verification test suite?**  
**A:** It empirically verifies that all DBMS mechanisms—multi-account authentication, data isolation, ACID rollback, timetable conflict checking, and live attendance propagation—function correctly under automated test conditions.
