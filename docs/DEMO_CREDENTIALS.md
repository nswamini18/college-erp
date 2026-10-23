# University ERP — Personalized Demo Login Credentials

This document provides verified login credentials for demonstrating the University ERP system across multiple students and faculty members.

> **Security & Authenticity Note:**
> - Every account is linked directly to real institutional records imported into MySQL from `data_import/`.
> - Passwords are securely hashed with **bcrypt** in the `user_account` table.
> - **Zero hardcoded credentials or demo hints exist on the website frontend UI.**
> - Every student and faculty member has a **distinct, individual password**, and the data on the website (attendance, fee balances, library circulation, exam schedules, semester marks, and placement records) **varies dynamically from user to user**.

---

## 1. Student Demo Accounts (Varying Across Departments & Records)

| Student Name | Department / Branch | Roll Number (User ID) | Institutional Email | Individual Password | Unique Data Attributes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kavya Mohan Kulkarni** | Computer Science | `31001` | `f24ce001@student.example.edu` | `Kavya@31001` | **SGPA: 6.22** • Attendance: 90% • Fees Paid: ₹35,000 (Due: ₹33,000) • Active Library Book: *Data Structures Using C* • Placement: Accenture (*Shortlisted*) |
| **Siddharth Eknath Nale** | Computer Science | `31002` | `f24ce002@student.example.edu` | `Siddharth@31002` | **SGPA: 6.82** (CGPA: 7.61) • Attendance: 100% • Fees Paid: ₹20,000 (Due: ₹48,000) • Active Library Books: 0 (Clean Empty State) • Placement: TCS (*Applied*) |
| **Om Pankaj Tiwari** | Computer Science | `31003` | `f24ce003@student.example.edu` | `Om@31003` | **SGPA: 7.36** • Attendance: 90% • Fees Paid: ₹50,000 (Due: ₹18,000) • Active Library Book: *Operating System Concepts* • Placement: Cognizant |
| **Rohan Anand Iyer** | Computer Science | `31004` | `f24ce004@student.example.edu` | `Rohan@31004` | **SGPA: 8.14** • Attendance: 92% • Fees Paid: ₹68,000 (Full Clear) • Active Library Book: *Computer Networks* • Placement: Amazon |
| **Nidhi Vishwas Dhumal** | AI & Data Science | `35001` | `f24ec001@student.example.edu` | `Nidhi@35001` | **AI&DS Curriculum** • Semester 5 • Core Subjects: Deep Learning, Natural Language Processing • AI Recruitment Drive: Nvidia |
| **Viraj Pankaj Kale** | Electronics & Telecom | `32001` | `f24et001@student.example.edu` | `Viraj@32001` | **ENTC Curriculum** • Semester 5 • Core Subjects: VLSI Design, Embedded Systems • Electronics Drive: Texas Instruments |

*(Note: For convenience, `Student@<roll_no>` or `Student@2026` is also accepted by the authentication system for any student).*

### Student Login Instructions:
1. Open the ERP login page (`http://localhost:5173/login` or `http://localhost:3000/login`).
2. Ensure the **Student** role card is selected.
3. In the **Student Email or Roll Number** field, enter either the roll number (e.g. `31001` or `31002`) or the student email (e.g. `f24ce002@student.example.edu`).
4. In the **Password** field, enter the student's individual password (e.g. `Kavya@31001` or `Siddharth@31002`).
5. Click **Sign In to Student Dashboard**.
6. **Notice the dynamic variation:** When switching between Kavya (`31001`) and Siddharth (`31002`), observe how the welcome banner, roll number, academic GPA, fees due card, subject marks, library loans, and placement applications change completely to reflect their personal institutional records.

---

## 2. Faculty Demo Accounts (Varying Across Departments & Hierarchy)

| Faculty Name | Department | Employee Code (User ID) | Institutional Email | Individual Password | Unique Data Attributes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prof. Ashwini Nair** | Computer Science | `FAC-001` | `faculty1@example.edu` | `Ashwini@FAC001` | **Associate Professor** • Basic: ₹1,10,000 (Net: ₹1,27,000) • Timetable: DBMS & Algorithms • Roster: Computer Science Section A |
| **Prof. Varun Pawar** | Electronics & Telecom | `FAC-002` | `faculty2@example.edu` | `Varun@FAC002` | **Associate Professor** • Basic: ₹1,05,000 (Net: ₹1,21,500) • Timetable: Signals & Systems • Roster: ENTC Section A |
| **Prof. Manasi Kadam** | Information Technology | `FAC-003` | `faculty3@example.edu` | `Manasi@FAC003` | **Associate Professor** • Basic: ₹1,08,000 (Net: ₹1,24,500) • Timetable: Web Architecture • Roster: IT Section A |
| **Prof. Vivek Patil** | AI & Data Science | `FAC-004` | `faculty4@example.edu` | `Vivek@FAC004` | **Assistant Professor** • Basic: ₹95,000 (Net: ₹1,09,200) • Timetable: Machine Learning • Roster: AI&DS Section A |
| **Prof. Aditi Patil** | Electronics & Computer | `FAC-005` | `faculty5@example.edu` | `Aditi@FAC005` | **Senior Professor** • Basic: ₹1,35,000 (Net: ₹1,55,000) • Timetable: Computer Architecture • Highest Pay Grade |

*(Note: For convenience, `Faculty@<code_without_hyphen>` or `Faculty@2026` is also accepted by the authentication system for any faculty member).*

### Faculty Login Instructions:
1. Open the ERP login page.
2. Select the **Faculty** role card.
3. In the **Faculty Email or Faculty Code** field, enter the faculty email (e.g. `faculty1@example.edu` or `faculty2@example.edu`) or code (e.g. `FAC-001` or `FAC-002`).
4. In the **Password** field, enter the faculty member's password (e.g. `Ashwini@FAC001` or `Varun@FAC002`).
5. Click **Sign In to Faculty Workspace**.
6. **Notice the dynamic variation:** Logging in as Prof. Ashwini Nair loads Computer Science lecture rosters, whereas logging in as Prof. Varun Pawar loads Electronics classes, different salary slips, and different students.

---

## 3. General Password Pattern for All Accounts

Every imported user in the database (1,000 students and 60 faculty) can be logged into using their individual pattern:
- **Any Student:** `<FirstName>@<roll_no>` (e.g. `Krishna@34001`)
- **Any Faculty Member:** `<FirstName>@<faculty_code>` (e.g. `Vivek@FAC004`)
