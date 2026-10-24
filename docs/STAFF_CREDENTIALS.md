# University ERP — Staff Portal Credentials

> Three new institutional staff portals have been added on top of the existing ERP system.
> All existing student and faculty logins remain fully operational and unchanged.

---

## Staff Accounts Summary

| Name | Role | Login ID | Institutional Email | Password | Portal Colour |
|:---|:---|:---|:---|:---|:---|
| **Rajesh Kumar Sharma** | TNP Cell Head | `TNP-HEAD` | `tnp.head@campus.edu` | `TNP@Campus2026` | 🟢 Green |
| **Priya Deepak Mehta** | Finance Officer | `FINANCE-01` | `finance@campus.edu` | `Finance@Campus2026` | 🟣 Purple |
| **Sunita Ramesh Joshi** | Librarian | `LIB-001` | `librarian@campus.edu` | `Library@Campus2026` | 🟠 Orange |

---

## How to Login

1. Open the ERP login page: `http://localhost:3000/login`
2. Select the **Staff** tab (third option after Student and Faculty)
3. Enter the **Login ID** or **Email** in the identifier field
4. Enter the password
5. Click **Sign In**

---

## 1. TNP Cell Head — Rajesh Kumar Sharma

| Field | Value |
|:---|:---|
| **Name** | Rajesh Kumar Sharma |
| **Login ID** | `TNP-HEAD` |
| **Email** | `tnp.head@campus.edu` |
| **Password** | `TNP@Campus2026` |
| **Role** | `TNP_HEAD` |
| **Department** | Training & Placement Cell |
| **Phone** | 9876500001 |
| **Portal Colour** | Emerald Green |

### Capabilities
- **Company Management** — Add new companies visiting campus, update company details (name, industry, location, contact email, website)
- **Job Drives** — Create new placement drives, assign companies, set package, registration deadlines, update drive status (Upcoming → Ongoing → Completed)
- **Applications & Shortlisting** — View all student applications per drive, shortlist or reject individual candidates, mark selected students, enter offered package
- **Placement Records** — View all final placement records including student name, company, package, offer date

### Portal Pages
| Page | URL |
|:---|:---|
| Dashboard | `/staff/dashboard` |
| Companies | `/staff/companies` |
| Drives | `/staff/drives` |
| Applications | `/staff/applications` |
| Placements | `/staff/placements` |

---

## 2. Finance Officer — Priya Deepak Mehta

| Field | Value |
|:---|:---|
| **Name** | Priya Deepak Mehta |
| **Login ID** | `FINANCE-01` |
| **Email** | `finance@campus.edu` |
| **Password** | `Finance@Campus2026` |
| **Role** | `FINANCE` |
| **Department** | Finance & Accounts |
| **Phone** | 9876500002 |
| **Portal Colour** | Purple |

### Capabilities
- **Finance Dashboard** — Overview of total outstanding dues, total collected, pending fees count, overdue records count; department-wise fee collection breakdown
- **Student Fees** — View all students with fee balances; search and filter by department
- **Payment Recording** — Record cash, online, or cheque payments for individual students; updates `student_fee.amount_paid` and marks status (Paid / Partially Paid) atomically via ACID transaction
- **Fee Structures** — View all existing fee structures; add new fee categories (Tuition, Exam, Library, etc.) with amounts and due dates
- **Payment Records** — Complete paginated payment transaction history

### Portal Pages
| Page | URL |
|:---|:---|
| Dashboard | `/staff/dashboard` |
| Student Fees | `/staff/fees` |
| Payments | `/staff/payments` |
| Fee Structures | `/staff/fee-structures` |
| Reports | `/staff/reports` |

---

## 3. Librarian — Sunita Ramesh Joshi

| Field | Value |
|:---|:---|
| **Name** | Sunita Ramesh Joshi |
| **Login ID** | `LIB-001` |
| **Email** | `librarian@campus.edu` |
| **Password** | `Library@Campus2026` |
| **Role** | `LIBRARIAN` |
| **Department** | Central Library |
| **Phone** | 9876500003 |
| **Portal Colour** | Amber/Orange |

### Capabilities
- **Library Dashboard** — Stats for total books, total copies, available copies, active issues, overdue count; recent issue log with status indicators
- **Book Inventory** — Add new books (ISBN, title, author, publisher, category, edition, total copies, shelf location); search by title, author, or ISBN; update existing book information
- **Book Issuance** — Issue a book to any student by student ID and ISBN; due date configurable (default 14 days); marks copy as `Issued` in `book_copy`; decrements `book.available_copies`
- **Book Returns** — Process returns; marks copy as `Available`; restores `book.available_copies`; logs return date
- **Overdue Books** — View all active issues past due date with days-overdue count and student contact details

### Portal Pages
| Page | URL |
|:---|:---|
| Dashboard | `/staff/dashboard` |
| Book Inventory | `/staff/books` |
| Issue / Return | `/staff/issues` |
| Overdue Books | `/staff/overdue` |
| Return History | `/staff/returns` |

---

## Security Notes

- Staff passwords are stored as **Bcrypt hashes** (10 salt rounds) in `user_account.password_hash`
- Staff tokens are **JWT-signed** (7-day expiry) containing `role`, `staff_id`, `user_id`
- Each portal is **strictly isolated** by role — TNP Head cannot access Finance or Library endpoints and vice versa
- Student tokens receive **HTTP 403** if they attempt to access any `/api/staff/*` endpoint (IDOR protection)
- Existing student and faculty routes, controllers, and pages have **not been modified**

---

## Database Tables

| MySQL Table | Purpose |
|:---|:---|
| `staff` | Staff member master records (staff_id 21–23 are the 3 new members) |
| `user_account` | Authentication — role column now supports `TNP_HEAD`, `FINANCE`, `LIBRARIAN` |
| `librarian` | Links librarian staff to library system |
| `company` | Companies managed by TNP Head |
| `job_drive` | Placement drives created by TNP Head |
| `application` | Student applications tracked by TNP Head |
| `placement` | Final placement records (shortlisted → selected by TNP Head) |
| `student_fee` | Student fee records viewable/editable by Finance Officer |
| `payment` | Payment transactions recorded by Finance Officer |
| `fee_structure` | Fee categories managed by Finance Officer |
| `book` | Book catalogue managed by Librarian |
| `book_copy` | Individual copy tracking managed by Librarian |
| `book_issue` | Issue/return log managed by Librarian |
