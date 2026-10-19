# College Management System — Sample CSV Database

This package contains eight individually organized modules based on the supplied ER diagrams:
1. Student
2. Faculty
3. Exams
4. Library
5. Finance and Fee
6. Attendance
7. Training and Placement (TNP)
8. Academics and Course Management

All records are synthetic sample data for academic/testing use. Emails use example domains; phone numbers and financial records are mock data.

## Important conventions
- `student_id` is the internal numeric primary key used to connect tables. `prn` is the college PRN and is not the same as `student_id` or `roll_no`.
- Student PRNs follow the previously requested department formats: CS `F24CE###`, ENTC `F24ET###`, IT `F24IT###`, AIDS `F24AI###`, ENCE `F24EC###`.
- Roll numbers use department ranges: CS 31xxx, ENTC 32xxx, IT 33xxx, AIDS 34xxx, ENCE 35xxx.
- Every department has divisions 1–4 with 50 students per division. `section_id` is a separate unique key for each department-division combination.
- `department_id`, `section_id`, `faculty_id`, `subject_id`, `semester_id`, `schedule_id`, and other `*_id` columns are module-specific keys or foreign keys as indicated by table relationships. Identically named concepts in separate modules are not automatically the same key.
- `semester_id` is an internal semester-table key; `semester_number` is the human-facing semester number.
- `amount` is context-specific: it can mean a fee payment, a fine, a scholarship, or a placement package depending on the table. `status` is also context-specific, such as application status, payment status, book-copy status, or student admission status.
- Foreign keys are represented as columns in CSVs. CSV itself does not enforce constraints; use the IDs to create PK/FK constraints when importing into MySQL.
- CSV files are UTF-8, with a header row.
